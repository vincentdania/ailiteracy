"use client";

import { useActionState, useState, useTransition } from "react";
import { Sparkles, UserRound, Volume2 } from "lucide-react";
import { setCertificateNameAction, setEffectsAction } from "@/app/actions/preferences";
import { useCelebrate } from "@/components/learning/celebration";

function Toggle({ checked, onChange, label, description, icon }: { checked: boolean; onChange: (v: boolean) => void; label: string; description: string; icon: React.ReactNode }) {
  return <label className="flex cursor-pointer items-start gap-4 rounded-2xl p-3 hover:bg-[#f6f8fb]">
    <span className="mt-0.5 text-[#0058be]">{icon}</span>
    <span className="flex-1"><strong className="block text-sm text-[#0b1c30]">{label}</strong><span className="text-sm text-[#4d5768]">{description}</span></span>
    <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
    <span aria-hidden className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#0058be] peer-focus-visible:ring-offset-2 ${checked ? "bg-[#0058be]" : "bg-[#cbd5e1]"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[1.375rem]" : "left-0.5"}`} /></span>
  </label>;
}

export function LearningSettings({ name }: { name: string }) {
  const { prefs, setPrefs } = useCelebrate();
  const [, startTransition] = useTransition();
  const [state, action, pending] = useActionState(setCertificateNameAction, { ok: false, message: "" });
  const [value, setValue] = useState(name);
  function update(next: typeof prefs) {
    setPrefs(next);
    startTransition(async () => { await setEffectsAction(next); });
  }
  return <div className="surface p-5 sm:p-6">
    <h2 className="font-display text-xl font-bold text-[#0b1c30]">Learning settings</h2>
    <div className="mt-3 grid gap-1">
      <Toggle checked={prefs.effectsEnabled} onChange={(v) => update({ ...prefs, effectsEnabled: v })} label="Celebration effects" description="Confetti and motion when you earn something. Your device's reduce-motion setting is always respected." icon={<Sparkles size={18} />} />
      <Toggle checked={prefs.soundEnabled} onChange={(v) => update({ ...prefs, soundEnabled: v })} label="Achievement sounds" description="A short chime when you solve a mission or earn a badge. Off by default." icon={<Volume2 size={18} />} />
    </div>
    <form action={action} className="mt-4 border-t border-[#dfe5ee] pt-4">
      <label className="grid gap-2 text-sm font-bold text-[#0b1c30]"><span className="flex items-center gap-2"><UserRound size={16} className="text-[#0058be]" />Your full name, as it appears on certificates</span>
        <span className="flex flex-col gap-2 sm:flex-row"><input name="name" value={value} onChange={(e) => setValue(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" className="tap flex-1 rounded-xl border border-[#cbd5e1] bg-white px-4 font-normal" /><button disabled={pending || value.trim() === name} className="tap rounded-xl bg-[#0b1c30] px-5 text-sm font-bold text-white disabled:opacity-40">{pending ? "Saving…" : "Save name"}</button></span>
      </label>
      {state.message && <p role="status" className={`mt-2 text-sm ${state.ok ? "text-[#146c43]" : "text-[#b3261e]"}`}>{state.message}</p>}
    </form>
  </div>;
}
