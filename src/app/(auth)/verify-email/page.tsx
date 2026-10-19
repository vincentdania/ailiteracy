import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tokenHash } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const record = token ? await db.emailVerificationToken.findUnique({ where: { tokenHash: tokenHash(token) } }) : null;
  const valid = Boolean(record && !record.usedAt && record.expiresAt > new Date());
  if (valid && record) await db.$transaction([db.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }), db.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })]);
  const session = valid ? null : await auth();
  return <div className="rounded-3xl border border-[#dfe5ee] bg-white p-7 text-center card-shadow"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#bcd6ff] text-2xl">{valid ? "✓" : "!"}</div><h1 className="display mt-5 text-4xl">{valid ? "Email verified" : "Link not valid"}</h1><p className="my-5 text-[#4d5768]">{valid ? "Your account is ready. Sign in to set up your learning plan." : "This verification link is invalid, has expired or has already been used. We can send you a new one."}</p>{valid ? <Button asChild><Link href="/login">Continue to sign in</Link></Button> : <><ResendVerificationForm signedInEmail={session?.user.email} /><p className="mt-5 text-sm text-[#4d5768]">Already verified? <Link className="font-bold text-[#214889]" href={session?.user.id ? "/dashboard" : "/login"}>{session?.user.id ? "Go to your dashboard" : "Sign in"}</Link></p></>}</div>;
}
