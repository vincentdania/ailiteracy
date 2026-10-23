import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { ImageSlot } from "@/components/marketing/image-slot";
import { MarketingNav } from "@/components/marketing/nav";
import { ProofPlaceholder } from "@/components/marketing/proof-placeholder";
import { Button } from "@/components/ui/button";
import { TRACKS, TRACK_PRICE_NGN, type Track } from "@/lib/tracks";

const support = "mailto:" + (process.env.SUPPORT_EMAIL ?? "team@hyrax.ng") + "?subject=" + encodeURIComponent("Done-with-you AI setup");
const heading = "display text-[clamp(1.9rem,3.2vw,3rem)] text-[#10294f]";

function TrackCard({ track }: { track: Track }) {
  return <article id={track.slug} className="scroll-mt-28 border border-[#e5ded4] bg-white p-6 sm:p-9">
    <p className="eyebrow text-[#8b4c1d]">{track.audience}</p>
    <h3 className="mt-5 font-display text-[clamp(1.7rem,2.5vw,2.1rem)] font-semibold leading-[1.15] text-[#10294f]">{track.title}</h3>
    <p className="mt-5 text-base leading-[1.6] text-[#394b63]">{track.subline}</p>
    <ul className="mt-7 grid gap-3 border-t border-[#e5ded4] pt-6">{track.outcomes.map((outcome) => <li key={outcome} className="flex gap-3 text-base leading-[1.6] text-[#10294f]"><Check aria-hidden="true" className="mt-1 shrink-0 text-[#c8742b]" size={18} />{outcome}</li>)}</ul>
    <div className="mt-8 border-t border-[#e5ded4] pt-6">
      <strong className="font-display text-4xl font-semibold text-[#10294f]">₦{TRACK_PRICE_NGN.toLocaleString("en-NG")}</strong>
      <span className="ml-3 text-sm font-semibold text-[#394b63]">3 months access</span>
      <Button asChild size="lg" className="mt-6 w-full"><Link href={"/checkout?course=" + track.slug}>Enrol now <ArrowRight className="ml-2" size={18} /></Link></Button>
      <Link href={"/tracks/" + track.slug} className="focus-ring mt-5 block text-center text-sm font-semibold text-[#10294f] underline decoration-[#c8742b] underline-offset-4">See the full track</Link>
    </div>
  </article>;
}

const faqs = [
  ["Do I need to know how to code?", "No. The lessons use guided, no-code setup and copy-and-paste templates. You follow the build along on a phone or laptop."],
  ["Which tools will I use, and what do they cost?", "The business track connects your assistant to WhatsApp, Gmail, Google Sheets and Telegram. The professionals track lets you chat with your assistant on WhatsApp or Telegram. Both include a guided hosting step. Tool, hosting and message costs vary and are paid separately to providers."],
  ["Can I take both tracks?", "Yes. Each track is a separate ₦20,000 purchase. Both will appear in your dashboard if you buy both."],
  ["How does three-month access work?", "Access starts when your payment is confirmed and ends three calendar months after the purchase date. You can renew a track after access ends."],
  ["What if I get stuck?", "Use the Support link below. Guided setup lessons are included, and a done-with-you setup is available on request."],
  ["What is the refund policy?", "TODO: Hyrax must publish its refund policy before launch. Contact Support with any payment concern."],
  ["Is WhatsApp automation allowed?", "Yes, when you use supported WhatsApp Business methods and follow its messaging rules. Get the right customer consent, use approved templates when required, and keep a clear route to a person. The guided setup covers these checks."],
] as const;

