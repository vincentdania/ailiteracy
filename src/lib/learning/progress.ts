import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { isCapstoneLesson, unlockedDay } from "@/lib/challenge";
import { newCredentialId } from "@/lib/certificates";
import { ADVANCED_KEY, parseActivities, parseQuiz, quizPassed } from "./activities";
import { advancedUnlocked, moduleEligible, moduleProgress, moduleRequirements, PRACTICAL_PASS, type LessonMastery } from "./mastery";
import { BADGES, earnedBadgeKeys, levelFor, missionXp, XP, type BadgeStats } from "./rewards";

/** Everything the learner-facing pages need about one enrolment. */
export async function loadCourseState(userId: string, courseId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      user: { include: { profile: true } },
      course: { include: { modules: { orderBy: { orderIndex: "asc" }, include: { lessons: { orderBy: { dayNumber: "asc" } } } } } },
    },
  });
  if (!enrollment) return null;
  const lessonIds = enrollment.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const [quizAttempts, activityAttempts, submissions, certificates] = await Promise.all([
    db.quizAttempt.findMany({ where: { userId, lessonId: { in: lessonIds } } }),
    db.activityAttempt.findMany({ where: { userId, lessonId: { in: lessonIds } } }),
    db.projectSubmission.findMany({ where: { userId, lessonId: { in: lessonIds } }, select: { lessonId: true, score: true } }),
    db.moduleCertificate.findMany({ where: { userId, courseId }, orderBy: { moduleOrder: "asc" } }),
  ]);
  const totalLessons = enrollment.course.modules.flatMap((m) => m.lessons).filter((l) => !l.isBonus).length;
  const available = unlockedDay(enrollment.enrolledAt, new Date(), enrollment.user.profile?.timezone ?? "Africa/Lagos", enrollment.previewOverride, totalLessons);

  const modules = enrollment.course.modules.map((courseModule) => {
    const lessons: LessonMastery[] = courseModule.lessons.map((lesson) => {
      const quiz = parseQuiz(lesson.quizJson);
      const activities = parseActivities(lesson.activitiesJson);
      const attempt = quizAttempts.find((a) => a.lessonId === lesson.id);
      const missionState = (key: string) => activityAttempts.find((a) => a.lessonId === lesson.id && a.activityKey === key);
      const missions = (activities?.missions ?? []).map((mission) => {
        const state = missionState(mission.key);
        return { key: mission.key, title: mission.title, solved: !!state?.solved, attempts: state?.attempts ?? 0 };
      });
      const quizPerfect = !!attempt && attempt.score === attempt.total;
      const advancedState = missionState(ADVANCED_KEY);
      const submission = submissions.find((s) => s.lessonId === lesson.id);
      return {
        id: lesson.id,
        slug: lesson.slug,
        dayNumber: lesson.dayNumber,
        title: lesson.title,
        summary: lesson.summary,
        isBonus: lesson.isBonus,
        isCapstone: isCapstoneLesson(lesson),
        unlocked: lesson.isBonus ? enrollment.bonusUnlocked : lesson.dayNumber <= available,
        completed: enrollment.completedDays.includes(lesson.dayNumber),
        quiz: quiz ? { total: quiz.length, best: attempt?.score ?? null, passed: !!attempt && quizPassed(attempt.score, quiz.length), attempts: attempt?.attemptCount ?? 0 } : null,
        missions,
        advanced: activities?.advanced
          ? { title: activities.advanced.title, solved: !!advancedState?.solved, available: !!advancedState || advancedUnlocked({ quizPerfect, missionsFirstTry: missions.length > 0 && missions.every((m) => m.solved && m.attempts === 1) }) }
          : null,
        practical: { score: submission?.score ?? null, passed: (submission?.score ?? 0) >= PRACTICAL_PASS },
      };
    });
    const certificate = certificates.find((c) => c.moduleId === courseModule.id) ?? null;
    return { id: courseModule.id, title: courseModule.title, orderIndex: courseModule.orderIndex, lessons, requirements: moduleRequirements(lessons), eligible: moduleEligible(lessons), progress: moduleProgress(lessons), certificate };
  });

  return { enrollment, course: enrollment.course, modules, available, totalLessons };
}

export type CourseState = NonNullable<Awaited<ReturnType<typeof loadCourseState>>>;

