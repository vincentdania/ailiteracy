import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f7f1]/92 backdrop-blur-xl"><nav className="container-shell flex h-[72px] items-center justify-between" aria-label="Primary navigation"><Link href="/" className="focus-ring flex items-center gap-2 rounded-lg font-serif text-xl font-bold text-[#00261d]"><Menu size={18} strokeWidth={1.6} /><span>AI Literacy</span></Link><div className="hidden items-center gap-8 text-sm font-semibold text-[#414845] md:flex"><a href="#how-it-works">Programme</a><a href="#outcomes">Tracks</a><a href="#pricing">Pricing</a></div><div className="flex items-center gap-2"><Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link href="/login">Sign in</Link></Button><Button asChild size="sm"><Link href="/signup">Start learning</Link></Button></div></nav></header>;
}
