"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Flag, LockKeyhole } from "lucide-react";
import { completeLessonAction } from "@/app/actions/challenge";
import { useCelebrate } from "@/components/learning/celebration";

export function CompleteButton({ lessonId, completed, blockers }: { lessonId: string; completed: boolean; blockers: string[] }) {
  const { celebrate } = useCelebrate();
  const router = useRouter();
  const [done, setDone] = useState(completed);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const blocked = !done && blockers.length > 0;
  return <div className="no-print sticky bottom-20 z-20 mt-10 lg:bottom-4">
    <div className="flex flex-col gap-3 rounded-2xl border border-[#dfe5ee] bg-white/95 p-4 shadow-[0_18px_40px_-18px_rgba(11,28,48,.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div aria-live="polite"><strong className="block font-display text-[#0b1c30]">{done ? "Lesson complete" : blocked ? "Almost there" : "Ready to complete this lesson"}</strong><span className="text-sm text-[#4d5768]">{message || (done ? "Your progress is saved. You can still replay any mission or retake the knowledge check." : blocked ? `${blockers.join(" · ")}.` : "You’ve solved the missions and passed the knowledge check. If you haven’t yet, submit your practical task above. Then complete the lesson.")}</span></div>
      <button disabled={pending || done || blocked} onClick={() => startTransition(async () => { const result = await completeLessonAction(lessonId); setMessage(result.message); if (result.ok) { setDone(true); if ("celebration" in result) celebrate(result.celebration); router.refresh(); } })} className="tap inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0058be] px-6 py-3 font-bold text-white transition hover:bg-[#00479b] disabled:cursor-not-allowed disabled:bg-[#97a3b6]">{done ? <><Check size={18} />Completed</> : pending ? "Saving…" : blocked ? <><LockKeyhole size={16} />Complete lesson</> : <><Flag size={17} />Complete lesson</>}</button>
    </div>
  </div>;
}
