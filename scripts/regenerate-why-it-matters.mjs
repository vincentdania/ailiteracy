#!/usr/bin/env node
/**
 * Regenerate stored personalizedLessons.whyItMatters for existing learning plans.
 * Fixes the grammar template bug (building block for {promise} -> gerund) retroactively.
 * Run inside the app container: node /tmp/regenerate-why-it-matters.mjs
 * Idempotent. Updates ONLY whyItMatters; leaves progress, other overlay fields untouched.
 */
import { createRequire } from "node:module";
const require = createRequire("/app/package.json"); // resolve deps from the app container
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

// Fixed building-block phrases (must match src/lib/personalization/tracks.ts)
const BUILDING_BLOCK = {
  CAREER_PRODUCTIVITY: "turning recurring knowledge work into reliable, human-reviewed AI workflows",
  BUSINESS_GROWTH: "using AI to understand customers, improve service and create a practical growth engine",
  CREATIVE_CONTENT: "developing an authentic content system without surrendering taste, voice or cultural context",
  DATA_DECISIONS: "asking better questions of information, testing claims and communicating decisions clearly",
  ENTREPRENEURSHIP: "moving from a real local problem to a tested, responsible AI-enabled offer",
  EDUCATION_RESEARCH: "using AI to deepen learning and research while preserving evidence, authorship and judgement",
};

function whyItMatters(primaryGoal, lessonTitle, track) {
  const title = lessonTitle.toLowerCase().replace(/\bai\b/g, "AI");
  return `For your goal—${primaryGoal}—${title} is a building block for ${BUILDING_BLOCK[track]}`;
}

async function main() {
  const plans = await db.learningPlan.findMany({
    include: {
      user: { select: { profile: { select: { primaryGoal: true } } } },
      personalizedLessons: { include: { lesson: { select: { title: true } } } },
    },
  });

  let updated = 0;
  for (const plan of plans) {
    const goal = plan.user?.profile?.primaryGoal;
    if (!goal) continue;
    let count = 0;
    for (const pl of plan.personalizedLessons) {
      const text = whyItMatters(goal, pl.lesson.title, plan.track);
      if (pl.whyItMatters !== text) {
        await db.personalizedLesson.update({ where: { id: pl.id }, data: { whyItMatters: text } });
        count++;
      }
    }
    if (count > 0) {
      updated += count;
      console.log(`plan ${plan.id} (track ${plan.track}): updated ${count} lessons`);
    }
  }
  console.log(`\nDONE — updated ${updated} personalizedLesson rows across ${plans.length} plans`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
