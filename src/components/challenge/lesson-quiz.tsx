"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { gradeQuizAction } from "@/app/actions/quiz";
import { Button } from "@/components/ui/button";

type QuizQuestion = { q: string; options: string[]; answer: number; explanation: string };
type Result = { score: number; total: number; perQuestion: { correct: boolean; chosen: number; answer: number; explanation: string }[] };

export function LessonQuiz({ lessonId, quiz, bestScore }: { lessonId: string; quiz: QuizQuestion[]; bestScore: number | null }) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.length).fill(null));
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  async function submit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    const form = new FormData();
    form.set("lessonId", lessonId);
    answers.forEach((a, i) => form.set(`q${i}`, String(a)));
    const res = await gradeQuizAction(form);
    setSubmitting(false);
    if (res.ok) setResult(res);
  }

  return (
    <section className="mt-10">
      <p className="eyebrow">Check your understanding</p>
      <h2 className="display mt-2 text-4xl text-[#00261d]">3 quick questions</h2>
      <p className="mt-3 leading-7 text-[#414845]">Answer before moving on — this is how you know the lesson stuck. Your best score is saved.</p>
      {bestScore !== null && !result && <p className="mt-2 text-sm font-bold text-[#1d604d]">Your best score: {bestScore}/{quiz.length}</p>}
      <div className="mt-6 grid gap-4">
        {quiz.map((question, qi) => (
          <fieldset key={qi} className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <legend className="mb-3 font-bold text-[#00261d]">{qi + 1}. {question.q}</legend>
            <div className="grid gap-2">
              {question.options.map((option, oi) => {
                const chosen = (answers[qi] ?? -1) === oi;
                const showCorrect = result && result.perQuestion[qi]?.answer === oi;
                const showWrong = result && chosen && result.perQuestion[qi]?.answer !== oi;
                return (
                  <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${showCorrect ? "border-[#1d604d] bg-[#eef5e9]" : showWrong ? "border-[#b5472e] bg-[#fdf1ee]" : chosen ? "border-[#00261d] ring-1 ring-[#00261d]" : "border-[#e2e8f0]"}`}>
                    <input type="radio" name={`q${qi}`} value={oi} checked={chosen} onChange={() => { if (result) return; const next = [...answers]; next[qi] = oi; setAnswers(next); }} className="accent-[#00261d]" disabled={!!result} />
                    <span className="flex-1">{option}</span>
                    {showCorrect && <Check size={16} className="text-[#1d604d]" />}
                    {showWrong && <X size={16} className="text-[#b5472e]" />}
                  </label>
                );
              })}
            </div>
            {result && <p className="mt-3 rounded-xl bg-[#f4f6f5] p-3 text-sm leading-6 text-[#414845]">{(result.perQuestion[qi]?.correct ? "Correct. " : "Not quite. ")}{result.perQuestion[qi]?.explanation}</p>}
          </fieldset>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        {!result ? (
          <Button size="lg" disabled={!allAnswered || submitting} onClick={submit}>{submitting ? "Checking…" : "Check my answers"}</Button>
        ) : (
          <>
            <p className="font-bold text-[#00261d]">You scored {result.score}/{result.total}</p>
            <Button variant="secondary" size="lg" onClick={() => { setAnswers(Array(quiz.length).fill(null)); setResult(null); }}><RotateCcw className="mr-2" size={16} />Try again</Button>
          </>
        )}
      </div>
    </section>
  );
}
