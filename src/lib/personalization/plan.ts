import { createHash } from "node:crypto";
import type { GenerationSource, LearningTrack, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enhancePlanWithDeepSeek, deepSeekEnabled } from "./deepseek";
import { chooseTrack, TRACKS, type PersonalizationInput } from "./tracks";

const DAILY_OUTPUTS = [
  "an AI opportunity map for five tasks you regularly handle",
  "a plain-language explanation of how one AI tool produces an answer",
  "a risk-and-verification checklist for your work",
  "a one-page responsible-use agreement for your context",
  "a reusable prompt with role, context, task and quality criteria",
  "three improved prompt versions and notes on what changed",
  "a worked example that includes constraints and source requirements",
  "a prompt test comparing weak and strong outputs",
  "a first-draft document grounded in your own source material",
  "a concise summary with claims checked against the original",
  "a structured table or small analysis with calculations verified",
  "a decision brief separating evidence, assumptions and recommendation",
  "an original concept brief that protects your voice and audience",
  "a culturally aware visual or content brief with explicit exclusions",
  "a before-and-after editing record showing your human contribution",
  "a responsible publishing checklist covering consent, bias and disclosure",
  "a multi-step workflow with a clear human checkpoint",
  "a lightweight automation design with failure and recovery paths",
  "a personal tool stack chosen for value, privacy and connectivity",
  "a measurement plan for time saved, quality and user impact",
  "a capstone showing the problem, workflow, evidence, safeguards and result",
] as const;

function inputHash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function tailoredExample(track: LearningTrack, input: PersonalizationInput, day: number) {
  const context = input.industry ? `${input.profession} working in ${input.industry}` : input.profession;
  const examples: Record<LearningTrack, string> = {
    CAREER_PRODUCTIVITY: `Imagine a ${context} turning a recurring weekly task into a draft → verify → approve workflow, while keeping confidential details out of the model.`,
    BUSINESS_GROWTH: `Imagine a ${context} grouping real customer questions, drafting a response asset and testing it against the original customer evidence before publishing.`,
    CREATIVE_CONTENT: `Imagine a ${context} building a brief rooted in a specific Nigerian or African audience, then using AI for options while retaining final voice and taste.`,
    DATA_DECISIONS: `Imagine a ${context} asking AI to structure evidence, recomputing every important number and clearly labelling assumptions before recommending an action.`,
    ENTREPRENEURSHIP: `Imagine a ${context} testing a painful customer problem with a small AI-assisted service before investing in a full product.`,
    EDUCATION_RESEARCH: `Imagine a ${context} using AI to generate questions or organise sources, then checking every citation and explaining the learning in their own words.`,
  };
  return `${examples[track]} On Day ${day}, the evidence of learning is the artefact—not time spent watching content.`;
}

function lessonOverlay(track: LearningTrack, input: PersonalizationInput, lesson: { id: string; dayNumber: number; title: string }, caseStudySlugs: string[]) {
  const definition = TRACKS[track];
  const caseStudyDays = [3, 8, 14, 18];
  const caseIndex = caseStudyDays.indexOf(lesson.dayNumber);
  return {
    lessonId: lesson.id,
    whyItMatters: `For your goal—${input.primaryGoal}—${lesson.title.toLowerCase().replace(/\bai\b/g, "AI")} is a building block for ${definition.buildingBlock}`,
    tailoredExample: tailoredExample(track, input, lesson.dayNumber),
    practiceBrief: `Using a real but non-sensitive situation from your work or life, create ${DAILY_OUTPUTS[Math.min(lesson.dayNumber - 1, DAILY_OUTPUTS.length - 1)]}. You have about ${Math.max(15, Math.round(input.weeklyMinutes / 7))} minutes. Save the prompt, the result and the changes you made.`,
    successCriteria: [
      "The output addresses a real need connected to your stated goal.",
      "Important facts, calculations or sources are checked independently.",
      "Your final version shows a clear human decision or improvement.",
    ],
    caseStudySlug: caseIndex >= 0 ? caseStudySlugs[caseIndex % caseStudySlugs.length] : null,
    inputHash: inputHash({ track, input, lesson: lesson.dayNumber, version: "overlay-v1" }),
  };
}

function estimatedCost(promptTokens?: number, completionTokens?: number) {
  if (promptTokens == null && completionTokens == null) return undefined;
  return ((promptTokens ?? 0) * 0.14 + (completionTokens ?? 0) * 0.28) / 1_000_000;
}

export async function createOrRefreshLearningPlan(userId: string, courseId: string, input: PersonalizationInput) {
  const track = chooseTrack(input);
  const definition = TRACKS[track];
  let source: GenerationSource = "CURATED";
  let model: string | undefined;
  let title = definition.label;
  let outcomeSummary = `${definition.promise} By Day 21, you will have a portfolio-ready project tied to this outcome: ${input.primaryGoal}`;
  let milestones = definition.milestones;

  if (deepSeekEnabled()) {
    try {
      const enhancement = await enhancePlanWithDeepSeek(input, definition.label);
      title = enhancement.title;
      outcomeSummary = enhancement.outcomeSummary;
      milestones = definition.milestones.map((milestone, index) => ({ ...milestone, outcome: enhancement.milestoneOutcomes[index] ?? milestone.outcome }));
      source = "DEEPSEEK";
      model = enhancement.model;
      await db.aiUsageEvent.create({ data: { userId, operation: "CREATE_PLAN", model, inputTokens: enhancement.usage?.promptTokens, outputTokens: enhancement.usage?.completionTokens, estimatedCostUsd: estimatedCost(enhancement.usage?.promptTokens, enhancement.usage?.completionTokens), latencyMs: enhancement.latencyMs, status: "SUCCESS" } });
    } catch (error) {
      await db.aiUsageEvent.create({ data: { userId, operation: "CREATE_PLAN", model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash", status: "FAILED", errorCode: error instanceof Error ? error.message.slice(0, 120) : "unknown_error" } });
    }
  }

  const lessons = await db.lesson.findMany({ where: { module: { courseId }, isBonus: false }, select: { id: true, dayNumber: true, title: true }, orderBy: { dayNumber: "asc" } });
  return db.$transaction(async (transaction) => {
    const plan = await transaction.learningPlan.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { track, title, outcomeSummary, milestones: milestones as unknown as Prisma.InputJsonValue, recommendedTools: input.preferredTools.length ? input.preferredTools : definition.tools, caseStudySlugs: definition.caseStudies, source, model },
      create: { userId, courseId, track, title, outcomeSummary, milestones: milestones as unknown as Prisma.InputJsonValue, recommendedTools: input.preferredTools.length ? input.preferredTools : definition.tools, caseStudySlugs: definition.caseStudies, source, model },
    });
    for (const lesson of lessons) {
      const overlay = lessonOverlay(track, input, lesson, definition.caseStudies);
      await transaction.personalizedLesson.upsert({
        where: { learningPlanId_lessonId: { learningPlanId: plan.id, lessonId: lesson.id } },
        update: { ...overlay, source, model },
        create: { learningPlanId: plan.id, ...overlay, source, model },
      });
    }
    await transaction.userProfile.update({ where: { userId }, data: { learningTrack: track } });
    return plan;
  });
}
