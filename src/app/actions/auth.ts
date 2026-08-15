"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { secureToken, tokenHash } from "@/lib/security";
import { referralCode } from "@/lib/utils";
import { signIn } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/redis";

export type AuthActionState = { ok: boolean; message: string; verificationPath?: string };

const signupSchema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(8).max(72), referral: z.string().optional() });

export async function signupAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your details." };
  const email = parsed.data.email.toLowerCase();
  const signupLimit = await enforceRateLimit(`signup:${email}`, 5, 60 * 60);
  if (!signupLimit.allowed) return { ok: false, message: "Too many signup attempts. Please try again later." };
  if (await db.user.findUnique({ where: { email } })) return { ok: false, message: "An account already exists for this email." };
  const referrer = parsed.data.referral ? await db.user.findUnique({ where: { referralCode: parsed.data.referral.toUpperCase() } }) : null;
  const token = secureToken();
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      referralCode: referralCode(parsed.data.name),
      referredById: referrer?.id,
      emailVerified: process.env.INTEGRATION_MODE === "mock" ? new Date() : undefined,
      verificationTokens: { create: { tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } },
      ...(referrer ? { referralReceived: { create: { referrerId: referrer.id } } } : {}),
    },
  });
  const verificationPath = `/verify-email?token=${encodeURIComponent(token)}`;
  await sendEmail({ to: user.email, subject: "Verify your AI Literacy account", text: `Verify your email: ${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}${verificationPath}` });
  return { ok: true, message: process.env.INTEGRATION_MODE === "mock" ? "Account created. You can sign in now." : "Check your inbox to verify your email.", verificationPath: process.env.INTEGRATION_MODE === "mock" ? verificationPath : undefined };
}

export async function credentialsLoginAction(formData: FormData) {
  const requestedPath = String(formData.get("next") || "/dashboard");
  const redirectTo = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/dashboard";
  await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo });
}

export async function googleSignInAction(formData: FormData) {
  const requestedPath = String(formData.get("next") || "/dashboard");
  const redirectTo = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/dashboard";
  await signIn("google", { redirectTo });
}
