"use client";

import { useState, useTransition } from "react";
import { Check, PartyPopper } from "lucide-react";
import { completeLessonAction } from "@/app/actions/challenge";
import { Button } from "@/components/ui/button";

export function CompleteButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [done, setDone] = useState(completed);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return <div className="sticky bottom-4 mt-10 rounded-2xl border border-[#dce2dd] bg-white/90 p-4 shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between gap-4"><div><strong className="block">{done ? "Lesson complete" : "Finished the practical task?"}</strong><span className="text-sm text-[#5f6f67]">{message || (done ? "Your progress and streak are saved." : "Mark complete when you have produced the output.")}</span></div><Button disabled={pending || done} onClick={() => startTransition(async () => { const result = await completeLessonAction(lessonId); setMessage(result.message); if (result.ok) setDone(true); })}>{done ? <><Check className="mr-2" size={18} />Done</> : pending ? "Saving…" : <><PartyPopper className="mr-2" size={18} />Mark complete</>}</Button></div>{done && <div className="celebrate pointer-events-none absolute -top-5 right-9 text-3xl">🎉</div>}</div>;
}
