---
summary: Investigate missing values, duplicates, outliers and inconsistent categories, clean a programme dataset by rule rather than by eye, and keep a reproducible cleaning log.
quiz:
  - question: Why never edit the raw data file directly?
    options:
      - It's slower
      - Keeping the raw file untouched means every change can be traced and redone
      - Excel won't allow it
      - Donors require it
    answer: 1
    explanation: Raw data stays as collected. Cleaning happens in a copy or in Power Query or a script, so it can be checked and reproduced.
  - question: A participant reports earning ₦9,500,000 in 30 days. Others report ₦20,000 to ₦150,000. What's the right action?
    options:
      - Delete it
      - 'Investigate: check for a typing error or verify with the field team, then apply a written rule and log it'
      - Replace it with the average
      - Keep it with no note
    answer: 1
    explanation: Outliers are investigated, not automatically deleted. The decision and reason go in the cleaning log.
  - question: 40 of 600 graduates didn't answer the follow-up. How should they appear in the analysis?
    options:
      - Counted as not working
      - Counted as working
      - Reported as missing, with the response rate shown and possible bias discussed
      - Removed without comment
    answer: 2
    explanation: 'Missing isn''t the same as "no". Report missingness openly and think about whether non-responders might differ.'
---

**Week 3 · About 15 to 20 hours · Competency 3: Data quality**

Every real dataset has problems. This week you'll find them systematically, fix them by written rules, and log every change so someone else could reproduce your clean dataset from the raw one.

## What you'll be able to do

- Profile a dataset to find missing values, duplicates, outliers and inconsistencies
- Write cleaning rules and apply them consistently
- Clean data reproducibly in Power Query (or Python)
- Keep a cleaning log that explains every change

## Key ideas

**Raw, working, clean.** Keep three stages: the raw export (never edited), the working steps (Power Query or script), and the clean output. Anyone should be able to rerun the steps on the raw file and get the same clean file.

**Profile first.** Before changing anything, count: rows, unique IDs, blanks per column, values outside allowed ranges, category spellings, and minimum, maximum and median of numeric columns.

**Common problems and rules.**

| Problem | How to find it | Typical rule |
| --- | --- | --- |
| Exact duplicates | Count rows per participant ID and submission | Keep the first submission; log removed IDs |
| Conflicting duplicates | Same ID, different answers | Flag; check with the field team; keep the verified one |
| Inconsistent categories | Pivot or group by the column | Map "F", "female", "Female " to `female` |
| Impossible values | Filter outside allowed ranges | Set to blank and flag; never guess |
| Outliers | Values far above the rest (e.g. above 3 × the interquartile range) | Verify; correct if a clear typo is confirmed, otherwise keep and flag |
| Missing values | Count blanks by column and group | Leave blank; report missingness; don't fill with zeros |

**Missingness matters.** If people who aren't working are less likely to answer the phone, your "% working" among respondents will be too high. Always report the response rate, and compare respondents and non-respondents on what you know (sex, state, trade).

## Worked example

```
CLEANING LOG: Rise 6-month follow-up  (raw file: rise_followup_raw_2026-10-02.csv, 618 rows)

#  | Step                               | Rule                                              | Rows affected | Result
1  | Remove test submissions            | pid starts with "TEST"                            | 6             | 612 rows
2  | Remove exact duplicates            | same pid + same answers; keep earliest            | 9             | 603 rows
3  | Conflicting duplicates             | same pid, different answers → field team checked  | 3 pids        | kept verified; 600 rows
4  | Standardise sex                    | F/female/Female → female; M/male → male           | 41            | 2 categories
5  | Standardise trade                  | "phone repairs", "Phone Repair" → phone_repair    | 27            | 3 categories
6  | Impossible ages                    | age < 18 or > 35 → blank, flagged                 | 4             | flagged
7  | Income outlier                     | R-0412 ₦9,500,000 → field team confirmed ₦95,000  | 1             | corrected
8  | Income where working = no          | income > 0 but working = no → flagged, not changed| 5             | flagged
9  | Missing follow-up                  | no response → kept as missing                     | 47            | response rate 92.2%

Clean file: rise_followup_clean.xlsx (600 rows). Steps reproducible in Power Query: query "Clean_Followup".
```

## Use AI well this week

AI can help write Power Query M or Python code and suggest checks. Give it column names and types only, never the data.

```
In Power Query, I have a table with columns pid (text), sex (text), age
(number), income_30d (number), working (text). Write steps to: trim and
lower-case sex and map variants to "female" / "male"; flag ages outside
18–35; flag income_30d above 3 times the interquartile range. Explain each step.
```

Test any code on a small copy first, and check the row counts after each step match your expectations.

> **Stay safe:** Clean on an approved device and storage. Never paste beneficiary rows, names or phone numbers into an AI tool.

## Guided practice

> **Try it:** Download the practice dataset [rise_followup_raw.csv](/pathways/ai-meal-data-analysis/rise_followup_raw.csv). It's fictional, and it has problems planted in it for you to find. Profile it, write your cleaning rules, apply them in Power Query (or Python), and keep the cleaning log. Compare respondents and non-respondents by sex and state.

## Your evidence this week

Hand in, as described in the week 3 evidence brief:

1. A **clean dataset** and the raw file it came from
2. Your **reproducible cleaning steps**: the Power Query file or script
3. A **cleaning log** of every rule, rows affected and result
4. A short **data quality note**: missingness, remaining concerns and possible bias

What the assessor looks for: problems found systematically, rules applied consistently, nothing guessed, and a log someone else could follow to the same result.

## Before you hand in

- [ ] The raw file is untouched
- [ ] Rerunning my steps on the raw file gives the same clean file
- [ ] Every change is in the log with a rule and a row count
- [ ] Missing values are reported, not filled with zeros
- [ ] My note discusses possible bias from non-response
