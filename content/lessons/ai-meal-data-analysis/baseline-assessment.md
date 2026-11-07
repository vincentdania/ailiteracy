---
summary: The competency standard for the AI-Assisted MEAL Data Analyst pathway, and a 90-minute baseline task on a small programme dataset that shows your mentor where to start.
quiz:
  - question: 'A report says "80% of participants found jobs". What''s the first question to ask?'
    options:
      - Is 80% good?
      - '80% of whom? What was the denominator, and how was "found a job" defined?'
      - Which chart should we use?
      - Can we round it to 85%?
    answer: 1
    explanation: 'A percentage means nothing without its denominator and indicator definition. Always ask "of whom" and "measured how".'
  - question: Income rose among participants after the training. What can you conclude?
    options:
      - The training caused the rise
      - Income rose; without a comparison group or other design, we can't say how much was due to the training
      - The training had no effect
      - Income will keep rising
    answer: 1
    explanation: A before-after change is not proof of impact. Other things change over time too.
  - question: You find a participant listed twice in the dataset. What do you do?
    options:
      - Delete one row quietly
      - Investigate, decide by a rule, and record the change in a cleaning log
      - Leave it; it doesn't matter
      - Ask AI to fix it
    answer: 1
    explanation: Every change to data is decided by a rule and logged, so the analysis can be reproduced and checked.
---

**Time: about 2 hours · You'll need Excel or Google Sheets**

Before you learn anything new, you'll show what you can already do. The baseline task takes about 90 minutes and it isn't scored. It tells you and your mentor where to focus over the next eight weeks.

## What you'll have at the end

- A **baseline data check** of a small programme dataset
- A **self-rating** against the five competencies
- Your **strengths and gaps** written into your competence record

## The competency standard

| Competency | At the foundation standard, you can... |
| --- | --- |
| 1. Indicators | Write operational indicator definitions with clear numerators and defensible denominators |
| 2. Ethical collection | Design digital data collection tools with informed consent, minimal personal data and good question design |
| 3. Data quality | Investigate and document missing values, duplicates and outliers, with a reproducible cleaning log |
| 4. Analysis and visualisation | Calculate and present programme results accurately and clearly |
| 5. Honest interpretation | Separate associations and trends from causal effects, and disclose limitations |

Your partner project: assess the performance of a **fictional or properly anonymised** youth livelihoods or women's empowerment project, distinguishing outputs, outcomes and causal claims.

## What this pathway is not

- It doesn't train you to run impact evaluations. You'll learn to recognise when a claim needs one.
- It never involves exposing real beneficiaries' personal data to unapproved AI tools.
- It certifies foundational competence on an independent assessment. It isn't a professional licence or accreditation.

## The baseline case

Download the practice file [rise_baseline_sample.csv](/pathways/ai-meal-data-analysis/rise_baseline_sample.csv) and open it in Excel or Google Sheets. It's fictional. It describes the **Rise Youth Livelihoods Project**, which trained young people aged 18 to 35 in tailoring, phone repair and catering in the FCT and Nasarawa, and gave graduates a starter kit.

The sheet has 60 rows with these columns: `participant_id`, `state`, `sex`, `age`, `trade`, `completed_training` (yes/no), `income_before_ngn`, `working_6m` (yes/no), `income_6m_ngn`, `completed_training` (yes/no).

The donor report draft says: *"The project transformed lives: 85% of youth are now working and incomes have doubled thanks to the training."*

## The baseline task

Spend about 90 minutes. Use an AI assistant only on the column names and your own summary figures, never on the rows themselves, and log how you used it.

Write a two-page data check with these five headings:

1. **Quality problems.** What's wrong with the data? Look for missing values, duplicates, impossible values and inconsistent categories. Count each.
2. **Your numbers.** Calculate the share of participants working at 6 months, and the median income before and after. State your denominator each time.
3. **The donor claim.** Is "85% working" right? Is "incomes doubled" right? Is "thanks to the training" supported?
4. **Your rewrite.** Rewrite the donor sentence so it's accurate and honest.
5. **What you'd need.** What extra data or design would let the project make a stronger claim?

> **Stay safe:** This dataset is fictional, but treat it as if it were real: don't upload the rows to any AI tool, and don't share the file outside the course.

## Rate yourself

```
SELF-RATING (1 = I couldn't do this, 4 = I could do this for a real client)
1. Indicators:                  1  2  3  4
2. Ethical collection:          1  2  3  4
3. Data quality:                1  2  3  4
4. Analysis and visualisation:  1  2  3  4
5. Honest interpretation:       1  2  3  4

My strongest area:
The area I most want to improve:
```

## Before you hand in

- [ ] I counted every type of quality problem I found
- [ ] Every percentage states its numerator and denominator
- [ ] I explained whether the causal claim is supported
- [ ] I didn't upload any rows to an AI tool
- [ ] My AI-use log and self-rating are filled in
