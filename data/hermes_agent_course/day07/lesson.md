---
day: 7
title: Tools and Toolsets — Your Agent's Hands
subtitle: Give the agent only the tools it needs, grouped into switchable toolsets.
---

# Tools and Toolsets — Your Agent's Hands

**Read time: 5 minutes · Task: 8 minutes**

**Tools** are the actions Hermes can take: searching the web, reading a file, running a command or using a connected service. Toolsets group related tools so you can control what is available in each session or platform.

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

## More tools are not always better

A model can only act through the tools it has. With the right tools and a clear task, one instruction can cover several checked steps:

> "Research funding for NGOs in Nigeria, summarise the top three deadlines, and save the list to a file."

That single instruction uses search, extract, and the file system — three tools working together.

## Low bandwidth 📶

Tool-based work is text-heavy and lightweight. Web pages are extracted to text before they enter the agent, so you are not downloading images and videos from every link — a big saving on mobile data.

## 🎯 Task

Take the task you named in Lesson 1. Break it into the tools your agent would need to do it. Write the list. Example: if the task is a policy memo, you need web search (find sources), extract (read the report), and file tools (save the draft).

## 📤 Output

Your task broken into 2–4 tools your agent would use.

---
**Official guides:** [Tools and toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/) and the [current tool registry](https://hermes-agent.nousresearch.com/docs/reference/tools-reference/). Availability varies by platform and credentials.
