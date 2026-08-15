"use client";

import { useActionState } from "react";
import { CheckCircle2, ExternalLink, FileCheck2, Link2 } from "lucide-react";
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
  return <section className="mt-12 border-t border-[#e2e8f0] pt-10">
    <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#00261d] text-[#ceee93]"><FileCheck2 size={20} /></span><div><p className="eyebrow">{isCapstone ? "Certificate evidence" : "Practice submission"}</p><h2 className="mt-1 font-serif text-3xl font-semibold text-[#00261d]">Submit Artefact</h2><p className="mt-2 text-sm text-[#414845]">Show what you made and explain how you checked it.</p></div>{score != null && <strong className="ml-auto rounded-full bg-[#e6efdf] px-3 py-2 text-sm text-[#123c31]">{score}/100</strong>}</div>
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="lessonId" value={lessonId} />
      <label className="grid gap-2 text-sm font-bold">Artefact title<input name="title" required minLength={3} maxLength={140} defaultValue={initial?.title ?? `${lessonTitle} practice`} className="h-13 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal" /></label>
      <label className="grid gap-2 text-sm font-bold">What did you create, change, and verify?<textarea name="content" required minLength={80} rows={8} defaultValue={initial?.content ?? ""} className="rounded-2xl border border-[#c0c8c4] bg-white p-4 font-normal" placeholder="Describe the situation, your process, the output, the checks you performed, your decisions, and the result you expect." /></label>
      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Link2 size={15} />Link to an artefact <span className="font-normal text-[#717975]">(optional; use a view-only link)</span></span><input type="url" name="artifactUrl" defaultValue={initial?.artifactUrl ?? ""} className="h-13 rounded-2xl border border-[#c0c8c4] bg-white px-4 font-normal" placeholder="https://…" /></label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Button disabled={pending}>{pending ? "Reviewing…" : initial ? "Update and review" : "Submit for instant review"}</Button><p role="status" className={`text-sm ${state.ok ? "text-[#1d604d]" : "text-[#9a3f31]"}`}>{state.message}</p></div>
    </form>
    {(feedback?.summary || feedback?.nextSteps?.length) && <div className="mt-6 rounded-2xl bg-[#00261d] p-6 text-sm leading-6 text-white"><strong className="flex items-center gap-2 text-[#ceee93]"><CheckCircle2 size={17} />Review complete</strong><p className="mt-3">{feedback.summary}</p>{feedback.nextSteps?.length ? <ul className="mt-3 list-disc pl-5 text-white/75">{feedback.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div>}
    {initial?.artifactUrl && <a href={initial.artifactUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1d604d]">Open submitted artefact <ExternalLink size={15} /></a>}
  </section>;
}
