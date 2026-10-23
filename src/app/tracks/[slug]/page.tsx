import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { AssistantExample } from "@/components/marketing/academy-images";
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
    alternates: { canonical: "/tracks/" + track.slug },
    openGraph: { title: track.title, description: track.subline, url: "/tracks/" + track.slug, type: "website" },
    twitter: { card: "summary_large_image", title: track.title, description: track.subline },
  };
}

export default async function TrackPage({ params }: Props) {
  const track = getTrack((await params).slug);
  if (!track) notFound();
  const support = "mailto:" + (process.env.SUPPORT_EMAIL ?? "team@hyrax.ng") + "?subject=" + encodeURIComponent("Done-with-you AI setup");
  const checkout = "/checkout?course=" + track.slug;
  const heading = "display text-[clamp(1.9rem,3.2vw,3rem)] text-[#10294f]";

  return <><MarketingNav /><main>
    <section className="border-b border-[#e5ded4] bg-[#faf7f2] py-14 sm:py-24">
      <div className="container-shell grid gap-12 lg:grid-cols-[1.15fr_.65fr] lg:items-end lg:gap-20">
        <div><Link href="/" className="focus-ring text-sm font-semibold text-[#10294f] underline decoration-[#c8742b] underline-offset-4">All tracks</Link><p className="eyebrow mt-8 text-[#8b4c1d]">{track.audience}</p><h1 className="display mt-4 max-w-4xl text-[clamp(2.125rem,4vw,3.5rem)] text-[#10294f]">{track.title}</h1><p className="mt-7 max-w-3xl text-base leading-[1.6] text-[#394b63]">{track.subline}</p></div>
        <div className="border-t-2 border-[#c8742b] bg-white p-6 sm:p-8"><p className="text-sm font-semibold text-[#394b63]">One track · 3 months access</p><strong className="mt-3 block font-display text-4xl font-semibold text-[#10294f]">₦20,000</strong><Link href={checkout} className="focus-ring tap mt-6 inline-flex w-full items-center justify-center bg-[#10294f] px-6 py-3.5 font-semibold text-white hover:bg-[#1c3a65]">Enrol now <ArrowRight className="ml-2" size={18} /></Link><p className="mt-5 text-sm leading-6 text-[#394b63]">Lessons unlock after a verified Paystack payment. Tool and message costs are separate.</p></div>
      </div>
    </section>

    <section className="container-shell py-16 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div><p className="eyebrow text-[#8b4c1d]">Does this sound familiar?</p><h2 className={heading + " mt-4"}>Your time is caught in repeat work.</h2><ul className="mt-8 divide-y divide-[#e5ded4] border-t border-[#e5ded4]">{track.problems.map((problem) => <li key={problem} className="py-4 text-base leading-[1.6] text-[#394b63]">{problem}</li>)}</ul></div>
        <div><p className="eyebrow text-[#8b4c1d]">What you will build</p><h2 className={heading + " mt-4"}>Assistants you can use in your own setting.</h2><ul className="mt-8 grid gap-4">{track.builds.map((item) => <li key={item} className="flex gap-3 text-base leading-[1.6] text-[#10294f]"><Check className="mt-1 shrink-0 text-[#c8742b]" size={18} />{item}</li>)}</ul></div>
      </div>
      <AssistantExample track={track.slug === "small-business" ? "small-business" : "professionals"} className="mt-14" />
    </section>

    <section className="border-y border-[#e5ded4] bg-[#f2ece4] py-16 sm:py-24">
      <div className="container-shell"><p className="eyebrow text-[#8b4c1d]">Curriculum</p><h2 className={heading + " mt-4"}>Build it step by step.</h2><p className="mt-5 max-w-3xl text-base leading-[1.6] text-[#394b63]">Start with how assistants work and how to approve their actions. Then build each assistant around your real tasks and finish with a launch capstone.</p>
        <ol className="mt-10 grid gap-x-12 md:grid-cols-2">{track.modules.map((module) => <li key={module.title} className="border-t border-[#c8742b] py-6"><h3 className="font-display text-2xl font-semibold text-[#10294f]">{module.title}</h3><ul className="mt-4 grid gap-2 text-base leading-[1.6] text-[#394b63]">{module.lessons.map((lesson) => <li key={lesson.slug}>• {lesson.slug === "n8n-setup" || lesson.slug === "hermes-setup" ? "Guided hosting and setup" : lesson.title}</li>)}</ul></li>)}</ol>
      </div>
    </section>

    <section className="bg-[#10294f] py-16 text-white sm:py-24"><div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><p className="eyebrow eyebrow-inverse">Your rules, your approval</p><h2 className="display mt-4 text-[clamp(1.9rem,3.2vw,3rem)]">Keep a person in control.</h2></div><div><p className="text-base leading-[1.6] text-white/90">Every assistant includes a human approval step. Nothing is sent without your say-so, and you decide what information it can access. {track.slug === "professionals" ? "The track includes dedicated guidance on client confidentiality and access limits." : "The guided WhatsApp Business setup covers customer consent and supported messaging methods."}</p><p className="mt-6 text-base leading-[1.6] text-white/90">Hosting setup is guided in the lessons. A <a href={support} className="focus-ring font-semibold underline decoration-[#c8742b] underline-offset-4">done-with-you setup</a> is available on request.</p></div></div></section>

    <section className="bg-white py-16 sm:py-24"><div className="container-shell max-w-4xl"><p className="eyebrow text-[#8b4c1d]">FAQ</p><h2 className={heading + " mt-4"}>Before you enrol</h2><div className="mt-8 divide-y divide-[#e5ded4] border-y border-[#e5ded4]">{[
      ["Do I need to code?", "No. The build-alongs use guided setup and copy-and-paste templates."],
      ["Do I need my own tools or hosting?", "Yes. The lessons include a guided hosting step for your assistant. Tool, hosting and message costs vary and are paid separately to providers."],
      ["Can I take both tracks?", "Yes. Each track is purchased separately for ₦20,000."],
      ["When does access end?", "Three calendar months after your purchase date. You can renew after it expires."],
      ["What if I need setup help?", "Contact Support for help or request a done-with-you setup."],
      ["What is the refund policy?", "TODO: Hyrax must publish its refund policy before launch."],
    ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="focus-ring flex cursor-pointer list-none justify-between gap-4 font-display text-xl font-semibold text-[#10294f]">{question}<span aria-hidden="true" className="text-2xl text-[#c8742b] group-open:rotate-45">+</span></summary><p className="mt-4 text-base leading-[1.6] text-[#394b63]">{answer}</p></details>)}</div></div></section>

    <section className="border-t-4 border-[#c8742b] bg-[#faf7f2] py-16 sm:py-24"><div className="container-shell"><p className="eyebrow text-[#8b4c1d]">Your next step</p><h2 className={heading + " mt-4 max-w-3xl"}>Start building your {track.slug === "small-business" ? "AI team" : "professional assistant"}.</h2><p className="mt-6 text-base font-semibold text-[#10294f]">₦20,000 · 3 months access</p><Link href={checkout} className="focus-ring tap mt-7 inline-flex items-center bg-[#10294f] px-7 py-3.5 font-semibold text-white hover:bg-[#1c3a65]">Enrol now <ArrowRight className="ml-2" size={18} /></Link></div></section>
  </main><footer className="safe-bottom bg-[#10294f] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-5 border-t border-white/25 pt-8 text-sm sm:flex-row sm:items-center"><AcademyLockup inverse /><nav aria-label="Footer" className="flex gap-5 text-white/85"><Link href="/login">Sign in</Link><a href={"mailto:" + (process.env.SUPPORT_EMAIL ?? "team@hyrax.ng")}>Support</a></nav></div></footer></>;
}
