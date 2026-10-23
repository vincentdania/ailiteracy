import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { hasActiveAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { TRACKS } from "@/lib/tracks";
import { sendPushToUser } from "@/lib/push";

function validAdminKey(value: string | null) {
  const expected = process.env.ADMIN_TRIGGER_SECRET;
  if (!expected || !value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!validAdminKey(request.headers.get("x-admin-key"))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = new Date();
  const candidates = await db.enrollment.findMany({
    where: { status: { in: ["ACTIVE", "COMPLETED"] }, course: { slug: { in: TRACKS.map((track) => track.slug) } }, user: { pushSubscriptions: { some: {} } } },
    select: { userId: true, purchasedAt: true, expiresAt: true, status: true },
  });
  const enrollments = candidates.filter((enrollment) => hasActiveAccess(enrollment, now));
  const results = await Promise.all(enrollments.map((enrollment) => sendPushToUser(enrollment.userId, {
    title: "Keep building your AI assistant",
    body: "Open your dashboard to continue your track.",
    url: "/dashboard",
  })));
  return NextResponse.json({ ok: true, learners: enrollments.length, deliveries: results.reduce((sum, result) => sum + result.sent, 0) });
}
