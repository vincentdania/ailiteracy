---
day: 5
title: Long Documents and Numbers
subtitle: Summarise a 30-page document in minutes — and build a working spreadsheet by describing what you want, with no formulas typed.
---

# Long Documents and Numbers

**Read time: 12–15 minutes · Task: 10 minutes**

Two things bury professionals in work: documents too long to read fully, and spreadsheets too tedious to build. Today you practise a more structured way to handle both. You will summarise a long document in minutes, and get a working spreadsheet by describing what you want — AI writes the formulas, you type none.

## Summarising long documents

Policies, donor reports, papers, contracts — most of them are long because everything was included, not because everything matters to you. So do not ask for "a summary". Ask for **the decisions-relevant summary**:

```
ROLE: You are a senior analyst briefing me before a meeting.

CONTEXT: I am a [your role] and I have [X minutes] to act on this
document. Paste sections at a time if it is long.

TASK: Tell me, from the document only:
1. What does this require ME to do?
2. By when?
3. At what cost?
4. What decisions does someone above me need to make?
Quote the exact section for each answer. If the document does not
answer a question, say "not stated" — do not guess.

DOCUMENT:
[paste]
```

For a long document, paste it in sections — first half, ask, then second half, ask again — and finish with "combine your two summaries into one, keeping the four questions."

## Numbers without formulas

You do not need to know formulas to build a spreadsheet. You need to describe the table. The AI writes the formulas and explains them in plain language:

```
Build a spreadsheet layout I can copy into Google Sheets or Excel.

WHAT IT TRACKS: [e.g. my monthly sales]
COLUMNS: [e.g. Date, Item, Quantity, Unit Price, Total]
WHAT TO CALCULATE: [e.g. Total = Quantity × Unit Price for each row;
grand total for the month; total per item type]
EXPLAIN each formula in one plain-English sentence so I can check it.
```

Paste the result into Google Sheets (free with a Google account) or Excel, and it calculates. If a formula confuses you, reply: "Explain the grand-total formula like I am new to spreadsheets."

## Who uses this for what

- **SME owners:** budgets, cashbooks, stock trackers — "columns for money in, money out, balance carried forward."
- **NGO staff:** activity budgets — line items, quantities, unit costs, totals per activity, grand total that must match the donor template.
- **Teachers:** mark sheets and results summaries — scores, class average, position, pass count per subject.

## Limits, stated honestly

The AI summarises exactly what you paste — no more. Three rules carry over from Day 2 and now do double duty:

1. **Confidential documents do not go into free tools.** If the document is confidential, summarise a public one for practice today instead.
2. **Anonymise first.** Strip names, account numbers and identifying details before pasting. If figures are sensitive, round or replace them — you are testing structure, not leaking data.
3. **Check every total yourself.** AI-generated calculations and formulas can be wrong. Add one row by hand and compare.

## Worked example: a small trader's sales sheet

*Illustrative figures, not a real business's sales.* Input: two notebooks at ₦1,500 each and three pens at ₦200 each. Ask: “Create columns Item, Quantity, Unit price and Total. Give row formulas and a grand-total formula. Do not add sales I have not supplied.”

Expected rows: Notebooks | 2 | 1500 | `=B2*C2`; Pens | 3 | 200 | `=B3*C3`. Grand total: `=SUM(D2:D3)`. Independently check the multiplication and addition with a calculator before using the sheet. Revenue is not profit: stock costs and other expenses are not included.

On a phone, enter the two sample rows first and confirm that the formulas calculate before pasting a full table. If data is limited, practise with a short public extract rather than uploading a large PDF.

## 🎯 Task

1. **Summarise:** take one real long document you are responsible for — or, if it is confidential, a public policy document — and run the decisions-summary prompt. Check two of its quotes against the actual document.
2. **Build:** describe a spreadsheet you actually keep (or should keep) and get it built. Copy it into Google Sheets, paste the formulas, and confirm the totals calculate.

## 📤 Output

One decisions-relevant summary and one working spreadsheet with formulas AI wrote and you verified. Both go into your Playbook — the spreadsheet prompt is the one you will reuse most after this week ends.

---
**Privacy card (Day 2, still standing):** anonymise before paste. No names, no account numbers, no confidential figures into free tools.