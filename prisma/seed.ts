import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";
import matter from "gray-matter";
import { PATHWAYS } from "../src/lib/pathways";
import { TRACK_PRICE_NGN, TRACKS } from "../src/lib/tracks";

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(__dirname, "..", "content", "lessons");

/** A written lesson lives in content/lessons/<course>/<slug>.md, or content/lessons/shared/ when several courses use it. */
function lessonFile(trackSlug: string, lessonSlug: string) {
  for (const folder of [trackSlug, "shared"]) {
    const file = path.join(CONTENT_DIR, folder, `${lessonSlug}.md`);
    if (!existsSync(file)) continue;
    const { data, content } = matter(readFileSync(file, "utf8"));
    return {
      contentMarkdown: content.trim(),
      summary: typeof data.summary === "string" ? data.summary : null,
      quizJson: Array.isArray(data.quiz) ? (data.quiz as Prisma.InputJsonValue) : Prisma.DbNull,
    };
  }
  return null;
}

type CourseDefinition = {
  slug: string;
  title: string;
  description: string;
  priceNgn: number;
  isPublished: boolean;
  productCode: string;
  modules: readonly { title: string; lessons: readonly { slug: string; title: string }[] }[];
};

const COURSES: CourseDefinition[] = [
  ...TRACKS.map((track) => ({ slug: track.slug, title: track.title, description: track.subline, priceNgn: TRACK_PRICE_NGN, isPublished: true, productCode: track.productCode, modules: track.modules })),
  // Competence pathways stay unpublished and unpriced until a cohort is launched.
  ...PATHWAYS.map((pathway) => ({ slug: pathway.slug, title: pathway.title, description: pathway.purpose, priceNgn: 0, isPublished: false, productCode: pathway.productCode, modules: pathway.modules })),
];

async function seed() {
  for (const track of COURSES) {
    const details = {
      title: track.title,
      description: track.description,
      priceNgn: track.priceNgn,
      priceUsd: 0,
      isPublished: track.isPublished,
      paystackProductCode: track.productCode,
    };
    const course = await prisma.course.upsert({
      where: { slug: track.slug },
      // Never unpublish or reprice a course from the seed once it has been launched by hand.
      update: track.isPublished ? details : { title: details.title, description: details.description, paystackProductCode: details.paystackProductCode },
      create: { slug: track.slug, ...details },
    });
    let dayNumber = 0;
    for (const [orderIndex, definition] of track.modules.entries()) {
      const courseModule = await prisma.module.upsert({
        where: { courseId_orderIndex: { courseId: course.id, orderIndex } },
        update: { title: definition.title },
        create: { courseId: course.id, orderIndex, title: definition.title },
      });
      for (const lesson of definition.lessons) {
        dayNumber += 1;
        // Look across the whole course so a lesson keeps its content when modules are inserted or reordered.
        // Negative day numbers avoid clashing with lessons not yet moved; the final pass below makes them positive.
        const existing = await prisma.lesson.findFirst({ where: { module: { courseId: course.id }, slug: lesson.slug }, select: { id: true } });
        // Written lesson files are the source of truth; lessons without one keep whatever the database holds.
        const written = lessonFile(track.slug, lesson.slug);
        if (existing) {
          await prisma.lesson.update({ where: { id: existing.id }, data: { moduleId: courseModule.id, title: lesson.title, dayNumber: -dayNumber, ...written } });
        } else if (written) {
          await prisma.lesson.create({ data: { moduleId: courseModule.id, slug: lesson.slug, title: lesson.title, dayNumber: -dayNumber, ...written } });
        } else {
          await prisma.lesson.create({ data: {
            moduleId: courseModule.id,
            slug: lesson.slug,
            title: lesson.title,
            dayNumber: -dayNumber,
            summary: "A guided build-along lesson. Content coming soon.",
            contentMarkdown: `# ${lesson.title}\n\nLesson content and copy-and-paste templates will be added before launch.`,
            isFreePreview: false,
            isBonus: false,
          } });
        }
      }
    }
    const placed = await prisma.lesson.findMany({ where: { module: { courseId: course.id }, dayNumber: { lt: 0 } }, select: { id: true, dayNumber: true } });
    for (const lesson of placed) await prisma.lesson.update({ where: { id: lesson.id }, data: { dayNumber: -lesson.dayNumber } });
    console.info(`Seeded ${track.isPublished ? "track" : "draft course"} ${track.slug} with ${dayNumber} lessons.`);
  }
}

seed().finally(async () => prisma.$disconnect());
