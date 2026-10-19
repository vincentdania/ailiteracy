import { createHash } from "node:crypto";
import type { GenerationSource, LearningTrack, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enhancePlanWithDeepSeek, deepSeekEnabled } from "./deepseek";
import { chooseTrack, TRACKS, type PersonalizationInput } from "./tracks";

const DAILY_OUTPUTS = [
  "a finished, formatted report made from your own rough notes",
  "one R-C-F prompt and the 4-question check applied to its answer",
  "your job's most common document, plus a template made from an old example",
  "this week's emails or customer messages, drafted and checked in one sitting",
  "a summary of a long document and a spreadsheet built by describing what you need",
  "the output for your Day 6 track: a job application, a programme report or teaching material",
  "your Personal AI Playbook with every prompt tested and organised",
  "a plain-language map of the four parts of the agent you will build",
  "a working agent for one recurring job, with instructions, memory, tools and a trigger",
  "a weekly routine for your agent and one genuine output shown to someone who needs it",
] as const;

function inputHash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function tailoredExample(track: LearningTrack, input: PersonalizationInput, day: number) {
  const context = input.industry ? `${input.profession}, ${input.industry}` : input.profession;
  const examples: Record<LearningTrack, string> = {
    CAREER_PRODUCTIVITY: `Example (${context}): turn a task you do every week into three steps (AI drafts, you check, you approve) and keep confidential details out of the AI tool.`,
    BUSINESS_GROWTH: `Example (${context}): group real customer questions, draft one standard reply and check it against what customers actually said before you use it.`,
    CREATIVE_CONTENT: `Example (${context}): write a brief for a specific Nigerian or African audience, use AI to suggest options, and keep the final voice and choices your own.`,
    DATA_DECISIONS: `Example (${context}): ask AI to organise the evidence, recalculate every important number yourself and label assumptions clearly before you recommend an action.`,
    ENTREPRENEURSHIP: `Example (${context}): test a real customer problem with a small AI-assisted service before you spend money on a full product.`,
    EDUCATION_RESEARCH: `Example (${context}): use AI to draft questions or organise sources, then check every citation and explain the ideas in your own words.`,
  };
  return `${examples[track]} When you submit the Day ${day} task, say what you did, how you checked it and which decisions you kept for yourself.`;
}

function lessonOverlay(track: LearningTrack, input: PersonalizationInput, lesson: { id: string; dayNumber: number; title: string }, caseStudySlugs: string[]) {
  const definition = TRACKS[track];
  const caseStudyDays = [2, 5, 8, 10];
  const caseIndex = caseStudyDays.indexOf(lesson.dayNumber);
  return {
    lessonId: lesson.id,
    whyItMatters: `Your goal: ${input.primaryGoal}. Each lesson moves you a step closer to ${definition.buildingBlock}.`,
    tailoredExample: tailoredExample(track, input, lesson.dayNumber),
    practiceBrief: `Using a real but non-sensitive situation from your work, create ${DAILY_OUTPUTS[Math.min(lesson.dayNumber - 1, DAILY_OUTPUTS.length - 1)]}. Allow about ${Math.max(15, Math.round(input.weeklyMinutes / 7))} minutes, and note what you did so you can describe it when you submit.`,
    successCriteria: [
      "It meets a real need linked to your goal.",
      "You have checked the important facts, figures and sources yourself.",
      "Your final version shows at least one decision or improvement you made yourself.",
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
  let outcomeSummary = `${definition.promise} By the end of the course, you will have a tested Personal AI Playbook and a working agent that supports your goal: ${input.primaryGoal}`;
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
