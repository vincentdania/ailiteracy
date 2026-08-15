import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

const moduleDefinitions = [
  { orderIndex: 1, title: "AI Foundations", days: [1, 2, 3, 4] },
  { orderIndex: 2, title: "Prompting for Real Work", days: [5, 6, 7, 8] },
  { orderIndex: 3, title: "Documents, Decisions & Data", days: [9, 10, 11, 12] },
  { orderIndex: 4, title: "Creative and Responsible AI", days: [13, 14, 15, 16] },
  { orderIndex: 5, title: "Your AI Operating System", days: [17, 18, 19, 20] },
  { orderIndex: 6, title: "Build Your Personal AI Agent with Open-Source Tools", days: [21] },
];

function titleFromMarkdown(content: string, day: number) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return heading?.replace(/^Day\s+\d+\s+[—-]\s+/, "") ?? `Day ${day}`;
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

async function readLesson(day: number) {
  const file = path.join(process.cwd(), "data", "21day_challenge", `day${String(day).padStart(2, "0")}`, "lesson.md");
  const raw = await readFile(file, "utf8");
  const parsed = parseLessonMarkdown(raw);
  return {
    dayNumber: day,
    title: parsed.title ?? titleFromMarkdown(parsed.content, day),
    slug: `day-${String(day).padStart(2, "0")}`,
    summary: parsed.subtitle ?? `A focused, practical AI skill for day ${day}.`,
    contentMarkdown: parsed.content.trim(),
    heroImage: `/lessons/day${String(day).padStart(2, "0")}_hero.png`,
    isFreePreview: day === 1,
    isBonus: false,
  };
}

async function seed() {
  const course = await prisma.course.upsert({
    where: { slug: "21-day-ai-challenge" },
    update: { title: "Personalized AI Certificate Program", description: "Master practical AI fundamentals through a learning path built around your role, outcome and context.", isPublished: true, priceNgn: 20_000, priceUsd: 39 },
    create: {
      slug: "21-day-ai-challenge",
      title: "Personalized AI Certificate Program",
      description: "Master practical AI fundamentals through a learning path built around your role, outcome and context.",
      priceNgn: 20_000,
      priceUsd: 39,
      isPublished: true,
    },
  });

  for (const definition of moduleDefinitions) {
    const courseModule = await prisma.module.upsert({
      where: { courseId_orderIndex: { courseId: course.id, orderIndex: definition.orderIndex } },
      update: { title: definition.title },
      create: { courseId: course.id, title: definition.title, orderIndex: definition.orderIndex },
    });
    for (const day of definition.days) {
      const lesson = await readLesson(day);
      const existingLesson = await prisma.lesson.findFirst({ where: { slug: lesson.slug, module: { courseId: course.id } } });
      if (existingLesson) {
        await prisma.lesson.update({ where: { id: existingLesson.id }, data: { moduleId: courseModule.id, ...lesson } });
      } else {
        await prisma.lesson.create({ data: { moduleId: courseModule.id, ...lesson } });
      }
    }
  }

  const bonusModule = await prisma.module.upsert({
    where: { courseId_orderIndex: { courseId: course.id, orderIndex: 7 } },
    update: { title: "Referral Bonus Lab" },
    create: { courseId: course.id, title: "Referral Bonus Lab", orderIndex: 7 },
  });
  const bonusRaw = await readFile(path.join(process.cwd(), "data/21day_challenge/bonus/lesson.md"), "utf8");
  const bonus = parseLessonMarkdown(bonusRaw);
  const existingBonus = await prisma.lesson.findFirst({ where: { slug: "bonus-ai-operating-system", module: { courseId: course.id } } });
  if (existingBonus && existingBonus.moduleId !== bonusModule.id) {
    await prisma.lesson.update({ where: { id: existingBonus.id }, data: { moduleId: bonusModule.id } });
  }
  await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: bonusModule.id, slug: "bonus-ai-operating-system" } },
    update: { contentMarkdown: bonus.content.trim(), summary: bonus.summary ?? "Turn the challenge into a durable weekly practice." },
    create: {
      moduleId: bonusModule.id,
      dayNumber: 22,
      title: bonus.title ?? "Build Your AI Operating System",
      slug: "bonus-ai-operating-system",
      summary: bonus.summary ?? "Turn the challenge into a durable weekly practice.",
      contentMarkdown: bonus.content.trim(),
      isFreePreview: false,
      isBonus: true,
    },
  });

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
      referralCode: "ADMIN21",
      profile: {
        create: {
          profession: "Programme Director",
          industry: "Education",
          primaryGoal: "Help more professionals become AI fluent",
          onboardingDone: true,
        },
      },
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
      referralCode: "LEARN21",
      profile: {
        create: {
          profession: "Operations Manager",
          industry: "Professional Services",
          primaryGoal: "Automate repetitive knowledge work",
          onboardingDone: true,
        },
      },
    },
  });
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: learner.id, courseId: course.id } },
    update: {},
    create: { userId: learner.id, courseId: course.id },
  });
  await prisma.streak.upsert({
    where: { userId: learner.id },
    update: {},
    create: { userId: learner.id },
  });
  console.info(`Seeded ${course.title}; admin=${admin.email}; learner=${learner.email}`);
}

seed().finally(async () => prisma.$disconnect());
