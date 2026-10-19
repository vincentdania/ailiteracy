"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, FileCheck2, Link2 } from "lucide-react";
import { submitPracticeAction } from "@/app/actions/submissions";
import { Button } from "@/components/ui/button";
import { useCelebrate } from "@/components/learning/celebration";

type Props = {
  lessonId: string;
  lessonTitle: string;
  isCapstone: boolean;
  initial?: { title: string; content: string; artifactUrl: string | null; score: number | null; aiFeedback: unknown } | null;
};

export function PracticeSubmission({ lessonId, lessonTitle, isCapstone, initial }: Props) {
  const [state, action, pending] = useActionState(submitPracticeAction, { ok: false, message: "" });
  const [hidden, setHidden] = useState(false);
  const { celebrate } = useCelebrate();
  useEffect(() => { if (state.ok) celebrate(state.celebration); }, [state, celebrate]);
  const feedback = initial?.aiFeedback && typeof initial.aiFeedback === "object" ? initial.aiFeedback as { summary?: string; nextSteps?: string[] } : null;
  const score = state.score ?? initial?.score;
  return <section className="surface p-5 sm:p-6">
    <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#10294f] text-[#bcd6ff]"><FileCheck2 size={20} /></span><div><p className="eyebrow">{isCapstone ? "Capstone · needs 70 or more" : "Practical task"}</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#0b1c30] sm:text-3xl">Submit your work</h2><p className="mt-2 text-sm leading-6 text-[#4d5768]">Describe what you made in today’s task. It is scored out of 100 as soon as you submit. You score higher when you say how you checked the facts or figures, what you decided or changed yourself, what result it should improve, and one risk (such as privacy or bias) and how you handled it. Write at least {isCapstone ? 140 : 45} words. {isCapstone ? "The capstone needs 70 or more to complete this lesson." : "Each module certificate needs at least one practical task that scores 70 or more."}</p></div>{score != null && <strong className="ml-auto rounded-full bg-[#eaf2ff] px-3 py-2 text-sm text-[#214889]">{score}/100</strong>}</div>
    {hidden ? (
      <button type="button" onClick={() => setHidden(false)} className="mt-5 text-sm font-bold text-[#0058be] hover:underline">Show the form</button>
    ) : (
      <form action={action} className="mt-6 grid gap-4">
        <input type="hidden" name="lessonId" value={lessonId} />
        <label className="grid gap-2 text-sm font-bold">What you made<input name="title" required minLength={3} maxLength={140} defaultValue={initial?.title ?? `${lessonTitle} practice`} className="h-13 rounded-2xl border border-[#cbd5e1] bg-white px-4 font-normal" /></label>
        <label className="grid gap-2 text-sm font-bold">Describe what you did<textarea name="content" required minLength={60} rows={5} defaultValue={initial?.content ?? ""} className="rounded-2xl border border-[#cbd5e1] bg-white p-4 font-normal" placeholder="What you made, how you checked it, what you changed yourself, the result you expect and one risk you handled." /></label>
        <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Link2 size={15} />Link to your work <span className="font-normal text-[#677284]">(optional: a view-only link to your document or file)</span></span><input type="url" name="artifactUrl" defaultValue={initial?.artifactUrl ?? ""} className="h-13 rounded-2xl border border-[#cbd5e1] bg-white px-4 font-normal" placeholder="https://…" /></label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Button disabled={pending}>{pending ? "Scoring…" : initial ? "Resubmit for feedback" : "Submit for feedback"}</Button><button type="button" onClick={() => setHidden(true)} className="text-sm text-[#677284] underline-offset-2 hover:underline">Skip for now</button><p role="status" className={`text-sm ${state.ok ? "text-[#0058be]" : "text-[#9a3f31]"}`}>{state.message}</p></div>
      </form>
    )}
    {(feedback?.summary || feedback?.nextSteps?.length) && <div className="mt-6 rounded-2xl bg-[#10294f] p-6 text-sm leading-6 text-white"><strong className="flex items-center gap-2 text-[#bcd6ff]"><CheckCircle2 size={17} />Feedback on your last submission</strong><p className="mt-3">{feedback.summary}</p>{feedback.nextSteps?.length ? <ul className="mt-3 list-disc pl-5 text-white/75">{feedback.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div>}
    {initial?.artifactUrl && <a href={initial.artifactUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0058be]">Open the link you submitted <ExternalLink size={15} /></a>}
  </section>;
}
