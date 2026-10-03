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
  buildingBlock: string;
  keywords: string[];
  tools: string[];
  caseStudies: string[];
  milestones: { day: number; title: string; outcome: string }[];
};

export const TRACKS: Record<LearningTrack, TrackDefinition> = {
  CAREER_PRODUCTIVITY: {
    label: "AI for Career & Productivity",
    promise: "Build a personal agent for recurring work while keeping final decisions with you.",
    buildingBlock: "turning a recurring task into a tested, human-controlled agent workflow",
    keywords: ["career", "work", "productivity", "operations", "report", "email", "admin", "job", "workflow"],
    tools: ["Hermes Agent", "A supported model provider", "Telegram", "A VPS for the production lab"],
    caseStudies: ["agriadvisor-field-guidance", "masakhane-african-languages"],
    milestones: [
      { day: 4, title: "Opportunity map", outcome: "Choose valuable tasks and identify what must stay human." },
      { day: 12, title: "Reliable workflow", outcome: "Build and test one repeatable work process." },
      { day: 16, title: "Production agent", outcome: "Run one measured workflow for 48 hours and document the result." },
    ],
  },
  BUSINESS_GROWTH: {
    label: "AI for Business Growth",
    promise: "Build a personal agent that monitors customer or market signals and prepares work for your review.",
    buildingBlock: "building a monitored business workflow with clear approval points",
    keywords: ["marketing", "sales", "customer", "business", "growth", "revenue", "service", "commerce"],
    tools: ["Hermes Agent", "A supported model provider", "Telegram", "A VPS for the production lab"],
    caseStudies: ["esusfarm-smallholders", "agriadvisor-field-guidance"],
    milestones: [
      { day: 4, title: "Customer opportunity brief", outcome: "Define a customer problem worth solving." },
      { day: 12, title: "Growth workflow", outcome: "Create a reusable research-to-campaign process." },
      { day: 16, title: "Production agent", outcome: "Run the workflow for 48 hours and record usefulness, errors and cost." },
    ],
  },
  CREATIVE_CONTENT: {
    label: "AI for Creativity & Content",
    promise: "Build a personal agent that supports content work without taking over your voice or judgement.",
    buildingBlock: "turning a content routine into a repeatable workflow with your voice and approval built in",
    keywords: ["content", "creative", "design", "video", "writing", "social", "brand", "creator", "music"],
    tools: ["Hermes Agent", "A supported model provider", "Telegram", "A VPS for the production lab"],
    caseStudies: ["masakhane-african-languages", "google-flood-nigeria"],
    milestones: [
      { day: 4, title: "Creative brief", outcome: "Define audience, voice and cultural guardrails." },
      { day: 12, title: "Content production system", outcome: "Turn one idea into a checked set of assets." },
      { day: 16, title: "Production agent", outcome: "Run the workflow for 48 hours and show where you edited or rejected its work." },
    ],
  },
  DATA_DECISIONS: {
    label: "AI for Data & Decisions",
    promise: "Build a personal agent that gathers and structures evidence without pretending verification is automatic.",
    buildingBlock: "automating evidence collection while keeping calculations, sources and decisions auditable",
    keywords: ["data", "analysis", "research", "decision", "finance", "forecast", "insight", "excel", "analytics"],
    tools: ["Hermes Agent", "A supported model provider", "Telegram", "A VPS for the production lab"],
    caseStudies: ["google-flood-nigeria", "esusfarm-smallholders"],
    milestones: [
      { day: 4, title: "Decision question", outcome: "Turn a vague concern into a testable decision brief." },
      { day: 12, title: "Evidence workflow", outcome: "Analyse a small dataset and verify the result." },
      { day: 16, title: "Production agent", outcome: "Run the evidence workflow for 48 hours and record checks, failures and corrections." },
    ],
  },
  ENTREPRENEURSHIP: {
    label: "AI for Entrepreneurship",
    promise: "Build a personal agent around one useful business task before spending money on a bigger system.",
    buildingBlock: "testing one useful agent workflow with clear cost and risk limits",
    keywords: ["startup", "entrepreneur", "founder", "idea", "venture", "product", "sme", "freelance"],
    tools: ["Hermes Agent", "A supported model provider", "Telegram", "A VPS for the production lab"],
    caseStudies: ["ubenwa-newborn-care", "esusfarm-smallholders", "agriadvisor-field-guidance"],
    milestones: [
      { day: 4, title: "Problem evidence", outcome: "Describe a real user problem without jumping to technology." },
      { day: 12, title: "Offer prototype", outcome: "Build and test the riskiest part of an AI-assisted service." },
      { day: 16, title: "Production agent", outcome: "Run the workflow for 48 hours and decide whether its value justifies the cost." },
    ],
  },
  EDUCATION_RESEARCH: {
    label: "AI for Education & Research",
    promise: "Build a personal agent for teaching or research while protecting evidence, authorship and judgement.",
    buildingBlock: "automating a teaching or research routine without giving up source checking or authorship",
    keywords: ["teacher", "student", "education", "learn", "research", "academic", "school", "training"],
    tools: ["Hermes Agent", "A supported model provider", "Telegram", "A VPS for the production lab"],
    caseStudies: ["masakhane-african-languages", "ubenwa-newborn-care"],
    milestones: [
      { day: 4, title: "Learning question", outcome: "Define the learner or research need and its evidence standard." },
      { day: 12, title: "Teaching or research workflow", outcome: "Create an evidence-aware reusable process." },
      { day: 16, title: "Production agent", outcome: "Run the workflow for 48 hours and document source checks, errors and human decisions." },
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
