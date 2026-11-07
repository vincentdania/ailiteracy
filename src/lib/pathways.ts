/**
 * Competence pathways from the Hyrax Competence Lab Four Pathways Programme Handbook (pilot edition, November 2026).
 *
 * Unlike the two self-paced tracks in tracks.ts, each pathway is an eight-week, mentor-led cohort that ends in an
 * independent assessment. Pathways are seeded as unpublished courses: they are not listed, sold or opened in the
 * lesson reader until they are launched.
 *
 * Lessons live in content/lessons/<pathway>/<slug>.md (the shared start-here lesson in content/lessons/shared/).
 * Evidence briefs live in content/assignments/<pathway>/. Assessor guides, which hold the unseen briefs, live in
 * docs/pathways/ and are never seeded.
 */

export type PathwaySlug = "ai-business-growth" | "ai-business-automation" | "ai-meal-data-analysis" | "ai-project-delivery";

type PathwayLesson = { slug: string; title: string };
type PathwayModule = { title: string; lessons: PathwayLesson[] };

export type PathwayWeek = {
  week: number;
  focus: string;
  /** The required practical evidence for the week, as the handbook names it. */
  evidence: string;
};

export type RubricDimension = { dimension: string; weight: number };

export type Pathway = {
  slug: PathwaySlug;
  productCode: string;
  title: string;
  purpose: string;
  partnerProject: string;
  competencies: readonly string[];
  weeks: readonly PathwayWeek[];
  rubric: readonly RubricDimension[];
  finalAssessment: string;
  portfolio: readonly string[];
  tools: readonly string[];
  safeguards: readonly string[];
  progression: readonly string[];
  modules: readonly PathwayModule[];
};

/** Pilot rule from the handbook: 80% overall, plus a pass on every mandatory requirement. */
export const PATHWAY_PASS_MARK = 80;
export const PATHWAY_WEEKLY_HOURS = "15–20";
export const PATHWAY_COHORT_SIZE = 5;

export const SHARED_RUBRIC: readonly RubricDimension[] = [
  { dimension: "Technical accuracy and completeness", weight: 30 },
  { dimension: "Problem diagnosis and professional reasoning", weight: 20 },
  { dimension: "Quality, usefulness and clarity of deliverable", weight: 20 },
  { dimension: "Reproducibility, testing or measurement", weight: 15 },
  { dimension: "Ethical practice, privacy and professional conduct", weight: 10 },
  { dimension: "Oral defence and reflective improvement", weight: 5 },
];

export const MANDATORY_REQUIREMENTS = [
  "Critical safety",
  "Ethics",
  "Data integrity",
  "Authorization",
] as const;

const startHere = (title: string): PathwayModule => ({
  title: "Start here · The standard and your baseline",
  lessons: [
    { slug: "competence-pathway-guide", title: "How a competence pathway works" },
    { slug: "baseline-assessment", title },
  ],
});

const weekModules = (lessons: readonly [string, string][]): PathwayModule[] =>
  lessons.map(([slug, title], index) => ({
    title: index === 7 ? "Week 8 · Independent competence assessment" : `Week ${index + 1} · ${title}`,
    lessons: [{ slug, title }],
  }));

