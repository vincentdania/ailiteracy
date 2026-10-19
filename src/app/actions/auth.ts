"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { secureToken, tokenHash } from "@/lib/security";
import { referralCode } from "@/lib/utils";
import { auth, signIn } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/redis";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export type AuthActionState = { ok: boolean; message: string; verificationPath?: string };

const VERIFICATION_TTL_MS = 60 * 60 * 1000;

async function sendVerificationEmail(to: string, token: string) {
  const verificationPath = `/verify-email?token=${encodeURIComponent(token)}`;
  await sendEmail({ to, subject: "Verify your Hyrax AI Academy account", text: `Verify your email: ${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}${verificationPath}` });
  return verificationPath;
}

const signupSchema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(8).max(72), referral: z.string().optional() });

export async function signupAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!(await verifyRecaptchaToken(String(formData.get("recaptchaToken") ?? "")))) return { ok: false, message: "Please complete the security check." };
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
      verificationTokens: { create: { tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS) } },
      ...(referrer ? { referralReceived: { create: { referrerId: referrer.id } } } : {}),
    },
  });
  let verificationPath: string;
  try {
    verificationPath = await sendVerificationEmail(user.email, token);
  } catch {
    // The account is not useful without verification. Remove this new record so
    // the learner can retry once the temporary delivery problem is resolved.
    await db.user.delete({ where: { id: user.id } }).catch(() => undefined);
    return { ok: false, message: "We could not send the verification email. Please try again." };
  }
  return { ok: true, message: process.env.INTEGRATION_MODE === "mock" ? "Account created. You can sign in now." : "Check your inbox to verify your email.", verificationPath: process.env.INTEGRATION_MODE === "mock" ? verificationPath : undefined };
}

const RESEND_SENT_MESSAGE = "If that email address still needs verifying, we have sent a new link. Check your inbox. The link works for 1 hour.";

/**
 * Sends a fresh verification link after an expired or used one. Signed-in
 * learners get it at their own address; everyone else types theirs. The reply
 * is the same whether or not the address has an account.
 */
export async function resendVerificationAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const session = await auth();
  const parsed = z.string().email().safeParse(session?.user.email ?? formData.get("email"));
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };
  const email = parsed.data.toLowerCase();
  const limit = await enforceRateLimit(`verify-resend:${email}`, 3, 60 * 60);
  if (!limit.allowed) return { ok: false, message: "Too many requests. Please try again later." };
  const user = await db.user.findUnique({ where: { email }, select: { id: true, email: true, emailVerified: true } });
  if (user && !user.emailVerified) {
    const token = secureToken();
    await db.$transaction([
      db.emailVerificationToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }),
      db.emailVerificationToken.create({ data: { userId: user.id, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS) } }),
    ]);
    try {
      await sendVerificationEmail(user.email, token);
    } catch (error) {
      console.error("Verification email resend failed", error instanceof Error ? error.message : error);
    }
  }
  return { ok: true, message: RESEND_SENT_MESSAGE };
}

export async function credentialsLoginAction(formData: FormData) {
  const requestedPath = String(formData.get("next") || "/dashboard");
  const redirectTo = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/dashboard";
  if (!(await verifyRecaptchaToken(String(formData.get("recaptchaToken") ?? "")))) redirect(`/login?error=recaptcha&next=${encodeURIComponent(redirectTo)}`);
  await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo });
}

export async function googleSignInAction(formData: FormData) {
  const requestedPath = String(formData.get("next") || "/dashboard");
  const redirectTo = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/dashboard";
  await signIn("google", { redirectTo });
}
