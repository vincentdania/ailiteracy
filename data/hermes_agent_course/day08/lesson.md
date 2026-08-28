---
day: 8
title: Skills and the Curator — Your Agent Learns
subtitle: Turn a one-off workflow into a reusable skill, powered by an automatic self-improvement engine.
---

# Skills and the Curator — Your Agent Learns

**Read time: 5 minutes · Task: 15 minutes (hands-on)**

Skills are how your agent *remembers how to do things*. While tools give it hands, **skills give it method** — a reusable procedure it can follow again and again.

## What a skill is

A skill is a stored procedure: "here is exactly how to produce the weekly donor report." Instead of re-teaching your agent every time, it loads the skill and executes it consistently. Over time, your agent accumulates skills for *your* most frequent work.

## How skills form

Two ways:

1. **You ask it to remember.** After a good outcome, you tell the agent to capture the method as a skill.
2. **The Curator does it automatically.** Hermes includes a **Curator** — a self-improvement engine that reviews completed work and proposes saving reusable skills and other improvements in the background.

That loop is the heart of "it gets better at your work": **you do a task, the pattern is saved, and next time it's faster and more consistent.**

## A skill you can write today (Lab 6)

The classic first skill: your **daily/weekly briefing format**. Large language models are great at following a fixed template. Tell your agent:

1. "Read my email summary and the morning news."
2. "Produce a briefing with sections for funding, social protection, and one innovation to replicate."
3. "Save this exact format as a skill named `daily_briefing`."

From then on, one command produces your briefing in the format you defined.

## The skills system

- Skills are organised for **progressive disclosure** — a light index loads by default; the full detail is pulled only when the skill is actually invoked. That keeps every session lean and fast on low bandwidth.
- A **skills hub** lets them be shared, so the community's hard-won procedures become available to you (and yours to others).

## 🎯 Task (hands-on)

Do the "daily briefing format" exercise above with your agent. Ask it to save `daily_briefing` as a skill, then run it once and confirm it reproduces your format.

## 📤 Output

A note that the skill was saved, plus the one-command you now use to get your briefing.

---
**Verified fact:** Skills with progressive disclosure (index first, detail on invoke) and the Curator self-improvement engine are documented Hermes Agent features.
