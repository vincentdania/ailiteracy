# Assessor guide: AI-Assisted MEAL Data Analyst

**Confidential. For mentors and independent assessors only. Do not seed, publish or share with learners.**

## The decision

You decide whether the learner has **demonstrated foundational competence** on an unseen dataset. Record **competent** or **not yet competent**, with reasons. Competent requires **80% overall** and a pass on **integrity** and **privacy**.

## Assessment conditions

- One working day (about 7 hours) for the analysis, then a 30-minute oral defence.
- Open book: notes, past work and an approved AI assistant are allowed, but no personal data may go into AI tools. AI use must be logged.
- Use only fictional or properly anonymised datasets. Plant known problems and keep an answer key (the "true" clean counts and indicator values) so accuracy can be checked objectively.
- The dataset must be new to the learner. The independent assessor must not have mentored the learner.

## Unseen dataset A: Market Women Digital Payments Pilot (fictional)

> A fictional NGO trained 450 market traders (mostly women) in Lafia and Keffi to accept mobile and transfer payments, and gave 300 of them a free POS device by lottery after training. Data: intake survey, 4-month follow-up and a short open-ended question. The programme manager asks: (1) Did traders complete training? (2) What share accept digital payments at 4 months? (3) Do device recipients accept digital payments more than non-recipients? (4) What problems do traders report? (5) What should change?

**Plant in the data:** 12 duplicate submissions (3 conflicting), 8% missing follow-ups skewed towards Keffi, "Lafia"/"lafia"/"LAFIA" variants, two impossible ages, one income outlier from a missing zero, three participants with a phone number typed into the open-ended answer (privacy trap: must be removed, not reproduced).

**Judgement point:** the device was allocated by **lottery**, so comparing recipients with non-recipients *can* support a causal statement about the device (with caveats about non-response), unlike the before-after training change. Strong learners notice this; weak learners either claim everything is causal or nothing is.

## Unseen dataset B: Girls' Secondary Transition Scholarships (fictional)

> 600 girls received scholarships in their final primary year in Bauchi; schools were chosen because they had the highest dropout rates. Data: school records and a follow-up survey 1 year later. Questions: What share transitioned to secondary school? How does it vary by LGA? Can we say the scholarships caused transition rates to rise?

**Plant in the data:** school names spelled inconsistently, missing LGA for 20 records, a cohort of 4 girls in one school (small-cell privacy trap), and an enrolment date before the scholarship date for 6 records.

**Judgement point:** schools were selected for high dropout, so any rise may partly reflect regression to the mean. A competent learner should not claim causation and should name selection as a limitation.

## Scoring

Score each dimension on four levels, then convert: Not yet = 25% of the weight, Developing = 55%, Competent = 85%, Strong = 100%. Check calculations against the answer key.

| Dimension (weight) | Not yet | Developing | Competent | Strong |
| --- | --- | --- | --- | --- |
| Programme logic and indicators (15) | Confuses outputs and outcomes | Indicators named but denominators vague | Indicators defined with correct, stated denominators | Notes indicator weaknesses and proposes better ones |
| Data quality and reproducibility (20) | Raw data edited; changes untracked | Main problems found; log incomplete | All planted problems found or reasoned about; complete log; steps reproduce the clean file | Also compares respondents and non-respondents to assess bias |
| Accuracy and interpretation (25) | Wrong figures | Mostly right; some denominator or summary errors | Figures match the answer key; n shown; appropriate summaries | As competent, with sensitivity analysis and careful uncertainty language |
| Reporting (15) | Unclear, unstructured | Answers some questions | Answers every question clearly; dashboard reconciled; limitations stated | Concise, decision-focused, excellent visuals |
| Judgment (15) | Overclaims cause or misses key limits | Some overclaiming or excessive hedging | Correctly separates association and cause given the design | Spots the design's judgement point (lottery or selection) and explains it |
| Oral defence (10) | Can't explain own work | Explains with prompting | Explains denominators, cleaning and claims clearly | Revises confidently and accurately on the spot |

## Mandatory requirements (any fail = not yet competent)

- [ ] **Integrity:** no invented, altered or selectively reported findings; every figure traceable to the data; results below target reported
- [ ] **Privacy:** no personal data in outputs (including the phone numbers in free text and small cells under 5); no personal data given to unapproved AI services

## Defence questions

1. Talk me through the denominator for your main indicator. Why that one?
2. How did you handle missing follow-ups? Which direction could that bias the result?
3. Reproduce one cleaning step for me from the raw file.
4. Is this finding descriptive or causal? What in the design lets you say that?
5. Show me your AI-use log. What did you reject?
6. The manager wants the headline figure "rounded up for the donor". What do you say?

## Decision record

```
Learner:                     Dataset:          Date:
Assessor:                    Moderator (if borderline):
Scores: Logic __/15  Data quality __/20  Accuracy __/25  Reporting __/15  Judgment __/15  Defence __/10   Total __/100
Mandatory: Integrity [pass/fail]  Privacy [pass/fail]
Accuracy vs answer key: indicators matched __ of __
Decision: competent / not yet competent
Reasons, strengths, gaps and remediation, reassessment date:
```

## Moderation

A second assessor reviews every result between 75% and 85%, every mandatory fail, and a random 20% of the rest. Record agreed decisions with both names.
