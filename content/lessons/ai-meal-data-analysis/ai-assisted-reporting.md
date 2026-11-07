---
summary: Use AI responsibly to help code qualitative data and draft reports, validate every AI-assisted finding against the data, and keep an AI-use log that a reviewer can audit.
quiz:
  - question: You want AI help to code 200 open-ended feedback responses. What must happen first?
    options:
      - Paste them all into any free AI tool
      - Remove names, phone numbers and identifying details, and use an approved tool
      - Translate them into English with any tool
      - Nothing
    answer: 1
    explanation: Beneficiary data must be de-identified and only used with approved AI services.
  - question: How do you check AI-assigned qualitative codes?
    options:
      - Trust them if they look reasonable
      - Code a random sample yourself, compare, and record the agreement rate; revise the codes if agreement is low
      - Ask the AI if it's sure
      - Check only the first five
    answer: 1
    explanation: A human-coded sample shows how reliable the AI coding is. Report the agreement, and don't rely on codes that don't hold up.
  - question: 'An AI-drafted report says "participants overwhelmingly praised the trainers". Your data shows 31% mentioned trainers, mostly positively. What do you do?'
    options:
      - Keep it; it's roughly right
      - 'Rewrite it to match the data, such as "about a third mentioned trainers, mostly positively"'
      - Delete all mention of trainers
      - Add a quote to support it
    answer: 1
    explanation: Every claim must match the evidence. AI drafts often exaggerate; you correct them.
---

**Week 6 · About 15 to 20 hours · Competencies 4 and 5, with AI**

AI can speed up the slowest parts of MEAL work: coding open-ended answers, summarising, and drafting reports. It can also invent findings, exaggerate, and leak data. This week you'll use it in a way you can defend to any reviewer.

## What you'll be able to do

- Prepare qualitative data safely for AI-assisted coding
- Build and apply a codebook for qualitative themes, with AI help
- Validate AI coding and AI-drafted findings against the data
- Keep an auditable AI-use log

## Key ideas

**Approved tools only.** Use AI services your organisation has approved for this kind of data, and check their data-retention terms. If none is approved, use AI only on de-identified, aggregated material, or not at all.

**De-identification.** Remove names, phone numbers, addresses, exact locations, and details that could identify someone in a small community ("the only female welder in Keffi"). Use a participant ID.

**Qualitative coding.** Read a sample, draft a codebook of themes with definitions and examples, then apply codes to every response. AI can suggest themes and apply codes, but a person sets the final codebook and checks the coding.

**Validation.** Code a random sample of at least 20% yourself, without seeing the AI's codes. Compare. Report the agreement. Where agreement is low, refine the definitions and recode.

**Findings trace to evidence.** Every finding in the report links to a number in the workbook or to coded qualitative evidence. AI-drafted text is checked line by line.

## Worked example

```
QUALITATIVE CODEBOOK (extract): "What could the project do better?"
Code             | Definition                                    | Example (de-identified)
kit_delay        | Starter kit arrived late or incomplete        | "My machine came two months after"
market_access    | Difficulty finding customers or a workspace   | "No shop to work from"
training_length  | Training too short or too rushed              | "Twelve weeks is not enough for tailoring"
trainer_praise   | Positive comments about trainers              | "Our instructor was patient"
other            | Doesn't fit the codes above                   |

VALIDATION
Sample: 50 of 212 responses, random (seed 42), coded independently by me
Agreement with AI codes: 41 of 50 (82%)
Main disagreement: AI coded "no shop" as kit_delay 5 times → definition clarified, all responses recoded
```

```
AI-USE LOG (extract)
Date   | Task                      | Tool (approved?) | Input                         | Kept                  | Changed / rejected                         | How checked
14 Nov | Suggest themes            | [org tool] (yes) | 212 de-identified responses   | 4 of 6 themes         | Merged 2 overlapping themes                | Read 60 responses
15 Nov | Apply codes               | [org tool] (yes) | Same + codebook               | Codes                 | Recoded after definition change            | 50-response sample, 82% agreement
16 Nov | Draft findings paragraph  | [org tool] (yes) | Summary table only            | Structure             | Removed "overwhelmingly"; fixed 2 figures  | Each sentence vs workbook
```

## Use AI well this week

```
Below are de-identified answers to "What could the project do better?"
Suggest up to 6 themes. For each: a short name, a one-sentence definition,
and two example answers quoted exactly from the list. Don't create themes
that fewer than 5 answers support. Don't invent quotes.
```

Then check that every example quote really appears in the data.

> **Stay safe:** Never expose personal beneficiary data to unapproved AI services. Never present an AI-generated quote, number or finding that you haven't checked against the data. Both are mandatory requirements.

## Guided practice

> **Try it:** Use the `feedback` column in the practice dataset [rise_followup_raw.csv](/pathways/ai-meal-data-analysis/rise_followup_raw.csv). It's fictional and already de-identified. Build a codebook with AI help, apply it, validate a 20% sample, then draft a one-page findings summary combining quantitative and qualitative results. Log every AI use.

## Your evidence this week

Hand in, as described in the week 6 evidence brief:

1. **Validated findings**: a one-page summary where every finding links to its evidence
2. A **qualitative coding sample**: codebook, coded responses and validation results
3. Your **AI-use log** for the week

What the assessor looks for: safe data handling, a human-checked codebook, honest agreement figures, and findings that match the evidence exactly.

## Before you hand in

- [ ] All data given to AI was de-identified and the tool was approved
- [ ] I coded a random sample myself and reported agreement
- [ ] Every quote appears word for word in the data
- [ ] Every finding links to a number or coded evidence
- [ ] My AI-use log is complete
