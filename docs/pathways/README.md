# Competence pathways

Four eight-week, mentor-led pathways from the *Hyrax Competence Lab Four Pathways Programme Handbook* (pilot edition, November 2026), under the Hyrax Competence Development Framework (HCDF):

| Pathway | Course slug | Assessor guide |
| --- | --- | --- |
| AI Business Growth Specialist | `ai-business-growth` | [ai-business-growth-assessor-guide.md](ai-business-growth-assessor-guide.md) |
| AI Business Automation Specialist | `ai-business-automation` | [ai-business-automation-assessor-guide.md](ai-business-automation-assessor-guide.md) |
| AI-Assisted MEAL Data Analyst | `ai-meal-data-analysis` | [ai-meal-data-analysis-assessor-guide.md](ai-meal-data-analysis-assessor-guide.md) |
| AI-Enabled Project Delivery Practitioner | `ai-project-delivery` | [ai-project-delivery-assessor-guide.md](ai-project-delivery-assessor-guide.md) |

## Where things live

- **Structure** (competencies, weeks, evidence, rubric, safeguards, modules): `src/lib/pathways.ts`
- **Lessons**: `content/lessons/<pathway>/<slug>.md`, plus the shared `content/lessons/shared/competence-pathway-guide.md`
- **Evidence briefs**: `content/assignments/<pathway>/baseline.md`, `week-1.md` to `week-8.md`, `portfolio.md`
- **Assessor guides**: this folder. They contain the unseen assessment briefs, so they are **not** seeded and must never be shown to learners.

Each pathway's modules are: *Start here* (the shared guide and a pathway baseline), then one module per week. Week 8 is the independent assessment.

## Status: unpublished drafts

`pnpm db:seed` creates the four courses with `isPublished: false` and a price of ₦0. They do not appear on the home page, checkout, dashboard or lesson reader, which all read `TRACKS` in `src/lib/tracks.ts`. Launching a pathway needs a decision on price, cohort dates and access, then wiring it into the site. Once a course has been published by hand, the seed no longer changes its price or published flag.

## How these differ from the two self-paced tracks

The handbook's design is followed for these pathways where it differs from the academy term structure used by the small-business and professionals tracks:

| | Self-paced tracks | Competence pathways (handbook) |
| --- | --- | --- |
| Length | 8 teaching weeks + week 9 portfolio | 8 weeks; week 8 is the independent assessment; portfolio submitted in week 8 |
| Weekly work | Build + apply assignments | Evidence + revision after written mentor feedback |
| Assessment | None; an on-time submission counts | Rubric-scored by mentor (weekly) and an independent assessor (final); 80% overall plus mandatory passes on safety, ethics, data integrity and authorization |
| Starting point | None | Diagnostic baseline task |
| Certificate | Submissions on time + portfolio | "Demonstrated foundational competence", independently assessed; never completion alone |
| Format | Self-paced, ₦20,000, 3 months access | Cohort of five, 15–20 hours a week, mentor + independent assessor, partner briefs |
| Final | Public GitHub Pages portfolio | Unseen task + oral defence; portfolio published only with partner permission |

## Pilot gates (from the handbook)

Before a first cohort: appoint a pilot programme owner, choose the first pathway, secure an occupational lead and an independent assessor, recruit three realistic partner briefs, publish the one-page competency standard (in each pathway's baseline lesson), create baseline tasks (done) and an evidence register (the competence record in the shared guide), and validate an itemised budget.

Durations, thresholds and targets are proposals that need empirical validation. No certificate may imply a licensed profession, an accreditation Hyrax has not obtained, or equivalence to third-party credentials such as PMP.
