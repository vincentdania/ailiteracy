import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/login?next=/onboarding");
  const profile = await db.userProfile.findUnique({ where: { userId: session.user.id }, select: { onboardingDone: true } });
  if (profile?.onboardingDone) redirect("/dashboard");
  return <main className="grid min-h-screen place-items-center p-5 py-10"><div className="w-full max-w-2xl rounded-[2rem] border border-[#dce2dd] bg-white p-7 card-shadow sm:p-10"><p className="eyebrow">Your 4-minute learning diagnostic</p><h1 className="display mt-3 text-5xl">Build a programme around your outcome.</h1><p className="mt-4 max-w-xl text-[#5f6f67]">Your answers shape the examples, practice briefs, case studies and capstone—not the quality standard.</p><OnboardingForm /></div></main>;
}
