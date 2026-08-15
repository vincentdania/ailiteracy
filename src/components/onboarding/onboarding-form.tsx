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

export function OnboardingForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [profession, setProfession] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [weeklyMinutes, setWeeklyMinutes] = useState("140");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return <form action={saveOnboardingAction} className="mt-8 grid gap-6">
    <div aria-label={`Step ${step} of 4`} className="grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((item) => <span key={item} className={`h-1.5 rounded-full ${item <= step ? "bg-[#123c31]" : "bg-[#dce2dd]"}`} />)}</div>

    <section className={step === 1 ? "grid gap-5" : "hidden"}>
      <div><p className="text-lg font-black">First, tell us where you are applying AI.</p><p className="mt-1 text-sm text-[#5f6f67]">We use this to choose realistic scenarios—not to make assumptions about you.</p></div>
      <label className="grid gap-2 text-sm font-bold">What is your current profession?<input required={step === 1} name="profession" value={profession} onChange={(event) => setProfession(event.target.value)} className="focus-ring h-12 rounded-xl border border-[#cad4ce] px-4 font-normal" placeholder="Operations manager" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">Industry <span className="font-normal text-[#839189]">(optional)</span><input name="industry" className="focus-ring h-12 rounded-xl border border-[#cad4ce] px-4 font-normal" placeholder="Professional services" /></label>
        <label className="grid gap-2 text-sm font-bold">Country or region<input required name="country" defaultValue="Nigeria" className="focus-ring h-12 rounded-xl border border-[#cad4ce] px-4 font-normal" /></label>
      </div>
      <Button type="button" size="lg" disabled={profession.trim().length < 2} onClick={() => setStep(2)}>Continue <ArrowRight className="ml-2" size={18} /></Button>
    </section>

    <section className={step === 2 ? "grid gap-5" : "hidden"}>
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6efdf]"><Target size={19} /></span><div><p className="text-lg font-black">Define the outcome that matters.</p><p className="mt-1 text-sm text-[#5f6f67]">Specific outcomes produce better projects and feedback.</p></div></div>
      <label className="grid gap-2 text-sm font-bold">What should AI help you achieve?<textarea required={step === 2} name="primaryGoal" value={goal} onChange={(event) => setGoal(event.target.value)} rows={5} className="focus-ring rounded-xl border border-[#cad4ce] p-4 font-normal" placeholder="I want to turn weekly customer feedback into a clear product decision brief in under one hour." /></label>
      <p className="text-xs text-[#839189]">A strong answer names a task, audience or measurable change. Avoid sharing confidential information.</p>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr]"><Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}><ArrowLeft className="mr-2" size={18} />Back</Button><Button type="button" size="lg" disabled={goal.trim().length < 12} onClick={() => setStep(3)}>Continue <ArrowRight className="ml-2" size={18} /></Button></div>
    </section>

    <section className={step === 3 ? "grid gap-5" : "hidden"}>
      <div><p className="text-lg font-black">Set the right pace and starting point.</p><p className="mt-1 text-sm text-[#5f6f67]">The standard stays high; the explanations and practice load adapt.</p></div>
      <fieldset className="grid gap-3"><legend className="mb-2 text-sm font-bold">How experienced are you with AI tools?</legend>{levelOptions.map((option) => <label key={option.value} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${level === option.value ? "border-[#1d604d] bg-[#eef5e9]" : "border-[#dce2dd]"}`}><input type="radio" name="skillLevel" value={option.value} checked={level === option.value} onChange={() => setLevel(option.value)} className="mt-1" /><span><strong className="block">{option.label}</strong><span className="text-sm text-[#5f6f67]">{option.copy}</span></span></label>)}</fieldset>
      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Clock3 size={16} />Time available each week</span><select name="weeklyMinutes" value={weeklyMinutes} onChange={(event) => setWeeklyMinutes(event.target.value)} className="focus-ring h-12 rounded-xl border border-[#cad4ce] bg-white px-4 font-normal"><option value="70">About 10 minutes a day</option><option value="140">About 20 minutes a day</option><option value="210">About 30 minutes a day</option><option value="420">About 1 hour a day</option></select></label>
      <div className="grid gap-3 sm:grid-cols-[auto_1fr]"><Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)}><ArrowLeft className="mr-2" size={18} />Back</Button><Button type="button" size="lg" onClick={() => setStep(4)}>Continue <ArrowRight className="ml-2" size={18} /></Button></div>
    </section>

    <section className={step === 4 ? "grid gap-5" : "hidden"}>
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#123c31] text-[#d9f99d]"><Sparkles size={19} /></span><div><p className="text-lg font-black">Choose how you like to learn.</p><p className="mt-1 text-sm text-[#5f6f67]">You can change these preferences later.</p></div></div>
      <label className="grid gap-2 text-sm font-bold">Preferred lesson style<select name="learningFormat" defaultValue="PRACTICAL" className="focus-ring h-12 rounded-xl border border-[#cad4ce] bg-white px-4 font-normal"><option value="PRACTICAL">Hands-on first</option><option value="VISUAL">Visual examples</option><option value="READING">Detailed reading</option><option value="MIXED">A balanced mix</option></select></label>
      <fieldset><legend className="mb-3 text-sm font-bold">Tools you already use <span className="font-normal text-[#839189]">(optional)</span></legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{tools.map((tool) => <label key={tool} className="flex items-center gap-2 rounded-xl border border-[#dce2dd] p-3 text-sm"><input type="checkbox" name="preferredTools" value={tool} />{tool}</label>)}</div></fieldset>
      <div className="rounded-2xl bg-[#eef3e9] p-4 text-sm leading-6 text-[#405148]"><Check className="mr-2 inline text-[#1d604d]" size={17} />We will create your track, three milestones, tailored daily practice and relevant African case studies.</div>
      <input type="hidden" name="timezone" value={timezone} />
      <div className="grid gap-3 sm:grid-cols-[auto_1fr]"><Button type="button" variant="secondary" size="lg" onClick={() => setStep(3)}><ArrowLeft className="mr-2" size={18} />Back</Button><Button size="lg">Build my learning plan</Button></div>
    </section>
  </form>;
}
