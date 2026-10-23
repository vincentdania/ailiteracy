import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";
import matter from "gray-matter";
import { TRACK_PRICE_NGN, TRACKS } from "../src/lib/tracks";

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(__dirname, "..", "content", "lessons");

/** A written lesson lives in content/lessons/<track>/<slug>.md, or content/lessons/shared/ when both tracks use it. */
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

async function seed() {
  for (const track of TRACKS) {
    const course = await prisma.course.upsert({
      where: { slug: track.slug },
      update: {
        title: track.title,
        description: track.subline,
        priceNgn: TRACK_PRICE_NGN,
        priceUsd: 0,
        isPublished: true,
        paystackProductCode: track.productCode,
      },
      create: {
        slug: track.slug,
        title: track.title,
        description: track.subline,
        priceNgn: TRACK_PRICE_NGN,
        priceUsd: 0,
        isPublished: true,
        paystackProductCode: track.productCode,
      },
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
    console.info(`Seeded track ${track.slug} with ${dayNumber} lessons.`);
  }
}

seed().finally(async () => prisma.$disconnect());
