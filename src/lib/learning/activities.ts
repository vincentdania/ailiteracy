import { createHmac } from "node:crypto";

/**
 * Interactive lesson activities ("missions"), authored per lesson in
 * data/<course>/dayNN/activities.json and stored on Lesson.activitiesJson.
 *
 * The full definition (answers, feedback, hints) never leaves the server.
 * Pages receive a PublicMission from toPublicMission(); grading happens in
 * gradeMission() inside a server action.
 */

export type MissionOption = { text: string; feedback: string };

type MissionBase = {
  key: string;
  title: string;
  scenario?: string;
  prompt: string;
  hint: string;
  /** Shown after a second wrong attempt: a simpler way into the idea. */
  support: string;
  /** Shown once solved: why the answer is right. */
  explain: string;
};

export type ChoiceMission = MissionBase & { type: "choice"; options: MissionOption[]; correct: number };
export type MultiMission = MissionBase & { type: "multi"; options: MissionOption[]; correct: number[] };
/** items are authored in the correct order; the client receives them shuffled. */
export type OrderMission = MissionBase & { type: "order"; items: string[] };
/** Each item belongs to exactly one category (by index). */
export type SortMission = MissionBase & { type: "sort"; categories: string[]; items: { text: string; category: number; feedback: string }[] };

export type Mission = ChoiceMission | MultiMission | OrderMission | SortMission;

export type LessonActivities = {
  objectives: { understand: string; do: string; demonstrate: string; apply: string };
  discover: { title: string; scenario: string };
  keyIdeas: string[];
  device: "phone" | "computer-recommended";
  missions: Mission[];
  advanced?: Mission;
};

export type PublicMission =
  | (Omit<ChoiceMission, "correct" | "options" | "hint" | "support" | "explain"> & { options: { id: string; text: string }[] })
  | (Omit<MultiMission, "correct" | "options" | "hint" | "support" | "explain"> & { options: { id: string; text: string }[] })
  | (Omit<OrderMission, "items" | "hint" | "support" | "explain"> & { items: { id: string; text: string }[] })
  | (Omit<SortMission, "items" | "hint" | "support" | "explain"> & { items: { id: string; text: string }[] });

export type MissionAnswer = string | string[] | Record<string, number>;

export type MissionResult = {
  correct: boolean;
  /** Per-choice or per-item feedback for what the learner submitted. */
  feedback: string[];
  hint?: string;
  support?: string;
  explain?: string;
  /** After three wrong attempts the answer is shown so nobody gets stuck. */
  reveal?: string[];
};

export const ADVANCED_KEY = "advanced";

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validOptions(value: unknown): value is MissionOption[] {
  return Array.isArray(value) && value.length >= 2 && value.every((o) => isObject(o) && isString(o.text) && isString(o.feedback));
}

/** Returns a list of problems; an empty list means the mission is well formed. */
export function missionProblems(value: unknown): string[] {
  if (!isObject(value)) return ["mission is not an object"];
  const problems: string[] = [];
  for (const field of ["key", "title", "prompt", "hint", "support", "explain"]) if (!isString(value[field])) problems.push(`missing ${field}`);
  switch (value.type) {
    case "choice":
      if (!validOptions(value.options)) problems.push("choice needs 2+ options with text and feedback");
      else if (!Number.isInteger(value.correct) || (value.correct as number) < 0 || (value.correct as number) >= value.options.length) problems.push("choice.correct out of range");
      break;
    case "multi":
      if (!validOptions(value.options)) problems.push("multi needs 2+ options with text and feedback");
      else if (!Array.isArray(value.correct) || value.correct.length < 1 || !value.correct.every((i) => Number.isInteger(i) && i >= 0 && i < (value.options as unknown[]).length)) problems.push("multi.correct invalid");
      break;
    case "order":
      if (!Array.isArray(value.items) || value.items.length < 3 || !value.items.every(isString)) problems.push("order needs 3+ items");
      break;
    case "sort":
      if (!Array.isArray(value.categories) || value.categories.length < 2 || !value.categories.every(isString)) problems.push("sort needs 2+ categories");
      else if (!Array.isArray(value.items) || value.items.length < 3 || !value.items.every((i) => isObject(i) && isString(i.text) && isString(i.feedback) && Number.isInteger(i.category) && (i.category as number) >= 0 && (i.category as number) < (value.categories as unknown[]).length)) problems.push("sort items invalid");
      break;
    default:
      problems.push(`unknown type ${String(value.type)}`);
  }
  return problems;
}

export function activitiesProblems(value: unknown): string[] {
  if (!isObject(value)) return ["activities is not an object"];
  const problems: string[] = [];
  const objectives = value.objectives;
  if (!isObject(objectives) || !["understand", "do", "demonstrate", "apply"].every((k) => isString(objectives[k]))) problems.push("objectives need understand/do/demonstrate/apply");
  if (!isObject(value.discover) || !isString(value.discover.title) || !isString(value.discover.scenario)) problems.push("discover needs title and scenario");
  if (!Array.isArray(value.keyIdeas) || value.keyIdeas.length < 2 || !value.keyIdeas.every(isString)) problems.push("keyIdeas needs 2+ entries");
  if (value.device !== "phone" && value.device !== "computer-recommended") problems.push("device must be phone or computer-recommended");
  if (!Array.isArray(value.missions) || value.missions.length < 1) problems.push("at least one mission is required");
  const keys = new Set<string>();
  for (const mission of [...(Array.isArray(value.missions) ? value.missions : []), ...(value.advanced ? [value.advanced] : [])]) {
    for (const problem of missionProblems(mission)) problems.push(`${isObject(mission) ? String(mission.key) : "?"}: ${problem}`);
    if (isObject(mission) && isString(mission.key)) {
      if (keys.has(mission.key)) problems.push(`duplicate mission key ${mission.key}`);
      keys.add(mission.key);
    }
  }
  if (isObject(value.advanced) && value.advanced.key !== ADVANCED_KEY) problems.push(`advanced mission key must be "${ADVANCED_KEY}"`);
  return problems;
}

