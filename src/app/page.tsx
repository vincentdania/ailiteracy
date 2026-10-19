import Image from "next/image";
import Link from "next/link";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
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
import { getCourseOutline } from "@/lib/course-outline";
import { paystackUsdEnabled } from "@/lib/payments/paystack";

// Rendered per request so the USD price follows PAYSTACK_USD_ENABLED at runtime, as checkout does.
export const dynamic = "force-dynamic";

function courseSchema(showUsd: boolean) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "AI for Your Work in 10 Days",
    description: "A step-by-step, no-code course. Use free AI tools on your phone to finish reports, emails, documents and decisions faster, then turn your Personal AI Playbook into a working agent. Built for Nigerian working people, with nothing technical assumed.",
    provider: { "@type": "Organization", name: "Hyrax AI Academy" },
    educationalLevel: "Beginner",
    timeRequired: "P10D",
    offers: [
      { "@type": "Offer", price: "20000", priceCurrency: "NGN" },
      ...(showUsd ? [{ "@type": "Offer", price: "29", priceCurrency: "USD" }] : []),
    ],
  };
}

const tracks = [
  [BriefcaseBusiness, "Work", "Reports, briefs and follow-ups in minutes."],
  [Store, "Business", "Customer replies, quotes and adverts whenever you need them."],
  [Palette, "Creativity", "Draft, revise and post content in your own voice."],
  [BarChart3, "Numbers", "Build a spreadsheet by describing what you need. No formulas."],
  [Lightbulb, "Entrepreneurship", "A month of posts and your key business documents in one sitting."],
  [GraduationCap, "Education", "Lesson plans, marking feedback and research."],
] as const;

