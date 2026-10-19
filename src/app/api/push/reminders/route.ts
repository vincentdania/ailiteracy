import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { hasActiveAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { unlockedDay } from "@/lib/challenge";
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
  const candidates = await db.enrollment.findMany({ where: { status: "ACTIVE", user: { pushSubscriptions: { some: {} } } }, include: { user: { include: { profile: true } }, course: { include: { modules: { include: { lessons: { where: { isBonus: false } } } } } } } });
  // No lesson reminders once a learner's access has ended.
  const enrollments = candidates.filter((enrollment) => hasActiveAccess(enrollment, now, enrollment.user.role));
  const results = await Promise.all(enrollments.map((enrollment) => {
    const totalLessons = enrollment.course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const day = unlockedDay(enrollment.enrolledAt, now, enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride, totalLessons);
    return sendPushToUser(enrollment.userId, { title: `Your Day ${day} lesson is live!`, body: "Keep your streak alive 🔥", url: "/dashboard" });
  }));
  return NextResponse.json({ ok: true, learners: enrollments.length, deliveries: results.reduce((sum, result) => sum + result.sent, 0) });
}
