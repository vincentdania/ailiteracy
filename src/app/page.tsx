import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { AcademyLockup } from "@/components/brand/hyrax-logo";
import { AcademyPhoto, AssistantExample } from "@/components/marketing/academy-images";
import { MarketingNav } from "@/components/marketing/nav";
import { ProofPlaceholder } from "@/components/marketing/proof-placeholder";
import { Button } from "@/components/ui/button";
import { TRACKS, TRACK_PRICE_NGN, type Track } from "@/lib/tracks";

const support = "mailto:" + (process.env.SUPPORT_EMAIL ?? "team@hyrax.ng") + "?subject=" + encodeURIComponent("Done-with-you AI setup");
const heading = "display text-[clamp(1.9rem,3.2vw,3rem)] text-[#10294f]";
const cardOutcomes = {
  "small-business": ["Customer replies you approve", "Lead follow-ups", "Weekly reports from your data", "A daily brief", "Invoice and payment reminders"],
  professionals: ["An organised inbox", "A morning brief", "Meeting actions and follow-ups", "Proposal and client-update drafts", "Approval before anything is sent"],
} as const;
const commonProblems = {
  "small-business": ["The same WhatsApp questions, every day", "Leads that go cold", "Friday reports that take too long"],
  professionals: ["An inbox that takes over the morning", "Follow-ups lost after meetings", "First drafts that eat into client time"],
} as const;

function TrackCard({ track }: { track: Track }) {
  return <article id={track.slug} className="scroll-mt-28 border border-[#e5ded4] border-t-4 border-t-[#c8742b] bg-white p-6 sm:p-8">
    <p className="eyebrow text-[#8b4c1d]">{track.audience}</p>
    <h3 className="mt-4 font-display text-[clamp(1.7rem,2.5vw,2.1rem)] font-semibold leading-[1.15] text-[#10294f]">{track.title}</h3>
    <ul className="mt-6 grid gap-2 border-t border-[#e5ded4] pt-5">{cardOutcomes[track.slug].map((outcome) => <li key={outcome} className="flex gap-3 text-[17px] leading-[1.5] text-[#10294f]"><Check aria-hidden="true" className="mt-1 shrink-0 text-[#c8742b]" size={18} />{outcome}</li>)}</ul>
    <div className="mt-6 border-t border-[#e5ded4] pt-5">
      <strong className="font-display text-4xl font-semibold text-[#10294f]">₦{TRACK_PRICE_NGN.toLocaleString("en-NG")}</strong>
      <span className="ml-3 text-sm font-semibold text-[#394b63]">3 months access</span>
      <Button asChild size="lg" className="mt-5 w-full"><Link href={"/checkout?course=" + track.slug}>Enrol now <ArrowRight className="ml-2" size={18} /></Link></Button>
      <Link href={"/tracks/" + track.slug} className="focus-ring mt-4 block text-center text-sm font-semibold text-[#10294f] underline decoration-[#c8742b] underline-offset-4">View track details</Link>
    </div>
  </article>;
}

