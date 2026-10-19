import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Activity, UserCheck, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReferralCard } from "@/components/referrals/referral-card";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");
  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id }, include: { referralsMade: { include: { referredUser: true }, orderBy: { createdAt: "desc" } } } });
  const requestHeaders = await headers();
  const origin = `${requestHeaders.get("x-forwarded-proto") ?? "http"}://${requestHeaders.get("host") ?? "localhost:3000"}`;
  // rewardGranted is set once the referred learner pays (see src/lib/payments/process.ts). No payout or reward is attached to it.
  const enrolled = user.referralsMade.filter((referral) => referral.rewardGranted).length;
  return <div className="mx-auto max-w-5xl"><p className="eyebrow">Refer a friend</p><h1 className="display mt-3 text-6xl">Learn with a colleague.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#4d5768]">Share your personal link with a colleague who could use the course. When they sign up through it, they appear below, and you can see when they enrol.</p><div className="mt-9 grid gap-5 md:grid-cols-[1.2fr_.8fr]"><ReferralCard code={user.referralCode} origin={origin} /><div className="grid grid-cols-2 gap-4"><div className="rounded-3xl bg-white p-6 card-shadow"><Users className="text-[#0058be]" /><strong className="mt-5 block text-4xl">{user.referralsMade.length}</strong><span className="text-sm text-[#4d5768]">joined with your link</span></div><div className="rounded-3xl bg-white p-6 card-shadow"><UserCheck className="text-[#0058be]" /><strong className="mt-5 block text-4xl">{enrolled}</strong><span className="text-sm text-[#4d5768]">enrolled in the course</span></div></div></div><section className="mt-7 rounded-3xl border border-[#dfe5ee] bg-white p-7"><h2 className="flex items-center gap-3 text-xl font-black"><Activity className="text-[#b05b20]" />Referral activity</h2>{user.referralsMade.length ? <div className="mt-5 divide-y divide-[#edf1f6]">{user.referralsMade.map((referral) => <div key={referral.id} className="flex items-center justify-between py-4"><div><strong className="block">{referral.referredUser.name ?? referral.referredUser.email}</strong><span className="text-sm text-[#4d5768]">Joined {referral.createdAt.toLocaleDateString()}</span></div><span className={`rounded-full px-3 py-1 text-xs font-black ${referral.rewardGranted ? "bg-[#bcd6ff] text-[#214889]" : "bg-[#fff1d2] text-[#8a5b10]"}`}>{referral.rewardGranted ? "Enrolled" : "Not enrolled yet"}</span></div>)}</div> : <p className="mt-5 text-[#4d5768]">No one has joined with your link yet. When someone does, they will appear here.</p>}</section></div>;
}
