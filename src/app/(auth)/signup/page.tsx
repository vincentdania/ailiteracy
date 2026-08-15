import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return <><p className="eyebrow">Get started</p><h1 className="display mt-3 text-5xl">Build practical AI skills.</h1><p className="mb-8 mt-4 text-[#5f6f67]">Create an account to get your learning plan.</p><SignupForm referral={ref} /></>;
}