export function parseActivities(value: unknown): LessonActivities | null {
  return activitiesProblems(value).length === 0 ? (value as LessonActivities) : null;
}

export function findMission(activities: LessonActivities, key: string): Mission | undefined {
  if (key === ADVANCED_KEY) return activities.advanced;
  return activities.missions.find((mission) => mission.key === key);
}

/** Opaque, stable id for an option or item so the client cannot infer answers from ids. */
export function optionId(lessonId: string, missionKey: string, index: number, secret = process.env.AUTH_SECRET ?? "hyrax-dev") {
  return createHmac("sha256", secret).update(`${lessonId}:${missionKey}:${index}`).digest("hex").slice(0, 10);
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  let state = 0;
  for (const char of seed) state = (state * 31 + char.charCodeAt(0)) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  // A shuffle that lands back in authored order would give an ordering task away.
  if (copy.length > 1 && copy.every((item, i) => item === items[i])) copy.push(copy.shift()!);
  return copy;
}

export function toPublicMission(lessonId: string, mission: Mission): PublicMission {
  const idAt = (i: number) => optionId(lessonId, mission.key, i);
  const base = { key: mission.key, title: mission.title, scenario: mission.scenario, prompt: mission.prompt };
  switch (mission.type) {
    case "choice": {
      return { ...base, type: "choice", options: mission.options.map((o, i) => ({ id: idAt(i), text: o.text })) };
    }
    case "multi": {
      return { ...base, type: "multi", options: mission.options.map((o, i) => ({ id: idAt(i), text: o.text })) };
    }
    case "order": {
      return { ...base, type: "order", items: seededShuffle(mission.items.map((text, i) => ({ id: idAt(i), text })), `${lessonId}:${mission.key}`) };
    }
    case "sort": {
      return { ...base, type: "sort", categories: mission.categories, items: seededShuffle(mission.items.map((item, i) => ({ id: idAt(i), text: item.text })), `${lessonId}:${mission.key}`) };
    }
  }
}

/**
 * Grade one attempt. `attemptNumber` is 1 for the first try. Wrong answers
 * get a hint first, then a simpler explanation, then the answer itself.
 */
export function gradeMission(lessonId: string, mission: Mission, answer: MissionAnswer, attemptNumber: number): MissionResult {
  const idFor = (i: number) => optionId(lessonId, mission.key, i);
  let correct = false;
  let feedback: string[] = [];
  let reveal: string[] = [];

  if (mission.type === "choice") {
    const chosen = mission.options.findIndex((_, i) => idFor(i) === answer);
    correct = chosen === mission.correct;
    feedback = chosen >= 0 ? [mission.options[chosen]!.feedback] : ["Choose one option."];
    reveal = [mission.options[mission.correct]!.text];
  } else if (mission.type === "multi") {
    const picked = new Set(Array.isArray(answer) ? answer : []);
    const chosen = mission.options.map((_, i) => picked.has(idFor(i)));
    const expected = new Set(mission.correct);
    correct = chosen.every((isChosen, i) => isChosen === expected.has(i));
    // Feedback on the mistakes only, so the learner sees exactly what to rethink.
    feedback = mission.options.flatMap((option, i) => (chosen[i] !== expected.has(i) ? [option.feedback] : []));
    if (correct) feedback = mission.correct.map((i) => mission.options[i]!.feedback);
    reveal = mission.correct.map((i) => mission.options[i]!.text);
  } else if (mission.type === "order") {
    const sequence = Array.isArray(answer) ? answer : [];
    const expected = mission.items.map((_, i) => idFor(i));
    correct = sequence.length === expected.length && sequence.every((id, i) => id === expected[i]);
    const inPlace = sequence.filter((id, i) => id === expected[i]).length;
    feedback = correct ? [] : [`${inPlace} of ${expected.length} steps are in the right place.`];
    reveal = mission.items.map((item, i) => `${i + 1}. ${item}`);
  } else {
    const placed = !Array.isArray(answer) && typeof answer === "object" ? answer : {};
    const results = mission.items.map((item, i) => ({ item, ok: placed[idFor(i)] === item.category }));
    correct = results.every((r) => r.ok);
    feedback = results.filter((r) => !r.ok).map((r) => `“${r.item.text}”: ${r.item.feedback}`);
    if (correct) feedback = [];
    reveal = mission.items.map((item) => `${item.text} → ${mission.categories[item.category] ?? ""}`);
  }

  if (correct) return { correct, feedback, explain: mission.explain };
  return {
    correct,
    feedback,
    hint: mission.hint,
    support: attemptNumber >= 2 ? mission.support : undefined,
    reveal: attemptNumber >= 3 ? reveal : undefined,
  };
}

/** Quiz questions as authored in quiz.json. Answers stay on the server. */
export type QuizQuestion = { q: string; options: string[]; answer: number; explanation: string };

export function parseQuiz(value: unknown): QuizQuestion[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const ok = value.every((q) => isObject(q) && isString(q.q) && Array.isArray(q.options) && q.options.every(isString) && Number.isInteger(q.answer) && isString(q.explanation));
  return ok ? (value as QuizQuestion[]) : null;
}

/** A knowledge check is mastered at 75% or better. */
export function quizPassMark(total: number) {
  return Math.ceil(total * 0.75);
}

export function quizPassed(score: number, total: number) {
  return total > 0 && score >= quizPassMark(total);
}
