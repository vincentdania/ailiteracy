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
    tools: ["A free AI assistant such as ChatGPT, Gemini, Claude or Copilot", "Your phone or laptop", "Google Docs, Word or Sheets"],
    caseStudies: ["agriadvisor-field-guidance", "masakhane-african-languages"],
    milestones: [
      { day: 3, title: "Your job's core document", outcome: "Turn one real example into a template you reuse every week." },
      { day: 7, title: "Personal AI Playbook", outcome: "Collect and test the prompts that handle your recurring work." },
      { day: 10, title: "Agent on a routine", outcome: "Run one recurring task through your agent each week and check its output." },
    ],
  },
  BUSINESS_GROWTH: {
    label: "AI for Business Growth",
    promise: "Build a personal agent that monitors customer or market signals and prepares work for your review.",
    buildingBlock: "building a monitored business workflow with clear approval points",
    keywords: ["marketing", "sales", "customer", "business", "growth", "revenue", "service", "commerce"],
    tools: ["A free AI assistant such as ChatGPT, Gemini, Claude or Copilot", "Your phone or laptop", "Google Docs, Word or Sheets"],
    caseStudies: ["esusfarm-smallholders", "agriadvisor-field-guidance"],
    milestones: [
      { day: 3, title: "Customer document set", outcome: "Produce the proposals, quotes or replies your customers see most." },
      { day: 7, title: "Growth Playbook", outcome: "Save tested prompts for customer messages, offers and follow-ups." },
      { day: 10, title: "Agent on a routine", outcome: "Hand one weekly customer or market task to your agent and review what it prepares." },
    ],
  },
  CREATIVE_CONTENT: {
    label: "AI for Creativity & Content",
    promise: "Build a personal agent that supports content work without taking over your voice or judgement.",
    buildingBlock: "turning a content routine into a repeatable workflow with your voice and approval built in",
    keywords: ["content", "creative", "design", "video", "writing", "social", "brand", "creator", "music"],
    tools: ["A free AI assistant such as ChatGPT, Gemini, Claude or Copilot", "Your phone or laptop", "Google Docs, Word or Sheets"],
    caseStudies: ["masakhane-african-languages", "google-flood-nigeria"],
    milestones: [
      { day: 3, title: "Content template", outcome: "Capture your voice, audience and guardrails in one reusable format." },
      { day: 7, title: "Content Playbook", outcome: "Save tested prompts that turn one idea into a checked set of assets." },
      { day: 10, title: "Agent on a routine", outcome: "Run a weekly content task through your agent and show where you edited its work." },
    ],
  },
  DATA_DECISIONS: {
    label: "AI for Data & Decisions",
    promise: "Build a personal agent that gathers and structures evidence without pretending verification is automatic.",
    buildingBlock: "automating evidence collection while keeping calculations, sources and decisions auditable",
    keywords: ["data", "analysis", "research", "decision", "finance", "forecast", "insight", "excel", "analytics"],
    tools: ["A free AI assistant such as ChatGPT, Gemini, Claude or Copilot", "Your phone or laptop", "Google Docs, Word or Sheets"],
    caseStudies: ["google-flood-nigeria", "esusfarm-smallholders"],
    milestones: [
      { day: 3, title: "Decision brief", outcome: "Turn a vague concern into a document with the question and the evidence needed." },
      { day: 7, title: "Evidence Playbook", outcome: "Save tested prompts for summarising documents and building spreadsheets you verify." },
      { day: 10, title: "Agent on a routine", outcome: "Hand one weekly reporting task to your agent and record the checks you made." },
    ],
  },
  ENTREPRENEURSHIP: {
    label: "AI for Entrepreneurship",
    promise: "Build a personal agent around one useful business task before spending money on a bigger system.",
    buildingBlock: "testing one useful agent workflow with clear cost and risk limits",
    keywords: ["startup", "entrepreneur", "founder", "idea", "venture", "product", "sme", "freelance"],
    tools: ["A free AI assistant such as ChatGPT, Gemini, Claude or Copilot", "Your phone or laptop", "Google Docs, Word or Sheets"],
    caseStudies: ["ubenwa-newborn-care", "esusfarm-smallholders", "agriadvisor-field-guidance"],
    milestones: [
      { day: 3, title: "Offer document", outcome: "Describe a real customer problem and the service you could sell for it." },
      { day: 7, title: "Business Playbook", outcome: "Save tested prompts for the messages and documents your business sends." },
      { day: 10, title: "Agent on a routine", outcome: "Run one weekly business task through your agent and decide if it saves enough time." },
    ],
  },
  EDUCATION_RESEARCH: {
    label: "AI for Education & Research",
    promise: "Build a personal agent for teaching or research while protecting evidence, authorship and judgement.",
    buildingBlock: "automating a teaching or research routine without giving up source checking or authorship",
    keywords: ["teacher", "student", "education", "learn", "research", "academic", "school", "training"],
    tools: ["A free AI assistant such as ChatGPT, Gemini, Claude or Copilot", "Your phone or laptop", "Google Docs, Word or Sheets"],
    caseStudies: ["masakhane-african-languages", "ubenwa-newborn-care"],
    milestones: [
      { day: 3, title: "Teaching or research template", outcome: "Turn one lesson plan, worksheet or source summary into a reusable format." },
      { day: 7, title: "Teaching Playbook", outcome: "Save tested prompts with your source-checking steps built in." },
      { day: 10, title: "Agent on a routine", outcome: "Run a weekly teaching or research task through your agent and check every source it uses." },
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
