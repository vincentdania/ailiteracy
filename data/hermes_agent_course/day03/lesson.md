---
day: 3
title: How Hermes Is Put Together
subtitle: The five layers from interface to core — see where your agent's power lives.
---

# How Hermes Is Put Together

**Read time: 4 minutes · Task: 3 minutes**

Before you install, grasp the one mental model that makes everything else click. Hermes is built in layers, from the face you touch down to the brain that thinks.

## The five layers

1. **Interfaces** — how you talk to it. The CLI, a desktop app, a TUI, voice, and the messaging gateway you reach through Telegram or WhatsApp. You will almost always use several.
2. **Application** — the agent runtime and services that run on your machine or server: the core loop, the gateway, cron scheduler, and API.
3. **Agent core** — the brain. The model, the tools it can call, the memory that persists, and the skills it has learned. This is where your agent "lives."
4. **Capabilities** — the things the agent can actually do: tools and toolsets, skills, memory, context files, plugins, and MCP connections.
5. **Providers & backends** — the outside world it depends on: LLM providers (Nous Portal, OpenRouter, OpenAI, local models) and terminal backends (local, Docker, SSH, cloud) that run its work.

## Why the mental model matters

Every feature in this course plugs into one of those layers:

- *"Connect Telegram"* → **Interface layer**.
- *"Save a skill"* → **Capabilities layer**.
- *"Set up memory"* → **Capabilities layer**, near the core.
- *"Run it on a VPS"* → **Application + backend layers**.
- *"Pick a model"* → **Provider layer**.

If a tool ever feels confusing, ask: *which layer does this touch?* The answer tells you where to look.

## The self-improving loop

The engine that makes an agent *personal* is a loop:

**You use it → it records context → it saves a skill → next session it's better.**

That loop — tools, skills, memory, context, and the ability to recall past sessions — is what separates a personal agent from a chat that forgets.

## 🎯 Task

Sketch the five layers on paper or in a note app. Next to each, write one example of *your* agent's action that touches it (e.g., "chat with me = interface").

## 📤 Output

Your one-line-per-layer diagram.

---
**Verified fact:** This five-layer model matches how the real system is organised in the official Hermes Agent documentation — interfaces, runtime/core, capabilities, and providers/backends. You'll explore each in depth in the modules ahead.
