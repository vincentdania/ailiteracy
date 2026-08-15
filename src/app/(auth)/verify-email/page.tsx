import Link from "next/link";
import { db } from "@/lib/db";
import { tokenHash } from "@/lib/security";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const record = token ? await db.emailVerificationToken.findUnique({ where: { tokenHash: tokenHash(token) } }) : null;
  const valid = Boolean(record && !record.usedAt && record.expiresAt > new Date());
  if (valid && record) await db.$transaction([db.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }), db.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })]);
  return <div className="rounded-3xl border border-[#dce2dd] bg-white p-7 text-center card-shadow"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#d9f99d] text-2xl">{valid ? "✓" : "!"}</div><h1 className="display mt-5 text-4xl">{valid ? "Email verified" : "Link expired"}</h1><p className="my-5 text-[#5f6f67]">{valid ? "Your account is ready. Sign in and tell us what you want AI to help you achieve." : "This verification link is invalid or has already been used."}</p><Button asChild><Link href={valid ? "/login" : "/signup"}>{valid ? "Continue to sign in" : "Create an account"}</Link></Button></div>;
}
