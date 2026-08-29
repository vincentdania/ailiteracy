---
day: 13
title: 'GitHub — Webhooks, Review and Automation'
subtitle: Connect your agent to GitHub so it can watch repos, review pull requests and automate workflows.
---

# GitHub — Webhooks, Review and Automation

Think of GitHub as the place where code and projects live on the internet. Almost every software team keeps its working files there, in a folder called a **repository** (a "repo"). People don't edit the same file directly — they propose changes, and someone reviews those changes before they are accepted. This lesson shows you how to connect Hermes to GitHub so your agent can join that workflow.

## A simple mental model

Your agent can live inside the GitHub life cycle in four steps:

1. **Your project lives in a repo** on GitHub, with your developer — or a client's developer — actively working on it.
2. **GitHub notifies Hermes when something happens.** When someone opens a pull request (a "PR" — a proposed change), pushes new code, or files an issue, GitHub can send your agent a message about it. We call this a **webhook**: GitHub posts an event to a URL your agent listens on. When a new PR opens, Hermes hears about it and can act.
3. **Hermes reviews the change.** Hermes can read the proposed change, spot bugs or style issues, and post a comment on the pull request with suggestions. There is even a dedicated GitHub PR Review Agent guide for this.
4. **You approve before it merges.** Nothing gets merged into the real project without a human saying yes. The agent suggests and flags; the human decides and approves.

## Being honest about the setup

Webhooks work because GitHub reaches *out* to your agent. That means your agent needs a publicly reachable web address — one the internet can actually get to. If your Hermes runs on your own laptop, GitHub cannot knock on it directly. The common fix is to run your agent on a server on the internet, like a low-cost VPS. That is a one-time setup, and then your monitoring runs on its own.

## A real-world example

Say you are a consultant keeping a client's GitHub repo tidy. Every time the developer opens a PR, your agent is notified, reviews the change, and leaves inline suggestions — freeing you up instead of babysitting a chat window. Or perhaps you are not a coder yourself, but you team up with a developer peer: they write the code, while your agent watches repo activity and flags anything odd for your review before you approve the merge. Either way, you stay in control.

## Where to go deeper

The official Hermes documentation has guides on **"Receive events from GitHub"**, **"Automated GitHub PR Comments with Webhooks"**, and the **GitHub PR Review Agent**. Hermes also has git and terminal tools, so it can work with a repo locally too. Read those guides when you're ready to wire it up.

## Task

Describe one GitHub workflow you'd like your agent to watch for you — for example, monitoring a client's pull requests — and outline the four steps from this lesson applied to that scenario.

## Output

Two or three short paragraphs: (1) the scenario, (2) which GitHub events you'd want to be notified about, and (3) the rule you would set for when you approve a merge.
