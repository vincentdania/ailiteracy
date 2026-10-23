"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user.id || session.user.role !== "ADMIN") throw new Error("Admin access required");
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== "ADMIN") throw new Error("Admin access required");
}

export async function broadcastPushAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "Your lesson is ready").slice(0, 80);
  const body = String(formData.get("body") ?? "Open your dashboard to continue learning.").slice(0, 180);
  const users = await db.user.findMany({ where: { pushSubscriptions: { some: {} } }, select: { id: true } });
  await Promise.all(users.map((user) => sendPushToUser(user.id, { title, body, url: "/dashboard" })));
  revalidatePath("/admin");
}
