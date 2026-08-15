import { z } from "zod";
import type { PersonalizationInput } from "./tracks";

const enhancementSchema = z.object({
  title: z.string().min(8).max(90),
  outcomeSummary: z.string().min(30).max(420),
  milestoneOutcomes: z.array(z.string().min(15).max(180)).length(3),
});

export type DeepSeekEnhancement = z.infer<typeof enhancementSchema> & {
  model: string;
  usage?: { promptTokens?: number; completionTokens?: number };
  latencyMs: number;
};

type DeepSeekResponse = {
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

export function deepSeekEnabled() {
  return process.env.AI_PERSONALIZATION_ENABLED === "true" && Boolean(process.env.DEEPSEEK_API_KEY) && process.env.INTEGRATION_MODE !== "mock";
}

export async function enhancePlanWithDeepSeek(input: PersonalizationInput, trackLabel: string): Promise<DeepSeekEnhancement> {
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 650,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You design concise, practical adult-learning plans. Return JSON only with title, outcomeSummary and milestoneOutcomes (exactly 3 strings). Never promise employment, income or guaranteed results. Preserve the learner's agency and African context without stereotypes.",
          },
          {
            role: "user",
            content: JSON.stringify({
              instruction: "Personalize the wording of a 21-day learning plan. Make the outcome observable and specific. Do not invent personal facts.",
              track: trackLabel,
              profession: input.profession,
              industry: input.industry,
              goal: input.primaryGoal,
              country: input.country,
              level: input.skillLevel,
              weeklyMinutes: input.weeklyMinutes,
            }),
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`deepseek_http_${response.status}`);
    const payload = (await response.json()) as DeepSeekResponse;
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("deepseek_empty_response");
    const parsed = enhancementSchema.parse(JSON.parse(content));
    return {
      ...parsed,
      model,
      usage: { promptTokens: payload.usage?.prompt_tokens, completionTokens: payload.usage?.completion_tokens },
      latencyMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timeout);
  }
}
