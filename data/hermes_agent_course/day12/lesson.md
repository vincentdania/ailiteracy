---
day: 12
title: Automate — Cron, Delegation, Batch and More
subtitle: Making your agent run on its own schedule, spin up workers, process bulks, and react to events.
---

# Automate — Cron, Delegation, Batch and More

**Read time: 6 minutes · Task: 10 minutes**

Automation is useful only when the task, delivery target and failure path are clear. Start with one scheduled job you can check.

## 1. Cron — scheduled jobs

You already set a time-of-day for your agent; now let it *start* at a time. Cron runs jobs on a schedule.

```bash
hermes cron create "0 8 * * 1-5" "Prepare my morning briefing" --deliver telegram
```

The expression runs at 08:00 on weekdays in the timezone used by the scheduler. Confirm that timezone rather than assuming it is Lagos time. Check the job with `hermes cron list` and test it with `hermes cron run JOB_ID`.

## 2. Delegation — subagents

For suitable tasks, Hermes can spawn **subagents** in separate contexts. Each handles one defined part and reports back. Delegation costs additional model calls, so use it when the split is clear and worth the cost.

## 3. Batch — many inputs, one instruction

**Batch** applies one instruction to several inputs. Use it only when the inputs can be handled by the same rule and you have a way to check the outputs.

## 4. Event hooks — react to things

Hooks make your agent *respond to events* rather than wait for you: a new email, a file change, a webhook hitting the gateway, a cron change. The always-on gateway can fire connected actions automatically.

## 5. MCP — connect your tools

The **Model Context Protocol** lets Hermes plug into external tools and data sources cleanly. If you use apps that expose MCP servers, your agent can drive them. It's the modern standard for tool interoperability.

## How the parts can work together

These compose. For example:

1. **Cron** fires at 07:00.
2. **Delegation** sends subagents to check email, news, and your calendar in parallel.
3. The agent **batches** the results into one briefing.
4. The gateway **hooks** a new opportunity email to re-flag it.
5. Everything lands in your **Telegram home chat**.

Each added part creates another failure point. Build and test the sequence one step at a time.

## 🎯 Task

Create one cron job that would help you and deliver it to Telegram. Confirm the scheduler timezone, run the job manually once, and inspect the result before leaving it active.

## 📤 Output

The `hermes cron create` command, timezone, job ID and result of the manual test.

---
**Official guide:** [Scheduled tasks](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron/).
