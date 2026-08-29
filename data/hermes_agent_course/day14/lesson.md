---
day: 14
title: 'The Web Browser — Search, Extract and Browse'
subtitle: Give your agent hands and eyes on the web
---

# The Web Browser — Search, Extract and Browse

So far your agent reads files and calls APIs. Today you give it a browser. **Read time: ~6 min. Task: ~10 min hands-on.**

From day 14 your agent can navigate real websites, click buttons, fill and submit forms, and pull out information you'd normally copy by hand. Just describe what you want: "Research this topic and summarise it," "Check if this site is down," "Extract the pricing from this competitor's page," "Fill and submit this form for me."

## How the browser sees pages

Hermes doesn't "look" at a page the way you do. It reads the page as an **accessibility tree** — a clean, text-based snapshot of every element. Interactive bits (buttons, inputs, links) get **ref IDs** like `@e1`, `@e2`. The agent uses those IDs to click and type, so it never fumbles by guessing coordinates. It also supports **vision analysis** of screenshots, and each task runs in its **own isolated browser session**.

## Pick your browser: four ways

Here's the honest, non-coder version of your options.

- **Use the browser you already have.** Run `/browser connect` to attach the agent to your own Chrome, Brave, Edge, or Chromium. No new software, nothing to learn.
- **A cloud browser.** Hermes can drive a remote browser for you: Browser Use (managed Chromium with stealth, residential proxies, CAPTCHA solving, and reusable profiles), Browserbase, or Firecrawl for scraping.
- **A tiny local browser.** Lightpanda runs entirely on your machine with very low memory — good for lightweight jobs.
- **Portal subscribers.** If you're on the paid Nous Portal, run `hermes setup --portal` and every gateway tool (browser included) just works with no browser API keys to hunt for.

```bash
hermes setup --portal
```

Need a browser API key yourself? It lives in `~/.hermes/.env` (the real one is `BROWSER_USE_API_KEY`). No branch of this requires you to become a programmer.

## A note for low-bandwidth users

On a slow connection, a **cloud browser is your friend**. The work happens remotely, on the provider's fast pipes — your small link only carries back the finished result. Perfect for Nigerian networks where every megabyte counts.

## Task

Open a chat with your agent and ask it to **navigate to a real website of your choice** (a news site, a government portal, a competitor's pricing page) and **summarise the key information** for you. If you're brave, ask it to **fill and submit a simple form** on a non-sensitive site. Watch it read the page and act on the ref IDs.

## Output

Note down: which backend you used, what you asked, and what the agent returned. In one line, say how this changes what you'd trust your agent to do next.

---

**Key word to remember:** accessibility tree — the agent's eyes. Everything else is just choosing a browser.
