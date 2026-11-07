---
summary: Build a project dashboard in Excel or Power BI that reconciles exactly with your indicator workbook, chooses the right chart for each question, and is honest and accessible.
quiz:
  - question: Your dashboard shows 360 graduates working; your indicator workbook says 355. What do you do?
    options:
      - Use whichever number looks better
      - Find the cause, fix it, and record the reconciliation before sharing
      - Average them
      - Remove the number from the dashboard
    answer: 1
    explanation: A dashboard must reconcile with the source calculations. Differences usually mean a filter, a duplicate or a different definition.
  - question: A bar chart's vertical axis starts at 50% instead of 0. What's the risk?
    options:
      - None
      - Small differences look much larger than they are
      - The chart loads slowly
      - It's harder to print
    answer: 1
    explanation: Bar charts should start at zero. A truncated axis exaggerates differences.
  - question: Which chart best shows the working rate for each of three trades?
    options:
      - A pie chart
      - A bar chart with the rate and n labelled
      - A 3D chart
      - A scatter plot
    answer: 1
    explanation: Bar charts make comparisons across categories easy. Label each bar with the value and group size.
---

**Week 5 · About 15 to 20 hours · Competency 4: Analysis and visualisation**

Managers and donors often see your work only through a dashboard. This week you'll build one that's accurate to the last number, easy to read, and honest about uncertainty.

## What you'll be able to do

- Plan a dashboard around the decisions its users need to make
- Choose charts that answer specific questions clearly
- Build the dashboard in Excel or Power BI from your clean data
- Reconcile every figure with the indicator workbook

## Key ideas

**Start with users and questions.** Who will use the dashboard, and what decisions will they make? A programme manager might ask: "Are we on track against targets? Which groups or locations are falling behind?"

**One question per visual.**

| Question | Chart |
| --- | --- |
| Are we meeting the target? | Single value with target and n (a KPI card) |
| How do groups compare? | Bar chart, starting at zero, labelled with values and n |
| How has it changed over time? | Line chart with consistent intervals |
| What makes up the total? | Stacked bar (avoid pie charts with many slices) |

**Reconciliation.** Every number on the dashboard must match the indicator workbook. Keep a reconciliation table: figure, dashboard value, workbook value, match, note.

**Honest design.** Bars start at zero; group sizes are shown; small groups are flagged or suppressed (fewer than 5); colours have a legend; definitions and data dates are on the page.

**Accessibility.** Good contrast, don't rely on colour alone (add labels), readable font sizes, and alt text or a text summary for each chart if the dashboard is shared as an image or PDF.

## Worked example

```
DASHBOARD PLAN: Rise project, 6-month results (for the programme manager)

Page 1: Are we on track?
  KPI cards: % working (64.2%, n = 553, target 60%), median income (₦48,000, n = 355),
             response rate (92.2%)
  Note: "Excluding non-respondents. If all were not working: 59.2%."

Page 2: Who is doing better or worse?
  Bar: % working by sex (labels: 61.0%, n = 287 | 67.7%, n = 266)
  Bar: % working by trade (labels with n)
  Bar: % working by state

Page 3: Definitions and data
  Indicator definitions, data source, collection dates, cleaning log link,
  limitations.

RECONCILIATION
Figure                  | Dashboard | Workbook | Match | Note
Respondents             | 553       | 553      | yes   |
Working                 | 360       | 355      | NO    | Dashboard included 5 rows flagged "income but not working" → filter fixed
Working (after fix)     | 355       | 355      | yes   |
Median income           | 48,000    | 48,000   | yes   |
```

## Power BI or Excel?

Either is fine. Excel with PivotTables and PivotCharts is enough for a small project. Power BI is better when data refreshes regularly or users need filters. Whichever you choose, load the **clean** data, build measures that follow the indicator definitions, and keep the cleaning in Power Query so refreshes are reproducible.

## Use AI well this week

AI can suggest chart types and write DAX or Excel formulas from your definitions.

```
I'm building a Power BI measure. Table: Followup with columns pid, working
("yes"/"no"/blank), consent ("yes"/"no"). Write a DAX measure for "% working
among respondents" where respondents are consent = "yes" and working is not
blank. Explain how it treats blanks.
```

Check every measure against the workbook value before you trust it.

> **Stay safe:** If the dashboard will be shared, remove participant IDs and any row-level personal data. Suppress groups smaller than 5.

## Guided practice

> **Try it:** Plan the dashboard for your partner scenario on paper first: users, questions, one visual per question. Build it, then fill in a reconciliation table until every figure matches.

## Your evidence this week

Hand in, as described in the week 5 evidence brief:

1. A **project dashboard** in Excel or Power BI (file or link) with a definitions page
2. A **reconciliation table** showing every figure matches the workbook
3. A **dashboard plan** naming users, questions and why each chart was chosen

What the assessor looks for: exact reconciliation, charts that answer clear questions, honest and accessible design, and no personal data.

## Before you hand in

- [ ] Every number on the dashboard matches the workbook
- [ ] Bars start at zero; values and n are labelled
- [ ] Definitions, data dates and limitations are on the dashboard
- [ ] Groups smaller than 5 are suppressed or flagged
- [ ] No participant IDs or personal data are visible
