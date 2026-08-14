---
day: 9
title: Day 9 — Spreadsheets and Data
subtitle: Make AI do the spreadsheet grunt work.
bullets: Ask for formulas in plain English | Upload CSVs and ask questions | Build models, verify the numbers | No formula memorising needed
rules: Verify every number | Give AI data context | Keep raw data safe
---

# Day 9 — Spreadsheets and Data

**Read time: 5 minutes · Task: 15 minutes**

If spreadsheets are where your day goes to die, today you take it back. AI won't fix your data — it will do the grunt work so you can think about the numbers instead of wrestling with them.

## Formulas in plain language

Stop memorising formula syntax. Describe the job in plain English and let AI write the formula. *"I have dates in column A and I want the month name in column B"* — AI gives you the formula, the cell references, and an explanation. Copy it in, test it on a few rows, move on. The skill isn't knowing `=TEXT()` by heart; it's describing what you want clearly enough for AI to translate. If you have Microsoft 365, Copilot in Excel does this natively — but ChatGPT, Claude, or Gemini work just as well for any spreadsheet.

## Cleaning data without tears

Messy data is the real time sink. Tell AI what "clean" means:

- **Remove duplicates** — "delete rows where columns A and B are identical"
- **Standardise formats** — dates, phone numbers, currency, consistent spelling
- **Flag problems** — blank cells, impossible values, negative stock
- **Split and combine** — full names into first and last; two columns into one address

For a bigger job, upload a copy of the CSV and ask for a cleaning plan *before* you touch the original.

## Upload the CSV and ask questions

Upload a CSV to ChatGPT or Claude and you can interrogate your data in plain language: "What's the total?", "Which region grew fastest?", "Which client is worth the most?" The AI reads the file and answers — no pivot tables required to get a first answer. Use a copy with anything sensitive removed, and treat the answers as a starting point, not an audit.

## Build a simple model

Give AI your assumptions — income, fixed costs, expected growth — and ask for a simple budget or forecast model, laid out row by row so you can see the logic. Ask it to explain each step. Then stress-test: change a number and check the model still behaves sensibly. It won't be an accountant; it will be a fast first pass that you refine.

## Why this matters

People who turn raw numbers into decisions get noticed. AI collapses the grunt work — formulas, cleaning, first-pass analysis — so your energy goes into the judgment part, which is the part you're paid for. One rule, repeated: **verify**. AI can be confidently wrong about numbers, so check every formula against a value you already know. "I asked an AI to write my spreadsheet formulas in plain English" is a sentence your colleagues won't believe until they see it.

---

## 🎯 Task (15 minutes)

Pick one real spreadsheet need from your work — a budget, a tracker, a report you rebuild every week.

1. Describe the need in plain language: *"I need a formula that flags any expense over budget by more than 10%."*
2. If you have a CSV, upload a copy (no sensitive data) and ask it three questions about your data.
3. Test every formula AI gives you against real rows before you trust it.

## 📤 Output

Your **working spreadsheet** — or the formula/model — **plus the prompts you used**. Save the prompts: they're now your personal spreadsheet toolkit. Screenshot your smartest formula and share it in the community.

Tomorrow, we point the same trick at the other great time-sink of office life: building presentations.
