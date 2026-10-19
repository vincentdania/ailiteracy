"use client";

import { useState, useTransition } from "react";
import { Check, CheckCircle2, GraduationCap, RotateCcw, X } from "lucide-react";
import { gradeQuizAction, type QuizResult } from "@/app/actions/quiz";
import { useCelebrate } from "@/components/learning/celebration";

type Question = { q: string; options: string[] };
type Graded = Extract<QuizResult, { ok: true }>;

export function LessonQuiz({ lessonId, quiz, bestScore, passMark }: { lessonId: string; quiz: Question[]; bestScore: number | null; passMark: number }) {
  const { celebrate } = useCelebrate();
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.length).fill(null));
  const [result, setResult] = useState<Graded | null>(null);
  const [best, setBest] = useState(bestScore);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const allAnswered = answers.every((a) => a !== null);
  const mastered = best !== null && best >= passMark;

  function submit() {
    if (!allAnswered || pending) return;
    setError("");
    startTransition(async () => {
      const response = await gradeQuizAction(lessonId, answers as number[]);
      if (!response.ok) return setError(response.error);
      setResult(response);
      setBest(response.best);
      celebrate(response.celebration);
      document.getElementById("knowledge-check-result")?.focus();
    });
  }

  return <section className="surface overflow-hidden" aria-labelledby="knowledge-check-title">
    <header className="flex flex-wrap items-start gap-4 border-b border-[#dfe5ee] bg-[#f6f8fb] p-5 sm:p-6">
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${mastered ? "bg-[#146c43]" : "bg-[#214889]"} text-white`}>{mastered ? <Check size={20} /> : <GraduationCap size={20} />}</span>
      <div className="min-w-0 flex-1"><p className="eyebrow">Knowledge check · {quiz.length} questions</p><h3 id="knowledge-check-title" className="mt-1 font-display text-xl font-semibold text-[#0b1c30] sm:text-2xl">Show you’ve mastered it</h3><p className="mt-1 text-sm leading-6 text-[#4d5768]">Mastery is {passMark} of {quiz.length} or better. Retake it as often as you like; your best score counts.</p></div>
      {best !== null && <span className={`chip ${mastered ? "bg-[#e6f4ec] text-[#146c43]" : "bg-[#fff4d6] text-[#8a5300]"}`}>Best {best}/{quiz.length}{mastered ? " · Mastered" : ""}</span>}
    </header>
    <div className="grid gap-4 p-5 sm:p-6">
      {quiz.map((question, qi) => {
        const graded = result?.perQuestion[qi];
        return <fieldset key={qi} className="rounded-2xl border border-[#dfe5ee] p-4 sm:p-5">
          <legend className="sr-only">Question {qi + 1}</legend>
          <p className="font-semibold leading-7 text-[#0b1c30]"><span className="mr-2 text-[#0058be]">{qi + 1}.</span>{question.q}</p>
          <div className="mt-3 grid gap-2">
            {question.options.map((option, oi) => {
              const chosen = answers[qi] === oi;
              const tone = graded && chosen ? (graded.correct ? "border-[#146c43] bg-[#e6f4ec]" : "border-[#b3261e] bg-[#fdeceb]") : chosen ? "border-[#0058be] bg-[#eaf2ff] ring-1 ring-[#0058be]" : "border-[#dfe5ee] hover:border-[#8fb0e0]";
              return <label key={oi} className={`tap flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-[15px] leading-6 transition ${tone} ${result ? "cursor-default" : ""}`}>
                <input type="radio" name={`q${qi}`} value={oi} checked={chosen} disabled={!!result} onChange={() => { const next = [...answers]; next[qi] = oi; setAnswers(next); }} className="mt-1 size-4 accent-[#0058be]" />
                <span className="flex-1">{option}</span>
                {graded && chosen && (graded.correct ? <Check size={17} className="mt-1 text-[#146c43]" aria-label="Correct" /> : <X size={17} className="mt-1 text-[#b3261e]" aria-label="Incorrect" />)}
              </label>;
            })}
          </div>
          {graded && <p className={`mt-3 rounded-xl p-3 text-sm leading-6 ${graded.correct ? "bg-[#e6f4ec] text-[#0b3d26]" : "bg-[#fdf6f5] text-[#4a1d19]"}`}><strong>{graded.correct ? "Correct. " : "Not quite. "}</strong>{graded.explanation ?? "Look back at the lesson section on this and try again. If you miss it twice, you'll see the full explanation."}</p>}
        </fieldset>;
      })}
      {error && <p className="rounded-xl bg-[#fdeceb] p-3 text-sm text-[#b3261e]">{error}</p>}
      <div id="knowledge-check-result" tabIndex={-1} aria-live="polite" className="outline-none">
        {result ? <div className={`flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center ${result.passed ? "bg-[#e6f4ec]" : "bg-[#fff4d6]"}`}>
          <div className="flex-1"><p className="font-display text-2xl font-bold text-[#0b1c30]">{result.score}/{result.total}{result.passed ? " · Mastered" : ""}</p><p className="mt-1 text-sm leading-6 text-[#4d5768]">{result.score === result.total ? "Full marks. You clearly understand this." : result.passed ? "You've reached mastery. Retake it for full marks if you like." : `You need ${passMark} to reach mastery. Review the questions you missed and try again.`}</p></div>
          <button type="button" onClick={() => { setAnswers(Array(quiz.length).fill(null)); setResult(null); }} className="tap inline-flex items-center justify-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-5 py-2.5 text-sm font-bold text-[#0b1c30] hover:bg-[#f6f8fb]"><RotateCcw size={15} />{result.passed ? "Retake" : "Try again"}</button>
        </div> : <button type="button" disabled={!allAnswered || pending} onClick={submit} className="tap inline-flex items-center justify-center rounded-full bg-[#0058be] px-6 py-3 font-bold text-white hover:bg-[#00479b] disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Checking…" : allAnswered ? "Check my answers" : `Answer all ${quiz.length} questions`}</button>}
        {mastered && !result && <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#146c43]"><CheckCircle2 size={16} />Mastered. You can retake it for practice any time.</p>}
      </div>
    </div>
  </section>;
}
