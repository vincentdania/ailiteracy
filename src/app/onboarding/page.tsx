import { redirect } from "next/navigation";
import Link from "next/link";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login?next=/onboarding");
  const profile = await db.userProfile.findUnique({ where: { userId: session.user.id }, select: { onboardingDone: true } });
  if (profile?.onboardingDone) redirect("/dashboard");
  return <main className="min-h-screen bg-[#f6f8fb]"><header className="border-b border-[#e2e8f0] bg-[#f6f8fb]/95"><div className="container-shell flex h-[72px] items-center justify-between"><Link href="/" className="text-xl" aria-label="Hyrax AI Academy home"><AcademyLockup /></Link><span className="text-xs font-bold uppercase tracking-[.16em] text-[#677284]">Set up your plan</span></div></header><div className="container-shell grid min-h-[calc(100vh-72px)] items-center py-10"><div className="mx-auto w-full max-w-3xl"><OnboardingForm /></div></div></main>;
}
