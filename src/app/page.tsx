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
  name: "Personalized AI Certificate Program",
  description: "A 21-day applied AI certificate programme personalized to each learner's role, goals and context.",
  provider: { "@type": "Organization", name: "AI Literacy" },
  educationalLevel: "Beginner to practitioner",
  timeRequired: "P21D",
  offers: [
    { "@type": "Offer", price: "20000", priceCurrency: "NGN" },
    { "@type": "Offer", price: "39", priceCurrency: "USD" },
  ],
};

const tracks = [
  [BriefcaseBusiness, "Career", "Optimise your workflow, automate routine tasks, and position yourself as an AI-literate professional."],
  [Store, "Business", "Drive operational efficiency and uncover new strategic insights using accessible AI tools."],
  [Palette, "Creativity", "Augment your creative process, overcome blocks, and rapidly iterate on concepts across mediums."],
  [BarChart3, "Data", "Synthesise complex information, recognise patterns, and make evidence-backed decisions faster."],
  [Lightbulb, "Entrepreneurship", "Validate ideas, streamline early-stage operations, and scale your impact with limited resources."],
  [GraduationCap, "Education", "Design better curricula, personalise learner experiences, and strengthen responsible research."],
] as const;

export default function HomePage() {
  return (
    <>
      <Script id="course-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <MarketingNav />
      <main>
        <section className="container-shell grid min-h-[calc(100svh-72px)] items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">A practical 21-day certificate programme</p>
            <h1 className="display text-[clamp(3.25rem,6vw,5.5rem)] text-[#00261d]">
              Learn to use AI for the outcome you care about.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#414845]">
              Turn AI fundamentals into real work, a portfolio-ready capstone and sound judgment—built with African realities in view.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/signup">Build my learning plan <ArrowRight className="ml-2" size={18} /></Link></Button>
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
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ceee93]">Designed for how work happens here</p>
              <p className="mt-2 font-serif text-lg leading-6">Local context. Globally useful capability. Evidence you can show.</p>
            </div>
          </div>
        </section>

        <section aria-label="Programme benefits" className="border-y border-[#c0c8c4]/45 bg-white/60">
          <div className="container-shell grid gap-6 py-9 sm:grid-cols-3">
            {[
              [Clock3, "10–20 mins/day", "Built around a working schedule"],
              [BookOpenCheck, "Applied practice", "Real tasks, not passive videos"],
              [ShieldCheck, "Evidence-based", "A certificate backed by your work"],
            ].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Clock3;
              return <div key={String(title)} className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e7ece8] text-[#00261d]"><ItemIcon size={20} strokeWidth={1.7} /></span><div><h2 className="font-bold text-[#00261d]">{String(title)}</h2><p className="mt-1 text-xs text-[#717975]">{String(copy)}</p></div></div>;
            })}
          </div>
        </section>

        <section id="how-it-works" className="container-shell py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <p className="eyebrow">Your goal is the syllabus</p>
              <h2 className="display mt-4 text-5xl text-[#00261d]">A short path from curiosity to confident action.</h2>
              <p className="mt-5 max-w-md leading-7 text-[#414845]">The diagnostic shapes the examples, practice and capstone around your role—without lowering the standard.</p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#e2e8f0] md:grid-cols-3">
              {[
                ["01", "Name your outcome", "Tell us the work you want to improve and the time you can commit."],
                ["02", "Learn in context", "Build durable fundamentals through relevant African examples and realistic briefs."],
                ["03", "Show the evidence", "Complete a capstone, document your checks, and earn a verifiable certificate."],
              ].map(([number, title, copy]) => <article key={number} className="bg-white p-7"><span className="font-serif text-4xl text-[#7da798]">{number}</span><h3 className="mt-8 font-serif text-2xl font-semibold text-[#00261d]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#414845]">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="outcomes" className="bg-[#f2f3ff] py-20 md:py-28">
          <div className="container-shell">
            <div className="max-w-2xl"><p className="eyebrow">Choose your track</p><h2 className="display mt-4 text-5xl text-[#00261d]">Focus the journey on the outcome that matters most.</h2></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map(([Icon, title, copy]) => <article key={title} className="editorial-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"><span className="grid size-10 place-items-center rounded-lg bg-[#f2f3ff] text-[#00261d]"><Icon size={19} strokeWidth={1.7} /></span><h3 className="mt-5 font-serif text-2xl font-semibold text-[#00261d]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#414845]">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#00261d] py-20 text-white md:py-24">
          <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow eyebrow-inverse">Africa as a source of insight</p><h2 className="display mt-4 text-5xl">Real cases. Local constraints. Global lessons.</h2><p className="mt-5 leading-7 text-white/70">Study documented work in health, language, agriculture and climate resilience, then learn to test what makes an AI system useful and responsible.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{CASE_STUDIES.slice(0, 4).map((item) => <a key={item.slug} href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/12 bg-white/6 p-6 transition hover:bg-white/10"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ceee93]"><MapPin size={13} />{item.region} · {item.sector}</p><h3 className="mt-3 font-serif text-xl font-semibold">{item.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-white/65">{item.summary}</p></a>)}</div>
          </div>
        </section>

        <section id="syllabus" className="container-shell py-20 md:py-28"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">A curriculum that compounds</p><h2 className="display mt-4 text-5xl text-[#00261d]">Twenty-one applied lessons. One defensible capability.</h2><p className="mt-5 leading-7 text-[#414845]">Master durable fundamentals, then apply them to the work and decisions that matter to you.</p></div><Syllabus /></section>

        <section id="pricing" className="border-t border-[#e2e8f0] bg-white py-20 md:py-28"><div className="container-shell"><div className="mb-12 text-center"><p className="eyebrow">Simple, local pricing</p><h2 className="display mt-4 text-5xl text-[#00261d]">Start your journey today.</h2><p className="mx-auto mt-4 max-w-xl text-[#414845]">One payment for the programme, personalised practice, capstone review and verified certificate.</p></div><PricingToggle /></div></section>
      </main>
      <footer className="safe-bottom bg-[#00261d] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-5 text-sm sm:flex-row sm:items-center"><strong className="font-serif text-xl">AI Literacy</strong><p className="text-white/60">Practical AI capability, built around human outcomes.</p><nav aria-label="Footer" className="flex gap-5 text-white/70"><Link href="/login">Sign in</Link><a href="mailto:support@ailiteracy.africa">Support</a></nav></div></footer>
    </>
  );
}
