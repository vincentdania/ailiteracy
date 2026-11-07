---
summary: Build a logic-based schedule with dependencies and a critical path, a bottom-up budget with contingency, and a resource plan, and show the reasoning behind every estimate.
quiz:
  - question: What is the critical path?
    options:
      - The most expensive tasks
      - The longest chain of dependent tasks, which sets the earliest finish date
      - The tasks the sponsor cares about most
      - The first week of the project
    answer: 1
    explanation: Any delay on the critical path delays the whole project. Tasks off it have float.
  - question: Task E has 1.5 weeks of float. It slips by 1 week. What happens to the end date?
    options:
      - It moves 1 week later
      - It doesn't change, but E now has only 0.5 weeks of float left
      - It moves 1.5 weeks
      - The project is cancelled
    answer: 1
    explanation: Float absorbs delays up to its size. Keep watching, because the remaining float is smaller.
  - question: Why add contingency to a budget?
    options:
      - To spend it on extras
      - To cover identified risks and estimating uncertainty, released only with approval
      - Because donors expect a round number
      - To hide mistakes
    answer: 1
    explanation: Contingency is for known risks and uncertainty. It's controlled, and using it is reported.
---

**Week 3 · About 15 to 20 hours · Competency 2: Estimates**

A plan is only as good as its estimates. This week you'll turn your WBS into a schedule driven by logic, a budget built from the bottom up, and a resource plan that shows who does what, when.

## What you'll be able to do

- Estimate durations and costs for each work package, with your basis
- Sequence work by dependencies and find the critical path
- Build a bottom-up budget with contingency
- Plan resources and spot overloads

## Key ideas

**Estimate with a basis.** Every estimate needs a reason: a quote, a past project, an expert's view, or a calculation (units × rate). For uncertain items, use three-point estimates: optimistic, most likely and pessimistic, then (O + 4M + P) ÷ 6.

**Dependencies.** Most tasks can't start until another finishes ("finish-to-start"). Materials can't be printed until they're written.

**Critical path and float.** The critical path is the longest chain of dependent tasks. Tasks not on it have float, the amount they can slip without delaying the end.

**Bottom-up budget.** Cost each work package (units × rate), add them up, then add contingency for identified risks. Show the funder exactly how you got each figure.

**Resource plan.** Who's needed, when, and for how much of their time. Look for overloads: one person needed in two places at once.

## Worked example: schedule

```
SCHEDULE LOGIC: Karu Digital Skills Week (weeks)
ID | Task                              | Duration | Depends on | Basis
A  | Charter approved, funds confirmed | 1        | –          | Bank's stated process
B  | Recruit trainers and agreements   | 2        | A          | Past community projects
C  | Book hall and generator           | 1        | A          | Caretaker; hire firm
D  | Write session outlines, handouts  | 2        | B          | Lead trainer estimate
E  | Outreach and registration         | 2        | C          | Association's past events
F  | Print handouts                    | 0.5      | D          | Printer quote
G  | Trainer briefing                  | 0.5      | D          | –
H  | Deliver sessions (groups A and B) | 4        | E, F, G    | 1 session per group per week
J  | Analyse results and report        | 2        | H          | Coordinator estimate

Critical path: A → B → D → F/G → H → J = 1 + 2 + 2 + 0.5 + 4 + 2 = 11.5 weeks
Classes start: end of week 5.5 → inside the bank's 10-week condition (4.5 weeks' margin)
Float: C → E path = 1 + 1 + 2 = 4 weeks to reach H, against 5.5 → 1.5 weeks' float
```

## Worked example: budget

```
BUDGET (₦)                                     Units × rate                 Total      Basis
Trainers                                       16 trainer-sessions × 25,000 400,000    2 per session; 2 quotes
Trainer briefing                               2 × 15,000                   30,000     Half-day rate
Volunteer helper stipends                      4 helpers × 8 sessions × 5,000 160,000  Association norm
Handouts (bilingual)                           280 copies × 500             140,000    Printer quote
Hall hire                                      8 × 20,000                   160,000    Caretaker
Generator hire                                 8 × 15,000                   120,000    Hire firm quote
Fuel                                           8 × 20,000                   160,000    Estimate: 10 litres per session (check current price)
Refreshments                                   60 × 4 sessions × 800        192,000    Caterer quote
Outreach (flyers, announcements)               lump sum                      50,000    Printer quote
Data bundles for demonstrations                lump sum                      40,000    Estimate
Coordinator stipend                            lump sum                     200,000    Agreed with chair
Subtotal                                                                  1,652,000
Contingency (fuel prices, extra session)                                    145,200    ~10% of costs excluding stipend
Total                                                                     1,797,200    Funding ₦1,800,000; unallocated ₦2,800
```

## Use AI well this week

AI can check your logic and arithmetic and suggest missing costs. It doesn't know local prices: get quotes.

```
Here's my task list with durations and dependencies (pasted). Calculate the
critical path and the float for each task. Show your working. Then list costs
a small community training project often forgets.
```

Recalculate the critical path yourself. AI tools sometimes get dependency logic wrong.

> **Stay safe:** Never present an AI-suggested price as a quote. Mark every estimate's basis honestly.

## Guided practice

> **Try it:** Estimate each work package in your WBS with a basis. Draw the dependency network on paper, find the critical path, then build the schedule in Excel or a free Gantt tool. Build the budget bottom-up and get at least two real quotes for the biggest items.

## Your evidence this week

Hand in, as described in the week 3 evidence brief:

1. A **logic-based schedule** with dependencies, critical path and float
2. A **bottom-up budget** with the basis of each line and contingency
3. A **resource plan** showing who's needed when, with any overloads resolved

What the assessor looks for: estimates with a stated basis, correct dependency logic and critical path, a budget that adds up and is traceable, and a feasible resource plan.

## Before you hand in

- [ ] Every estimate has a basis
- [ ] Dependencies are logical; the critical path is correct
- [ ] The budget adds up and every line shows units × rate or a quote
- [ ] Contingency is linked to named risks
- [ ] No person is overloaded in the resource plan
