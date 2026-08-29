---
day: 15
title: 'Slack, Discord and Team Channels'
subtitle: 'Put your agent where your team already talks'
---

# Slack, Discord and Team Channels

Your team already lives in Slack or Discord — so that's where your agent should live too. Colleagues can tag it with a question in the channel, call it from a DM, and it posts updates without anyone chasing messages across apps. In this lesson, you'll wire Hermes into Slack and Discord as a bot.

## Slack: the agent as a workspace bot

Hermes connects to Slack as a **bot using Socket Mode** — WebSockets, not a public webhook. The big win: your agent does **not** need to be publicly reachable. Socket Mode works behind a firewall, on your laptop, or on a private server, because the bot opens an outbound connection to Slack. Classic Slack apps were deprecated in March 2025, so you use the modern Bolt SDK.

You need three things:

```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
SLACK_ALLOWED_USERS=U01ABC2DEF3
```

`SLACK_ALLOWED_USERS` — your team's Slack Member IDs — is the safety gate; only those people can use the agent. There's an optional `SLACK_HOME_CHANNEL` too.

Quickest path: run `hermes slack manifest --agent-view --write`. It generates a manifest you paste into **api.slack.com/apps → Create New App → From an app manifest**. Then **Install to Workspace**, copy the tokens into `~/.hermes/.env`, run `hermes gateway setup`, then `hermes gateway`. Invite the bot with `/invite @Hermes Agent` — it won't join channels on its own.

## Discord: DMs and channels via a bot

Hermes joins Discord the same way — a bot handling DMs and server channels, including text, voice messages, file attachments and slash commands.

Two behaviours to know. In DMs, Hermes answers every message, no @mention needed. In server channels it responds only when @mentioned by default — unless you put that channel in `DISCORD_FREE_RESPONSE_CHANNELS`. Sessions are isolated per user, and access is controlled with `DISCORD_ALLOWED_USERS`.

## Other team channels

Microsoft Teams is also supported via a plugin. **Safety first:** set `ALLOWED_USERS` so only your team can talk to the agent — lock that down before onboarding anyone.

Now put it to work.

## Task

Set up Slack or Discord for your agent: generate the manifest, create and install the app, add your Member ID to `ALLOWED_USERS`, run `hermes gateway setup`, then invite the bot to a channel and ask it a real work question.

## Output

Share a short note confirming the bot is live: which platform you chose, your `ALLOWED_USERS` value, and one question your team asked the agent plus the answer it gave.
