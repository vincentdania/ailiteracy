---
day: 9
title: Memory, Context Files and Sessions — What Your Agent Remembers
subtitle: Persistent memory, per-turn context files, scripts and sessions — the difference between remembering and forgetting.
---

# Memory, Context Files and Sessions — What Your Agent Remembers

**Read time: 5 minutes · Task: 8 minutes**

A personal agent *remembers*. This lesson is about the three ways Hermes does that: persistent memory, context files, and sessions.

## 1. Persistent memory

Hermes keeps durable facts in `USER.md` and `MEMORY.md` under `~/.hermes/memories/`. A snapshot is loaded when a session starts. If memory changes during a session, the file is updated immediately, but the new entry is fully reflected in the system prompt on the next session.

You can also attach external memory providers for larger, searchable long-term recall if you outgrow the built-in store.

## 2. Context files — injected every turn

You can tell your agent how to *be* by dropping structured files into its context. Three stand out:

- **`SOUL.md`** (personality) — voice, values, boundaries: "be blunt, no flattery, Nigerian/British English."
- **`AGENTS.md`** — project/procedural context, loaded when working in a codebase or a specific working dir.
- **`.hermes.md` or `HERMES.md`** — Hermes-specific project instructions in a working directory. Hermes checks these before `AGENTS.md`.

`SOUL.md` is global to the Hermes profile. Project files are discovered from the working directory. Editing `SOUL.md` does not update the facts stored about you.

## 3. Sessions

When you close a session, the state doesn't have to vanish. Hermes lets you:

- **Continue** a session later (`hermes --continue`).
- **Search** past sessions to recover work or decisions.
- **Save/export** sessions when you need a durable record.

This is your agent's memory of *what we were doing*, separate from the memory of *who you are*.

## Memory ≠ privacy risk if configured right

The files stay in your Hermes home, but text sent to a cloud model still leaves the machine for inference. Local storage is not the same as fully local processing. Do not store API keys or passwords in memory or context files; keep them in `.env`.

## 🎯 Task

Set the tone of your agent. Find or create a `SOUL.md` and add one line about how you'd like it to speak to you (your values, your deadlines, your bluntness preference). Then confirm your memory contains your name and role.

## 📤 Output

The one-line personality rule you added to `SOUL.md`, and confirmation that memory knows who you are.

---
**Official guides:** [Which file does what](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what) and [SOUL.md](https://hermes-agent.nousresearch.com/docs/guides/use-soul-with-hermes).
