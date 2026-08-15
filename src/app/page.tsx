import Link from "next/link";
import Script from "next/script";
import { ArrowRight, BarChart3, BookOpenCheck, BriefcaseBusiness, Check, Clock3, GraduationCap, Lightbulb, MapPin, Palette, ShieldCheck, Sparkles, Store, Target } from "lucide-react";
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
  offers: [{ "@type": "Offer", price: "20000", priceCurrency: "NGN" }, { "@type": "Offer", price: "39", priceCurrency: "USD" }],
};

const tracks = [
  [BriefcaseBusiness, "Career & productivity", "Build reliable workflows for the work you already do."],
  [Store, "Business growth", "Understand customers and create useful growth assets."],
  [Palette, "Creativity & content", "Make original work without losing your voice or context."],
  [BarChart3, "Data & decisions", "Test claims, analyse information and explain recommendations."],
  [Lightbulb, "Entrepreneurship", "Turn a real problem into a responsible, testable offer."],
  [GraduationCap, "Education & research", "Learn and investigate with evidence and integrity."],
] as const;

export default function HomePage() {
  return <>
    <Script id="course-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <MarketingNav />
    <main>
      <section className="container-shell grid min-h-[82vh] items-center gap-12 py-16 lg:grid-cols-[1.06fr_.94fr] lg:py-24">
        <div>
          <div className="eyebrow mb-6 flex items-center gap-2"><Sparkles size={14} />Your goals first. AI skills that transfer.</div>
          <h1 className="display max-w-4xl text-[clamp(3.5rem,7.4vw,7rem)]">Learn to use AI for the outcome <em className="text-[#1d604d]">you</em> care about.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5f6f67] sm:text-xl">A personalized 21-day certificate programme that turns AI fundamentals into real work, a portfolio-ready capstone and sound judgment—built with African realities in view.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/signup">Build my learning plan <ArrowRight className="ml-2" size={19} /></Link></Button><Button asChild size="lg" variant="secondary"><a href="#how-it-works">See how it works</a></Button></div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#5f6f67]"><span className="flex items-center gap-2"><Clock3 size={16} />10–60 min/day</span><span className="flex items-center gap-2"><BookOpenCheck size={16} />Applied practice</span><span className="flex items-center gap-2"><ShieldCheck size={16} />Evidence-based certificate</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-lg"><div className="absolute -right-7 -top-7 size-36 rounded-full bg-[#f4b942]/25 blur-3xl" /><div className="glass card-shadow relative overflow-hidden rounded-[2rem] p-5 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[#1d604d]">Your personalized path</p><h2 className="mt-1 text-2xl font-black">AI for Business Growth</h2></div><span className="grid size-14 place-items-center rounded-2xl bg-[#123c31] text-[#d9f99d]"><Target size={24} /></span></div><div className="mt-6 rounded-2xl bg-[#eef3e9] p-5"><p className="eyebrow">Your Day 21 outcome</p><p className="mt-2 font-serif text-xl leading-7">A tested customer-insight workflow, a decision brief and proof of how you checked the output.</p></div><div className="mt-5 grid gap-3">{[[4,"Opportunity map"],[12,"Reliable workflow"],[21,"Capstone & certificate"]].map(([day,label], index) => <div key={String(label)} className="flex items-center gap-3 rounded-xl border border-[#dce2dd] bg-white p-3"><span className={`grid size-7 place-items-center rounded-full text-xs font-black ${index === 0 ? "bg-[#d9f99d] text-[#123c31]" : "bg-[#edf0ed] text-[#5f6f67]"}`}>{index === 0 ? <Check size={15} /> : day}</span><span className="font-bold">{String(label)}</span><span className="ml-auto text-xs text-[#839189]">Day {day}</span></div>)}</div><p className="mt-5 flex items-center gap-2 text-xs text-[#5f6f67]"><MapPin size={14} />Includes relevant Nigerian and pan-African case studies</p></div></div>
      </section>

      <section id="how-it-works" className="bg-[#123c31] py-20 text-white"><div className="container-shell"><p className="eyebrow text-[#d9f99d]">AI is the tool. Your result is the goal.</p><h2 className="display mt-4 max-w-4xl text-5xl sm:text-6xl">One shared foundation. A different practical journey for every learner.</h2><div className="mt-12 grid gap-4 md:grid-cols-3">{[["01","Tell us your outcome","A short diagnostic captures your role, goal, experience, pace and preferred tools."],["02","Learn through your context","Each lesson adds a tailored example, practice brief and case study to the core teaching."],["03","Prove what you can do","Save real artefacts, receive rubric-based feedback and complete a verifiable capstone."]].map(([number,title,copy]) => <article key={number} className="rounded-3xl border border-white/12 bg-white/6 p-7"><span className="font-serif text-5xl text-[#d9f99d]">{number}</span><h3 className="mt-7 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-white/70">{copy}</p></article>)}</div></div></section>

      <section id="outcomes" className="container-shell py-20 sm:py-28"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Choose a destination, not a content library</p><h2 className="display mt-4 text-5xl sm:text-6xl">Your programme adapts to the work you want to do.</h2><p className="mt-5 text-lg leading-8 text-[#5f6f67]">The diagnostic recommends a track. Your underlying goal remains visible in every lesson and milestone.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tracks.map(([Icon,title,copy]) => <article key={title} className="rounded-3xl border border-[#dce2dd] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"><span className="grid size-11 place-items-center rounded-xl bg-[#e6efdf] text-[#123c31]"><Icon size={21} /></span><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5f6f67]">{copy}</p></article>)}</div></section>

      <section className="border-y border-[#dce2dd] bg-white py-20"><div className="container-shell grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Africa as a source of insight</p><h2 className="display mt-4 text-5xl">Real cases. Local constraints. Global lessons.</h2><p className="mt-5 leading-7 text-[#5f6f67]">Learners study documented work in health, language, agriculture and climate resilience—then ask what makes it useful, inclusive and responsible.</p></div><div className="grid gap-4 sm:grid-cols-2">{CASE_STUDIES.slice(0,4).map((item) => <a key={item.slug} href={item.sourceUrl} target="_blank" rel="noreferrer" className="group rounded-3xl border border-[#dce2dd] bg-[#f8f7f1] p-6"><p className="text-xs font-black uppercase tracking-wider text-[#1d604d]">{item.region} · {item.sector}</p><h3 className="mt-3 text-lg font-black group-hover:underline">{item.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f6f67]">{item.summary}</p></a>)}</div></div></section>

      <section id="syllabus" className="container-shell py-20 sm:py-28"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">A curriculum that compounds</p><h2 className="display mt-4 text-5xl sm:text-6xl">Twenty-one applied lessons. One defensible capability.</h2><p className="mt-5 text-lg leading-8 text-[#5f6f67]">Everyone masters the same durable fundamentals. The examples, practice, milestones and capstone are personalized around their outcome.</p></div><Syllabus /></section>

      <section className="bg-[#182f4b] py-16 text-white"><div className="container-shell grid items-center gap-10 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-[#f4c76b]">A certificate with evidence behind it</p><h2 className="display mt-3 text-5xl">More than a completion badge.</h2></div><div className="grid gap-3 sm:grid-cols-3">{[["21","applied lessons"],["1","outcome capstone"],["70+","rubric score"]].map(([value,label]) => <div key={label} className="rounded-2xl bg-white/8 p-5 text-center"><strong className="display block text-5xl text-[#f4c76b]">{value}</strong><span className="text-sm text-white/65">{label}</span></div>)}</div></div></section>

      <section id="pricing" className="container-shell py-20 sm:py-28"><div className="mb-12 text-center"><p className="eyebrow">Simple, local pricing</p><h2 className="display mt-4 text-5xl sm:text-6xl">Build a skill you can show.</h2><p className="mx-auto mt-4 max-w-xl text-[#5f6f67]">One payment for the programme, personalized practice, capstone review and verified certificate.</p></div><PricingToggle /></section>
    </main>
    <footer className="border-t border-[#dce2dd] py-10"><div className="container-shell flex flex-col justify-between gap-4 text-sm text-[#5f6f67] sm:flex-row"><strong className="text-[#17211d]">AI Literacy</strong><p>Practical AI capability, built around human outcomes.</p><p>© {new Date().getFullYear()}</p></div></footer>
  </>;
}