export default function HomePage() {
  const schemas = TRACKS.map((track) => ({
    "@context": "https://schema.org", "@type": "Course", name: track.title, description: track.subline,
    provider: { "@type": "Organization", name: "Hyrax AI Academy" },
    offers: { "@type": "Offer", price: String(TRACK_PRICE_NGN), priceCurrency: "NGN", url: "https://learn.hyrax.ng/tracks/" + track.slug },
  }));

  return <>
    <Script id="track-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
    <MarketingNav />
    <main>
      <section className="border-b border-[#e5ded4] bg-[#faf7f2]">
        <div className="container-shell grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p className="eyebrow text-[#8b4c1d]">Hyrax AI Academy</p>
            <h1 className="display mt-5 max-w-3xl text-[clamp(2.125rem,4vw,3.5rem)] text-[#10294f]">Pick your track. Put AI to work in your business or practice.</h1>
            <p className="mt-7 max-w-2xl text-base leading-[1.6] text-[#394b63]">Build useful assistants around the work you already do, with guided setup, practical templates and your approval at every step.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#small-business" className="focus-ring tap inline-flex items-center justify-center bg-[#10294f] px-6 py-3.5 text-base font-semibold text-white hover:bg-[#1c3a65]">For business owners <ArrowRight className="ml-2" size={18} /></a>
              <a href="#professionals" className="focus-ring tap inline-flex items-center justify-center border border-[#10294f] px-6 py-3.5 text-base font-semibold text-[#10294f] hover:bg-[#f6e7d8]">For professionals <ArrowRight className="ml-2" size={18} /></a>
            </div>
            <p className="mt-7 border-l-2 border-[#c8742b] pl-4 text-sm font-semibold leading-6 text-[#394b63]">No coding. Phone or laptop. Pay once, learn for 3 months.</p>
          </div>
          <ImageSlot kind="photo" brief="Replace with an authentic Academy photo of a Nigerian owner or professional working in their own space." className="min-h-[21rem] lg:min-h-[31rem]" />
        </div>
      </section>

      <section aria-labelledby="tracks-title" className="container-shell py-16 sm:py-24">
        <p className="eyebrow text-[#8b4c1d]">Two practical tracks</p>
        <h2 id="tracks-title" className={heading + " mt-4 max-w-3xl"}>Choose the work you want help with.</h2>
        <p className="mt-5 max-w-2xl text-base leading-[1.6] text-[#394b63]">Start with one track or take both. Each purchase covers that track for three months.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">{TRACKS.map((track) => <TrackCard key={track.slug} track={track} />)}</div>
      </section>

      <section className="border-y border-[#e5ded4] bg-[#f2ece4] py-16 sm:py-24">
        <div className="container-shell">
          <p className="eyebrow text-[#8b4c1d]">Does this sound familiar?</p>
          <h2 className={heading + " mt-4 max-w-3xl"}>The work keeps coming. Your day does not get longer.</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            {TRACKS.map((track) => <div key={track.slug} className="border-t-2 border-[#c8742b] pt-5">
              <h3 className="font-display text-2xl font-semibold text-[#10294f]">{track.audience}</h3>
              <ul className="mt-5 grid gap-4">{track.problems.map((problem) => <li key={problem} className="text-base leading-[1.6] text-[#394b63]">{problem}</li>)}</ul>
            </div>)}
          </div>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div><p className="eyebrow text-[#8b4c1d]">What you will build</p><h2 className={heading + " mt-4"}>Working assistants for real tasks.</h2><p className="mt-5 text-base leading-[1.6] text-[#394b63]">Build each one alongside the lessons. Keep control of what it sees and approve what it sends.</p></div>
          <div className="grid gap-10">
            {TRACKS.map((track) => <div key={track.slug} className="border-t border-[#c8742b] pt-5">
              <h3 className="font-display text-2xl font-semibold text-[#10294f]">{track.audience}</h3>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">{track.builds.map((item, index) => <li key={item} className="flex gap-3 text-base leading-[1.6] text-[#10294f]"><span className="font-semibold text-[#9e591f]">{String(index + 1).padStart(2, "0")}.</span>{item}</li>)}</ol>
            </div>)}
          </div>
        </div>
        <ImageSlot kind="screenshot" brief="Replace with a real, permission-safe capture of an assistant briefing, reply approval, or report. Hide client and customer details." className="mt-12 min-h-[17rem] sm:min-h-[22rem]" />
      </section>

      <section className="bg-[#10294f] py-16 text-white sm:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div><p className="eyebrow eyebrow-inverse">Safety and trust</p><h2 className="display mt-4 text-[clamp(1.9rem,3.2vw,3rem)]">Your assistant works with you in charge.</h2><p className="mt-6 text-base leading-[1.6] text-white/85">Professionals also learn how to protect client confidentiality and limit access to sensitive information.</p></div>
          <ul className="divide-y divide-white/25 border-y border-white/25">
            <li className="py-5 text-base leading-[1.6]">Every assistant includes a human approval step.</li>
            <li className="py-5 text-base leading-[1.6]">Nothing is sent without your say-so.</li>
            <li className="py-5 text-base leading-[1.6]">You decide what your assistant can access.</li>
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="container-shell scroll-mt-24 py-16 sm:py-24">
        <p className="eyebrow text-[#8b4c1d]">How it works</p>
        <h2 className={heading + " mt-4 max-w-3xl"}>From first lesson to your first assistant.</h2>
        <div className="mt-10 border-t border-[#e5ded4]">
          {[
            ["01", "Pick your track", "Choose the business or professional path. Buy one or both."],
            ["02", "Build along", "Follow guided lessons and copy-and-paste templates, including the hosting setup."],
            ["03", "Launch your assistant", "Test each assistant, approve its actions and put it to work in your own setting."],
          ].map(([number, title, copy]) => <div key={number} className="grid gap-3 border-b border-[#e5ded4] py-6 sm:grid-cols-[5rem_15rem_1fr] sm:gap-6 sm:py-8"><span className="font-display text-2xl font-semibold text-[#c8742b]">{number}</span><h3 className="font-display text-2xl font-semibold text-[#10294f]">{title}</h3><p className="max-w-2xl text-base leading-[1.6] text-[#394b63]">{copy}</p></div>)}
        </div>
      </section>

      <section className="border-y border-[#e5ded4] bg-white py-16 sm:py-24">
        <div className="container-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div><p className="eyebrow text-[#8b4c1d]">What is included</p><h2 className={heading + " mt-4"}>The guidance to build it yourself.</h2><p className="mt-6 text-base leading-[1.6] text-[#394b63]">Both tracks include a guided hosting step. If you would rather set it up together, a done-with-you setup is available on request.</p><a href={support} className="focus-ring mt-6 inline-flex items-center font-semibold text-[#10294f] underline decoration-[#c8742b] underline-offset-4">Request done-with-you setup <ArrowRight className="ml-2" size={17} /></a></div>
          <ul className="grid content-start gap-0 border-t border-[#e5ded4]">{["Copy-and-paste templates", "Step-by-step build-alongs", "Guided hosting and assistant setup", "Guided WhatsApp Business setup for owners", "Certificate of completion", "3 months access per track"].map((item) => <li key={item} className="flex gap-4 border-b border-[#e5ded4] py-4 text-base leading-[1.6] text-[#10294f]"><Check className="mt-1 shrink-0 text-[#c8742b]" size={18} />{item}</li>)}</ul>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div><p className="eyebrow text-[#8b4c1d]">A good fit</p><h2 className={heading + " mt-4"}>Who it is for</h2><p className="mt-5 text-base leading-[1.6] text-[#394b63]">Owners and professionals ready to work through guided setup, try each assistant in their own setting and decide what it may do.</p></div>
          <div className="border-t border-[#e5ded4] pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0"><p className="eyebrow text-[#8b4c1d]">Know before you join</p><h2 className={heading + " mt-4"}>Who it is not for</h2><p className="mt-5 text-base leading-[1.6] text-[#394b63]">Anyone expecting a ready-made assistant without setup, or wanting messages to go out without reviewing and approving them.</p></div>
        </div>
        <ProofPlaceholder />
      </section>

      <section className="border-t border-[#e5ded4] bg-white py-16 sm:py-24">
        <div className="container-shell max-w-4xl"><p className="eyebrow text-[#8b4c1d]">FAQ</p><h2 className={heading + " mt-4"}>Good questions before you begin.</h2>
          <div className="mt-8 divide-y divide-[#e5ded4] border-y border-[#e5ded4]">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold text-[#10294f]"><span>{question}</span><span aria-hidden="true" className="text-2xl text-[#c8742b] group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl text-base leading-[1.6] text-[#394b63]">{answer}</p></details>)}</div>
          <p className="mt-5 text-sm leading-6 text-[#394b63]">WhatsApp rules can change. Check the <a href="https://business.whatsapp.com/policy/" target="_blank" rel="noreferrer" className="underline decoration-[#c8742b] underline-offset-4">current WhatsApp Business Messaging Policy</a> before launch.</p>
        </div>
      </section>

      <section className="border-t-4 border-[#c8742b] bg-[#faf7f2] py-16 sm:py-24">
        <div className="container-shell"><p className="eyebrow text-[#8b4c1d]">Ready to begin?</p><h2 className={heading + " mt-4 max-w-3xl"}>Choose the work you want your assistant to handle.</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">{TRACKS.map((track) => <div key={track.slug} className="border-t border-[#10294f] pt-6"><p className="text-sm font-semibold text-[#8b4c1d]">{track.audience}</p><h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-[#10294f]">{track.title}</h3><p className="mt-5 text-base font-semibold text-[#10294f]">₦20,000 · 3 months access</p><Link href={"/checkout?course=" + track.slug} className="focus-ring tap mt-6 inline-flex items-center bg-[#10294f] px-6 py-3 font-semibold text-white hover:bg-[#1c3a65]">Enrol now <ArrowRight className="ml-2" size={17} /></Link></div>)}</div>
          <p className="mt-10 flex items-center gap-2 text-sm text-[#394b63]"><LockKeyhole size={15} />Lessons open after your payment is confirmed.</p>
        </div>
      </section>
    </main>
    <footer className="safe-bottom bg-[#10294f] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-6 border-t border-white/25 pt-8 text-sm sm:flex-row sm:items-center"><span className="grid gap-2"><span className="text-xl"><AcademyLockup inverse /></span><span className="text-xs font-semibold uppercase tracking-[.18em] text-white/75">HYRAX · The AI Enablement Company.</span></span><nav aria-label="Footer" className="flex gap-5 text-white/85"><Link href="/login">Sign in</Link><a href={"mailto:" + (process.env.SUPPORT_EMAIL ?? "team@hyrax.ng")}>Support</a></nav></div></footer>
  </>;
}
