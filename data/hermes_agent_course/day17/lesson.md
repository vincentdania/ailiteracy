---
day: 17
title: Voice, Code Execution and Local Models
subtitle: Three advanced powers — talk to your agent, let it run code safely, and run it fully offline.
---

# Voice, Code Execution and Local Models

**Read time: 6 minutes · Task: optional, pick one**

These features solve different problems. Pick one only if it supports work you actually need to do.

## 1. Voice mode

Talk to your agent instead of typing.

- **Enter voice** with a command or /voice in a connected chat.
- Speech-to-text and text-to-speech depend on the provider and tools you configure. Test your language and accent before relying on them for important work.
- Great on the move: walking to a meeting, dictating a memo, catching up on a briefing hands-free.

## 2. Code execution

A huge jump in capability: your agent can **run Python, SQL, or other code** to do the work.

- Use it to analyse a spreadsheet, process data, run calculations, generate visualisations.
- The `execute_code` tool runs Python that can call Hermes tools programmatically. It is not, by itself, a security sandbox.
- Use a Docker or other isolated terminal backend when code should not have direct access to the host. Mount only the files the task needs.

## 3. Local models

If privacy or cost pushes you that way, Hermes supports **fully local inference**:

- **Ollama** — run open-weights models on your own machine.
- Quantised models reduce memory requirements, but hardware needs vary widely. Check the model size, context length and available RAM before downloading.
- A local model keeps every interaction on-device — the maximal privacy posture — at the cost of more capable cloud models.

**The trade-off.** A local model can keep inference on your device, but only if the rest of the workflow also avoids cloud tools. Local does not mean private if the agent still calls hosted search, browser, speech or MCP services. Hermes requires at least a 64K context window for agent use.

## 🎯 Task

Pick one to try today:
- **Voice:** enter voice mode and produce a one-paragraph dictated memo.
- **Code:** ask your agent to run a short Python script (e.g., compute a summary from a small CSV) in a sandbox.
- **Local:** install Ollama and run a small quantised model locally.

## 📤 Output

A one-line note of which you tried and whether it worked.

---
**Official guides:** [Code execution](https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution) and [model providers](https://hermes-agent.nousresearch.com/docs/integrations/providers/).
