---
day: 4
title: Install Hermes Anywhere
subtitle: One command per platform — Linux, macOS, Windows, WSL2, Termux — and how to verify it works.
---

# Install Hermes Anywhere

**Read time: 5 minutes · Task: 15 minutes (hands-on)**

Time to get your hands dirty. The installer handles almost everything — Python, Node, ripgrep, ffmpeg — so you run **one command** and you're most of the way there.

## Before you start

- A modern laptop or desktop (any recent machine you already use works).
- An internet connection (this install is a one-time download; daily use is lightweight).
- `git` installed. On Linux you may also need `curl` and `xz-utils`.

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
