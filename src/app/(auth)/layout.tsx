import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]"><section className="flex items-center justify-center bg-[#f8f7f1] p-5 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-10 flex items-center gap-2 font-serif text-xl font-bold text-[#00261d]"><Menu size={18} />AI Literacy</Link>{children}</div></section><aside className="relative hidden min-h-screen overflow-hidden bg-[#00261d] text-white lg:flex lg:flex-col lg:justify-end"><Image src="/images/nigerian-professionals-learning.jpg" alt="Nigerian professionals collaborating" fill sizes="55vw" className="object-cover" priority /><div className="absolute inset-0 bg-gradient-to-t from-[#00261d] via-[#00261d]/45 to-transparent" /><div className="relative max-w-2xl p-16"><p className="eyebrow text-[#ceee93]">Your outcome. Your context. Your evidence.</p><p className="display mt-5 text-6xl">Learn the fundamentals. Apply them to real work. Show what you can do.</p><p className="mt-7 text-white/70">Built for professionals who need useful capability—not another pile of videos.</p></div></aside></main>;
}
