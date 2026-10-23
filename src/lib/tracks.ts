export const TRACK_PRICE_NGN = 20_000;

export type TrackSlug = "small-business" | "professionals";

type TrackLesson = { slug: string; title: string };
type TrackModule = { title: string; lessons: TrackLesson[] };

export type Track = {
  slug: TrackSlug;
  /** The site's own product code for this track, sent to Paystack as checkout metadata. */
  productCode: string;
  audience: string;
  title: string;
  subline: string;
  promise: string;
  outcomes: readonly string[];
  problems: readonly string[];
  builds: readonly string[];
  modules: readonly TrackModule[];
};

const foundations: TrackModule = {
  title: "Module 0 · How AI agents work and how to use them safely",
  lessons: [
    { slug: "agent-foundations", title: "Roles, tools, memory, triggers and approvals" },
    { slug: "agent-safety", title: "Safe access, human approval and responsible use" },
  ],
};

export const TRACKS: readonly Track[] = [
  {
    slug: "small-business",
    productCode: "HYRAX-ACADEMY-SMALL-BUSINESS",
    audience: "Small business owners",
    title: "Build your own AI team: 5 assistants that handle customers, leads, and reports without writing code",
    subline: "Step-by-step, with copy-and-paste templates. Works with WhatsApp, Gmail, Google Sheets, and Telegram.",
    promise: "Keep customer replies moving, follow up with leads, and get your weekly report ready.",
    outcomes: [
      "Reply to common customer questions with your approval",
      "Follow up with leads before they go cold",
      "Turn your data into a weekly report",
      "Start each day with a useful brief",
      "Prepare invoices and payment reminders",
    ],
    problems: [
      "You answer the same customer questions on WhatsApp every day.",
      "Promising leads go cold while you are busy serving customers.",
      "Friday reporting takes time you would rather spend on the business.",
    ],
    builds: [
      "WhatsApp customer reply assistant",
      "Lead follow-up assistant",
      "Weekly report assistant",
      "Daily brief",
      "Invoice and payment reminder assistant",
    ],
    modules: [
      foundations,
      { title: "Module 1 · Customer replies", lessons: [
        { slug: "n8n-setup", title: "Guided n8n hosting and setup" },
        { slug: "whatsapp-business-setup", title: "Guided WhatsApp Business setup" },
        { slug: "customer-reply-assistant", title: "Build a customer reply assistant" },
      ] },
      { title: "Module 2 · Lead follow-up", lessons: [{ slug: "lead-follow-up-assistant", title: "Build a lead follow-up assistant" }] },
      { title: "Module 3 · Weekly reports", lessons: [{ slug: "weekly-report-assistant", title: "Build a weekly report assistant" }] },
      { title: "Module 4 · Daily brief", lessons: [{ slug: "daily-brief-assistant", title: "Build your daily brief" }] },
      { title: "Module 5 · Invoices and reminders", lessons: [{ slug: "invoice-reminder-assistant", title: "Build an invoice and payment reminder assistant" }] },
      { title: "Capstone · Launch your AI team", lessons: [{ slug: "business-capstone", title: "Review, test and launch your five assistants" }] },
    ],
  },
  {
    slug: "professionals",
    productCode: "HYRAX-ACADEMY-PROFESSIONALS",
    audience: "Professionals",
    title: "Hire an AI assistant that knows your clients, drafts your proposals, and briefs you every morning",
    subline: "Private, approval-based, and built around your own way of working. Chat with it on WhatsApp or Telegram.",
    promise: "Start each day briefed, keep your inbox organised, and review first drafts sooner.",
    outcomes: [
      "Triage your inbox before the day begins",
      "Receive a morning briefing shaped around your work",
      "Turn meeting notes into clear next steps",
      "Draft proposals and client updates in your voice",
      "Keep control of client access and every outgoing message",
    ],
    problems: [
      "Inbox triage takes the best part of your morning.",
      "Meeting follow-ups slip between calls and deadlines.",
      "First drafts consume time you need for higher-value work.",
    ],
    builds: [
      "Inbox triage assistant",
      "Morning briefing",
      "Meeting notes to action items and follow-up emails",
      "Proposal and client-update drafting",
      "Virtual mentor board for brainstorming",
    ],
    modules: [
      foundations,
      { title: "Module 1 · Inbox triage", lessons: [
        { slug: "hermes-setup", title: "Guided Hermes hosting and setup" },
        { slug: "inbox-triage-assistant", title: "Build an inbox triage assistant" },
      ] },
      { title: "Module 2 · Morning briefings", lessons: [{ slug: "morning-briefing", title: "Build a scheduled morning briefing" }] },
      { title: "Module 3 · Meeting follow-ups", lessons: [{ slug: "meeting-follow-ups", title: "Turn meeting notes into actions and follow-up emails" }] },
      { title: "Module 4 · Proposals and client updates", lessons: [{ slug: "proposal-client-updates", title: "Draft proposals and client updates" }] },
      { title: "Module 5 · Virtual mentors", lessons: [{ slug: "virtual-mentor-board", title: "Build a virtual mentor board to brainstorm ideas" }] },
      { title: "Module 6 · Confidentiality and approvals", lessons: [{ slug: "confidentiality-approvals", title: "Protect client information and approve every action" }] },
      { title: "Capstone · Launch your assistant", lessons: [{ slug: "professional-capstone", title: "Review, test and launch your assistant" }] },
    ],
  },
] as const;

export function getTrack(slug: string) {
  return TRACKS.find((track) => track.slug === slug);
}

export function isTrackSlug(slug: string): slug is TrackSlug {
  return slug === "small-business" || slug === "professionals";
}
