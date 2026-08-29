---
day: 5
title: Local Setup — Laptop Requirements
subtitle: What you actually need on your machine — then one command to install and verify.
---

# Local Setup — Laptop Requirements

**Read time: 5 minutes · Task: 15 minutes (hands-on)**

Time to get your hands dirty. The installer handles almost everything — Python, Node, ripgrep, ffmpeg — so you run **one command** and you're most of the way there.

## What you actually need

The good news: running Hermes is **light**. You do not need a gaming rig or a MacBook Pro.

- **Operating system** — Linux, macOS, or Windows (use WSL2 on Windows for the smoothest setup; Termux works on Android).
- **RAM** — 8 GB is comfortable; 4 GB will still do for a personal agent. The model usually runs in the cloud, so your machine mostly runs the agent loop, not the AI.
- **Storage** — a few GB free (the install, tools, and history).
- **Internet** — a connection good enough to browse the web; daily use is low-bandwidth text.
- **Prerequisites** — `git`, plus `curl` and `xz-utils` on Linux. The installer handles Python, Node, ripgrep and ffmpeg for you.

In short: **if you can comfortably browse the web and open a terminal, your machine can run a personal agent.**

## Install by platform

**Linux / macOS / WSL2 / Termux**

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Windows native (PowerShell)**

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Then reload your shell:

```bash
source ~/.bashrc
```

## Verify it's alive

Run the command that starts the setup wizard:

```bash
hermes
```

If you see the wizard begin, the install worked. For a fuller health check, later in the course you'll run `hermes doctor` to confirm every dependency and config is clean before adding features.

## A clean baseline rule

Before you add *any* feature (a model, Telegram, email), get **one clean `hermes doctor` run** with nothing complaining. This is your single most useful habit. If the baseline is clean and something breaks later, you know the cause is the feature you just added — not a mystery.

## Low bandwidth notes 📶

- The installer and model downloads are the only big downloads. Day-to-day, Hermes exchanges small text payloads — ideal for mobile data and modest connections.
- For a truly low-bandwidth setup, do the install once on a laptop or VPS with good internet, then connect to that instance remotely from your phone.

## 🎯 Task

Install Hermes on your primary machine. Run `hermes` and confirm the wizard starts. Then run `hermes doctor` and note anything it flags.

## 📤 Output

A screenshot or note of the `hermes` wizard launching, plus (if any) the list of things `hermes doctor` flagged so we can fix them in Lab 2.

---
**Verified fact:** These are the official installer commands from the Hermes Agent documentation (hermes-agent.nousresearch.com/docs/getting-started/installation). The installer automatically handles Python, Node, ripgrep, and ffmpeg.
