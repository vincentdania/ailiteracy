import { createHash } from "node:crypto";
import type { GenerationSource, LearningTrack, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enhancePlanWithDeepSeek, deepSeekEnabled } from "./deepseek";
import { chooseTrack, TRACKS, type PersonalizationInput } from "./tracks";

const DAILY_OUTPUTS = [
  "a one-sentence job for your personal agent and the boundary it must not cross",
  "a short reason for choosing Hermes Agent over a browser-only chat tool",
  "a map of your agent's instance, model provider, tools, memory and messaging surfaces",
  "an installation record with the command used and any error you fixed",
  "a provider record showing the model you chose, its cost basis and a successful test task",
  "a VPS decision with host, monthly cost, login method and gateway service status",
  "a least-privilege toolset for one real task",
  "one reusable skill tested twice with the same output structure",
  "a SOUL.md rule, a saved user fact and proof that both load in a new session",
  "a Telegram connection restricted to your user ID and tested end to end",
  "a safe email setup using a dedicated inbox, allowlist and a draft-only workflow",
  "a scheduled task with an explicit timezone, delivery target and test run",
  "a seven-day adoption plan built around work you already do",
  "a cross-surface test proving that Telegram and the terminal use the same Hermes profile",
  "a completed security review covering access, approvals, secrets, isolation and backups",
  "a production report from a 48-hour reliability test",
  "one tested advanced feature: voice, code execution or a local model",
  "an extension decision explaining whether a skill, plugin, MCP server or core tool fits the need",
  "a one-page operating note with daily commands, recovery steps and standing weekly tasks",
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
  return `${examples[track]} For Lesson ${day}, show what you configured, how you tested it and what you kept under human control.`;
}

function lessonOverlay(track: LearningTrack, input: PersonalizationInput, lesson: { id: string; dayNumber: number; title: string }, caseStudySlugs: string[]) {
  const definition = TRACKS[track];
  const caseStudyDays = [3, 8, 14, 18];
  const caseIndex = caseStudyDays.indexOf(lesson.dayNumber);
  return {
    lessonId: lesson.id,
    whyItMatters: `Your goal is ${input.primaryGoal}. This lesson helps by ${definition.buildingBlock}.`,
    tailoredExample: tailoredExample(track, input, lesson.dayNumber),
    practiceBrief: `Using a real but non-sensitive situation from your work, create ${DAILY_OUTPUTS[Math.min(lesson.dayNumber - 1, DAILY_OUTPUTS.length - 1)]}. Set aside about ${Math.max(15, Math.round(input.weeklyMinutes / 7))} minutes and keep enough evidence to repeat the setup.`,
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
  let outcomeSummary = `${definition.promise} By Lesson 19, you will have a tested personal agent and a short production record tied to this outcome: ${input.primaryGoal}`;
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
