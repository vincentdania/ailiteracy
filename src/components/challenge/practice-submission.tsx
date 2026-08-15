"use client";

import { useActionState } from "react";
import { ExternalLink, FileCheck2 } from "lucide-react";
import { submitPracticeAction } from "@/app/actions/submissions";
import { Button } from "@/components/ui/button";

type Props = {
  lessonId: string;
  lessonTitle: string;
  isCapstone: boolean;
  initial?: { title: string; content: string; artifactUrl: string | null; score: number | null; aiFeedback: unknown } | null;
};

export function PracticeSubmission({ lessonId, lessonTitle, isCapstone, initial }: Props) {
  const [state, action, pending] = useActionState(submitPracticeAction, { ok: false, message: "" });
  const feedback = initial?.aiFeedback && typeof initial.aiFeedback === "object" ? initial.aiFeedback as { summary?: string; nextSteps?: string[] } : null;
  const score = state.score ?? initial?.score;
  return <section className="mt-8 rounded-[2rem] border border-[#dce2dd] bg-white p-6 sm:p-8 card-shadow">
    <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#123c31] text-[#d9f99d]"><FileCheck2 size={20} /></span><div><p className="eyebrow">{isCapstone ? "Certificate evidence" : "Practice evidence"}</p><h2 className="mt-1 text-2xl font-black">Show what you made and how you checked it.</h2></div>{score != null && <strong className="ml-auto rounded-full bg-[#e6efdf] px-3 py-2 text-sm text-[#123c31]">{score}/100</strong>}</div>
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="lessonId" value={lessonId} />
      <label className="grid gap-2 text-sm font-bold">Artefact title<input name="title" required minLength={3} maxLength={140} defaultValue={initial?.title ?? `${lessonTitle} practice`} className="focus-ring h-12 rounded-xl border border-[#cad4ce] px-4 font-normal" /></label>
      <label className="grid gap-2 text-sm font-bold">What did you create, what did you change, and how did you verify it?<textarea name="content" required minLength={80} rows={8} defaultValue={initial?.content ?? ""} className="focus-ring rounded-xl border border-[#cad4ce] p-4 font-normal" placeholder="Describe the situation, your prompt or process, the output, the checks you performed, your human decisions, and the result you expect." /></label>
      <label className="grid gap-2 text-sm font-bold">Link to an artefact <span className="font-normal text-[#839189]">(optional; use a view-only link)</span><input type="url" name="artifactUrl" defaultValue={initial?.artifactUrl ?? ""} className="focus-ring h-12 rounded-xl border border-[#cad4ce] px-4 font-normal" placeholder="https://…" /></label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Button disabled={pending}>{pending ? "Reviewing…" : initial ? "Update and review" : "Submit for instant review"}</Button><p role="status" className={`text-sm ${state.ok ? "text-[#1d604d]" : "text-[#9a3f31]"}`}>{state.message}</p></div>
    </form>
    {(feedback?.summary || feedback?.nextSteps?.length) && <div className="mt-5 rounded-2xl bg-[#f4f6f1] p-5 text-sm leading-6"><strong>{feedback.summary}</strong>{feedback.nextSteps?.length ? <ul className="mt-2 list-disc pl-5 text-[#5f6f67]">{feedback.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div>}
    {initial?.artifactUrl && <a href={initial.artifactUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1d604d]">Open submitted artefact <ExternalLink size={15} /></a>}
  </section>;
}
