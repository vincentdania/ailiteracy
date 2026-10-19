import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

/**
 * The academy ships one course: "AI for Your Work" (data/track_a_course).
 * The former "21-Day AI Challenge" (`21-day-ai-challenge`) and the
 * "Hermes Agent Masterclass" (`hermes-agent-masterclass`) are retired and no
 * longer seeded. Deleting them is opt-in per environment (see retireCourse).
 */

const TRACK_A_MANIFEST_PATH = path.join(process.cwd(), "data", "track_a_course", "manifest.json");
const RETIRED_COURSES = [
  { slug: "21-day-ai-challenge", flag: "RETIRE_LEGACY_21DAY" },
  { slug: "hermes-agent-masterclass", flag: "RETIRE_HERMES_COURSE" },
];

function titleFromMarkdown(content: string, lessonNo: number) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return heading?.replace(/^Lesson\s+\d+\s+[—-]\s+/, "") ?? `Lesson ${lessonNo}`;
}

function parseLessonMarkdown(raw: string) {
  const frontmatter = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const metadata = frontmatter?.[1] ?? "";
  const value = (key: string) => {
    const rawValue = metadata.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim();
    return rawValue?.replace(/^(["'])(.*)\1$/, "$2");
  };
  return { title: value("title"), subtitle: value("subtitle"), summary: value("summary"), content: frontmatter ? raw.slice(frontmatter[0].length).trim() : raw.trim() };
}

async function readLesson(day: number, opts: { dir: string; heroPrefix: string; freePreviewDay?: number; slugPrefix: string }) {
  const dir = path.join(process.cwd(), "data", opts.dir, `day${String(day).padStart(2, "0")}`);
  const file = path.join(dir, "lesson.md");
  const raw = await readFile(file, "utf8");
  const parsed = parseLessonMarkdown(raw);
  let quizJson: Prisma.InputJsonValue | undefined;
  try {
    quizJson = JSON.parse(await readFile(path.join(dir, "quiz.json"), "utf8")) as Prisma.InputJsonValue;
  } catch {
    quizJson = undefined;
  }
  // Optional interactive missions, objectives and briefing for the lesson player.
  let activitiesJson: Prisma.InputJsonValue | typeof Prisma.DbNull = Prisma.DbNull;
  try {
    activitiesJson = JSON.parse(await readFile(path.join(dir, "activities.json"), "utf8")) as Prisma.InputJsonValue;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  return {
    dayNumber: day,
    title: parsed.title ?? titleFromMarkdown(parsed.content, day),
    slug: `${opts.slugPrefix}${String(day).padStart(2, "0")}`,
    summary: parsed.subtitle ?? `A focused, practical skill for lesson ${day}.`,
    contentMarkdown: parsed.content.trim(),
    heroImage: `/lessons/${opts.heroPrefix}day${String(day).padStart(2, "0")}_hero.png`,
    quizJson,
    activitiesJson,
    isFreePreview: day === (opts.freePreviewDay ?? 0),
    isBonus: false,
  };
}

// Opt-in deletion of a retired course. Destructive on prod data (cascades
// enrollments, progress and certificates), so it only runs when the course's
// flag is set to 1 in the deploy environment. Default OFF.
async function retireCourse({ slug, flag }: { slug: string; flag: string }) {
  if (process.env[flag] !== "1") {
    console.info(`${flag} not set; course "${slug}" left in place if present.`);
    return;
  }
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) {
    console.info(`No "${slug}" course to remove (already clean).`);
    return;
  }
  // Transaction.courseId is onDelete.Restrict: clear it before deleting the course.
  await prisma.transaction.deleteMany({ where: { courseId: course.id } });
  // Course deletion cascades to modules/lessons, enrollments, learning plans,
  // personalized lessons, lesson progress, quiz attempts, submissions, certificates.
  await prisma.course.delete({ where: { id: course.id } });
  console.info(`Removed retired course "${slug}" and all its data (${course.id}).`);
}

async function seedCourseFromManifest(manifestPath: string, opts: { dir: string; heroPrefix: string; slugPrefix: string; freePreviewDay?: number }) {
  const manifestRaw = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(manifestRaw) as {
    slug: string;
    title: string;
    description: string;
    priceNgn: number;
    priceUsd: number;
    modules: { orderIndex: number; title: string; lessons: number[] }[];
  };

  const course = await prisma.course.upsert({
    where: { slug: manifest.slug },
    update: { title: manifest.title, description: manifest.description, priceNgn: manifest.priceNgn, priceUsd: manifest.priceUsd, isPublished: true },
    create: { slug: manifest.slug, title: manifest.title, description: manifest.description, priceNgn: manifest.priceNgn, priceUsd: manifest.priceUsd, isPublished: true },
  });

  for (const definition of manifest.modules) {
    const courseModule = await prisma.module.upsert({
      where: { courseId_orderIndex: { courseId: course.id, orderIndex: definition.orderIndex } },
      update: { title: definition.title },
      create: { courseId: course.id, title: definition.title, orderIndex: definition.orderIndex },
    });
    for (const day of definition.lessons) {
      const lesson = await readLesson(day, { dir: opts.dir, heroPrefix: opts.heroPrefix, slugPrefix: opts.slugPrefix, freePreviewDay: opts.freePreviewDay });
      const existingLesson = await prisma.lesson.findFirst({ where: { slug: lesson.slug, module: { courseId: course.id } } });
      if (existingLesson) {
        await prisma.lesson.update({ where: { id: existingLesson.id }, data: { moduleId: courseModule.id, ...lesson } });
      } else {
        await prisma.lesson.create({ data: { moduleId: courseModule.id, ...lesson } });
      }
    }
  }

  console.info(`Seeded course: ${manifest.title} (${course.id})`);
  return course;
}

async function seedTrackACourse() {
  return seedCourseFromManifest(TRACK_A_MANIFEST_PATH, { dir: "track_a_course", heroPrefix: "tracka-", slugPrefix: "tracka-", freePreviewDay: 1 });
}

async function seed() {
  for (const retired of RETIRED_COURSES) await retireCourse(retired);

  const course = await seedTrackACourse();

  // Public deployments set SEED_DEMO_ACCOUNTS=false so the shared demo logins never exist there.
  if (process.env.SEED_DEMO_ACCOUNTS === "false") {
    console.info(`Seeded ${course.title}; demo accounts skipped`);
    return;
  }

  const seedPassword = process.env.SEED_PASSWORD ?? "ChangeMe123!";
  if (seedPassword.length < 12) throw new Error("SEED_PASSWORD must be at least 12 characters");
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ailiteracy.local" },
    update: { passwordHash },
    create: {
      name: "Hyrax AI Academy Admin",
      email: "admin@ailiteracy.local",
      emailVerified: new Date(),
      passwordHash,
      role: UserRole.ADMIN,
      referralCode: "AGENT21",
      profile: { create: { profession: "Programme Director", industry: "Education", primaryGoal: "Help professionals build capable personal agents", onboardingDone: true } },
    },
  });
  const learner = await prisma.user.upsert({
    where: { email: "learner@ailiteracy.local" },
    update: { passwordHash },
    create: {
      name: "Demo Learner",
      email: "learner@ailiteracy.local",
      emailVerified: new Date(),
      passwordHash,
      referralCode: "AGENTLEARN",
      profile: { create: { profession: "Operations Manager", industry: "Professional Services", primaryGoal: "Automate repetitive knowledge work", onboardingDone: true } },
    },
  });
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: learner.id, courseId: course.id } },
    update: {},
    create: { userId: learner.id, courseId: course.id, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
  });
  await prisma.streak.upsert({ where: { userId: learner.id }, update: {}, create: { userId: learner.id } });
  console.info(`Seeded ${course.title}; admin=${admin.email}; learner=${learner.email}`);
}

seed().finally(async () => prisma.$disconnect());
