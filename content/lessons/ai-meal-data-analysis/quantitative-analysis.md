---
summary: Calculate programme indicators accurately in an Excel workbook, disaggregate them, compare against baselines and targets, and write an interpretation memo that says exactly what the numbers do and don't show.
quiz:
  - question: Monthly incomes are ₦20,000, ₦25,000, ₦30,000, ₦35,000 and ₦600,000. Which summary best describes a typical participant?
    options:
      - The mean, ₦142,000
      - The median, ₦30,000
      - The maximum
      - The total
    answer: 1
    explanation: The median isn't pulled up by one very high value. Report the median for skewed data like income, and say which you used.
  - question: Women's working rate is 58% (n = 24) and men's is 66% (n = 290). What should your memo say?
    options:
      - Women do much worse
      - The rate is lower for women, but the group is small, so the difference is uncertain
      - There's no difference
      - Combine the groups and don't mention it
    answer: 1
    explanation: Always show group sizes. With small groups, apparent differences can be due to chance.
  - question: The working rate rose from 22% at intake to 64% at 6 months. What does the memo say about cause?
    options:
      - The training caused a 42-point increase
      - The rate rose by 42 points over the period; without a comparison group we can't attribute the change to the project
      - Nothing changed
      - The starter kits caused it
    answer: 1
    explanation: Before-after changes include everything else that happened in that time. Describe the change; don't claim cause.
---

**Week 4 · About 15 to 20 hours · Competencies 4 and 5: Analysis and honest interpretation**

This week you turn clean data into indicator results. You'll build a workbook that calculates each indicator from your reference sheets, and a memo that interprets the results carefully.

## What you'll be able to do

- Calculate indicators exactly as defined, with visible formulas
- Disaggregate by sex, age group, location and other groups
- Choose the right summary: counts, percentages, means, medians
- Compare with baseline and target, and write honest interpretation

## Key ideas

**Follow the reference sheet.** Each indicator is calculated exactly as its reference sheet says: same definition, numerator and denominator. If you have to change something, update the sheet and say why.

**Show your working.** Use formulas (COUNTIFS, AVERAGEIFS, MEDIAN with filters, PivotTables) rather than typed numbers. Anyone should be able to click a cell and see where it came from.

**Always report n.** Every percentage needs its count and denominator: "64% (384 of 600)". For small groups (fewer than about 30), say the result is uncertain.

**Mean or median.** Income is usually skewed by a few high earners. Report the median, and the mean only if you explain the difference.

**Disaggregation.** Results for subgroups can reveal who the project is and isn't reaching. But protect privacy: don't publish a group so small that individuals could be identified (for example, fewer than 5 people).

**Association, trend and cause.**

| You observe | You can say | You can't say (without a suitable design) |
| --- | --- | --- |
| Working rate rose after training | The rate rose over the period | The training caused the rise |
| Graduates with starter kits earn more | Kit recipients earn more, on average | The kit caused higher earnings (kits may have gone to the most motivated) |
| Catering graduates earn most | Earnings differ by trade | Everyone should train in catering |

## Worked example

```
INDICATOR WORKBOOK: Rise 6-month follow-up (clean file, n = 553 respondents of 600 due)

Indicator                                       | Result        | n / denominator | Baseline | Target | Formula sheet
% graduates working (respondents)               | 64.2%         | 355 / 553       | 22.0%    | 60%    | Calc!B4
% working, assuming non-respondents not working | 59.2%         | 355 / 600       | —        | —      | Calc!B5 (sensitivity)
Median income, past 30 days, those working (₦)  | 48,000        | 355             | 15,000*  | —      | Calc!B7
% working: female / male                        | 61.0% / 67.7% | 175/287 / 180/266 | —      | —      | Calc!B9:C9
% working: tailoring / phone repair / catering  | 55.9% / 70.3% / 66.3% | 104/186, 135/192, 116/175 | — | — | Calc!B11:D11
* intake median among those working at intake (n = 132)
```

```
INTERPRETATION MEMO (extract)
At six months, 64% of graduates who responded (355 of 553) reported earning
money from work in the past 30 days, above the 60% target. If all 47
non-respondents were not working, the rate would be 59%, so the target is met
only if non-respondents are similar to respondents.

The working rate is higher than the 22% recorded at intake. Because there is no
comparison group, we cannot say how much of this change is due to the project:
other factors, such as general economic conditions or participants' own
motivation, may have contributed.

Women's rate (61%) is lower than men's (68%). The difference is modest and
should be monitored in the next cohort rather than treated as conclusive.
```

## Use AI well this week

AI can check formulas and suggest how to phrase findings cautiously. It must never be the source of a number.

```
Here are my indicator results (summary table, no personal data). Rewrite
these three findings so they're accurate and don't imply causation. Flag any
place where I need to show a denominator or warn about a small group.
```

Recalculate any number the AI questions, yourself.

> **Stay safe:** Never round, drop or adjust numbers to meet a target. If the result is below target, report it. Integrity is a mandatory requirement.

## Guided practice

> **Try it:** Build the indicator workbook for your three indicators using your clean week 3 dataset. Add a sensitivity row for non-response. Write a one-page interpretation memo.

## Your evidence this week

Hand in, as described in the week 4 evidence brief:

1. An **indicator workbook** with formulas visible and n shown for every result
2. An **interpretation memo** separating what the data shows from what it can't show
3. A **reconciliation check**: totals that match across tables and the clean dataset

What the assessor looks for: accurate calculations that follow the reference sheets, appropriate summaries, and careful, honest interpretation.

## Before you hand in

- [ ] Every result follows its indicator reference sheet
- [ ] Every percentage shows its numerator and denominator
- [ ] Medians are used for income, with the choice stated
- [ ] No causal claim is made without a suitable design
- [ ] Totals reconcile across tables
