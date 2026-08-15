import { SignupForm } from "@/components/auth/signup-form";
import { googleSignInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  return <><p className="eyebrow">Get started</p><h1 className="display mt-3 text-5xl">Build practical AI skills.</h1><p className="mb-8 mt-4 text-[#5f6f67]">Create an account to get your learning plan.</p>{googleEnabled && <><form action={googleSignInAction}><input type="hidden" name="next" value="/onboarding" /><Button type="submit" variant="secondary" size="lg" className="w-full bg-white"><span aria-hidden="true" className="mr-3 grid size-6 place-items-center rounded-full border border-[#cad4ce] font-serif text-sm font-black text-[#123c31]">G</span>Sign up with Google</Button></form><div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#839189]"><span className="h-px flex-1 bg-[#dce2dd]" />or use email<span className="h-px flex-1 bg-[#dce2dd]" /></div></>}<SignupForm referral={ref} /></>;
}
