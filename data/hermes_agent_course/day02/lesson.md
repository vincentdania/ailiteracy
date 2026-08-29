---
day: 2
title: 'The Agent Landscape — Hermes, OpenClaw and Others'
subtitle: 'Where agents sit on the spectrum, and where Hermes fits in.'
---

# The Agent Landscape — Hermes, OpenClaw and Others

**Read time: ~5 min | Task: ~5 min**

Before you build anything, it helps to know what you're actually building. Let's place Hermes in the wider world of AI agents.

## Chatbots vs autonomous agents

Think of AI tools as sitting on a spectrum. At one end you have **chatbots**: they answer your question and stop. Ask one to summarise a file and you get a summary — but you have to copy, paste, click and fetch everything yourself. Useful, but passive.

At the other end sit **autonomous agents**. These don't just answer — they *act*. They plan, call tools, observe the results, then keep going until the goal is done. Ask an agent to "prepare my weekly report and send it to the team" and it will gather the data, write it and send it, looping until the job is finished. That single difference — acting instead of just replying — is what makes agents powerful.

## The tools you may have heard of

The agent space is busy, and you've probably seen a few names. They are all tool-calling, autonomous coding agents:

- **Claude Code**, from Anthropic.
- **OpenAI Codex CLI**, from OpenAI.
- **OpenClaw** (formerly called Clawdbot).
- **OpenCode**, an open-source option.
- **Hermes Agent**, from Nous Research.

Here's the thing worth knowing: these aren't rivals you have to choose between forever. Hermes is built to play nice with them. If you already have an OpenClaw or Clawdbot setup, Hermes has an official guide, **'Migrate from OpenClaw'**, to bring that setup over. And its **'Import from Other Agents'** feature can pull in a Claude Code setup from `~/.claude` or an OpenAI Codex CLI setup from `~/.codex`.

So if you've heard of these tools or tried one, nothing is wasted — you can carry it into Hermes.

## Where Hermes sits

Hermes Agent is a **terminal-native autonomous coding and task agent**. Plainly put: you talk to it from your command line, and it gets things done. It brings three things that stand out:

- **Persistent memory** — it remembers past work instead of starting fresh every time.
- **Agent-created skills** — it can build reusable procedures as it learns your workflows.
- **A messaging gateway** — it works across 21+ messaging platforms, so you can manage it from where you already chat.

It's open-source, and it works with many LLM providers and backends, so you're not locked into one model.

## What this means for this course

Everything we build from here is real, installed software on your machine — not a demo in a browser. Over the next lessons you'll set it up, give it memory, teach it skills and connect it to your messaging apps. That's the pay-off of Lesson 2: knowing *what* you're building before we start building it.

## Task

1. Write down which of the agent tools named above you've heard of before.
2. In one or two sentences, explain in your own words the difference between a chatbot and an autonomous agent.
3. If you have an existing Clawdbot, Claude Code or Codex setup, note it down — you'll migrate it later.

## Output

Your notes. Keep them in a plain text file called `landscape-notes.md`. You'll refer back to them in later lessons.
