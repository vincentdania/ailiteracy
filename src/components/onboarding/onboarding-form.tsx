"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Sparkles, Target } from "lucide-react";
import { saveOnboardingAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";

const levelOptions = [
  { value: "BEGINNER", label: "Beginner", copy: "I am starting from first principles." },
  { value: "EXPLORER", label: "Explorer", copy: "I have tried a few AI tools." },
  { value: "PRACTITIONER", label: "Practitioner", copy: "I use AI and want a reliable system." },
] as const;

const tools = ["ChatGPT", "DeepSeek", "Gemini", "Claude", "Canva", "Microsoft Copilot"];
const stepTitles = ["Tell us about your professional world.", "What outcome matters most to you?", "Set a pace that works in real life.", "How do you learn best?"];

export function OnboardingForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [profession, setProfession] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [weeklyMinutes, setWeeklyMinutes] = useState("140");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return <form action={saveOnboardingAction} className="grid gap-8">
    <div>
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-[#e2e8f0]" aria-label={`Step ${step} of 4`}><div className="h-full rounded-full bg-[#ceee93] transition-all" style={{ width: `${step * 25}%` }} /></div>
      <p className="eyebrow">Step {step} of 4</p>
      <h1 className="display mt-4 max-w-2xl text-5xl text-[#00261d] sm:text-6xl">{stepTitles[step - 1]}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-[#414845]">Your answers shape the examples, practice briefs, African case studies and capstone—not the quality standard.</p>
    </div>

    <section className={step === 1 ? "grid gap-5" : "hidden"}>
      <label className="grid gap-2 text-sm font-bold">What is your current profession?<input required={step === 1} name="profession" value={profession} onChange={(event) => setProfession(event.target.value)} className="h-14 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal" placeholder="e.g. Operations manager" autoFocus /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">Industry <span className="font-normal text-[#717975]">(optional)</span><input name="industry" className="h-14 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal" placeholder="Professional services" /></label>
        <label className="grid gap-2 text-sm font-bold">Country or region<input required name="country" defaultValue="Nigeria" className="h-14 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal" /></label>
      </div>
      <div className="mt-3 flex justify-end"><Button type="button" size="lg" disabled={profession.trim().length < 2} onClick={() => setStep(2)}>Continue <ArrowRight className="ml-2" size={18} /></Button></div>
    </section>

    <section className={step === 2 ? "grid gap-5" : "hidden"}>
      <div className="flex items-start gap-3 rounded-2xl border border-[#d6e3dc] bg-[#eef5e9] p-4"><Target className="mt-1 shrink-0 text-[#123c31]" size={20} /><p className="text-sm leading-6 text-[#414845]">A strong answer names a task, audience or measurable change. Do not include confidential information.</p></div>
      <label className="grid gap-2 text-sm font-bold">What should AI help you achieve?<textarea required={step === 2} name="primaryGoal" value={goal} onChange={(event) => setGoal(event.target.value)} rows={6} className="rounded-2xl border border-[#c0c8c4] bg-white p-4 font-normal" placeholder="I want to turn weekly customer feedback into a clear product decision brief in under one hour." autoFocus /></label>
      <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]"><Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}><ArrowLeft className="mr-2" size={18} />Back</Button><Button type="button" size="lg" disabled={goal.trim().length < 12} onClick={() => setStep(3)}>Continue <ArrowRight className="ml-2" size={18} /></Button></div>
    </section>

    <section className={step === 3 ? "grid gap-5" : "hidden"}>
      <fieldset className="grid gap-3"><legend className="mb-2 text-sm font-bold">How experienced are you with AI tools?</legend>{levelOptions.map((option) => <label key={option.value} className={`flex cursor-pointer gap-3 rounded-2xl border bg-white p-4 ${level === option.value ? "border-[#00261d] ring-1 ring-[#00261d]" : "border-[#e2e8f0]"}`}><input type="radio" name="skillLevel" value={option.value} checked={level === option.value} onChange={() => setLevel(option.value)} className="mt-1 accent-[#00261d]" /><span><strong className="block">{option.label}</strong><span className="text-sm text-[#414845]">{option.copy}</span></span></label>)}</fieldset>
      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Clock3 size={16} />Time available each week</span><select name="weeklyMinutes" value={weeklyMinutes} onChange={(event) => setWeeklyMinutes(event.target.value)} className="h-14 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal"><option value="70">About 10 minutes a day</option><option value="140">About 20 minutes a day</option><option value="210">About 30 minutes a day</option><option value="420">About 1 hour a day</option></select></label>
      <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]"><Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)}><ArrowLeft className="mr-2" size={18} />Back</Button><Button type="button" size="lg" onClick={() => setStep(4)}>Continue <ArrowRight className="ml-2" size={18} /></Button></div>
    </section>

    <section className={step === 4 ? "grid gap-5" : "hidden"}>
      <div className="flex items-start gap-3 rounded-2xl bg-[#00261d] p-5 text-white"><Sparkles className="mt-1 shrink-0 text-[#ceee93]" size={20} /><p className="text-sm leading-6 text-white/75">We will create your track, three milestones, tailored daily practice and relevant African case studies.</p></div>
      <label className="grid gap-2 text-sm font-bold">Preferred lesson style<select name="learningFormat" defaultValue="PRACTICAL" className="h-14 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal"><option value="PRACTICAL">Hands-on first</option><option value="VISUAL">Visual examples</option><option value="READING">Detailed reading</option><option value="MIXED">A balanced mix</option></select></label>
      <fieldset><legend className="mb-3 text-sm font-bold">Tools you already use <span className="font-normal text-[#717975]">(optional)</span></legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{tools.map((tool) => <label key={tool} className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white p-3 text-sm"><input type="checkbox" name="preferredTools" value={tool} className="accent-[#00261d]" />{tool}</label>)}</div></fieldset>
      <input type="hidden" name="timezone" value={timezone} />
      <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]"><Button type="button" variant="secondary" size="lg" onClick={() => setStep(3)}><ArrowLeft className="mr-2" size={18} />Back</Button><Button size="lg"><Check className="mr-2" size={18} />Build my learning plan</Button></div>
    </section>
  </form>;
}
