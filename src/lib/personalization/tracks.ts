import type { LearningFormat, LearningTrack, SkillLevel } from "@prisma/client";

export type PersonalizationInput = {
  profession: string;
  industry?: string;
  primaryGoal: string;
  country: string;
  skillLevel: SkillLevel;
  weeklyMinutes: number;
  learningFormat: LearningFormat;
  preferredTools: string[];
};

export type TrackDefinition = {
  label: string;
  promise: string;
  keywords: string[];
  tools: string[];
  caseStudies: string[];
  milestones: { day: number; title: string; outcome: string }[];
};

export const TRACKS: Record<LearningTrack, TrackDefinition> = {
  CAREER_PRODUCTIVITY: {
    label: "AI for Career & Productivity",
    promise: "Turn recurring knowledge work into reliable, human-reviewed AI workflows.",
    keywords: ["career", "work", "productivity", "operations", "report", "email", "admin", "job", "workflow"],
    tools: ["ChatGPT or DeepSeek", "Perplexity", "Google Workspace or Microsoft 365"],
    caseStudies: ["agriadvisor-field-guidance", "masakhane-african-languages"],
    milestones: [
      { day: 4, title: "Opportunity map", outcome: "Choose valuable tasks and identify what must stay human." },
      { day: 12, title: "Reliable workflow", outcome: "Build and test one repeatable work process." },
      { day: 21, title: "Personal AI operating system", outcome: "Present a measured workflow you can keep using." },
    ],
  },
  BUSINESS_GROWTH: {
    label: "AI for Business Growth",
    promise: "Use AI to understand customers, improve service and create a practical growth engine.",
    keywords: ["marketing", "sales", "customer", "business", "growth", "revenue", "service", "commerce"],
    tools: ["ChatGPT or DeepSeek", "Canva", "Google Sheets"],
    caseStudies: ["esusfarm-smallholders", "agriadvisor-field-guidance"],
    milestones: [
      { day: 4, title: "Customer opportunity brief", outcome: "Define a customer problem worth solving." },
      { day: 12, title: "Growth workflow", outcome: "Create a reusable research-to-campaign process." },
      { day: 21, title: "Business impact project", outcome: "Show a useful asset and the metric it should improve." },
    ],
  },
  CREATIVE_CONTENT: {
    label: "AI for Creativity & Content",
    promise: "Develop an authentic content system without surrendering taste, voice or cultural context.",
    keywords: ["content", "creative", "design", "video", "writing", "social", "brand", "creator", "music"],
    tools: ["ChatGPT or DeepSeek", "Canva", "Adobe Express or CapCut"],
    caseStudies: ["masakhane-african-languages", "google-flood-nigeria"],
    milestones: [
      { day: 4, title: "Creative brief", outcome: "Define audience, voice and cultural guardrails." },
      { day: 12, title: "Content production system", outcome: "Turn one idea into a checked set of assets." },
      { day: 21, title: "Signature campaign", outcome: "Publish a coherent project and explain your choices." },
    ],
  },
  DATA_DECISIONS: {
    label: "AI for Data & Decisions",
    promise: "Ask better questions of information, test claims and communicate decisions clearly.",
    keywords: ["data", "analysis", "research", "decision", "finance", "forecast", "insight", "excel", "analytics"],
    tools: ["ChatGPT or DeepSeek", "Google Sheets or Excel", "Perplexity"],
    caseStudies: ["google-flood-nigeria", "esusfarm-smallholders"],
    milestones: [
      { day: 4, title: "Decision question", outcome: "Turn a vague concern into a testable decision brief." },
      { day: 12, title: "Evidence workflow", outcome: "Analyse a small dataset and verify the result." },
      { day: 21, title: "Decision memo", outcome: "Defend a recommendation with evidence and caveats." },
    ],
  },
  ENTREPRENEURSHIP: {
    label: "AI for Entrepreneurship",
    promise: "Move from a real local problem to a tested, responsible AI-enabled offer.",
    keywords: ["startup", "entrepreneur", "founder", "idea", "venture", "product", "sme", "freelance"],
    tools: ["ChatGPT or DeepSeek", "Canva", "Notion or Google Docs"],
    caseStudies: ["ubenwa-newborn-care", "esusfarm-smallholders", "agriadvisor-field-guidance"],
    milestones: [
      { day: 4, title: "Problem evidence", outcome: "Describe a real user problem without jumping to technology." },
      { day: 12, title: "Offer prototype", outcome: "Build and test the riskiest part of an AI-assisted service." },
      { day: 21, title: "Venture case", outcome: "Present value, safeguards, economics and a next experiment." },
    ],
  },
  EDUCATION_RESEARCH: {
    label: "AI for Education & Research",
    promise: "Use AI to deepen learning and research while preserving evidence, authorship and judgment.",
    keywords: ["teacher", "student", "education", "learn", "research", "academic", "school", "training"],
    tools: ["ChatGPT or DeepSeek", "Perplexity", "Google Scholar"],
    caseStudies: ["masakhane-african-languages", "ubenwa-newborn-care"],
    milestones: [
      { day: 4, title: "Learning question", outcome: "Define the learner or research need and its evidence standard." },
      { day: 12, title: "Teaching or research workflow", outcome: "Create an evidence-aware reusable process." },
      { day: 21, title: "Learning impact project", outcome: "Demonstrate an asset, evaluation and responsible-use policy." },
    ],
  },
};

export function chooseTrack(input: Pick<PersonalizationInput, "profession" | "industry" | "primaryGoal">): LearningTrack {
  const corpus = `${input.profession} ${input.industry ?? ""} ${input.primaryGoal}`.toLowerCase();
  const scores = Object.entries(TRACKS).map(([track, definition]) => ({
    track: track as LearningTrack,
    score: definition.keywords.reduce((score, keyword) => score + (corpus.includes(keyword) ? 1 : 0), 0),
  }));
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  return top && top.score > 0 ? top.track : "CAREER_PRODUCTIVITY";
}

export function trackLabel(track: LearningTrack) {
  return TRACKS[track].label;
}
