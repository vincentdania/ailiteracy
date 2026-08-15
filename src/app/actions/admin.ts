"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user.id || session.user.role !== "ADMIN") throw new Error("Admin access required");
}

export async function setPreviewOverrideAction(formData: FormData) {
  await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const enabled = formData.get("enabled") === "true";
  await db.enrollment.update({ where: { id: enrollmentId }, data: { previewOverride: enabled, unlockedDay: enabled ? 21 : 1 } });
  revalidatePath("/admin");
}

export async function updatePricingAction(formData: FormData) {
  await requireAdmin();
  const courseId = String(formData.get("courseId") ?? "");
  const priceNgn = Number(formData.get("priceNgn"));
  const priceUsd = Number(formData.get("priceUsd"));
  if (!Number.isFinite(priceNgn) || !Number.isFinite(priceUsd) || priceNgn <= 0 || priceUsd <= 0) throw new Error("Prices must be positive numbers");
  await db.course.update({ where: { id: courseId }, data: { priceNgn, priceUsd } });
  revalidatePath("/admin");
}

export async function broadcastPushAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "Your lesson is ready").slice(0, 80);
  const body = String(formData.get("body") ?? "Keep your streak alive 🔥").slice(0, 180);
  const users = await db.user.findMany({ where: { pushSubscriptions: { some: {} } }, select: { id: true } });
  await Promise.all(users.map((user) => sendPushToUser(user.id, { title, body, url: "/dashboard" })));
  revalidatePath("/admin");
}
