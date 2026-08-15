import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f7f1]/85 backdrop-blur-xl"><nav className="container-shell flex h-18 items-center justify-between" aria-label="Primary navigation"><Link href="/" className="focus-ring flex items-center gap-2 rounded-lg font-black tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-[#123c31] text-[#d9f99d]"><Sparkles size={18} /></span><span>AI Literacy</span></Link><div className="hidden items-center gap-7 text-sm font-semibold text-[#5f6f67] md:flex"><a href="#outcomes">Outcomes</a><a href="#syllabus">Syllabus</a><a href="#pricing">Pricing</a></div><div className="flex items-center gap-2"><Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link href="/login">Sign in</Link></Button><Button asChild size="sm"><Link href="/signup">Start learning</Link></Button></div></nav></header>;
}
