---
summary: Build a prototype for a common business use case, such as automated reminders, scheduled reporting or invoice drafts, using everything from weeks 1 to 4.
quiz:
  - question: Your reminder workflow finds 14 customers with balances. What should it do?
    options:
      - Message all 14 customers immediately
      - Prepare 14 drafts for a person to review, edit and send
      - Message only the largest balances
      - Email the owner's bank
    answer: 1
    explanation: Payment reminders are external communications. The workflow prepares drafts; a person approves and sends.
  - question: A scheduled report runs at 6pm, but no orders changed today. What should it send?
    options:
      - Nothing, and log nothing
      - A short report saying there were no changes, so the manager knows it ran
      - Yesterday's report again
      - An error
    answer: 1
    explanation: 'A "nothing changed" message confirms the workflow is alive. Silence could mean it broke.'
  - question: Who should be able to receive the daily status summary?
    options:
      - Anyone who joins the Telegram group
      - Only the named people who need it, through a private chat or restricted group
      - All customers
      - It should be public
    answer: 1
    explanation: Reports can contain business data. Send them only to the people who need them.
---

**Week 5 · About 15 to 20 hours · Competencies 2, 3 and 5**

This week you build a prototype that solves a real business problem: automated reminders, scheduled reporting or invoice preparation. You'll bring together process design, safe connections, review gates and logging, and start measuring the value.

## What you'll be able to do

- Choose a use case that is low-risk and high-value
- Build a complete prototype: trigger, data, logic, review gate, action, log
- Handle the "nothing to do" and "too much to do" cases
- Start a before-and-after time study

## Key ideas

**Three common use cases.**

| Use case | Typical trigger | What it does | Review gate |
| --- | --- | --- | --- |
| Status report | Every day at a set time | Summarises open jobs by stage for the manager | Internal only; no gate needed, but log it |
| Payment reminders | Weekly | Prepares reminder drafts for balances over a threshold | A person reviews, edits and sends each one |
| Invoice drafts | When a job is marked ready | Fills an invoice template from the order record | A person checks and sends |

**Edge cases.** Plan for zero results ("No open jobs today"), many results (batch them, cap the number), missing data (skip and flag), and errors (notify someone).

**Thresholds and caps.** Don't remind customers about ₦200. Don't prepare 300 drafts at once. Set sensible thresholds and caps and write them down.

**Time study.** Measure how long the manual process takes before you switch the automation on, and after. Without the before, you can't show what it saved.

## Worked example

```
PROTOTYPE: Monday payment-reminder drafts (Kubwa Print Hub, test data)

Trigger: Every Monday 9:00 (workflow timezone Africa/Lagos)
1. Read Orders (TEST): status = collected AND balance_ngn >= 2000
2. IF none → Telegram to manager: "No balances to chase this week." → log → stop
3. Cap: first 20 by oldest received_date; flag if more
4. For each: draft text from template (order_id, job_type, balance, date)
   "Hello, this is Kubwa Print Hub. Our records show a balance of ₦{balance}
    for your {job_type} order {order_id} from {date}. If you've already paid,
    please ignore this and accept our thanks. Reply here with any questions."
5. Send drafts to the manager's private Telegram chat, one per message,
   with buttons: Approve (front desk sends from the shop WhatsApp) / Skip
6. Log each: order_id, drafted, decision, decided_by, time

Not automated on purpose: looking up phone numbers and sending on WhatsApp.
The front desk does that from the Customers sheet after approval.
```

## Start the time study

```
TIME STUDY (before)
Task                       | Who      | Times observed | Average minutes | Per week
Evening job-status calls   | Manager  | 5 evenings     | 44              | 220
Finding unpaid balances    | Front desk | 2 Mondays    | 35              | 35
Writing reminders          | Front desk | 2 Mondays    | 25              | 25
```

## Use AI well this week

Use AI to write message templates and check them for tone, but keep the facts (amounts, dates, IDs) coming from your data, never from the AI.

```
Improve this payment-reminder template for a small Nigerian print shop.
Keep the placeholders {balance}, {job_type}, {order_id}, {date} exactly.
Polite, clear, under 60 words, no threats, include "if you've already paid,
please ignore this".
```

> **Stay safe:** Payment reminders must be polite, accurate and never threatening. Never let an automation add charges, change amounts or send a reminder without approval.

## Guided practice

> **Try it:** Pick one use case for your partner business. Build the full prototype on test data, including the zero-results and too-many-results paths. Complete the "before" time study by observing the manual process at least twice.

## Your evidence this week

Hand in, as described in the week 5 evidence brief:

1. A **working prototype** (exported without credentials) and a one-page description
2. Its **edge-case handling**: zero results, many results, missing data, errors
3. Its **review gate** and the log showing approvals or skips
4. Your **before time study**

What the assessor looks for: a complete, working prototype, safe handling of edge cases, a real review gate before anything external, and measured baseline times.

## Before you hand in

- [ ] The prototype runs end to end on test data
- [ ] Zero and many results are handled and logged
- [ ] Nothing reaches a customer without a person approving
- [ ] Amounts, dates and IDs come from data, not from AI
- [ ] My "before" times are measured, not estimated
