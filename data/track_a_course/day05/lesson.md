---
day: 5
title: Long Documents and Numbers
subtitle: Summarise a 30-page document in minutes, and build a working spreadsheet by describing what you want, without typing a single formula.
---

# Long Documents and Numbers

**Read time: 12–15 minutes · Task: 10 minutes**

Two things bury professionals in work: documents too long to read in full, and spreadsheets too tedious to build. Today you practise a more structured way to handle both. You will summarise a long document in minutes, and get a working spreadsheet by describing what you want. The AI writes the formulas; you type none.

## Summarising long documents

Policies, donor reports, papers and contracts are usually long because everything was included, not because everything matters to you. So do not ask for "a summary". Ask for a **decisions-relevant summary**:

```
ROLE: You are a senior analyst briefing me before a meeting.

CONTEXT: I am a [your role] and I have [X minutes] to act on this
document.

TASK: Tell me, from the document only:
1. What does this require ME to do?
2. By when?
3. At what cost?
4. What decisions does someone above me need to make?
Quote the exact section for each answer. If the document does not
answer a question, say "not stated". Do not guess.

DOCUMENT:
[paste]
```

If the document is too long to paste in one go, split it:

1. Paste the prompt with the first half of the document and send it.
2. Save the answer (copy it into your phone notes).
3. Paste the second half and ask the same four questions.
4. Finish with: "Combine your two summaries into one, keeping the four questions."

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

Copy the result into Google Sheets (free with a Google account) or Excel. Type the column headings and figures into the cells the AI names, then paste each formula into its cell. The cell should show a number, not the formula text. If a formula confuses you, reply: "Explain the grand-total formula as if I am new to spreadsheets."

## Who uses this for what

- **SME owners:** budgets, cashbooks and stock trackers, for example "columns for money in, money out, balance carried forward".
- **NGO staff:** activity budgets with line items, quantities, unit costs, totals per activity, and a grand total that must match the donor template.
- **Teachers:** mark sheets and results summaries with scores, class average, position, and pass count per subject.

## Limits, stated honestly

The AI summarises only what you paste, nothing more. Three rules carry over from Day 2 and matter even more here:

1. **Confidential documents do not go into free tools.** If the document is confidential, practise today on a public one instead.
2. **Anonymise first.** Remove names, account numbers and identifying details before pasting. If figures are sensitive, round or replace them. You are testing the structure, so the real figures are not needed.
3. **Check every total yourself.** AI-generated calculations and formulas can be wrong. Work out one row by hand and compare.

## Worked example: a small trader's sales sheet

*Illustrative figures, not a real business's sales.* Input: two notebooks at ₦1,500 each and three pens at ₦200 each. Ask: "Create columns Item, Quantity, Unit price and Total. Give row formulas and a grand-total formula. Do not add sales I have not supplied."

Expected rows (row 1 holds the headings, columns A to D): Notebooks | 2 | 1500 | `=B2*C2`; Pens | 3 | 200 | `=B3*C3`. Grand total: `=SUM(D2:D3)`. Check the multiplication and addition with a calculator before you use the sheet: 2 × 1,500 + 3 × 200 = ₦3,600. Revenue is not profit: stock costs and other expenses are not included.

On a phone, enter the two sample rows first and confirm that the formulas calculate before pasting a full table. If your data is limited, practise with a short public extract rather than uploading a large PDF.

## 🎯 Task

1. **Summarise:** take one real long document you are responsible for (or, if it is confidential, a public policy document) and run the decisions-summary prompt. Check two of its quotes against the actual document.
2. **Build:** describe a spreadsheet you keep (or should keep) and ask the AI to build it. Open a new sheet in Google Sheets, type in the headings and a few rows of figures, paste in the formulas, and check that the totals calculate and match your own calculation.

## 📤 Output

One decisions-relevant summary, saved in your phone notes, and one working spreadsheet, saved in Google Sheets, with formulas the AI wrote and you checked. Keep both, and save the spreadsheet prompt too, for your Playbook (Day 7). The spreadsheet prompt is the one you are most likely to reuse after this week.

---
**Privacy card (Day 2, still in force):** anonymise before you paste. No names, no account numbers and no confidential figures go into free tools.
