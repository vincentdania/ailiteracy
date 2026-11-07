---
summary: Design the improved process before you build it, with a to-be workflow, a data dictionary that stops data getting corrupted, and an integration plan that names every connection and permission.
quiz:
  - question: Why give every order a unique ID?
    options:
      - It looks professional
      - So the automation can find, update and avoid duplicating the right record
      - Google Sheets requires it
      - To hide the customer's name
    answer: 1
    explanation: A unique ID lets every step refer to exactly one record, which prevents duplicates and overwrites.
  - question: 'A date column contains "3/4/26", "April 3" and "2026-04-03". What should the data dictionary say?'
    options:
      - Any format is fine
      - One format, for example yyyy-MM-dd, and how to enter it
      - Dates aren't needed
      - Let the AI guess each one
    answer: 1
    explanation: Mixed formats cause wrong calculations and missed reminders. Pick one format and make it the rule.
  - question: The automation only needs to read the Orders sheet and add rows to a Log sheet. What access should it get?
    options:
      - Owner access to the whole Google Drive
      - Edit access to the Orders and Log sheets only, or read-only where it just reads
      - The owner's Google password
      - Access to every sheet, in case
    answer: 1
    explanation: 'Least access: give only what each step needs. That limits the damage of any mistake.'
---

**Week 2 · About 15 to 20 hours · Competencies 1 and 2: Simplify and connect safely**

This week you design the improved process and the data that runs through it. Good design here prevents the two worst automation failures: corrupted data and automations with too much access.

## What you'll be able to do

- Draw a to-be workflow that removes waste and adds review gates
- Write a data dictionary with one meaning, format and owner for each field
- Choose a single source of truth for each type of data
- Plan each integration: trigger, action, data moved and permissions needed

## Key ideas

**Single source of truth.** Each piece of information lives in one place. If orders are in a notebook, a Sheet and WhatsApp, which one is right? Choose one and make the others feed it.

**Data dictionary.** A table describing every field: its name, meaning, type, allowed values, format, whether it's required, and who updates it. It's the contract every automation step follows.

**Unique IDs.** Every record gets an ID that never changes, such as `ORD-2026-0412`. Automations look records up by ID, never by name.

**Integration plan.** For each connection: what triggers it, what data moves, in which direction, which account it uses, and what permission it needs.

**Review gates.** Points in the to-be workflow where a person checks before the process continues. Always before anything external: customer messages, invoices, payments.

## Worked example

```
DATA DICTIONARY: Orders sheet (single source of truth for orders)

Field          | Meaning                        | Type    | Format / allowed values               | Required | Updated by
order_id       | Unique order reference         | text    | ORD-yyyy-#### (auto)                  | yes      | Automation
received_date  | Date order received            | date    | yyyy-MM-dd                            | yes      | Front desk (form)
customer_ref   | Customer code, not name        | text    | CUST-###                              | yes      | Front desk
job_type       | Product                        | choice  | flyer, banner, tshirt, other          | yes      | Front desk
status         | Stage of the job               | choice  | new, design, print, ready, collected  | yes      | Staff (status form)
total_ngn      | Agreed price                   | number  | whole naira, no commas                | yes      | Front desk
paid_ngn       | Paid so far                    | number  | whole naira                           | yes      | Front desk
balance_ngn    | Owed                           | formula | total_ngn − paid_ngn                  | auto     | Sheet formula
last_updated   | When status last changed       | datetime| yyyy-MM-dd HH:mm                      | auto     | Automation

Customer names and phone numbers live in a separate Customers sheet that the
automation can't read; the front desk looks them up when sending a reminder.
```

```
INTEGRATION PLAN
# | Trigger                     | Action                                 | Data moved           | Account / permission
1 | Google Form submitted       | Add row to Orders with new order_id    | Form → Orders        | Service account, edit Orders only
2 | Status form submitted       | Update status by order_id; add Log row | Form → Orders, Log   | Edit Orders, Log
3 | Every day 5:30pm            | Build status summary → Telegram        | Orders → Telegram    | Read Orders; bot to manager only
4 | Every Monday 9am            | Draft reminders for balance > 0 → manager approves | Orders → Telegram | Read Orders; no customer data
```

## Use AI well this week

AI is a good reviewer for designs. Ask it to look for gaps.

```
Here is my data dictionary and integration plan for a small print shop
(pasted, no personal data). Find: fields that could be ambiguous, places
duplicates could be created, steps with more access than they need, and
missing review gates before anything goes to customers.
```

> **Stay safe:** Keep personal data out of the sheets your automations read wherever you can. Use customer codes, and keep the lookup table separate.

## Guided practice

> **Try it:** Draw the to-be workflow for your process. Mark every step as manual, automated, or review gate. Write the data dictionary for its main sheet, then the integration plan. Walk through it with the person who'll use it and note their changes.

## Your evidence this week

Hand in, as described in the week 2 evidence brief:

1. A **to-be workflow** showing what changed from the as-is, with review gates marked
2. A **data dictionary** for every sheet the automation touches
3. An **integration plan** listing triggers, actions, data and permissions

What the assessor looks for: waste removed before automating, unambiguous data rules, least access, and review gates before external actions.

## Before you hand in

- [ ] Each type of data has one source of truth
- [ ] Every record has a unique ID; dates have one format
- [ ] Every integration lists the smallest permission it needs
- [ ] There's a review gate before any external message, invoice or payment
- [ ] The person who'll use it has seen and commented on the design
