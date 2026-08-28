---
day: 19
title: Your One-Page Cheat Sheet and Next Steps
subtitle: The commands you'll use daily, where to go deeper, and the habits that keep your agent compounding.
---

# Your One-Page Cheat Sheet and Next Steps

**Read time: 4 minutes · Task: save the cheat sheet**

You've built, wired, automated, and hardened your agent. This final lesson is your day-to-day reference. **Save this page.**

## The everyday commands

```bash
hermes                # start the setup wizard (first run)
hermes status         # see provider, model, and enabled tools
hermes doctor         # full health check — keep a clean baseline
hermes model          # change your main model
hermes tools          # manage toolsets
hermes gateway run    # keep messaging connected
hermes --continue     # resume your last session
```

## The quick email/message send

```bash
hermes send --to telegram "message..."
```

## The automation words

- **cron** — scheduled jobs ("every weekday 08:00 briefing").
- **delegate** — spawn parallel subagents for heavy work.
- **batch** — one instruction across many inputs.
- **hooks** — react to events (new email, webhook).
- **MCP** — connect external MCP servers.

## The one-line security rule

> Secrets in `.env`. Approvals for anything consequential. Checkpoints before experiments. Allowlist who can reach you.

## Where to go deeper

- **Official docs:** hermes-agent.nousresearch.com/docs — the authoritative reference and Learning Path.
- **model catalog:** `hermes model` / the docs' providers pages.
- **Community:** the skills hub for shared, hard-won procedures.

## The habits that make it compound

1. **Use it weekly** with standing tasks — briefings, triage, synthesis.
2. **Save a skill** whenever you find a workflow you'll repeat.
3. **Keep the baseline clean** — run `hermes doctor` after each change.
4. **Re-review security** monthly (allowlists, secrets, checkpoints).
5. **Let it get better** — the Curator improves skills in the background; trust and feed that loop.

## 🎯 Final task

Save the cheat sheet (this page). Then write one-sentence answers to: What will my agent do for me this week? What will it do for me every week from now on?

## 📤 Output

Your two sentences — your ongoing personal-agent charter.

---
**Verified fact:** Every command listed here is used earlier in this course and is documented in the official Hermes Agent documentation.
