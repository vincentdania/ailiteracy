---
day: 17
title: Voice, Code Execution and Local Models
subtitle: Three advanced powers — talk to your agent, let it run code safely, and run it fully offline.
---

# Voice, Code Execution and Local Models

**Read time: 6 minutes · Task: optional, pick one**

These three advanced powers take your agent from useful to formidable. You don't need all three — master what serves you.

## 1. Voice mode

Talk to your agent instead of typing.

- **Enter voice** with a command or /voice in a connected chat.
- The agent transcribes your speech (including non-English queries), works, and replies — with **spoken text-to-speech** responses on the latest models.
- Great on the move: walking to a meeting, dictating a memo, catching up on a briefing hands-free.

## 2. Code execution

A huge jump in capability: your agent can **run Python, SQL, or other code** to do the work.

- Use it to analyse a spreadsheet, process data, run calculations, generate visualisations.
- **Run it safely.** Hermes supports sandboxed execution and **containers** (Docker) for isolated, high-risk work, so a misbehaving task stays contained and can't touch your real system.
- For a personal user, sandboxed execution is the sweet spot: powerful enough for real analysis, safe enough to trust.

## 3. Local models

If privacy or cost pushes you that way, Hermes supports **fully local inference**:

- **Ollama** — run open-weights models on your own machine.
- Quantised (GGUF) models can run on modest hardware and even on phones.
- A local model keeps every interaction on-device — the maximal privacy posture — at the cost of more capable cloud models.

**The trade-off.** Cloud models (via Nous Portal, etc.) are usually smarter and faster for complex agent work. Local models win on privacy and zero marginal cost. Most people use cloud for heavy reasoning and local for private/offline tasks.

## 🎯 Task

Pick one to try today:
- **Voice:** enter voice mode and produce a one-paragraph dictated memo.
- **Code:** ask your agent to run a short Python script (e.g., compute a summary from a small CSV) in a sandbox.
- **Local:** install Ollama and run a small quantised model locally.

## 📤 Output

A one-line note of which you tried and whether it worked.

---
**Verified fact:** Voice mode with TTS, sandboxed/containerised code execution, and local inference via Ollama/quantised models are all documented Hermes Agent capabilities.
