import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return <><p className="eyebrow">Start with your outcome</p><h1 className="display mt-3 text-5xl">Build an AI skill you can use.</h1><p className="mb-8 mt-4 leading-7 text-[#5f6f67]">Create your account, complete the short diagnostic and receive your personalized learning plan.</p><SignupForm referral={ref} /></>;
}