export default function HomePage() {
  const showUsd = paystackUsdEnabled();
  const schema = courseSchema(showUsd);
  return (
    <>
      <Script id="course-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <MarketingNav />
      <main>
        <section className="container-shell grid min-h-[calc(100svh-72px)] items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">10 days · No code · Free tools · Phone or laptop</p>
            <h1 className="display text-[clamp(2.25rem,7vw,5.25rem)] text-[#0b1c30]">
              Expand your capabilities.<br />
              Make AI work for you.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4d5768]">
              Use free AI tools to finish reports, emails, documents and decisions faster. You learn step by step on your phone, and nothing technical is assumed. By the end, you have finished work to show and your first working agent.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/signup">Start learning <ArrowRight className="ml-2" size={18} /></Link></Button>
              <Button asChild size="lg" variant="secondary"><a href="#how-it-works">See how it works</a></Button>
            </div>
          </div>

          <div className="relative min-h-[28rem] overflow-hidden rounded-2xl border border-[#cbd5e1]/50 bg-white shadow-sm md:min-h-[35rem]">
            <Image
              src="/images/nigerian-professionals-learning.jpg"
              alt="Two Nigerian professionals learning together in a Lagos workspace"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#10294f]/92 p-4 text-white backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#bcd6ff]">Built for Africa</p>
              <p className="mt-2 font-display text-lg leading-6">Local examples. Real tasks from your job.</p>
            </div>
          </div>
        </section>

        <section aria-label="Free preview" className="container-shell py-10 md:py-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#d5e0ee] bg-[#eaf2ff] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-xl">
              <p className="eyebrow">Free preview</p>
              <h2 className="display mt-2 text-3xl text-[#0b1c30] sm:text-4xl">Try Day 1 free</h2>
              <p className="mt-3 leading-7 text-[#4d5768]">No account or payment needed. In about 20 minutes, you turn rough meeting notes into a finished report, so you can see how the course works before you pay.</p>
            </div>
            <Link href="/challenge/tracka-01" className="inline-flex shrink-0 items-center rounded-full bg-[#10294f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#214889]">Read Day 1 free <ArrowRight className="ml-2" size={16} /></Link>
          </div>
        </section>

        <section aria-label="Programme benefits" className="border-y border-[#cbd5e1]/45 bg-white/60">
          <div className="container-shell grid gap-6 py-9 sm:grid-cols-3">
            {[
              [Clock3, "20–30 minutes a day", "Fits around your work"],
              [BookOpenCheck, "Learn by doing", "One real task each day"],
              [ShieldCheck, "Verified certificate", "Anyone can check it online"],
            ].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Clock3;
              return <div key={String(title)} className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#edf1f6] text-[#0b1c30]"><ItemIcon size={20} strokeWidth={1.7} /></span><div><h2 className="font-bold text-[#0b1c30]">{String(title)}</h2><p className="mt-1 text-xs text-[#677284]">{String(copy)}</p></div></div>;
            })}
          </div>
        </section>

        <section id="how-it-works" className="container-shell py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display mt-4 text-5xl text-[#0b1c30]">Your own work, one step at a time.</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#e2e8f0] md:grid-cols-3">
              {[
                ["01", "Start free", "On Day 1, you turn rough notes into a finished report. It takes about 20 minutes, it is free, and you don't need an account."],
                ["02", "Seven days of real tasks", "Reports, emails, long documents and a month of posts. Each day, you use AI on one task from your own job."],
                ["03", "Agents Week", "Over the last three days, you turn your Personal AI Playbook into a working agent with instructions, memory and a weekly routine. Finish the course to earn your certificate."],
              ].map(([number, title, copy]) => <article key={number} className="bg-white p-7"><span className="font-display text-4xl text-[#8fb0e0]">{number}</span><h3 className="mt-8 font-display text-2xl font-semibold text-[#0b1c30]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#4d5768]">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="outcomes" className="bg-[#f2f3ff] py-20 md:py-28">
          <div className="container-shell">
            <div className="max-w-2xl"><p className="eyebrow">Where you&apos;ll use it</p><h2 className="display mt-4 text-5xl text-[#0b1c30]">Use it in the work you already do.</h2></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map(([Icon, title, copy]) => <article key={title} className="editorial-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"><span className="grid size-10 place-items-center rounded-lg bg-[#f2f3ff] text-[#0b1c30]"><Icon size={19} strokeWidth={1.7} /></span><h3 className="mt-5 font-display text-2xl font-semibold text-[#0b1c30]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#4d5768]">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#10294f] py-20 text-white md:py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow eyebrow-inverse">African case studies</p><h2 className="display mt-4 text-5xl">See how African organisations use AI.</h2></div>
            <div className="grid gap-4 sm:grid-cols-2">{CASE_STUDIES.slice(0, 4).map((item) => <a key={item.slug} href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/12 bg-white/6 p-6 transition hover:bg-white/10"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#bcd6ff]"><MapPin size={13} />{item.region} · {item.sector}</p><h3 className="mt-3 font-display text-xl font-semibold">{item.name}</h3></a>)}</div>
          </div>
        </section>

        <section id="syllabus" className="container-shell py-20 md:py-28"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">Course outline</p><h2 className="display mt-4 text-5xl text-[#0b1c30]">Seven days on your own work. Three days to build your first agent.</h2></div><Syllabus modules={getCourseOutline()} /></section>

        <section id="pricing" className="border-t border-[#e2e8f0] bg-white py-20 md:py-28"><div className="container-shell"><div className="mb-12 text-center"><p className="eyebrow">Simple pricing</p><h2 className="display mt-4 text-5xl text-[#0b1c30]">One course. One payment.</h2></div><PricingToggle showUsd={showUsd} /></div></section>
      </main>
      <footer className="safe-bottom bg-[#10294f] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-5 text-sm sm:flex-row sm:items-center"><span className="grid gap-2"><span className="text-xl"><AcademyLockup inverse /></span><span className="text-xs font-bold uppercase tracking-[.18em] text-white/60">HYRAX · The AI Enablement Company.</span></span><nav aria-label="Footer" className="flex gap-5 text-white/70"><Link href="/login">Sign in</Link><a href="mailto:team@hyrax.ng">Support</a></nav></div></footer>
    </>
  );
}
