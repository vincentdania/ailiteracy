"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const nameSchema = z.string().trim().min(2, "Enter your full name.").max(80, "Keep it under 80 characters.").regex(/^[\p{L}\p{M}' .-]+$/u, "Use letters, spaces, hyphens and apostrophes only.");

/** The full name printed on certificates. Updating it also corrects certificates already issued. */
export async function setCertificateNameAction(_: { ok: boolean; message: string }, formData: FormData) {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: "Sign in required." };
  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the name." };
  await db.$transaction([
    db.user.update({ where: { id: session.user.id }, data: { name: parsed.data } }),
    db.moduleCertificate.updateMany({ where: { userId: session.user.id }, data: { learnerName: parsed.data } }),
  ]);
  revalidatePath("/certificates");
  revalidatePath("/dashboard");
  return { ok: true, message: "Saved. Your certificates now show this name." };
}

/** Learners choose whether their name appears on the public verification page. */
export async function setCertificateVisibilityAction(input: { id: string; kind: "module" | "course"; showName: boolean }) {
  const session = await auth();
  if (!session?.user.id) return { ok: false };
  if (input.kind === "module") await db.moduleCertificate.updateMany({ where: { credentialId: input.id, userId: session.user.id }, data: { showName: !!input.showName } });
  else await db.certificate.updateMany({ where: { uniqueHash: input.id, userId: session.user.id }, data: { showName: !!input.showName } });
  revalidatePath("/certificates");
  revalidatePath(`/verify/${input.id}`);
  return { ok: true };
}
