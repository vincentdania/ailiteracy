"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, CheckCircle2, Lightbulb, LockKeyhole, RotateCcw, Sparkles, Target, X } from "lucide-react";
import { attemptMissionAction, type MissionActionResult } from "@/app/actions/missions";
import type { PublicMission } from "@/lib/learning/activities";
import { useCelebrate } from "@/components/learning/celebration";

type Props = {
  lessonId: string;
  mission: PublicMission;
  index: number;
  advanced?: boolean;
  locked?: boolean;
  initial: { solved: boolean; attempts: number };
};

type Answer = string | string[] | Record<string, number> | null;

const TYPE_LABEL: Record<PublicMission["type"], string> = { choice: "Choose the best answer", multi: "Select all that apply", order: "Put these in order", sort: "Sort each item" };

export function MissionCard({ lessonId, mission, index, advanced = false, locked = false, initial }: Props) {
  const { celebrate } = useCelebrate();
  const [answer, setAnswer] = useState<Answer>(() => (mission.type === "order" ? mission.items.map((i) => i.id) : mission.type === "multi" ? [] : mission.type === "sort" ? {} : null));
  const [result, setResult] = useState<Extract<MissionActionResult, { ok: true }> | null>(null);
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(initial.solved);
  const [attempts, setAttempts] = useState(initial.attempts);
  const [replaying, setReplaying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [pending, startTransition] = useTransition();

  const ready = mission.type === "choice" ? !!answer : mission.type === "multi" ? Array.isArray(answer) && answer.length > 0 : mission.type === "sort" ? Object.keys((answer as Record<string, number>) ?? {}).length === mission.items.length : true;
  const showingResult = !!result && (result.correct || !pending);
  const lockedIn = !!result?.correct;

  function submit() {
    if (!ready || pending) return;
    setError("");
    startTransition(async () => {
      const response = await attemptMissionAction(lessonId, mission.key, answer);
      if (!response.ok) return setError(response.error);
      setResult(response);
      if (!solved) setAttempts(response.attempts);
      if (response.correct) {
        setSolved(true);
        celebrate(response.celebration);
      } else setShakeKey((k) => k + 1);
    });
  }

  function retry() {
    setResult(null);
    setError("");
  }

  if (locked) return <section className="surface border-dashed p-5 sm:p-6" aria-label={`Advanced mission: ${mission.title}`}>
    <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf1f6] text-[#677284]"><LockKeyhole size={19} /></span><div><p className="eyebrow !text-[#677284]">Advanced mission · optional</p><h3 className="mt-1 font-display text-xl font-semibold text-[#0b1c30]">{mission.title}</h3><p className="mt-2 text-sm leading-6 text-[#4d5768]">Unlocks when you solve this lesson’s missions on the first try, or get full marks on the knowledge check. It isn’t required for your certificate.</p></div></div>
  </section>;

  const disabled = lockedIn || pending;
  return <section className={`surface overflow-hidden ${advanced ? "border-[#f2b01e]/60" : ""}`} aria-labelledby={`mission-${mission.key}`}>
    <header className={`flex items-start gap-4 border-b border-[#dfe5ee] p-5 sm:p-6 ${advanced ? "bg-[#fff9e8]" : "bg-[#f6f8fb]"}`}>
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${solved ? "bg-[#146c43] text-white" : advanced ? "bg-[#f2b01e] text-[#0b1c30]" : "bg-[#0058be] text-white"}`}>{solved ? <Check size={20} /> : advanced ? <Sparkles size={19} /> : <Target size={19} />}</span>
      <div className="min-w-0 flex-1">
        <p className="eyebrow">{advanced ? "Advanced mission · optional" : `Mission ${index + 1}`} <span className="font-semibold normal-case tracking-normal text-[#677284]">· {TYPE_LABEL[mission.type]}</span></p>
        <h3 id={`mission-${mission.key}`} className="mt-1 font-display text-xl font-semibold leading-snug text-[#0b1c30] sm:text-2xl">{mission.title}</h3>
      </div>
      {solved && !replaying && <span className="chip bg-[#e6f4ec] text-[#146c43]"><CheckCircle2 size={14} />Solved</span>}
    </header>

    {solved && !replaying && !result ? <div className="p-5 sm:p-6"><p className="text-sm leading-6 text-[#4d5768]">You solved this mission{attempts > 1 ? ` after ${attempts} attempts. Learning from the feedback is exactly the point` : " on the first try"}. Replay it any time for practice. Replays don’t change your record.</p><button type="button" onClick={() => setReplaying(true)} className="tap mt-4 inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] px-5 py-2.5 text-sm font-bold text-[#0b1c30] hover:bg-[#f6f8fb]"><RotateCcw size={15} />Replay mission</button></div> : <div className="p-5 sm:p-6">
      {mission.scenario && <p className="rounded-2xl border-l-4 border-[#214889] bg-[#eef4fd] p-4 text-base leading-7 text-[#26324a]">{mission.scenario}</p>}
      <p className="mt-4 font-semibold leading-7 text-[#0b1c30]">{mission.prompt}</p>

      <div key={shakeKey} className={`mt-4 ${result && !result.correct ? "anim-shake" : ""}`}>
        {mission.type === "choice" && <div role="radiogroup" aria-labelledby={`mission-${mission.key}`} className="grid gap-2.5">
          {mission.options.map((option, i) => { const chosen = answer === option.id; return <button key={option.id} type="button" role="radio" aria-checked={chosen} disabled={disabled} onClick={() => { setAnswer(option.id); if (result && !result.correct) retry(); }} className={`tap flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-base leading-6 transition ${chosen ? (showingResult ? (result!.correct ? "border-[#146c43] bg-[#e6f4ec]" : "border-[#b3261e] bg-[#fdeceb]") : "border-[#0058be] bg-[#eaf2ff] ring-1 ring-[#0058be]") : "border-[#dfe5ee] bg-white hover:border-[#8fb0e0]"}`}><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${chosen ? "border-[#0058be] bg-[#0058be] text-white" : "border-[#cbd5e1] text-[#677284]"}`}>{String.fromCharCode(65 + i)}</span><span>{option.text}</span></button>; })}
        </div>}

        {mission.type === "multi" && <div role="group" aria-labelledby={`mission-${mission.key}`} className="grid gap-2.5">
          {mission.options.map((option) => { const picked = Array.isArray(answer) && answer.includes(option.id); return <button key={option.id} type="button" role="checkbox" aria-checked={picked} disabled={disabled} onClick={() => { const list = Array.isArray(answer) ? answer : []; setAnswer(picked ? list.filter((id) => id !== option.id) : [...list, option.id]); if (result && !result.correct) retry(); }} className={`tap flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-base leading-6 transition ${picked ? "border-[#0058be] bg-[#eaf2ff]" : "border-[#dfe5ee] bg-white hover:border-[#8fb0e0]"}`}><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border ${picked ? "border-[#0058be] bg-[#0058be] text-white" : "border-[#cbd5e1]"}`}>{picked && <Check size={14} />}</span><span>{option.text}</span></button>; })}
        </div>}

        {mission.type === "order" && Array.isArray(answer) && <ol className="grid gap-2.5" aria-label="Steps in your chosen order">
          {answer.map((id, position) => { const item = mission.items.find((i) => i.id === id)!; const move = (delta: number) => { const next = [...answer]; const target = position + delta; [next[position], next[target]] = [next[target]!, next[position]!]; setAnswer(next); if (result && !result.correct) retry(); }; return <li key={id} className="flex items-center gap-3 rounded-2xl border border-[#dfe5ee] bg-white p-3 pl-4 text-base leading-6"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#eaf2ff] text-xs font-bold text-[#0058be]">{position + 1}</span><span className="flex-1">{item.text}</span><span className="flex shrink-0 flex-col gap-1 sm:flex-row"><button type="button" disabled={disabled || position === 0} onClick={() => move(-1)} className="tap grid size-11 place-items-center rounded-xl border border-[#dfe5ee] text-[#4d5768] hover:bg-[#f6f8fb] disabled:opacity-30" aria-label={`Move “${item.text}” up`}><ArrowUp size={16} /></button><button type="button" disabled={disabled || position === answer.length - 1} onClick={() => move(1)} className="tap grid size-11 place-items-center rounded-xl border border-[#dfe5ee] text-[#4d5768] hover:bg-[#f6f8fb] disabled:opacity-30" aria-label={`Move “${item.text}” down`}><ArrowDown size={16} /></button></span></li>; })}
        </ol>}

        {mission.type === "sort" && <div className="grid gap-3">
          {mission.items.map((item) => { const placed = (answer as Record<string, number> | null)?.[item.id]; return <fieldset key={item.id} className="rounded-2xl border border-[#dfe5ee] bg-white p-4"><legend className="sr-only">{item.text}</legend><p className="text-base font-semibold leading-6 text-[#0b1c30]" aria-hidden>{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{mission.categories.map((category, ci) => { const on = placed === ci; return <button key={category} type="button" aria-pressed={on} disabled={disabled} onClick={() => { setAnswer({ ...((answer as Record<string, number>) ?? {}), [item.id]: ci }); if (result && !result.correct) retry(); }} className={`tap rounded-full border px-4 py-2 text-sm font-semibold transition ${on ? "border-[#0058be] bg-[#0058be] text-white" : "border-[#cbd5e1] text-[#4d5768] hover:border-[#8fb0e0]"}`}>{category}</button>; })}</div></fieldset>; })}
        </div>}
      </div>

      <div aria-live="polite">
        {error && <p className="mt-4 rounded-xl bg-[#fdeceb] p-3 text-sm text-[#b3261e]">{error}</p>}
        {showingResult && result!.correct && <div className="anim-rise mt-5 rounded-2xl bg-[#e6f4ec] p-5 text-base leading-7 text-[#0b3d26]"><p className="flex items-center gap-2 font-display text-lg font-bold text-[#146c43]"><CheckCircle2 size={20} />{replaying ? "Correct again." : attempts > 1 ? "Solved. You worked it out." : "Spot on, first try."}</p>{result!.feedback.length > 0 && <ul className="mt-2 grid gap-1.5">{result!.feedback.map((line) => <li key={line}>{line}</li>)}</ul>}<p className="mt-3 border-t border-[#146c43]/15 pt-3"><strong>Why it works: </strong>{result!.explain}</p></div>}
        {showingResult && !result!.correct && <div className="anim-rise mt-5 rounded-2xl border border-[#f1c6c2] bg-[#fdf6f5] p-5 text-base leading-7 text-[#4a1d19]">
          <p className="flex items-center gap-2 font-display text-lg font-bold text-[#b3261e]"><X size={19} />Not yet. Mistakes are part of the mission.</p>
          {result!.feedback.length > 0 && <ul className="mt-2 grid list-disc gap-1.5 pl-5">{result!.feedback.map((line) => <li key={line}>{line}</li>)}</ul>}
          {result!.hint && <p className="mt-3 flex gap-2 rounded-xl bg-white p-3 text-[#26324a]"><Lightbulb size={18} className="mt-1 shrink-0 text-[#f2b01e]" /><span><strong>Hint: </strong>{result!.hint}</span></p>}
          {result!.support && <p className="mt-3 rounded-xl bg-white p-3 text-[#26324a]"><strong>Another way to see it: </strong>{result!.support}</p>}
          {result!.reveal && <div className="mt-3 rounded-xl bg-white p-3 text-[#26324a]"><strong>The answer:</strong><ul className="mt-1 grid gap-1">{result!.reveal.map((line) => <li key={line}>{line}</li>)}</ul><p className="mt-2 text-sm text-[#4d5768]">Set your answer to match, then check it to complete the mission.</p></div>}
        </div>}
      </div>

      {!lockedIn ? <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={submit} disabled={!ready || pending} className="tap inline-flex items-center justify-center rounded-full bg-[#0058be] px-6 py-3 font-bold text-white transition hover:bg-[#00479b] disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Checking…" : result && !result.correct ? "Check again" : "Check answer"}</button>{!solved && attempts > 0 && <span className="text-sm text-[#677284]">Attempt {attempts + (result && !result.correct ? 1 : 0)}</span>}</div>
        : replaying ? <button type="button" onClick={() => { setReplaying(false); retry(); }} className="tap mt-5 text-sm font-bold text-[#0058be]">Done</button> : null}
    </div>}
  </section>;
}
