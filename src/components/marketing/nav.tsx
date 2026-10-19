import Link from "next/link";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f6f8fb]/92 backdrop-blur-xl"><nav className="container-shell flex h-[72px] items-center justify-between" aria-label="Primary navigation"><Link href="/" className="focus-ring rounded-lg text-xl" aria-label="Hyrax AI Academy home"><AcademyLockup /></Link><div className="hidden items-center gap-8 text-sm font-semibold text-[#4d5768] md:flex"><a href="#how-it-works">Programme</a><a href="#outcomes">Tracks</a><a href="#pricing">Pricing</a></div><div className="flex items-center gap-2"><Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link href="/login">Sign in</Link></Button><Button asChild size="sm"><Link href="/signup">Start learning</Link></Button></div></nav></header>;
}