const faqs = [
  ["Do I need to code?", "No. Follow the guided lessons and copy-and-paste templates on your phone or laptop."],
  ["What tools and costs are involved?", "Both tracks include guided hosting setup. The business track uses WhatsApp, Gmail, Google Sheets and Telegram; the professional track connects to WhatsApp or Telegram. Tool, hosting and message costs vary and are paid separately to providers."],
  ["Can I take both tracks?", "Yes. Buy each track separately for ₦20,000."],
  ["When does access end?", "Three calendar months after purchase. You can renew when it expires."],
  ["What if I get stuck?", "Contact Support. Guided setup is included, and done-with-you setup is available on request."],
  ["What is the refund policy?", "Email Support within 24 hours of purchase for a 100% refund of the track price. Use the email address you used at checkout."],
  ["Is WhatsApp automation allowed?", "Yes, when you use supported WhatsApp Business methods and follow its rules. Get customer consent, use approved templates when required, and keep a route to a person. The lessons guide you through this."],
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
        <div className="container-shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow text-[#8b4c1d]">Hyrax AI Academy</p>
            <h1 className="display mt-5 max-w-3xl text-[clamp(2.125rem,4vw,3.5rem)] text-[#10294f]">Put AI to work in your business or job.</h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.6] text-[#394b63]">Build useful assistants around your business and the work you already do, with guided setup, lessons, ready-made templates and stay in control. Pick your track</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#small-business" className="focus-ring tap inline-flex items-center justify-center bg-[#10294f] px-6 py-3.5 text-base font-semibold text-white hover:bg-[#1c3a65]">For business owners <ArrowRight className="ml-2" size={18} /></a>
              <a href="#professionals" className="focus-ring tap inline-flex items-center justify-center border border-[#10294f] px-6 py-3.5 text-base font-semibold text-[#10294f] hover:bg-[#f6e7d8]">For professionals <ArrowRight className="ml-2" size={18} /></a>
            </div>
            <p className="mt-6 border-l-2 border-[#c8742b] pl-4 text-sm font-semibold leading-6 text-[#394b63]">No coding. Phone or laptop. Pay once, learn for 3 months.</p>
          </div>
          <AcademyPhoto person="owner" />
        </div>
      </section>

      <section aria-labelledby="tracks-title" className="container-shell py-12 sm:py-20">
        <p className="eyebrow text-[#8b4c1d]">Two practical tracks</p>
        <h2 id="tracks-title" className={heading + " mt-4 max-w-3xl"}>Which sounds like you?</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">{TRACKS.map((track) => <TrackCard key={track.slug} track={track} />)}</div>
      </section>

      <section className="border-y border-[#e5ded4] bg-[#f2ece4] py-12 sm:py-20">
        <div className="container-shell">
          <p className="eyebrow text-[#8b4c1d]">Does this sound familiar?</p>
          <h2 className={heading + " mt-4 max-w-3xl"}>Too much repeat work?</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
            {TRACKS.map((track) => <div key={track.slug} className="border-t-2 border-[#c8742b] pt-5">
              <h3 className="font-display text-2xl font-semibold text-[#10294f]">{track.audience}</h3>
              <ul className="mt-4 grid gap-2">{commonProblems[track.slug].map((problem) => <li key={problem} className="text-[17px] leading-[1.6] text-[#394b63]">{problem}</li>)}</ul>
            </div>)}
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div><p className="eyebrow text-[#8b4c1d]">What you will build</p><h2 className={heading + " mt-4"}>Make it. Use it.</h2></div>
          <div className="grid gap-8">
            {TRACKS.map((track) => <div key={track.slug} className="border-t border-[#c8742b] pt-5">
              <h3 className="font-display text-2xl font-semibold text-[#10294f]">{track.audience}</h3>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">{track.builds.map((item, index) => <li key={item} className="flex gap-3 text-[17px] leading-[1.5] text-[#10294f]"><span className="font-semibold text-[#9e591f]">{String(index + 1).padStart(2, "0")}.</span>{item}</li>)}</ol>
            </div>)}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AssistantExample track="small-business" />
          <AssistantExample track="professionals" />
        </div>
      </section>

      <section className="bg-[#10294f] py-12 text-white sm:py-20">
        <div className="container-shell grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div><p className="eyebrow eyebrow-inverse">Safety and trust</p><h2 className="display mt-4 text-[clamp(1.9rem,3.2vw,3rem)]">You stay in charge.</h2><p className="mt-5 text-[17px] leading-[1.6] text-white/85">Professionals also learn how to protect client confidentiality.</p></div>
          <ul className="divide-y divide-white/25 border-y border-white/25">
            <li className="py-4 text-[17px] leading-[1.6]">Approve every outgoing action.</li>
            <li className="py-4 text-[17px] leading-[1.6]">Nothing is sent without your say-so.</li>
            <li className="py-4 text-[17px] leading-[1.6]">Control what your assistant can access.</li>
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="container-shell scroll-mt-24 py-12 sm:py-20">
        <p className="eyebrow text-[#8b4c1d]">How it works</p>
        <h2 className={heading + " mt-4 max-w-3xl"}>Three steps to launch.</h2>
        <div className="mt-8 border-t border-[#e5ded4]">
          {[
            ["01", "Pick a track", "Choose one or both."],
            ["02", "Build along", "Follow the lessons and use the templates."],
            ["03", "Launch", "Test, approve and put your assistant to work."],
          ].map(([number, title, copy]) => <div key={number} className="grid gap-2 border-b border-[#e5ded4] py-5 sm:grid-cols-[5rem_15rem_1fr] sm:gap-6 sm:py-7"><span className="font-display text-2xl font-semibold text-[#c8742b]">{number}</span><h3 className="font-display text-2xl font-semibold text-[#10294f]">{title}</h3><p className="max-w-2xl text-[17px] leading-[1.6] text-[#394b63]">{copy}</p></div>)}
        </div>
      </section>

      <section className="border-y border-[#e5ded4] bg-white py-12 sm:py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div><p className="eyebrow text-[#8b4c1d]">What is included</p><h2 className={heading + " mt-4"}>Everything to build along.</h2><p className="mt-5 text-[17px] leading-[1.6] text-[#394b63]">Both tracks guide you through hosting. Want help setting it up?</p><a href={support} className="focus-ring mt-5 inline-flex items-center font-semibold text-[#10294f] underline decoration-[#c8742b] underline-offset-4">Request done-with-you setup <ArrowRight className="ml-2" size={17} /></a></div>
          <ul className="grid content-start gap-0 border-t border-[#e5ded4]">{["Copy-and-paste templates", "Step-by-step build-alongs", "Guided hosting and assistant setup", "WhatsApp Business setup for owners", "Certificate of completion", "3 months access per track"].map((item) => <li key={item} className="flex gap-4 border-b border-[#e5ded4] py-3 text-[17px] leading-[1.6] text-[#10294f]"><Check className="mt-1 shrink-0 text-[#c8742b]" size={18} />{item}</li>)}</ul>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div><p className="eyebrow text-[#8b4c1d]">A good fit</p><h2 className={heading + " mt-4"}>For you if...</h2><p className="mt-5 text-[17px] leading-[1.6] text-[#394b63]">You are ready to build along and use assistants in your own work.</p></div>
          <div className="border-t border-[#e5ded4] pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0"><p className="eyebrow text-[#8b4c1d]">Know before you join</p><h2 className={heading + " mt-4"}>Not for you if...</h2><p className="mt-5 text-[17px] leading-[1.6] text-[#394b63]">You want a ready-made assistant or messages sent without your approval.</p></div>
        </div>
        <ProofPlaceholder />
      </section>

      <section className="border-t border-[#e5ded4] bg-white py-12 sm:py-20">
        <div className="container-shell max-w-4xl"><p className="eyebrow text-[#8b4c1d]">FAQ</p><h2 className={heading + " mt-4"}>Quick answers.</h2>
          <div className="mt-8 divide-y divide-[#e5ded4] border-y border-[#e5ded4]">{faqs.map(([question, answer]) => <details key={question} className="group py-4"><summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold text-[#10294f]"><span>{question}</span><span aria-hidden="true" className="text-2xl text-[#c8742b] group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl text-[17px] leading-[1.6] text-[#394b63]">{answer}</p></details>)}</div>
          <p className="mt-5 text-sm leading-6 text-[#394b63]">WhatsApp rules can change. Check the <a href="https://business.whatsapp.com/policy/" target="_blank" rel="noreferrer" className="underline decoration-[#c8742b] underline-offset-4">current WhatsApp Business Messaging Policy</a> before launch.</p>
        </div>
      </section>

      <section className="border-t-4 border-[#c8742b] bg-[#faf7f2] py-12 sm:py-20">
        <div className="container-shell"><p className="eyebrow text-[#8b4c1d]">Ready to begin?</p><h2 className={heading + " mt-4 max-w-3xl"}>Pick your track.</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">{TRACKS.map((track) => <div key={track.slug} className="border-t border-[#10294f] pt-5"><h3 className="font-display text-2xl font-semibold leading-tight text-[#10294f]">{track.audience}</h3><p className="mt-3 text-[17px] leading-[1.5] text-[#394b63]">{track.promise}</p><p className="mt-4 text-base font-semibold text-[#10294f]">₦20,000 · 3 months access</p><Link href={"/checkout?course=" + track.slug} className="focus-ring tap mt-5 inline-flex items-center bg-[#10294f] px-6 py-3 font-semibold text-white hover:bg-[#1c3a65]">Enrol now <ArrowRight className="ml-2" size={17} /></Link></div>)}</div>
          <p className="mt-8 flex items-center gap-2 text-sm text-[#394b63]"><LockKeyhole size={15} />Lessons unlock after payment.</p>
        </div>
      </section>
    </main>
    <footer className="safe-bottom bg-[#10294f] py-10 text-white"><div className="container-shell flex flex-col justify-between gap-6 border-t border-white/25 pt-8 text-sm sm:flex-row sm:items-center"><span className="grid gap-2"><span className="text-xl"><AcademyLockup inverse /></span><span className="text-xs font-semibold uppercase tracking-[.18em] text-white/75">HYRAX · The AI Enablement Company.</span></span><nav aria-label="Footer" className="flex gap-5 text-white/85"><Link href="/login">Sign in</Link><a href={"mailto:" + (process.env.SUPPORT_EMAIL ?? "team@hyrax.ng")}>Support</a></nav></div></footer>
  </>;
}
