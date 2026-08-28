---
day: 5
title: Connect a Model and Talk to Your Agent
subtitle: The fastest path with Nous Portal, or bring your own key — then chat for the first time.
---

# Connect a Model and Talk to Your Agent

**Read time: 5 minutes · Task: 15 minutes (hands-on)**

Your agent is installed but it has no brain yet. This lesson gives it one. Your single decision that shapes everything is the **model**.

## The fastest path: Nous Portal

For most people, the easiest route is a **Nous Portal** subscription. It gives you **one OAuth login, 300+ models**, and unlocks the **Tool Gateway** (which enables built-in web search, image, and TTS tools). One subscription, predictable cost.

```bash
hermes setup --portal
```

Sign in with your Nous account and the setup wires the provider for you.

## Or bring your own key

If you already hold keys, you can connect any major provider — pick via the interactive model selector:

```bash
hermes model
```

Options include OpenRouter, OpenAI, Anthropic, and Google Gemini, plus DeepSeek (`DEEPSEEK_API_KEY`) or a local Ollama model.

## Where secrets live

A critical habit from day one:

- **Secrets** (API keys, tokens) go in `~/.hermes/.env`.
- **Settings** go in `~/.hermes/config.yaml`.

Never paste an API key into `config.yaml`. Keep keys in `.env`.

## A model with the right context

Hermes requires a model with at least **64K context**. Models with smaller context windows are rejected at startup. Your selected model should comfortably exceed that for multi-step agent work.

## Chat for the first time

```bash
hermes status
```

Confirm your provider, model, and enabled tools are shown. Then just type a message in the terminal and your agent answers. That's your first working personal agent.

## 🎯 Task

Connect a model (Portal is fastest). Run `hermes status` and confirm provider + model + tools. Ask your agent something real — e.g., "Draft a short memo summarising this week's naira exchange-rate news." Read the answer critically: an agent drafts fast, but you verify facts.

## 📤 Output

A note of: (1) which provider/model you chose, (2) the `hermes status` confirmation, and (3) one thing the agent drafted well and one thing you had to correct.

---
**Verified fact:** `hermes setup --portal`, `hermes model`, and the `~/.hermes/.env` + `~/.hermes/config.yaml` split, plus the 64K minimum context requirement, are all documented behaviours in the official Hermes Agent docs.
