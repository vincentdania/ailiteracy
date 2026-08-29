---
day: 22
title: 'Capstone + Your One-Page Cheat Sheet'
subtitle: 'The final lesson. Build a real, working agent configuration, document it, and earn your verified certificate.'
---

# Capstone + Your One-Page Cheat Sheet

Twenty-one lessons of groundwork, and here we are: the capstone. This is the lesson where you stop learning *about* Hermes and prove you can actually *run* it. You're going to produce one real, working personal agent configuration and write a short brief about it. That brief is your certificate submission — nothing fancier is needed, but it has to be genuinely yours and genuinely working.

## The deliverable

Produce a **1–2 page 'My Agent' brief** (markdown or PDF) that shows a working config you built across this course. It must cover:

1. **What your agent is called** and which model/provider you chose.
2. **Two integrations** you connected (Telegram, WhatsApp, email, GitHub — pick two that are live).
3. **One cron job or automation** you scheduled.
4. **One skill or memory item** you saved.
5. **A screenshot or note** of `hermes status` or `hermes doctor` showing green health.

If you're short on a step, go back and build it — a diagnosis matters more than a gap. Run `hermes doctor` and let it tell you what's missing; fix it, then move on.

## Pull it together with the building blocks

You've already used every piece of this. The agent has **memory**, **skills**, **cron**, **delegation**, **email**, a **browser**, and a **messaging gateway**. Your brief is just the honest summary of the one you actually wired up. If you've been hands-on all along, you have the material already — this is about finishing, not starting.

## Your one-page cheat sheet (keep this pinned)

This is the piece you'll keep pinned and share as proof of your work. Copy it into your brief:

```text
# Hermes Essentials
Install:  curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
Setup:    hermes setup                    # guided wizard
Fastest:  hermes setup --portal           # Nous Portal + Tool Gateway on
Model:    hermes model                    # choose provider/model (min context 64K)
Tools:    hermes tools                    # enable tools
Config:   hermes config set / hermes config get
Secrets:  ~/.hermes/.env                  # secrets live here
Settings: ~/.hermes/config.yaml           # settings live here
Gateway:  hermes gateway setup            # messaging
          hermes gateway run              # run it
          hermes gateway install          # install as a service
Health:   hermes doctor                   # check everything
```

Print it, pin it, keep it. That's 22 lessons distilled to one block — and it proves you can stand up an agent from a clean machine in minutes.

## Finish the job

This is the certificate submission. Aim for at least **70**, double-check all five required sections are present, upload the brief, and submit — don't leave the score on the table. You didn't come 21 lessons to stop at the last yard. Go and make it count.

## Task

Submit your completed 'My Agent' capability brief via the app to earn your certificate. Ensure all five required sections are present and your cheat sheet is included, then hit submit.

## Output

Your verified certificate — and a one-page cheat sheet you'll keep for life. Well done, genuinely.