export type Celebration = {
  xpGained: number;
  totalXp: number;
  levelUp: { level: number; title: string } | null;
  badges: { key: string; title: string; description: string; tier: string }[];
  certificates: { credentialId: string; moduleTitle: string; courseTitle: string }[];
  events: { label: string; xp: number }[];
};

type Award = { sourceKey: string; kind: string; label: string; xp: number; courseId: string; lessonId?: string };

function awardsFor(state: CourseState): Award[] {
  const courseId = state.course.id;
  const awards: Award[] = [];
  for (const courseModule of state.modules) {
    for (const lesson of courseModule.lessons) {
      const name = lesson.isBonus ? lesson.title : `Day ${lesson.dayNumber}`;
      if (lesson.completed) awards.push({ sourceKey: `lesson:${lesson.id}:complete`, kind: "lesson", label: `Completed ${name}`, xp: XP.lessonComplete, courseId, lessonId: lesson.id });
      if (lesson.quiz?.passed) awards.push({ sourceKey: `quiz:${lesson.id}:pass`, kind: "quiz", label: `Mastered the ${name} knowledge check`, xp: XP.quizPassed, courseId, lessonId: lesson.id });
      if (lesson.quiz && lesson.quiz.best === lesson.quiz.total) awards.push({ sourceKey: `quiz:${lesson.id}:perfect`, kind: "quiz", label: `Full marks on the ${name} check`, xp: XP.quizPerfect, courseId, lessonId: lesson.id });
      for (const mission of lesson.missions) if (mission.solved) awards.push({ sourceKey: `mission:${lesson.id}:${mission.key}`, kind: "mission", label: `Solved “${mission.title}”`, xp: missionXp(mission.attempts, false), courseId, lessonId: lesson.id });
      if (lesson.advanced?.solved) awards.push({ sourceKey: `mission:${lesson.id}:${ADVANCED_KEY}`, kind: "advanced", label: `Advanced mission: “${lesson.advanced.title}”`, xp: XP.advancedMission, courseId, lessonId: lesson.id });
      if (lesson.practical.passed) awards.push({ sourceKey: `practical:${lesson.id}`, kind: "practical", label: lesson.isCapstone ? `Capstone passed (${name})` : `Practical challenge passed (${name})`, xp: lesson.isCapstone ? XP.capstonePassed : XP.practicalPassed, courseId, lessonId: lesson.id });
    }
    if (courseModule.certificate) awards.push({ sourceKey: `module:${courseModule.id}`, kind: "module", label: `Module mastered: ${courseModule.title}`, xp: XP.moduleMastered, courseId });
  }
  if (state.enrollment.status === "COMPLETED") awards.push({ sourceKey: `course:${courseId}`, kind: "course", label: `Course complete: ${state.course.title}`, xp: XP.courseComplete, courseId });
  return awards;
}

function statsFor(states: CourseState[]): BadgeStats {
  const lessons = states.flatMap((s) => s.modules.flatMap((m) => m.lessons));
  const missions = lessons.flatMap((l) => l.missions.map((m) => ({ ...m, slug: l.slug })));
  return {
    lessonsCompleted: lessons.filter((l) => l.completed).length,
    missionsSolved: missions.filter((m) => m.solved).length + lessons.filter((l) => l.advanced?.solved).length,
    missionsSolvedAfterRetry: missions.filter((m) => m.solved && m.attempts > 1).length,
    advancedSolved: lessons.filter((l) => l.advanced?.solved).length,
    perfectChecks: lessons.filter((l) => l.quiz && l.quiz.best === l.quiz.total).length,
    practicalsPassed: lessons.filter((l) => l.practical.passed).length,
    modulesMastered: states.flatMap((s) => s.modules).filter((m) => m.certificate).length,
    coursesCompleted: states.filter((s) => s.enrollment.status === "COMPLETED").length,
    solvedMissionRefs: missions.filter((m) => m.solved).map((m) => `${m.slug}:${m.key}`),
    masteredModuleRefs: states.flatMap((s) => s.modules.filter((m) => m.certificate).map((m) => `${s.course.slug}:${m.orderIndex}`)),
  };
}

