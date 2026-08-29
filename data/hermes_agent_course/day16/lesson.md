---
day: 16
title: Automate — Cron, Delegation, Batch and More
subtitle: Making your agent run on its own schedule, spin up workers, process bulks, and react to events.
---

# Automate — Cron, Delegation, Batch and More

**Read time: 6 minutes · Task: 10 minutes**

This is where your agent stops waiting for you and starts running on its own. Five automation powers, each useful in Nigeria and globally.

## 1. Cron — scheduled jobs

You already set a time-of-day for your agent; now let it *start* at a time. Cron runs jobs on a schedule.

```bash
hermes cron add --schedule "0 8 * * 1-5" "Prepare my morning briefing"
```

Every weekday at 08:00, the agent runs that task and delivers the result to your chosen home chat. Use it for daily briefings, market opens (a weekday naira/market briefing at 16:30 Lagos time — just like a real analyst), weekend digests, and deadline reminders.

## 2. Delegation — subagents

For heavy or parallel work, Hermes spawns **subagents** in isolated contexts. This is like hiring temporary staff: each focuses on one slice and reports back. Use it to split large research into parallel streams instead of one long, slow task.

## 3. Batch — many inputs, one instruction

**Batch** turns a single instruction into a small factory: "grade this class of assignments," "summarise these 20 documents," "draft a post from each research note." Give it the instruction once; it processes the whole set.

## 4. Event hooks — react to things

Hooks make your agent *respond to events* rather than wait for you: a new email, a file change, a webhook hitting the gateway, a cron change. The always-on gateway can fire connected actions automatically.

## 5. MCP — connect your tools

The **Model Context Protocol** lets Hermes plug into external tools and data sources cleanly. If you use apps that expose MCP servers, your agent can drive them. It's the modern standard for tool interoperability.

## The combo that runs your life

These compose. For example:

1. **Cron** fires at 07:00.
2. **Delegation** sends subagents to check email, news, and your calendar in parallel.
3. The agent **batches** the results into one briefing.
4. The gateway **hooks** a new opportunity email to re-flag it.
5. Everything lands in your **Telegram home chat**.

That's a personal chief-of-staff running on a schedule you control.

## 🎯 Task

Create ONE cron job that would actually help you — a daily or weekday briefing delivered to Telegram. Use the schedule syntax from this lesson; adapt it to your timezone (Lagos = Africa/Lagos).

## 📤 Output

The `hermes cron add` command you wrote (or the equivalent UI), and which timezone/schedule you chose.

---
**Verified fact:** Cron scheduling, subagent delegation, batch processing, event hooks, and MCP are all documented Hermes Agent capabilities.
