import Link from "next/link";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { AcademyPhoto } from "@/components/marketing/academy-images";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen bg-[#faf7f2] lg:grid-cols-[.9fr_1.1fr]">
    <section className="flex items-center justify-center p-5 py-12 sm:p-10"><div className="w-full max-w-md"><Link href="/" className="mb-10 inline-block text-xl" aria-label="Hyrax AI Academy home"><AcademyLockup /></Link>{children}</div></section>
    <aside className="hidden border-l border-[#e5ded4] bg-[#f2ece4] p-12 text-[#10294f] lg:flex lg:flex-col lg:justify-center"><div className="mx-auto w-full max-w-xl"><p className="eyebrow text-[#8b4c1d]">Built for working people</p><h2 className="display mt-5 text-5xl">Pick your track. Put AI to work.</h2><p className="mt-6 text-base leading-[1.6] text-[#394b63]">Build along with guided lessons and templates. Learn on your phone or laptop, with three months of access from purchase.</p><AcademyPhoto person="professional" className="mt-10" /></div></aside>
  </main>;
}
