import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

/**
 * ARCHITECTURE NOTE (2026-08-28):
 * ailiteracy.ng now ships ONE flagship course: "Build Your Personal AI Agent and Make AI Work for You"
 * (`hermes-agent-masterclass`). The former "21-Day AI Challenge"
 * (`21-day-ai-challenge`) has been RETIRED. Seeding this file:
 *   - hard-deletes the legacy 21-day course and ALL of its data (modules/lessons,
 *     enrollments, learning plans, certificates, progress, submissions)
 *   - provisions the Hermes Agent Masterclass as the sole course
 * Running this on a fresh DB simply provisions the Hermes course; on an existing
 * DB it migrates the product from the 21-day course to the agent course.
 */

const MANIFEST_PATH = path.join(process.cwd(), "data", "hermes_agent_course", "manifest.json");
const TRACK_A_MANIFEST_PATH = path.join(process.cwd(), "data", "track_a_course", "manifest.json");
const LEGACY_SLUG = "21-day-ai-challenge";

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

async function readLesson(day: number, opts: { dir: string; heroPrefix: string; freePreviewDay?: number; slugPrefix?: string } = { dir: "hermes_agent_course", heroPrefix: "hermes-", freePreviewDay: 1, slugPrefix: "hermes-" }) {
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
  return {
    dayNumber: day,
    title: parsed.title ?? titleFromMarkdown(parsed.content, day),
    slug: `${opts.slugPrefix ?? "hermes-"}${String(day).padStart(2, "0")}`,
    summary: parsed.subtitle ?? `A focused, practical skill for lesson ${day}.`,
    contentMarkdown: parsed.content.trim(),
    heroImage: `/lessons/${opts.heroPrefix}day${String(day).padStart(2, "0")}_hero.png`,
    quizJson,
    isFreePreview: day === (opts.freePreviewDay ?? 0),
    isBonus: false,
  };
}

async function deleteLegacyTwentyDayCourse() {
  const legacy = await prisma.course.findUnique({ where: { slug: LEGACY_SLUG } });
  if (!legacy) {
    console.info("No legacy 21-day course to remove (already clean).");
    return;
  }
  // Transaction.courseId is onDelete.Restrict: clear it before deleting the course.
  await prisma.transaction.deleteMany({ where: { courseId: legacy.id } });
  // Course deletion cascades to modules/lessons, enrollments, learning plans,
  // personalized lessons, lesson progress, quiz attempts, submissions, certificates.
  await prisma.course.delete({ where: { id: legacy.id } });
  console.info(`Removed legacy course "${LEGACY_SLUG}" and all its data (${legacy.id}).`);
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

async function seedHermesCourse() {
  return seedCourseFromManifest(MANIFEST_PATH, { dir: "hermes_agent_course", heroPrefix: "hermes-", slugPrefix: "hermes-", freePreviewDay: 1 });
}


// Explicitly opt-in retirement of the technical Hermes Masterclass.
// Destructive on prod data (cascades enrollments/progress), so it only runs
// when RETIRE_HERMES_COURSE=1 is set in the deploy environment.
async function retireHermesMasterclass() {
  if (process.env.RETIRE_HERMES_COURSE !== "1") {
    console.info("RETIRE_HERMES_COURSE not set — Hermes Agent Masterclass left in place.");
    return;
  }
  const hermes = await prisma.course.findUnique({ where: { slug: "hermes-agent-masterclass" } });
  if (!hermes) return;
  await prisma.transaction.deleteMany({ where: { courseId: hermes.id } }); // Restrict FK first
  await prisma.course.delete({ where: { id: hermes.id } }); // cascades the rest
  console.info("Retired Hermes Agent Masterclass course and its data.");
}

async function seedTrackACourse() {
  return seedCourseFromManifest(TRACK_A_MANIFEST_PATH, { dir: "track_a_course", heroPrefix: "tracka-", slugPrefix: "tracka-", freePreviewDay: 1 });
}

async function seed() {
  // 1) Retire the old 21-day course and its data.
  await deleteLegacyTwentyDayCourse();

  // 1b) Optional, opt-in retirement of the old technical course.
  await retireHermesMasterclass();

  // 2) Provision the Hermes Agent Masterclass as the flagship.
  const course = await seedHermesCourse();

  // 2b) Provision Track A ("AI for Your Work") as a second, published course.
  // Flagship pointer (onboarding/enrollment/checkout hardcoded slug) is NOT
  // repointed here — that swap is gated on Vincent's approval (course-hard-swap.md).
  await seedTrackACourse();

  const seedPassword = process.env.SEED_PASSWORD ?? "ChangeMe123!";
  if (seedPassword.length < 12) throw new Error("SEED_PASSWORD must be at least 12 characters");
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ailiteracy.local" },
    update: { passwordHash },
    create: {
      name: "AI Literacy Admin",
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
    create: { userId: learner.id, courseId: course.id },
  });
  await prisma.streak.upsert({ where: { userId: learner.id }, update: {}, create: { userId: learner.id } });
  console.info(`Seeded ${course.title}; admin=${admin.email}; learner=${learner.email}`);
}

seed().finally(async () => prisma.$disconnect());
