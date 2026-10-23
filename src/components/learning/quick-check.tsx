"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/learning/quiz";

/** Three-question self check at the end of a lesson. Answers stay on the page; nothing is graded or saved. */
export function QuickCheck({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  if (!questions.length) return null;
  const right = picked.filter((choice, i) => choice === questions[i]?.answer).length;
  const done = picked.every((choice) => choice !== null);
  return <section id="quick-check" className="surface mt-10 scroll-mt-28 p-5 sm:p-8">
    <p className="eyebrow">Quick check</p>
    <h2 className="mt-1 font-display text-2xl font-semibold text-[#10294f]">Did it stick?</h2>
    <ol className="mt-6 grid gap-7">
      {questions.map((q, qi) => {
        const choice = picked[qi];
        return <li key={q.question}>
          <p className="font-semibold text-[#10294f]">{qi + 1}. {q.question}</p>
          <div className="mt-3 grid gap-2" role="group" aria-label={`Question ${qi + 1}`}>
            {q.options.map((option, oi) => {
              const chosen = choice === oi;
              const state = choice === null ? "" : oi === q.answer ? "quiz-right" : chosen ? "quiz-wrong" : "quiz-dim";
              return <button key={option} type="button" disabled={choice !== null} aria-pressed={chosen} onClick={() => setPicked((all) => all.map((value, i) => (i === qi ? oi : value)))} className={`quiz-option ${state}`}>
                <span>{option}</span>{choice !== null && oi === q.answer ? <Check size={18} aria-label="Correct answer" /> : chosen ? <X size={18} aria-label="Your answer" /> : null}
              </button>;
            })}
          </div>
          {choice !== null && <p className="mt-3 text-base leading-7 text-[#4d5768]" aria-live="polite"><strong className="text-[#10294f]">{choice === q.answer ? "Correct." : "Not quite."}</strong> {q.explanation}</p>}
        </li>;
      })}
    </ol>
    {done && <p className="mt-7 border-t border-[#dfe5ee] pt-5 font-semibold text-[#10294f]" aria-live="polite">You got {right} of {questions.length}. {right === questions.length ? "Well done. Mark the lesson complete below." : "Read the explanations, then mark the lesson complete below."}</p>}
    <button type="button" onClick={() => setPicked(questions.map(() => null))} className="tap mt-4 rounded-full px-4 text-sm font-semibold text-[#4d5768] hover:bg-[#faf7f2]">Try again</button>
  </section>;
}
