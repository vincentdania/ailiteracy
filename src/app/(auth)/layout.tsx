import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]"><section className="flex items-center justify-center bg-[#f8f7f1] p-5 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-10 flex items-center gap-2 font-black"><span className="grid size-9 place-items-center rounded-xl bg-[#123c31] text-[#d9f99d]"><Sparkles size={18} /></span>AI Literacy</Link>{children}</div></section><aside className="relative hidden overflow-hidden bg-[#123c31] p-16 text-white lg:flex lg:flex-col lg:justify-end"><div className="absolute -right-32 -top-32 size-[30rem] rounded-full border-[6rem] border-white/5" /><div className="relative max-w-xl"><p className="eyebrow text-[#d9f99d]">Your outcome. Your context. Your evidence.</p><p className="display mt-5 text-6xl">Learn the fundamentals. Apply them to real work. Show what you can do.</p><p className="mt-7 text-white/60">Built for professionals who need useful capability—not another pile of videos.</p></div></aside></main>;
}
