import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Lightbulb,
  MapPin,
  Palette,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/marketing/nav";
import { PricingToggle } from "@/components/marketing/pricing-toggle";
import { Syllabus } from "@/components/marketing/syllabus";
import { CASE_STUDIES } from "@/lib/personalization/case-studies";

const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "AI for Your Work — in 10 Days",
  description: "A step-by-step, no-code course: use free AI tools on your phone to finish reports, emails, documents and decisions faster — then turn your Personal AI Playbook into a working agent. Built for Nigerian working people; nothing technical assumed.",
  provider: { "@type": "Organization", name: "AI Literacy" },
  educationalLevel: "Beginner",
  timeRequired: "P10D",
  offers: [
    { "@type": "Offer", price: "20000", priceCurrency: "NGN" },
    { "@type": "Offer", price: "29", priceCurrency: "USD" },
  ],
};

const tracks = [
  [BriefcaseBusiness, "Work", "Reports, briefs and follow-ups in minutes."],
  [Store, "Business", "Customer replies, quotes and adverts on demand."],
  [Palette, "Creativity", "Draft, iterate and publish in your voice."],
  [BarChart3, "Numbers", "Spreadsheets built by describing them — no formulas."],
  [Lightbulb, "Entrepreneurship", "Content packs and business documents in one sitting."],
  [GraduationCap, "Education", "Lesson plans, marking feedback and research."],
] as const;

export default function HomePage() {
  return (
    <>
      <Script id="course-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <MarketingNav />
      <main>
        <section className="container-shell grid min-h-[calc(100svh-72px)] items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">10 days · No code · Free tools · Phone or laptop</p>
            <h1 className="display text-[clamp(3.25rem,6vw,5.5rem)] text-[#00261d]">
              Put AI to work on your job — in 10 days.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#414845]">
              Use free AI tools to finish reports, emails, documents and decisions faster — step by step, on your phone, nothing technical assumed. Finish with outputs you can show and your first working agent.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/signup">Start learning <ArrowRight className="ml-2" size={18} /></Link></Button>
              <Button asChild size="lg" variant="secondary"><a href="#how-it-works">See how it works</a></Button>
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden rounded-2xl border border-[#c0c8c4]/50 bg-white shadow-sm md:min-h-[35rem]">
            <Image
              src="/images/nigerian-professionals-learning.jpg"
              alt="Two Nigerian professionals learning together in a Lagos workspace"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#00261d]/92 p-4 text-white backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ceee93]">Built for Africa</p>
              <p className="mt-2 font-serif text-lg leading-6">Local examples. Practical outcomes.</p>
            </div>
          </div>
        </section>

        <section aria-label="Free preview" className="container-shell py-10 md:py-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#d6e3dc] bg-[#eef5e9] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-xl">
              <p className="eyebrow">Free preview</p>
              <h2 className="display mt-2 text-3xl text-[#00261d] sm:text-4xl">Try Day 1 — free</h2>
              <p className="mt-3 leading-7 text-[#414845]">Read the first day free, no account needed. Turn rough meeting notes into a polished report in 10 minutes before you commit.</p>
            </div>
            <Link href="/challenge/tracka-01" className="inline-flex shrink-0 items-center rounded-full bg-[#00261d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#123c31]">Read Day 1 free <ArrowRight className="ml-2" size={16} /></Link>
          </div>
        </section>

        <section aria-label="Programme benefits" className="border-y border-[#c0c8c4]/45 bg-white/60">
          <div className="container-shell grid gap-6 py-9 sm:grid-cols-3">
            {[
              [Clock3, "10–20 mins/day", "Fits your schedule"],
              [BookOpenCheck, "Learn by doing", "Complete real tasks"],
              [ShieldCheck, "Verified certificate", "Show what you built"],
            ].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Clock3;
              return <div key={String(title)} className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e7ece8] text-[#00261d]"><ItemIcon size={20} strokeWidth={1.7} /></span><div><h2 className="font-bold text-[#00261d]">{String(title)}</h2><p className="mt-1 text-xs text-[#717975]">{String(copy)}</p></div></div>;
            })}
          </div>
        </section>

        <section id="how-it-works" className="container-shell py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display mt-4 text-5xl text-[#00261d]">Your work, done by AI — step by step.</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#e2e8f0] md:grid-cols-3">
              {[
                ["01", "Start free", "Day 1 turns rough notes into a finished report in 10 minutes — free, no account."],
                ["02", "Seven days to results", "Reports, emails, documents, a month of content — one real task from your own work each day."],
                ["03", "Agents Week", "Turn your Personal AI Playbook into a working agent with instructions, memory and a weekly routine. Certificate on completion."],
              ].map(([number, title, copy]) => <article key={number} className="bg-white p-7"><span className="font-serif text-4xl text-[#7da798]">{number}</span><h3 className="mt-8 font-serif text-2xl font-semibold text-[#00261d]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#414845]">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="outcomes" className="bg-[#f2f3ff] py-20 md:py-28">
          <div className="container-shell">
            <div className="max-w-2xl"><p className="eyebrow">Where you&apos;ll use it</p><h2 className="display mt-4 text-5xl text-[#00261d]">Put AI to work on what you do.</h2></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map(([Icon, title, copy]) => <article key={title} className="editorial-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"><span className="grid size-10 place-items-center rounded-lg bg-[#f2f3ff] text-[#00261d]"><Icon size={19} strokeWidth={1.7} /></span><h3 className="mt-5 font-serif text-2xl font-semibold text-[#00261d]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#414845]">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#00261d] py-20 text-white md:py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow eyebrow-inverse">African case studies</p><h2 className="display mt-4 text-5xl">Learn from work happening here.</h2></div>
            <div className="grid gap-4 sm:grid-cols-2">{CASE_STUDIES.slice(0, 4).map((item) => <a key={item.slug} href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/12 bg-white/6 p-6 transition hover:bg-white/10"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ceee93]"><MapPin size={13} />{item.region} · {item.sector}</p><h3 className="mt-3 font-serif text-xl font-semibold">{item.name}</h3></a>)}</div>
          </div>
        </section>

        <section id="syllabus" className="container-shell py-20 md:py-28"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">Course outline</p><h2 className="display mt-4 text-5xl text-[#00261d]">Seven days to results. Three days to your first agent.</h2></div><Syllabus /></section>

        <section id="pricing" className="border-t border-[#e2e8f0] bg-white py-20 md:py-28"><div className="container-shell"><div className="mb-12 text-center"><p className="eyebrow">Simple pricing</p><h2 className="display mt-4 text-5xl text-[#00261d]">One course. One payment.</h2></div><PricingToggle /></div></section>
      </main>
      <footer className="safe-bottom bg-[#00261d] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-5 text-sm sm:flex-row sm:items-center"><strong className="font-serif text-xl">AI Literacy</strong><nav aria-label="Footer" className="flex gap-5 text-white/70"><Link href="/login">Sign in</Link><a href="mailto:support@ailiteracy.africa">Support</a></nav></div></footer>
    </>
  );
}
