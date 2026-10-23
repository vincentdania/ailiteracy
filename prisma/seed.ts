import { PrismaClient } from "@prisma/client";
import { TRACK_PRICE_NGN, TRACKS } from "../src/lib/tracks";

const prisma = new PrismaClient();

async function seed() {
  for (const track of TRACKS) {
    const productCode = process.env[track.slug === "small-business" ? "PAYSTACK_SMALL_BUSINESS_PRODUCT_CODE" : "PAYSTACK_PROFESSIONALS_PRODUCT_CODE"];
    const course = await prisma.course.upsert({
      where: { slug: track.slug },
      update: {
        title: track.title,
        description: track.subline,
        priceNgn: TRACK_PRICE_NGN,
        priceUsd: 0,
        isPublished: true,
        ...(productCode ? { paystackProductCode: productCode } : {}),
      },
      create: {
        slug: track.slug,
        title: track.title,
        description: track.subline,
        priceNgn: TRACK_PRICE_NGN,
        priceUsd: 0,
        isPublished: true,
        paystackProductCode: productCode,
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
        const existing = await prisma.lesson.findFirst({ where: { moduleId: courseModule.id, slug: lesson.slug }, select: { id: true } });
        if (existing) {
          await prisma.lesson.update({ where: { id: existing.id }, data: { title: lesson.title, dayNumber } });
        } else {
          await prisma.lesson.create({ data: {
            moduleId: courseModule.id,
            slug: lesson.slug,
            title: lesson.title,
            dayNumber,
            summary: "A guided build-along lesson. Content coming soon.",
            contentMarkdown: `# ${lesson.title}\n\nLesson content and copy-and-paste templates will be added before launch.`,
            isFreePreview: false,
            isBonus: false,
          } });
        }
      }
    }
    console.info(`Seeded track ${track.slug} with ${dayNumber} placeholder lessons.`);
  }
}

seed().finally(async () => prisma.$disconnect());
