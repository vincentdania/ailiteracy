---
day: 6
title: Connect a Model — GLM, DeepSeek, OpenAI, Claude
subtitle: The fastest path with Nous Portal, or bring the model of your choice — then chat for the first time.
---

# Connect a Model — GLM, DeepSeek, OpenAI, Claude

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

**Your four biggest choices, all supported:**

- **GLM** (Zhipu) — strong open-weight model, cost-effective. Add it via **OpenRouter** using a single key, or Zhipu's endpoint.
- **DeepSeek** — the popular budget workhorse. Native `DEEPSEEK_API_KEY`, or via OpenRouter. Excellent power-per-naira.
- **OpenAI** (GPT models) — the default many people know; familiar quality and tools.
- **Claude** (Anthropic) — best-in-class for long, careful writing and reasoning; generous to agents.

If you'd rather not manage several keys, **OpenRouter** is the clean move: one key, one selector, and access to GLM, DeepSeek, OpenAI, Claude and hundreds more from a single account. Google Gemini and a local **Ollama** model are also available offline or for privacy.

## The 64K rule

Hermes requires a model with at least **64K context**. Models with smaller windows are rejected at startup. All four providers above have 64K+ models; pick one that comfortably exceeds that for multi-step agent work.

## Where secrets live

A critical habit from day one:

- **Secrets** (API keys, tokens) go in `~/.hermes/.env`.
- **Settings** go in `~/.hermes/config.yaml`.

Never paste an API key into `config.yaml`. Keep keys in `.env`.

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
