---
summary: Design an ethical digital survey in KoboToolbox, with an informed consent flow, good questions, validation rules and a codebook that makes the data easy to analyse.
quiz:
  - question: A respondent says no at the consent question. What should the form do?
    options:
      - Continue anyway; the data is useful
      - End the survey politely and record only that consent was refused
      - Ask again until they agree
      - Skip the sensitive questions only
    answer: 1
    explanation: No consent means no survey. The form should end, recording only the refusal (no answers).
  - question: Which question is best?
    options:
      - "Don't you agree the training was excellent?"
      - "How much did you earn and did you like the trainer?"
      - "In the past 30 days, how much did you earn in total from your trade, in naira?"
      - "Are you rich now?"
    answer: 2
    explanation: It's neutral, asks one thing, sets a time period and gives a clear unit.
  - question: 'Why add a constraint such as "age must be between 18 and 35"?'
    options:
      - To make the form longer
      - To catch typing errors at collection time, when they're easiest to fix
      - Because Kobo requires it
      - To exclude people
    answer: 1
    explanation: Validation at collection prevents many cleaning problems later.
---

**Week 2 · About 15 to 20 hours · Competency 2: Ethical collection**

Data quality and ethics are decided when the form is designed. This week you'll build a working KoboToolbox form that asks good questions, protects respondents and produces data that's ready to analyse.

## What you'll be able to do

- Write clear, neutral questions that measure your indicators
- Build an informed consent flow and collect the minimum personal data
- Use question types, skip logic and constraints in KoboToolbox
- Write a codebook that defines every variable

## Key ideas

**Every question earns its place.** Each question should map to an indicator or a clear analytical need. If you can't say how you'll use the answer, cut the question.

**Good question design.** One idea per question; neutral wording; a defined time period ("in the past 30 days"); clear units ("in naira"); answer options that are exhaustive and don't overlap; "Don't know" and "Prefer not to say" where appropriate.

**Informed consent.** Before any questions: who you are, why you're asking, how long it takes, that taking part is voluntary, that they can stop or skip any question, how the data is protected, and who to contact. Then an explicit yes or no.

**Data minimisation.** Collect only the personal data you need. Use a participant ID instead of names where you can, and keep the ID-to-name list separate and locked down.

**Validation.** Constraints (age 18 to 35), required fields, skip logic (only ask about the business if they're self-employed), and choice lists instead of free text where possible.

**Codebook.** A table listing each variable name, the question text, the type, the allowed values and their codes, and the skip logic.

## Worked example

A section of the Rise 6-month follow-up form in KoboToolbox's XLSForm format:

```
survey sheet
type                 | name          | label                                                          | relevant               | constraint
note                 | intro         | Hello, I'm calling from the Rise project... (consent script)   |                        |
select_one yesno     | consent       | Do you agree to take part?                                     |                        |
end_group / end      |               | (form ends if consent = no)                                    |                        |
text                 | pid           | Participant ID (from call sheet)                               | ${consent}='yes'       | regex(., '^R-[0-9]{4}$')
select_one yesno     | working       | In the past 30 days, did you earn any money from work?         | ${consent}='yes'       |
select_one worktype  | work_type     | Was that from a job, your own business, or both?               | ${working}='yes'       |
integer              | income_30d    | In the past 30 days, how much did you earn in total, in naira? | ${working}='yes'       | . >= 0 and . <= 2000000
select_one yesno     | feedback_ok   | Is there anything about the project you'd like to raise?       | ${consent}='yes'       |
```

```
CODEBOOK (extract)
Variable    | Question                              | Type        | Values / codes                       | Skip logic
consent     | Do you agree to take part?            | select_one  | yes, no                              | all
pid         | Participant ID                        | text        | R-0001 to R-9999                     | consent = yes
working     | Earned any money from work, 30 days   | select_one  | yes, no                              | consent = yes
work_type   | Job, own business or both             | select_one  | job, own_business, both              | working = yes
income_30d  | Total earnings, 30 days (₦)           | integer     | 0 to 2,000,000; blank if not working | working = yes
```

## Use AI well this week

AI can review questions for bias, double-barrelled wording and missing options. Paste your questions, never responses.

```
Review these survey questions for a youth livelihoods follow-up (pasted).
For each, flag: leading wording, two questions in one, missing time periods
or units, overlapping or missing answer options. Suggest a better version.
```

> **Stay safe:** Plan how data will be stored and who can see it. In KoboToolbox, restrict project access to named team members, and don't export personal data to personal devices or unapproved tools.

## Guided practice

> **Try it:** Build the follow-up survey for your three indicators in KoboToolbox (a free account is fine for practice). Include the consent flow, at least one skip pattern and three constraints. Test it on a phone with at least five made-up submissions, including a consent refusal and an out-of-range value.

## Your evidence this week

Hand in, as described in the week 2 evidence brief:

1. A **working KoboToolbox form**: a link to the form or the XLSForm file
2. A **codebook** for every variable
3. Your **consent flow** text and how refusal is handled
4. **Test submissions** showing skip logic and constraints working

What the assessor looks for: questions that map to indicators, neutral and clear wording, a real consent flow, minimal personal data and validation that works.

## Before you hand in

- [ ] Every question maps to an indicator or stated need
- [ ] The form ends if consent is refused
- [ ] Constraints and skip logic were tested and work
- [ ] No unnecessary personal data is collected
- [ ] The codebook matches the form exactly
