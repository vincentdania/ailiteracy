export type QuizQuestion = { question: string; options: string[]; answer: number; explanation?: string };

/** Keeps only well-formed questions from a lesson's quizJson. */
export function parseQuiz(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is QuizQuestion =>
    typeof item?.question === "string" && Array.isArray(item.options) && item.options.every((option: unknown) => typeof option === "string") && Number.isInteger(item.answer));
}
