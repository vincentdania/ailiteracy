import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { MarketingNav } from "@/components/marketing/nav";
import { getTrack, TRACKS } from "@/lib/tracks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TRACKS.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const track = getTrack((await params).slug);
  if (!track) return {};
  return {
    title: track.title,
    description: track.subline,
    alternates: { canonical: `/tracks/${track.slug}` },
    openGraph: { title: track.title, description: track.subline, url: `/tracks/${track.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title: track.title, description: track.subline },
  };
}

export default async function TrackPage({ params }: Props) {
  const track = getTrack((await params).slug);
  if (!track) notFound();
  const support = `mailto:${process.env.SUPPORT_EMAIL ?? "team@hyrax.ng"}?subject=${encodeURIComponent("Done-with-you AI setup")}`;
  return <><MarketingNav /><main>
    <section className="bg-[#10294f] py-14 text-white sm:py-20"><div className="container-shell grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end"><div><Link href="/" className="text-sm font-bold text-[#bcd6ff] underline">All tracks</Link><p className="eyebrow eyebrow-inverse mt-7">{track.audience}</p><h1 className="display mt-4 max-w-4xl text-[clamp(2.3rem,5vw,4.6rem)] leading-tight">{track.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{track.subline}</p></div><div className="rounded-3xl border border-white/20 bg-white/10 p-6"><p className="text-sm text-white/75">One track · 3 months access</p><strong className="mt-2 block font-display text-4xl">₦20,000</strong><Link href={`/checkout?course=${track.slug}`} className="tap mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#f2b01e] px-6 py-3.5 font-bold text-[#10294f]">Enrol now <ArrowRight className="ml-2" size={18} /></Link><p className="mt-4 text-xs leading-5 text-white/65">Lessons unlock after a verified Paystack payment. Tool and message costs are separate.</p></div></div></section>

    <section className="container-shell py-14 sm:py-20"><div className="grid gap-10 md:grid-cols-2"><div><p className="eyebrow">Does this sound familiar?</p><h2 className="display mt-3 text-3xl text-[#10294f] sm:text-4xl">Your time is caught in repeat work.</h2><ul className="mt-6 grid gap-3">{track.problems.map((problem) => <li key={problem} className="border-l-4 border-[#f2b01e] pl-4 leading-7 text-[#4d5768]">{problem}</li>)}</ul></div><div><p className="eyebrow">What you will build</p><h2 className="display mt-3 text-3xl text-[#10294f] sm:text-4xl">Assistants you can use in your own setting.</h2><ul className="mt-6 grid gap-3">{track.builds.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#26324a]"><Check className="mt-1 shrink-0 text-[#146c43]" size={18} />{item}</li>)}</ul></div></div></section>

    <section className="bg-[#eef3fb] py-14 sm:py-20"><div className="container-shell"><p className="eyebrow">Curriculum</p><h2 className="display mt-3 text-3xl text-[#10294f] sm:text-4xl">Build it step by step.</h2><p className="mt-4 max-w-3xl leading-7 text-[#4d5768]">Start with how assistants work and how to approve their actions. Then build each assistant around your real tasks and finish with a launch capstone.</p><ol className="mt-8 grid gap-4 md:grid-cols-2">{track.modules.map((module) => <li key={module.title} className="rounded-2xl bg-white p-6"><h3 className="font-display text-xl font-bold text-[#10294f]">{module.title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[#4d5768]">{module.lessons.map((lesson) => <li key={lesson.slug}>• {lesson.slug === "n8n-setup" || lesson.slug === "hermes-setup" ? "Guided hosting and setup" : lesson.title}</li>)}</ul></li>)}</ol></div></section>

    <section className="container-shell grid gap-8 py-14 sm:py-20 md:grid-cols-[auto_1fr]"><ShieldCheck className="text-[#214889]" size={42} /><div><p className="eyebrow">Your rules, your approval</p><h2 className="display mt-3 text-3xl text-[#10294f] sm:text-4xl">Keep a person in control.</h2><p className="mt-4 max-w-3xl leading-7 text-[#4d5768]">Every workflow includes a human approval step. Nothing is sent without your say-so, and you decide what information the assistant can access. {track.slug === "professionals" ? "The track includes dedicated guidance on client confidentiality and access limits." : "The guided WhatsApp Business setup covers customer consent and supported messaging methods."}</p><p className="mt-4 leading-7 text-[#4d5768]">Hosting setup is guided in the lessons. A <a href={support} className="font-bold text-[#214889] underline">done-with-you setup</a> is available on request.</p></div></section>

    <section className="bg-white py-14 sm:py-20"><div className="container-shell max-w-4xl"><p className="eyebrow">FAQ</p><h2 className="display mt-3 text-3xl text-[#10294f] sm:text-4xl">Before you enrol</h2><div className="mt-7 divide-y divide-[#dfe5ee] border-y border-[#dfe5ee]">{[
      ["Do I need to code?", "No. The build-alongs use guided setup and copy-and-paste templates."],
      ["Do I need my own tools or hosting?", `Yes. The lessons include a guided hosting step for your assistant. Tool, hosting and message costs vary and are paid separately to providers.`],
      ["Can I take both tracks?", "Yes. Each track is purchased separately for ₦20,000."],
      ["When does access end?", "Three calendar months after your purchase date. You can renew after it expires."],
      ["What if I need setup help?", "Contact Support for help or request a done-with-you setup."],
      ["What is the refund policy?", "TODO: Hyrax must publish its refund policy before launch."],
    ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none justify-between gap-4 font-display text-lg font-bold text-[#10294f]">{question}<span aria-hidden="true" className="text-2xl group-open:rotate-45">+</span></summary><p className="mt-3 leading-7 text-[#4d5768]">{answer}</p></details>)}</div></div></section>

    <section className="bg-[#10294f] py-14 text-white sm:py-20"><div className="container-shell"><p className="eyebrow eyebrow-inverse">Your next step</p><h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl">Start building your {track.slug === "small-business" ? "AI team" : "professional assistant"}.</h2><p className="mt-4 text-lg">₦20,000 · 3 months access</p><Link href={`/checkout?course=${track.slug}`} className="tap mt-6 inline-flex items-center rounded-full bg-[#f2b01e] px-7 py-3.5 font-bold text-[#10294f]">Enrol now <ArrowRight className="ml-2" size={18} /></Link></div></section>
  </main><footer className="safe-bottom bg-[#10294f] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-5 border-t border-white/15 pt-8 text-sm sm:flex-row sm:items-center"><AcademyLockup inverse /><nav aria-label="Footer" className="flex gap-5 text-white/70"><Link href="/login">Sign in</Link><a href={`mailto:${process.env.SUPPORT_EMAIL ?? "team@hyrax.ng"}`}>Support</a></nav></div></footer></>;
}
