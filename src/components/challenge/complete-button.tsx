"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { completeLessonAction } from "@/app/actions/challenge";

export function CompleteButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const router = useRouter();
  const [done, setDone] = useState(completed);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return <div className="no-print mt-10 rounded-2xl border border-[#dfe5ee] bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><strong className="font-display text-lg text-[#10294f]">{done ? "Lesson complete" : "Ready to mark this lesson complete?"}</strong><p aria-live="polite" className="mt-1 text-sm text-[#4d5768]">{message || (done ? "Your progress is saved." : "Complete the build along, then save your progress.")}</p></div><button type="button" disabled={done || pending} onClick={() => startTransition(async () => { const result = await completeLessonAction(lessonId); setMessage(result.message); if (result.ok) { setDone(true); router.refresh(); } })} className="tap inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#10294f] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-[#97a3b6]">{done ? <><Check size={17} />Completed</> : pending ? "Saving…" : "Complete lesson"}</button></div></div>;
}
