import { PrismaClient } from "@prisma/client";
import { TRACK_PRICE_NGN, TRACKS } from "../src/lib/tracks";

const prisma = new PrismaClient();

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
        if (existing) {
          await prisma.lesson.update({ where: { id: existing.id }, data: { moduleId: courseModule.id, title: lesson.title, dayNumber: -dayNumber } });
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
    console.info(`Seeded track ${track.slug} with ${dayNumber} placeholder lessons.`);
  }
}

seed().finally(async () => prisma.$disconnect());
