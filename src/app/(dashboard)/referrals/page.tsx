import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Gift, LockOpen, Users } from "lucide-react";
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
  const rewarded = user.referralsMade.filter((referral) => referral.rewardGranted).length;
  return <div className="mx-auto max-w-5xl"><p className="eyebrow">Double-sided rewards</p><h1 className="display mt-3 text-6xl">Learn better together.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6f67]">Invite a colleague. When they enroll, both of you unlock the hidden AI Operating System bonus lab.</p><div className="mt-9 grid gap-5 md:grid-cols-[1.2fr_.8fr]"><ReferralCard code={user.referralCode} origin={origin} /><div className="grid grid-cols-2 gap-4"><div className="rounded-3xl bg-white p-6 card-shadow"><Users className="text-[#1d604d]" /><strong className="mt-5 block text-4xl">{user.referralsMade.length}</strong><span className="text-sm text-[#5f6f67]">people joined</span></div><div className="rounded-3xl bg-white p-6 card-shadow"><LockOpen className="text-[#1d604d]" /><strong className="mt-5 block text-4xl">{rewarded}</strong><span className="text-sm text-[#5f6f67]">bonuses unlocked</span></div></div></div><section className="mt-7 rounded-3xl border border-[#dce2dd] bg-white p-7"><h2 className="flex items-center gap-3 text-xl font-black"><Gift className="text-[#b05b20]" />Referral activity</h2>{user.referralsMade.length ? <div className="mt-5 divide-y divide-[#edf0ed]">{user.referralsMade.map((referral) => <div key={referral.id} className="flex items-center justify-between py-4"><div><strong className="block">{referral.referredUser.name ?? referral.referredUser.email}</strong><span className="text-sm text-[#5f6f67]">Joined {referral.createdAt.toLocaleDateString()}</span></div><span className={`rounded-full px-3 py-1 text-xs font-black ${referral.rewardGranted ? "bg-[#d9f99d] text-[#123c31]" : "bg-[#fff1d2] text-[#8a5b10]"}`}>{referral.rewardGranted ? "Rewarded" : "Awaiting enrollment"}</span></div>)}</div> : <p className="mt-5 text-[#5f6f67]">Your invites will appear here.</p>}</section></div>;
}
