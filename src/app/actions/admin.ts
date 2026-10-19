"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

/** Checks the session and the database, so a stale session cannot act after an admin is demoted. */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user.id || session.user.role !== "ADMIN") throw new Error("Admin access required");
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true } });
  if (user?.role !== "ADMIN") throw new Error("Admin access required");
  return user.id;
}

export async function setPreviewOverrideAction(formData: FormData) {
  await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const enabled = formData.get("enabled") === "true";
  const enrollment = await db.enrollment.findUniqueOrThrow({ where: { id: enrollmentId }, select: { courseId: true } });
  const totalLessons = await db.lesson.count({ where: { module: { courseId: enrollment.courseId }, isBonus: false } });
  await db.enrollment.update({ where: { id: enrollmentId }, data: { previewOverride: enabled, unlockedDay: enabled ? totalLessons : 1 } });
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

export async function grantLifetimeAccessAction(formData: FormData) {
  const adminId = await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  if (!enrollmentId) throw new Error("Enrolment required");
  await db.enrollment.update({ where: { id: enrollmentId }, data: { lifetimeAccess: true, lifetimeGrantedAt: new Date(), lifetimeGrantedBy: adminId } });
  revalidatePath("/admin");
}

/** Undo a lifetime grant: the learner falls back to their paid access end date. */
export async function removeLifetimeAccessAction(formData: FormData) {
  await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  if (!enrollmentId) throw new Error("Enrolment required");
  await db.enrollment.update({ where: { id: enrollmentId }, data: { lifetimeAccess: false, lifetimeGrantedAt: null, lifetimeGrantedBy: null } });
  revalidatePath("/admin");
}
