---
day: 8
title: Tools and Toolsets — Your Agent's Hands
subtitle: The 60+ built-in capabilities that let your agent do real work, grouped into switchable sets.
---

# Tools and Toolsets — Your Agent's Hands

**Read time: 5 minutes · Task: 8 minutes**

This is where an agent stops being a chatbot. **Tools** are the actions your agent can take — searching the web, extracting a page, running code, reading a file. Grouped sets of tools are called **toolsets**, and you can turn them on and off.

## What tools can do

Your agent's tools give it hands. A few you'll use constantly:

- **Web search & extract** — find information and pull the content of a page.
- **File & code execution** — read, edit, and run scripts.
- **Browser** — drive a real browser to get past bot-blocked or JavaScript-heavy pages.
- **Vision** — look at an image.
- **Developer tools** — the coding/CI tooling for building software.
- **Media & creative** — generate audio, images, diagrams.

## Toolsets: the switch

You don't need every tool at once. Tools are organised into **toolsets** you can enable per purpose. Configuring which toolsets are available is part of setup:

```bash
hermes tools
```

This shows what's available and lets you control what your agent may call. Limiting tools is also a **security** practice: give the agent only what a task needs.

## Why 60+ tools matters

A model can only do what its tools let it do. With a rich, correct toolset, one instruction can turn into a genuinely completed job:

> "Research funding for NGOs in Nigeria, summarise the top three deadlines, and save the list to a file."

That single instruction uses search, extract, and the file system — three tools working together.

## Low bandwidth 📶

Tool-based work is text-heavy and lightweight. Web pages are extracted to text before they enter the agent, so you are not downloading images and videos from every link — a big saving on mobile data.

## 🎯 Task

Take the task you named in Lesson 1. Break it into the tools your agent would need to do it. Write the list. Example: if the task is a policy memo, you need web search (find sources), extract (read the report), and file tools (save the draft).

## 📤 Output

Your task broken into 2–4 tools your agent would use.

---
**Verified fact:** Hermes ships with 60+ built-in tools organised into toolsets, manageable with `hermes tools` (per the official documentation). Extracting page text before processing keeps data use low.