export const PATHWAYS: readonly Pathway[] = [
  {
    slug: "ai-business-growth",
    productCode: "HYRAX-PATHWAY-BUSINESS-GROWTH",
    title: "AI Business Growth Specialist",
    purpose: "Use AI and digital marketing to understand customers, develop responsible campaigns and evaluate measurable business outcomes.",
    partnerProject: "Help a small business improve one clearly defined customer-acquisition or engagement process, with the business approving all spend and communications.",
    competencies: [
      "Describe customers and business goals in measurable terms",
      "Conduct proportionate market research and identify meaningful channels",
      "Create accurate, appropriate, accessible marketing content",
      "Set up and monitor approved campaigns safely",
      "Interpret conversion and acquisition metrics without overstating attribution",
    ],
    weeks: [
      { week: 1, focus: "Marketing fundamentals and AI literacy", evidence: "Customer journey map and responsible-AI practice exercise" },
      { week: 2, focus: "Market research and customer intelligence", evidence: "Competitor scan, customer segments, research evidence" },
      { week: 3, focus: "Content creation and digital branding", evidence: "Revised copy, social assets and creative rationale" },
      { week: 4, focus: "Campaign strategy", evidence: "Channel plan, objectives, KPIs, budget and creative brief" },
      { week: 5, focus: "Advertising and lead generation", evidence: "Supervised campaign configuration and tracking plan" },
      { week: 6, focus: "Marketing analytics and optimization", evidence: "Performance analysis with defensible recommendations" },
      { week: 7, focus: "Partner business growth project", evidence: "Approved campaign assets and documented implementation" },
      { week: 8, focus: "Independent competence assessment", evidence: "Unseen business brief, strategy, samples and oral defence" },
    ],
    rubric: SHARED_RUBRIC,
    finalAssessment: "Learner receives an unfamiliar business case and develops an evidence-backed plan, sample creatives, measurement approach and risk register; assessor challenges assumptions and asks for revisions.",
    portfolio: ["Market research memo", "Customer profiles", "Campaign plan", "Creative pack", "Measurement dashboard", "Reflection on results"],
    tools: ["Google Sheets", "Canva or Figma", "An ad-platform sandbox or approved live account", "Web analytics", "An AI assistant"],
    safeguards: [
      "No guarantee of increased sales.",
      "Client budgets and account access remain client-controlled.",
      "Obtain consent for testimonials and audience data.",
      "Avoid fabricated claims.",
    ],
    progression: ["Performance marketing", "Content strategy", "Growth analytics", "Creative production", "Marketing automation"],
    modules: [
      startHere("Baseline: diagnose a small business's growth problem"),
      ...weekModules([
        ["customer-journeys", "Marketing fundamentals and AI literacy"],
        ["market-research", "Market research and customer intelligence"],
        ["content-and-branding", "Content creation and digital branding"],
        ["campaign-strategy", "Campaign strategy"],
        ["ads-and-lead-generation", "Advertising and lead generation"],
        ["marketing-analytics", "Marketing analytics and optimization"],
        ["partner-growth-project", "Partner business growth project"],
        ["independent-assessment", "Prepare for your independent assessment"],
      ]),
    ],
  },
  {
    slug: "ai-business-automation",
    productCode: "HYRAX-PATHWAY-BUSINESS-AUTOMATION",
    title: "AI Business Automation Specialist",
    purpose: "Identify repetitive business processes and create reliable, maintainable automations with appropriate human oversight.",
    partnerProject: "Automate a low-risk administrative process, such as internal status reporting or non-sensitive payment-reminder drafts, with human approval before external communications.",
    competencies: [
      "Map and simplify workflows before automating",
      "Connect spreadsheets and applications without corrupting data",
      "Design audit logs, exception paths and human review gates",
      "Test success and failure scenarios",
      "Measure time saved while documenting actual operating costs",
    ],
    weeks: [
      { week: 1, focus: "Business process discovery", evidence: "As-is process map and pain-point inventory" },
      { week: 2, focus: "Data flows and system design", evidence: "To-be workflow, data dictionary and integration plan" },
      { week: 3, focus: "No-code automation fundamentals", evidence: "Working trigger-action workflow with logs" },
      { week: 4, focus: "Responsible AI in workflows", evidence: "AI-assisted classification or drafting with review rules" },
      { week: 5, focus: "Business use cases", evidence: "Automated reminder, reporting or invoicing prototype" },
      { week: 6, focus: "Testing, security and troubleshooting", evidence: "Test cases, failure handling, access and privacy checks" },
      { week: 7, focus: "Real business automation project", evidence: "Partner-approved functional pilot and handover notes" },
      { week: 8, focus: "Independent competence assessment", evidence: "Unseen workflow brief, live demonstration and defence" },
    ],
    rubric: SHARED_RUBRIC,
    finalAssessment: "Build and demonstrate an unseen workflow, deliberately recover from a simulated failure, and explain controls, data flow, permissions and handover.",
    portfolio: ["As-is and to-be process maps", "Working automation", "Test log", "Risk assessment", "Instructions", "Before and after time study"],
    tools: ["Google Sheets", "n8n or Make", "Webhook test endpoints", "Sample business apps", "An AI assistant"],
    safeguards: [
      "Use test records or authorized low-risk data.",
      "No autonomous payment transfers.",
      "No uncontrolled external messaging or sensitive-data uploads.",
      "Guard against prompt injection and unsafe permissions.",
    ],
    progression: ["Workflow architecture", "System integration", "Process improvement", "Software engineering", "AI operations"],
    modules: [
      startHere("Baseline: map and improve a messy process"),
      ...weekModules([
        ["process-discovery", "Business process discovery"],
        ["data-flows-and-design", "Data flows and system design"],
        ["no-code-fundamentals", "No-code automation fundamentals"],
        ["responsible-ai-workflows", "Responsible AI in workflows"],
        ["business-use-cases", "Business use cases"],
        ["testing-and-security", "Testing, security and troubleshooting"],
        ["partner-automation-project", "Real business automation project"],
        ["independent-assessment", "Prepare for your independent assessment"],
      ]),
    ],
  },
  {
    slug: "ai-meal-data-analysis",
    productCode: "HYRAX-PATHWAY-MEAL-DATA",
    title: "AI-Assisted MEAL Data Analyst",
    purpose: "Turn programme data into reliable evidence that supports accountable decisions in development and public-interest work.",
    partnerProject: "Assess the performance of a fictional or properly anonymized youth livelihoods or women's empowerment project, distinguishing outputs, outcomes and causal claims.",
    competencies: [
      "Develop operational indicator definitions and defensible denominators",
      "Design ethical digital data collection tools",
      "Investigate and document missingness, duplicates and outliers",
      "Analyze and visualize project results accurately",
      "Separate associations and trends from causal effects and disclose limitations",
    ],
    weeks: [
      { week: 1, focus: "MEAL foundations and indicators", evidence: "Theory of Change, results matrix and indicator reference sheets" },
      { week: 2, focus: "Survey design and ethical collection", evidence: "Working KoboToolbox form, codebook and consent flow" },
      { week: 3, focus: "Data quality and cleaning", evidence: "Clean dataset with reproducible cleaning log" },
      { week: 4, focus: "Quantitative analysis", evidence: "Accurate indicator workbook and interpretation memo" },
      { week: 5, focus: "Visualization and dashboards", evidence: "Reconciled Excel/Power BI project dashboard" },
      { week: 6, focus: "AI-assisted analysis and reporting", evidence: "Validated findings, AI-use log and qualitative coding sample" },
      { week: 7, focus: "Integrated project evaluation challenge", evidence: "Analysis package for realistic NGO scenario" },
      { week: 8, focus: "Independent competence assessment", evidence: "Unseen data challenge, report, dashboard and oral defence" },
    ],
    // Pathway-specific weights from the handbook's suggested scoring for the final assessment.
    rubric: [
      { dimension: "Programme logic and indicators", weight: 15 },
      { dimension: "Data quality and reproducibility", weight: 20 },
      { dimension: "Accuracy and interpretation", weight: 25 },
      { dimension: "Reporting", weight: 15 },
      { dimension: "Judgment", weight: 15 },
      { dimension: "Oral defence", weight: 10 },
    ],
    finalAssessment: "Independent unseen dataset, analysed to a report and dashboard with an oral defence. Mandatory pass on integrity and privacy.",
    portfolio: ["Theory of Change", "Kobo form", "Data dictionary", "Cleaning script or workbook", "Indicator tables", "Dashboard", "Analytical report", "Limitations statement"],
    tools: ["KoboToolbox or ODK", "Excel and Power Query", "Power BI", "Python (optional)", "An approved AI assistant"],
    safeguards: [
      "Never expose personal beneficiary data to unapproved AI services.",
      "Do not invent findings.",
      "Do not infer programme impact without a suitable evaluation design.",
    ],
    progression: ["Impact evaluation", "Applied statistics", "Humanitarian analytics", "Research", "GIS", "Social protection data systems"],
    modules: [
      startHere("Baseline: check a small programme dataset"),
      ...weekModules([
        ["meal-foundations", "MEAL foundations and indicators"],
        ["survey-design", "Survey design and ethical collection"],
        ["data-cleaning", "Data quality and cleaning"],
        ["quantitative-analysis", "Quantitative analysis"],
        ["dashboards", "Visualization and dashboards"],
        ["ai-assisted-reporting", "AI-assisted analysis and reporting"],
        ["evaluation-challenge", "Integrated project evaluation challenge"],
        ["independent-assessment", "Prepare for your independent assessment"],
      ]),
    ],
  },
  {
    slug: "ai-project-delivery",
    productCode: "HYRAX-PATHWAY-PROJECT-DELIVERY",
    title: "AI-Enabled Project Delivery Practitioner",
    purpose: "Coordinate small projects and project phases responsibly using project management fundamentals and AI-assisted tools.",
    partnerProject: "Plan and coordinate a supervised phase of a small community digital-literacy or business improvement project; scenario-based challenges test disruptions and change control.",
    competencies: [
      "Translate business need into clear outcomes and authorized scope",
      "Prepare feasible schedule, budget and resource estimates",
      "Manage risks, issues, quality and stakeholder communication",
      "Adapt delivery methods to uncertainty and context",
      "Report performance honestly and escalate decisions beyond authority",
    ],
    weeks: [
      { week: 1, focus: "Initiation and stakeholders", evidence: "Project charter, objectives and stakeholder register" },
      { week: 2, focus: "Scope and work planning", evidence: "Scope statement, WBS and acceptance criteria" },
      { week: 3, focus: "Schedule, cost and resources", evidence: "Logic-based schedule, budget and resource plan" },
      { week: 4, focus: "Risk, quality and engagement", evidence: "Risk register, quality criteria and communication plan" },
      { week: 5, focus: "Predictive, agile and hybrid delivery", evidence: "Chosen delivery approach, backlog and AI review log" },
      { week: 6, focus: "Monitoring and problem-solving", evidence: "Status report, change analysis and recovery options" },
      { week: 7, focus: "Supervised project phase", evidence: "Evidence of coordination, decision logs and issue management" },
      { week: 8, focus: "Independent competence assessment", evidence: "Unseen project scenario and oral defence" },
    ],
    rubric: SHARED_RUBRIC,
    finalAssessment: "Unseen project recovery case and delivery plan; assess planning, cost and resource logic, risk response, stakeholder decisions, AI verification and professional defence.",
    portfolio: ["Project charter", "WBS", "Schedule", "Cost baseline", "Risk register", "Communications plan", "Progress report", "Change log", "Lessons learned"],
    tools: ["Excel", "Trello, Jira or a comparable tool", "MS Project (optional)", "An AI assistant with human verification"],
    safeguards: [
      "Eight weeks builds foundational project coordination, not independent senior project-manager capability.",
      "Do not imply equivalence to PMP or other third-party credentials.",
    ],
    progression: ["Project coordination", "Agile delivery", "Digital projects", "Development project management", "Programme management", "Portfolio leadership"],
    modules: [
      startHere("Baseline: rescue a one-page project plan"),
      ...weekModules([
        ["initiation-and-stakeholders", "Initiation and stakeholders"],
        ["scope-and-wbs", "Scope and work planning"],
        ["schedule-cost-resources", "Schedule, cost and resources"],
        ["risk-quality-engagement", "Risk, quality and engagement"],
        ["delivery-approaches", "Predictive, agile and hybrid delivery"],
        ["monitoring-and-change", "Monitoring and problem-solving"],
        ["supervised-project-phase", "Supervised project phase"],
        ["independent-assessment", "Prepare for your independent assessment"],
      ]),
    ],
  },
] as const;

export function getPathway(slug: string) {
  return PATHWAYS.find((pathway) => pathway.slug === slug);
}
