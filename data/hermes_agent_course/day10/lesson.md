---
day: 10
title: Memory, Context Files and Sessions — What Your Agent Remembers
subtitle: Persistent memory, per-turn context files, scripts and sessions — the difference between remembering and forgetting.
---

# Memory, Context Files and Sessions — What Your Agent Remembers

**Read time: 5 minutes · Task: 8 minutes**

A personal agent *remembers*. This lesson is about the three ways Hermes does that: persistent memory, context files, and sessions.

## 1. Persistent memory

Your agent stores durable, high-signal facts about you — your name, role, goals, preferences, the tools you use. This is injected into **every** turn, so it's always acting with your identity in mind. It's kept compact on purpose (a limited character budget), so your agent prioritises what matters rather than drowning in detail.

You can also attach external memory providers for larger, searchable long-term recall if you outgrow the built-in store.

## 2. Context files — injected every turn

You can tell your agent how to *be* by dropping structured files into its context. Three stand out:

- **`SOUL.md`** (personality) — voice, values, boundaries: "be blunt, no flattery, Nigerian/British English."
- **`AGENTS.md`** — project/procedural context, loaded when working in a codebase or a specific working dir.
- **`.hermes.md`** — extra agent instructions in your home directory.

These load every turn, so they shape how your agent speaks and works without you repeating it.

## 3. Sessions

When you close a session, the state doesn't have to vanish. Hermes lets you:

- **Continue** a session later (`hermes --continue`).
- **Search** past sessions to recover work or decisions.
- **Save/export** sessions when you need a durable record.

This is your agent's memory of *what we were doing*, separate from the memory of *who you are*.

## Memory ≠ privacy risk if configured right

Because it runs on your machine, your memory and context stay with you. The main discipline: **don't store secrets** (API keys, passwords) in memory or context files — put those in `.env`. Keep memory for preferences and facts, and secrets for your secrets.

## 🎯 Task

Set the tone of your agent. Find or create a `SOUL.md` and add one line about how you'd like it to speak to you (your values, your deadlines, your bluntness preference). Then confirm your memory contains your name and role.

## 📤 Output

The one-line personality rule you added to `SOUL.md`, and confirmation that memory knows who you are.

---
**Verified fact:** The distinction between persistent memory, context files (SOUL.md, AGENTS.md, .hermes.md), and sessions with resume/search/export is documented in the official Hermes Agent guides for memory, context, and the CLI.
