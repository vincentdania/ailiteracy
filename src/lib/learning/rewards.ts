/**
 * XP, levels and badges. Pure rules, shared by server awarding and the UI.
 *
 * XP is earned only for demonstrated learning (a mastered check, a solved
 * mission, assessed practical work, a completed module). Every award has a
 * unique source key, so repeating an activity can improve a score but never
 * farms points.
 */

export const XP = {
  lessonComplete: 20,
  quizPassed: 30,
  quizPerfect: 20,
  missionFirstTry: 40,
  missionSecondTry: 30,
  missionLater: 20,
  advancedMission: 60,
  practicalPassed: 50,
  capstonePassed: 150,
  moduleMastered: 200,
  courseComplete: 500,
} as const;

export function missionXp(attempts: number, advanced: boolean) {
  if (advanced) return XP.advancedMission;
  if (attempts <= 1) return XP.missionFirstTry;
  if (attempts === 2) return XP.missionSecondTry;
  return XP.missionLater;
}

export const LEVELS = [
  { level: 1, title: "Curious", xp: 0 },
  { level: 2, title: "Explorer", xp: 150 },
  { level: 3, title: "Apprentice", xp: 400 },
  { level: 4, title: "Practitioner", xp: 800 },
  { level: 5, title: "Builder", xp: 1400 },
  { level: 6, title: "Specialist", xp: 2200 },
  { level: 7, title: "Enabler", xp: 3200 },
  { level: 8, title: "Pioneer", xp: 4500 },
] as const;

export function levelFor(xp: number) {
  let index = 0;
  LEVELS.forEach((level, i) => { if (xp >= level.xp) index = i; });
  const current = LEVELS[index] ?? LEVELS[0];
  const next = LEVELS[index + 1] ?? null;
  const span = next ? next.xp - current.xp : 1;
  const into = xp - current.xp;
  return {
    level: current.level,
    title: current.title,
    xp,
    nextLevelXp: next?.xp ?? null,
    nextTitle: next?.title ?? null,
    progress: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
    toNext: next ? next.xp - xp : 0,
  };
}

export type BadgeStats = {
  lessonsCompleted: number;
  missionsSolved: number;
  missionsSolvedAfterRetry: number;
  advancedSolved: number;
  perfectChecks: number;
  practicalsPassed: number;
  modulesMastered: number;
  coursesCompleted: number;
  /** Mission keys solved, as "<lessonSlug>:<missionKey>". */
  solvedMissionRefs: string[];
  /** Module certificates held, as "<courseSlug>:<moduleOrder>". */
  masteredModuleRefs: string[];
};

export type BadgeDefinition = {
  key: string;
  title: string;
  description: string;
  /** What to do to earn it, shown while it is still locked. */
  how: string;
  icon: "spark" | "target" | "compass" | "shield" | "trophy" | "rocket" | "book" | "medal" | "refresh" | "layers" | "bolt" | "flag";
  tier: "bronze" | "silver" | "gold";
  /** Limit to one course, by slug. */
  course?: string;
  earned: (stats: BadgeStats) => boolean;
};

export const BADGES: BadgeDefinition[] = [
  { key: "first-lesson", title: "First Lesson Completed", description: "You finished your first lesson and proved it with a mastered check.", how: "Complete any lesson.", icon: "flag", tier: "bronze", earned: (s) => s.lessonsCompleted >= 1 },
  { key: "first-mission", title: "First Mission Solved", description: "You solved your first hands-on mission.", how: "Solve any mission inside a lesson.", icon: "target", tier: "bronze", earned: (s) => s.missionsSolved >= 1 },
  { key: "comeback", title: "Learns From Mistakes", description: "You got a mission wrong, used the feedback and solved it.", how: "Solve a mission after an incorrect attempt.", icon: "refresh", tier: "bronze", earned: (s) => s.missionsSolvedAfterRetry >= 1 },
  { key: "first-practical", title: "First Practical Challenge", description: "Your first piece of real work passed the practical rubric.", how: "Submit practical work that scores 70 or more.", icon: "bolt", tier: "bronze", earned: (s) => s.practicalsPassed >= 1 },
  { key: "flawless", title: "Flawless Check", description: "You scored full marks on a knowledge check.", how: "Get every question right in one knowledge check.", icon: "spark", tier: "silver", earned: (s) => s.perfectChecks >= 1 },
  { key: "problem-solver", title: "Problem Solver", description: "Ten missions solved. You are applying ideas, not just reading them.", how: "Solve 10 missions.", icon: "compass", tier: "silver", earned: (s) => s.missionsSolved >= 10 },
  { key: "deep-diver", title: "Deep Diver", description: "You took on an optional advanced mission and solved it.", how: "Solve an advanced mission. They unlock when you ace a lesson.", icon: "layers", tier: "silver", earned: (s) => s.advancedSolved >= 1 },
  { key: "module-master", title: "Module Master", description: "You earned your first module certificate.", how: "Meet every requirement in one module.", icon: "medal", tier: "gold", earned: (s) => s.modulesMastered >= 1 },
  { key: "course-champion", title: "Course Champion", description: "You completed a whole course, capstone included.", how: "Complete every lesson in a course.", icon: "trophy", tier: "gold", earned: (s) => s.coursesCompleted >= 1 },
  // AI for Your Work, matched to what each part of the course teaches.
  { key: "fact-checker", title: "Fact Checker", description: "You caught an AI answer that could not be trusted and checked it properly.", how: "Solve the verification mission in Day 2.", icon: "shield", tier: "silver", course: "ai-for-your-work", earned: (s) => s.solvedMissionRefs.includes("tracka-02:verify") },
  { key: "ai-foundations", title: "AI Foundations Mastered", description: "Reports, prompts, documents, messages and numbers: AI is working on your job.", how: "Earn the Week One module certificate.", icon: "book", tier: "gold", course: "ai-for-your-work", earned: (s) => s.masteredModuleRefs.includes("ai-for-your-work:1") },
  { key: "playbook-author", title: "Playbook Author", description: "Your Personal AI Playbook passed the capstone review.", how: "Earn the Playbook and Role module certificate.", icon: "medal", tier: "gold", course: "ai-for-your-work", earned: (s) => s.masteredModuleRefs.includes("ai-for-your-work:2") },
  { key: "automation-explorer", title: "Automation Explorer", description: "You built a working agent and put it on a weekly routine.", how: "Earn the Agents Week module certificate.", icon: "rocket", tier: "gold", course: "ai-for-your-work", earned: (s) => s.masteredModuleRefs.includes("ai-for-your-work:3") },
];

export function badgesFor(courseSlugs: string[]) {
  return BADGES.filter((badge) => !badge.course || courseSlugs.includes(badge.course));
}

export function earnedBadgeKeys(stats: BadgeStats, courseSlugs: string[]) {
  return badgesFor(courseSlugs).filter((badge) => badge.earned(stats)).map((badge) => badge.key);
}