async function issueModuleCertificates(userId: string, state: CourseState) {
  const issued: Celebration["certificates"] = [];
  const learnerName = state.enrollment.user.name?.trim();
  if (!learnerName) return issued;
  for (const courseModule of state.modules) {
    if (courseModule.certificate || !courseModule.eligible) continue;
    const lessons = courseModule.lessons.filter((l) => !l.isBonus);
    const checks = lessons.filter((l) => l.quiz);
    const evidence = {
      lessons: lessons.map((l) => ({ day: l.dayNumber, title: l.title })),
      knowledgeCheckAverage: checks.length ? Math.round((checks.reduce((sum, l) => sum + (l.quiz!.best ?? 0) / l.quiz!.total, 0) / checks.length) * 100) : null,
      missionsSolved: lessons.reduce((sum, l) => sum + l.missions.length, 0),
      practicalBest: Math.max(...lessons.map((l) => l.practical.score ?? 0)),
      rules: "rules-v1",
    };
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const certificate = await db.moduleCertificate.create({
          data: { credentialId: newCredentialId(), userId, moduleId: courseModule.id, courseId: state.course.id, learnerName, courseTitle: state.course.title, moduleTitle: courseModule.title, moduleOrder: courseModule.orderIndex, evidence },
        });
        courseModule.certificate = certificate;
        issued.push({ credentialId: certificate.credentialId, moduleTitle: certificate.moduleTitle, courseTitle: certificate.courseTitle });
        break;
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
        // Issued concurrently by another request: nothing to celebrate twice.
        const existing = await db.moduleCertificate.findUnique({ where: { userId_moduleId: { userId, moduleId: courseModule.id } } });
        if (existing) {
          courseModule.certificate = existing;
          break;
        }
        // Otherwise the random credential id collided: try a fresh one.
      }
    }
  }
  return issued;
}

/**
 * Bring XP, badges and module certificates in line with what the learner has
 * actually demonstrated. Safe to call repeatedly: every award is idempotent.
 * Also backfills rewards for progress made before gamification existed.
 */
export async function syncAchievements(userId: string): Promise<Celebration> {
  const enrollments = await db.enrollment.findMany({ where: { userId, status: { in: ["ACTIVE", "COMPLETED"] } }, select: { courseId: true } });
  const states = (await Promise.all(enrollments.map((e) => loadCourseState(userId, e.courseId)))).filter((s): s is CourseState => !!s);
  const [existingEvents, existingBadges] = await Promise.all([
    db.xpEvent.findMany({ where: { userId }, select: { sourceKey: true, xp: true } }),
    db.userBadge.findMany({ where: { userId }, select: { badgeKey: true } }),
  ]);
  const xpBefore = existingEvents.reduce((sum, e) => sum + e.xp, 0);

  const certificates = (await Promise.all(states.map((state) => issueModuleCertificates(userId, state)))).flat();

  const known = new Set(existingEvents.map((e) => e.sourceKey));
  const fresh = states.flatMap(awardsFor).filter((award) => !known.has(award.sourceKey));
  if (fresh.length) await db.xpEvent.createMany({ data: fresh.map((award) => ({ userId, ...award })), skipDuplicates: true });

  const courseSlugs = states.map((s) => s.course.slug);
  const owned = new Set(existingBadges.map((b) => b.badgeKey));
  const newBadgeKeys = earnedBadgeKeys(statsFor(states), courseSlugs).filter((key) => !owned.has(key));
  if (newBadgeKeys.length) await db.userBadge.createMany({ data: newBadgeKeys.map((badgeKey) => ({ userId, badgeKey, courseId: states.find((s) => BADGES.find((b) => b.key === badgeKey)?.course === s.course.slug)?.course.id })), skipDuplicates: true });

  const xpGained = fresh.reduce((sum, award) => sum + award.xp, 0);
  const before = levelFor(xpBefore);
  const after = levelFor(xpBefore + xpGained);
  return {
    xpGained,
    totalXp: after.xp,
    levelUp: after.level > before.level ? { level: after.level, title: after.title } : null,
    badges: newBadgeKeys.map((key) => BADGES.find((b) => b.key === key)!).map(({ key, title, description, tier }) => ({ key, title, description, tier })),
    certificates,
    events: fresh.map(({ label, xp }) => ({ label, xp })),
  };
}

export async function learnerRewards(userId: string) {
  const [xp, badges, events] = await Promise.all([
    db.xpEvent.aggregate({ where: { userId }, _sum: { xp: true } }),
    db.userBadge.findMany({ where: { userId }, orderBy: { awardedAt: "asc" } }),
    db.xpEvent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  const total = xp._sum.xp ?? 0;
  return { xp: total, level: levelFor(total), badges, events };
}
