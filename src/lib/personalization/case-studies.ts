export type CaseStudy = {
  slug: string;
  name: string;
  region: string;
  sector: string;
  summary: string;
  lesson: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ubenwa-newborn-care",
    name: "Ubenwa: listening for newborn risk",
    region: "Nigeria",
    sector: "Health",
    summary: "A Nigerian-founded health technology team is researching how machine learning can help clinicians screen newborn cries for signs that merit closer attention.",
    lesson: "Useful AI begins with a narrow problem, representative data and a workflow that keeps qualified humans responsible for the decision.",
    sourceLabel: "Ubenwa research partnership",
    sourceUrl: "https://www.ubenwa.ai/news/ubenwa-partners-top-nenonatalogist-nigeria",
  },
  {
    slug: "masakhane-african-languages",
    name: "Masakhane: language technology built with communities",
    region: "Pan-African",
    sector: "Language & research",
    summary: "Masakhane is a grassroots research community advancing natural-language processing for African languages through open, participatory work.",
    lesson: "Language technology is stronger when speakers help define the data, evaluation and real-world meaning of quality.",
    sourceLabel: "Masakhane publications",
    sourceUrl: "https://www.masakhane.io/publications",
  },
  {
    slug: "esusfarm-smallholders",
    name: "eSusFarm: data-informed finance for smallholders",
    region: "Ghana & sub-Saharan Africa",
    sector: "Agriculture & finance",
    summary: "eSusFarm combines farmer records with satellite and weather information to help smallholder farmers build a financial history and make better farming decisions, including through feature-phone channels.",
    lesson: "The best AI product may meet users through familiar, low-bandwidth tools rather than asking them to adopt an expensive new interface.",
    sourceLabel: "Microsoft Source case study",
    sourceUrl: "https://news.microsoft.com/source/emea/features/ai-smallholder-farmer-finance-esusfarm/",
  },
  {
    slug: "google-flood-nigeria",
    name: "Flood forecasting for Nigerian communities",
    region: "Nigeria",
    sector: "Climate resilience",
    summary: "Google's flood forecasting work has been used with humanitarian partners to make river forecasts and alerts more actionable for communities exposed to flooding in Nigeria.",
    lesson: "A prediction creates value only when it reaches the right people early enough, in language and channels they can act on.",
    sourceLabel: "Google flood forecasting case study",
    sourceUrl: "https://blog.google/company-news/outreach-and-initiatives/sustainability/4-flood-forecasting-collaboration-case-studies-show-how-ai-can-help-communities-in-need/",
  },
  {
    slug: "agriadvisor-field-guidance",
    name: "AgriAdvisor: field guidance through messaging",
    region: "East Africa",
    sector: "Agriculture",
    summary: "Microsoft Research's AgriAdvisor explores AI-assisted agronomic guidance delivered through accessible channels such as SMS and WhatsApp.",
    lesson: "Good AI assistants combine trusted domain knowledge, local context and an interface that fits the user's day-to-day reality.",
    sourceLabel: "Microsoft Research AgriAdvisor",
    sourceUrl: "https://www.microsoft.com/en-us/research/project/agriadvisor/",
  },
];

export function getCaseStudy(slug?: string | null) {
  return CASE_STUDIES.find((item) => item.slug === slug);
}
