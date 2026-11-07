---
summary: Discover how a business process really works, map it as it is, and build a pain-point inventory that shows where automation would help and where it wouldn't.
quiz:
  - question: Where does the most accurate picture of a process come from?
    options:
      - The owner's description alone
      - Watching the people who do it, and checking their records
      - A template from the internet
      - An AI's guess
    answer: 1
    explanation: Owners often describe how a process should work. Watching it and checking the records shows how it actually works.
  - question: Which pain point is the best candidate for automation?
    options:
      - A judgement call that differs every time
      - A repetitive, rule-based step done the same way many times a day
      - A task done once a year
      - A sensitive conversation with a customer
    answer: 1
    explanation: Automation suits frequent, repetitive, rule-based work. Judgement and sensitive conversations need people.
  - question: 'What is a "handoff" on a process map?'
    options:
      - When work passes from one person or system to another
      - The last step
      - When the process is cancelled
      - A type of software
    answer: 0
    explanation: Handoffs are where information is most often lost or delayed, so they're worth marking.
---

**Week 1 · About 15 to 20 hours · Competency 1: Map and simplify**

The most common automation mistake is building before understanding. This week you'll learn to discover how a process really works, draw it as it is, and list what goes wrong, before any tool is opened.

## What you'll be able to do

- Interview and observe the people who run a process
- Draw an as-is process map with swimlanes, handoffs and data stores
- Measure how often and how long each step takes
- Build a pain-point inventory ranked by cost and risk

## Key ideas

**As-is and to-be.** The as-is map shows the process today, warts and all. The to-be map (next week) shows the improved version. Never skip the as-is: it's your baseline for measuring improvement.

**Swimlanes.** A map with one row per person or system, so you can see who does what and where work passes between them.

**Handoffs and data stores.** A handoff is where work moves between people or systems. A data store is where information is written: a notebook, a sheet, a WhatsApp chat. Handoffs and duplicate data stores are where most errors happen.

**The eight wastes.** A quick lens for spotting problems: waiting, re-typing (over-processing), errors and rework, searching, unnecessary movement, duplicate records, unused skills, and work done before it's needed.

> **New word: trigger.** The event that starts a process or an automation, such as "a new order arrives" or "it's 6pm".

## Worked example

```
AS-IS: Kubwa Print Hub order-to-payment (observed Mon–Wed, 3 days)

Lane: Customer       → sends order (WhatsApp / walk-in / email)
Lane: Front desk     → writes in notebook → later types into Google Sheet (data store 2)
Lane: Designer       → gets job by word of mouth → designs → tells printer
Lane: Printer        → prints → leaves job on shelf
Lane: Manager        → 6pm: phones designer and printer (45 min) → WhatsApps owner
Lane: Front desk     → customer collects → payment by transfer or cash → sometimes balance owed

Handoffs: 5   Data stores: notebook, Sheet, WhatsApp chats, manager's memory

PAIN-POINT INVENTORY
# | Pain point                              | Frequency     | Time / cost             | Risk     | Automate?
1 | Orders typed twice (notebook + Sheet)   | 25/day        | ~50 min/day (timed)     | Errors   | Simplify first: type once
2 | Evening phone round for job status      | daily         | 45 min/day              | Low      | Yes: status form + summary
3 | Unpaid balances not chased              | ~2–3/day      | Unknown ₦ owed          | Cash     | Yes: drafts, human sends
4 | Designer not told of new jobs           | several/day   | delays (not measured)   | Medium   | Yes: notify on new row
5 | Customer disputes over what was ordered | ~1/week       | rework                  | Trust    | No: fix with order confirmation
```

## Use AI well this week

AI can turn your rough observation notes into a tidy draft map and suggest questions you missed.

```
Here are my notes from observing a print shop's order process (no names or
phone numbers). Turn them into a swimlane list: one lane per role, steps in
order, with handoffs and data stores marked. Then list 8 questions I should
ask to fill gaps. Don't invent steps that aren't in my notes.
```

Check the draft against your notes line by line. AI tools often "tidy" a process by adding steps that don't happen.

> **Stay safe:** When you observe, ask permission, explain you're studying the process, not judging people, and don't photograph customers' documents or chats.

## Guided practice

> **Try it:** Choose one process at your partner business (or use the Kubwa Print Hub case). Watch it for at least two sessions, time the main steps, and talk to two people who do it. Draw the as-is map on paper first, then in a tool such as draw.io, Miro or Google Slides.

## Your evidence this week

Hand in, as described in the week 1 evidence brief:

1. An **as-is process map** with swimlanes, handoffs and data stores
2. A **pain-point inventory** with frequency, time or cost, risk, and whether to automate, simplify or leave it
3. Your **observation notes** and timings, with no personal data

What the assessor looks for: a map based on observation, measurements rather than guesses, and good judgement about what not to automate.

## Before you hand in

- [ ] My map is based on what I saw, not just what I was told
- [ ] Every handoff and data store is marked
- [ ] Times and frequencies are measured, or marked "not measured"
- [ ] At least one pain point is marked "simplify" or "don't automate", with a reason
- [ ] No customer details appear anywhere
