---
day: 21
title: Day 21 — Build Your Personal AI Agent with Open-Source Tools
subtitle: Build a private agent you can run, inspect and improve.
bullets: Run a model locally with Ollama | Use Open WebUI as the interface | Give the agent one clear job | Add only the tools it needs | Test before trusting it
rules: Start read-only | Keep secrets out | Require approval for actions
---

# Day 21 — Build Your Personal AI Agent with Open-Source Tools

**Read time: 7 minutes · Task: 30 minutes**

Today you will turn your best workflow into a personal AI agent. The first version should do one useful job well.

## Your open-source stack

- **Ollama** runs an AI model on your computer.
- **Open WebUI** gives you a simple chat interface and knowledge base.
- **n8n** connects the agent to repeatable workflows when you are ready.

Start with Ollama and Open WebUI. Add n8n only after the agent gives reliable answers.

Official setup guides:

- [Ollama quickstart](https://docs.ollama.com/quickstart)
- [Open WebUI quickstart](https://docs.openwebui.com/getting-started/quick-start/)
- [n8n documentation](https://docs.n8n.io/)

## 1. Choose one job

Pick a narrow task you already understand:

- Turn meeting notes into actions
- Draft a weekly operations brief
- Answer questions from an approved policy document
- Turn field updates into a concise project report

Write the outcome in one sentence: **“My agent turns ___ into ___.”**

## 2. Write the agent brief

Use this template as the agent's system prompt:

> You are my [role] agent. Your job is to [single outcome]. Use only the information I provide. Ask when context is missing. Separate facts, assumptions and recommendations. Never send, delete, publish or spend without my approval. End with a short checklist for my review.

Add only the documents the agent needs. Remove personal, client and company secrets first.

## 3. Build the first version

1. Install Ollama and run a model that fits your device.
2. Install Open WebUI and connect it to Ollama.
3. Create a model or workspace with your agent brief.
4. Add one safe reference document.
5. Test with a real but non-sensitive task.

If your computer cannot run a local model comfortably, complete the design and testing steps with a hosted model. The agent brief and safety rules stay the same.

## 4. Test it

Run three checks:

1. **Normal case:** a complete, clear request.
2. **Missing context:** an incomplete request; the agent should ask questions.
3. **Unsafe request:** ask it to send, delete or expose something; it should stop for approval.

Record what failed and revise the brief once.

## 5. Add a workflow later

When the agent is reliable, use n8n to connect a trigger, the model, an output and a human approval step. Keep the first workflow read-only.

## Capstone checklist

- [ ] One clear agent job
- [ ] Agent brief added
- [ ] One approved knowledge source
- [ ] Three tests completed
- [ ] Human approval required for actions
- [ ] AI Work Playbook assembled

---

## 🎯 Task (30 minutes)

Build and test the smallest useful version of your personal AI agent.

## 📤 Output

Your **agent brief, test results and working prototype**. Complete the lesson to earn your certificate.
