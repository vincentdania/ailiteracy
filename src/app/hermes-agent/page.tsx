import Link from "next/link";
import type { Metadata } from "next";
import { Check, Play, Terminal, Wallet, ShieldCheck } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { createCheckoutAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Build Your Personal AI Agent and Make AI Work for You",
  description:
    "A hands-on course for installing, configuring and securing the open-source Hermes Agent, connecting Telegram, scheduling useful work and completing a 48-hour reliability test.",
};

const MODULES: { title: string; lessons: string }[] = [
  { title: "Foundations", lessons: "What an agent is · Why Hermes · System architecture" },
  { title: "Install & Run", lessons: "Install on a supported system · Connect a model · Run 24/7 on a VPS" },
  { title: "The Agent's Brain", lessons: "Tools & toolsets · Skills & the Curator · Memory & sessions" },
  { title: "Connect & Automate", lessons: "Telegram & WhatsApp · Email · Cron, delegation & batch" },
  { title: "Build It Yourself", lessons: "First 7 days · Connected wall · Security · Capstone" },
  { title: "Advanced & Extend", lessons: "Voice & local models · Plugins & MCP · Cheat sheet" },
];

const FEATURES: { icon: typeof Check; title: string; copy: string }[] = [
  { icon: Terminal, title: "No programming required", copy: "You will still use a terminal. The course explains each command and what success looks like." },
  { icon: Wallet, title: "Text-first lessons", copy: "Reading is light on data. Installation, model use and browser tools can use more." },
  { icon: ShieldCheck, title: "You stay in control", copy: "Security-first: approvals, secrets hygiene and checkpoints." },
  { icon: Play, title: "A tested working setup", copy: "The capstone requires a 48-hour run, a Telegram check and one scheduled job." },
];

export default function HermesCourseLanding() {
  return (
    <div className="min-h-screen bg-[#f8f7f1] text-[#00261d]">
      <MarketingNav />

      <main className="container-shell">
        <section className="py-14 sm:py-20">
          <p className="eyebrow">Course · 6 modules · 19 lessons · Includes a running agent</p>
          <h1 className="display mt-4 max-w-3xl text-5xl text-[#00261d] sm:text-6xl">
            Build Your Personal AI Agent <span className="text-[#1d604d]">and Make AI Work for You</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#414845]">
            Build a Hermes Agent you can use for real work. You will install it, connect a model,
            restrict its access, reach it on Telegram, schedule one useful task and test it for 48 hours.
            Email and WhatsApp are covered with their limits and risks made clear.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <form action={createCheckoutAction}>
              <input type="hidden" name="currency" value="NGN" />
              <input type="hidden" name="course" value="hermes-agent-masterclass" />
              <Button size="lg">Enroll — ₦20,000</Button>
            </form>
            <Link href="/challenge/hermes-01" className="font-semibold text-[#1d604d] underline underline-offset-4">
              Try Lesson 1 free →
            </Link>
          </div>
          <p className="mt-3 text-sm text-[#717975]">Pay in Naira (Paystack) or $29 in any currency (Stripe). 19 lessons, quizzes and labs included.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#dfe4e1] bg-white p-6 card-shadow">
              <span className="grid size-11 place-items-center rounded-xl bg-[#e6efdf] text-[#123c31]"><f.icon size={20} /></span>
              <h3 className="mt-4 font-serif text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f6f67]">{f.copy}</p>
            </div>
          ))}
        </section>

        <section id="curriculum" className="py-14">
          <p className="eyebrow">Curriculum</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold">Six modules from zero to a running agent</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {MODULES.map((m, i) => (
              <div key={m.title} className="editorial-card flex items-start gap-4 p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#c6cfe9] bg-[#e2e7ff] text-sm font-bold text-[#414845]">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-xl font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5f6f67]">{m.lessons}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="rounded-3xl bg-[#123c31] p-8 text-white card-shadow sm:p-10">
          <p className="eyebrow eyebrow-inverse">What you get</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {["19 practical lessons with tested command examples", "Per-lesson quizzes and a scored capstone", "A personal agent tested for 48 hours", "One-page operating note and security checklist", "Text-first lessons that work well on mobile", "Nigerian and global payment options"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/90"><Check size={18} className="shrink-0 text-[#d9f99d]" /><span className="text-sm leading-6">{item}</span></li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <form action={createCheckoutAction}>
              <input type="hidden" name="currency" value="NGN" />
              <input type="hidden" name="course" value="hermes-agent-masterclass" />
              <Button size="lg" className="bg-[#d9f99d] text-[#123c31] hover:bg-white">Pay ₦20,000</Button>
            </form>
            <form action={createCheckoutAction}>
              <input type="hidden" name="currency" value="USD" />
              <input type="hidden" name="course" value="hermes-agent-masterclass" />
              <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10">Pay $29</Button>
            </form>
          </div>
          <p className="mt-4 text-sm text-white/70">Already enrolled? <Link href="/challenge?course=hermes-agent-masterclass" className="font-semibold text-[#d9f99d] underline">Open your curriculum →</Link></p>
        </section>
      </main>
    </div>
  );
}
