/**
 * Mastery rules for lessons and modules. Pure functions so the same rules run
 * in server actions, the certificate issuer, pages and unit tests.
 */

export const PRACTICAL_PASS = 70;

export type LessonMastery = {
  id: string;
  slug: string;
  dayNumber: number;
  title: string;
  summary: string | null;
  isBonus: boolean;
  isCapstone: boolean;
  /** Open on the learner's calendar. */
  unlocked: boolean;
  completed: boolean;
  quiz: { total: number; best: number | null; passed: boolean; attempts: number } | null;
  missions: { key: string; title: string; solved: boolean; attempts: number }[];
  advanced: { title: string; available: boolean; solved: boolean } | null;
  practical: { score: number | null; passed: boolean };
};

export type Requirement = { key: string; label: string; met: boolean; done: number; total: number };

type CompletionInput = Pick<LessonMastery, "quiz" | "missions" | "isCapstone" | "practical">;

export function lessonReadyToComplete(lesson: CompletionInput) {
  return lessonBlockers(lesson).length === 0;
}

/** What still stands between the learner and marking this lesson complete. */
export function lessonBlockers(lesson: CompletionInput) {
  const blockers: string[] = [];
  const open = lesson.missions.filter((mission) => !mission.solved).length;
  if (open) blockers.push(`Solve ${open === 1 ? "the remaining mission" : `the ${open} remaining missions`}`);
  if (lesson.quiz && !lesson.quiz.passed) blockers.push("Pass the knowledge check (75% or more)");
  // Same rule as completeLessonAction: a capstone needs a submission scoring PRACTICAL_PASS or more.
  if (lesson.isCapstone && !lesson.practical.passed) blockers.push(`Submit your capstone and score ${PRACTICAL_PASS} or more`);
  return blockers;
}

/** Advanced missions open up for learners who are clearly flying. */
export function advancedUnlocked(input: { quizPerfect: boolean; missionsFirstTry: boolean }) {
  return input.quizPerfect || input.missionsFirstTry;
}

export function moduleRequirements(lessons: LessonMastery[]): Requirement[] {
  const required = lessons.filter((lesson) => !lesson.isBonus);
  const withQuiz = required.filter((lesson) => lesson.quiz);
  const missions = required.flatMap((lesson) => lesson.missions);
  const requirements: Requirement[] = [
    { key: "lessons", label: `Complete all ${required.length} lessons`, met: required.every((l) => l.completed), done: required.filter((l) => l.completed).length, total: required.length },
  ];
  if (withQuiz.length) requirements.push({ key: "checks", label: "Pass every knowledge check (75% or more)", met: withQuiz.every((l) => l.quiz!.passed), done: withQuiz.filter((l) => l.quiz!.passed).length, total: withQuiz.length });
  if (missions.length) requirements.push({ key: "missions", label: "Solve every mission", met: missions.every((m) => m.solved), done: missions.filter((m) => m.solved).length, total: missions.length });
  const practicals = required.filter((l) => l.practical.passed).length;
  requirements.push({ key: "practical", label: `Pass at least one practical task (${PRACTICAL_PASS} or more)`, met: practicals >= 1, done: Math.min(practicals, 1), total: 1 });
  return requirements;
}

export function moduleEligible(lessons: LessonMastery[]) {
  return lessons.some((lesson) => !lesson.isBonus) && moduleRequirements(lessons).every((requirement) => requirement.met);
}

export function moduleProgress(lessons: LessonMastery[]) {
  const requirements = moduleRequirements(lessons);
  const done = requirements.reduce((sum, r) => sum + r.done, 0);
  const total = requirements.reduce((sum, r) => sum + r.total, 0);
  return total ? Math.round((done / total) * 100) : 0;
}

/** The single most useful next step, used by the dashboard's Continue button. */
export function nextActivity(modules: { title: string; lessons: LessonMastery[] }[]) {
  for (const courseModule of modules) {
    for (const lesson of courseModule.lessons.filter((l) => !l.isBonus)) {
      if (!lesson.unlocked) return { lesson, moduleTitle: courseModule.title, reason: "next" as const, label: "Your next lesson opens soon" };
      if (!lesson.completed) {
        const started = lesson.missions.some((m) => m.attempts > 0) || (lesson.quiz?.attempts ?? 0) > 0;
        return { lesson, moduleTitle: courseModule.title, reason: started ? ("resume" as const) : ("start" as const), label: started ? "Pick up where you left off" : "Start your next lesson" };
      }
      const openMission = lesson.missions.find((m) => !m.solved);
      if (openMission) return { lesson, moduleTitle: courseModule.title, reason: "mission" as const, label: `Mission to finish: ${openMission.title}` };
      if (lesson.quiz && !lesson.quiz.passed) return { lesson, moduleTitle: courseModule.title, reason: "check" as const, label: "Retake the knowledge check to pass it" };
    }
    if (!courseModule.lessons.some((l) => l.practical.passed)) {
      const lesson = [...courseModule.lessons].reverse().find((l) => l.completed && !l.isBonus);
      if (lesson && courseModule.lessons.filter((l) => !l.isBonus).every((l) => l.completed)) return { lesson, moduleTitle: courseModule.title, reason: "practical" as const, label: "Pass one practical task to earn this module’s certificate" };
    }
  }
  return null;
}
