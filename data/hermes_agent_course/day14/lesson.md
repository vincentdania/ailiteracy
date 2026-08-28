---
day: 14
title: The Connected Wall — One Agent Everywhere
subtitle: Wire all your surfaces together so the same agent, memory and skills serve you from every app you use.
---

# The Connected Wall — One Agent Everywhere

**Read time: 4 minutes · Task: 10 minutes (review/lab)**

By now you have piecemeal integrations. This lesson is the wiring review that turns a collection of connected apps into one *connected wall* — a single agent you can reach from anywhere.

## The goal

The point is coherence: your assistant on Telegram isn't a different assistant from the one on your laptop. It is the **same agent** — same tools, memory, skills, and cron jobs — reached through different doors. That's exactly what the messaging gateway delivers.

## The surfaces you'll wire

- **Terminal / desktop** — deep work, big tasks.
- **Telegram** — on-the-go instructions and replies.
- **Email** — asynchronous triage and drafts.
- **Cron to Telegram** — automated push briefings, no one watching.

## Verification ritual

After wiring each surface, ask a question that would *only* make sense if they share memory:

> "On my laptop I asked you to save a `daily_briefing` skill. Reproduce it here."

If the Telegram assistant can call the same skill, your wall is genuinely connected. If not, check the gateway and that both surfaces point at the same instance/profile.

## Keep it one instance

For a personal agent, run **one** Hermes instance (usually on your VPS) and treat it as the source of truth. All surfaces connect to it. Avoid running separate instances per device — that fragments memory and skills, destroying the "one agent everywhere" value.

## 🎯 Task

Test the connected wall: from Telegram, ask your agent to run a skill you saved earlier. Confirm it does. Then confirm your cron briefing delivers to the same chat.

## 📤 Output

A note confirming that (1) Telegram can use your saved skill, and (2) your scheduled briefing arrives in your home chat.

---
**Verified fact:** The gateway presents the same agent (shared memory and skills) across platforms. Running one instance as the source of truth is the recommended architecture for a personal setup.
