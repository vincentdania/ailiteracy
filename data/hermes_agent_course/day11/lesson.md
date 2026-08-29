---
day: 11
title: The Messaging Gateway — Telegram and WhatsApp
subtitle: Exact steps to reach your agent from the apps you already use. The gateway is the always-on switchboard.
---

# The Messaging Gateway — Telegram and WhatsApp

**Read time: 6 minutes · Task: 20 minutes (hands-on)**

This is where the agent becomes genuinely yours: it reaches you in the apps you check daily. The key concept is the **messaging gateway** — the always-on service that connects Hermes to 20+ messaging platforms.

## The gateway

Run `hermes gateway setup` to pick your platforms, and `hermes gateway run` (or install it as a service) to keep it connected 24/7. With the gateway up, you can message your agent from Telegram, WhatsApp, Discord, Slack, Signal, Matrix, email and more — the *same* agent, same memory and skills.

To send it a message from the CLI:

```bash
hermes send --to telegram "Good morning, brief me"
```

## Connect Telegram — exact steps

1. **Create a bot.** In Telegram, message **@BotFather** → send `/newbot` → name it → copy the HTTP API token.
2. **Store the token.** In `~/.hermes/.env`, set `TELEGRAM_BOT_TOKEN=...`.
3. **Allowlist yourself.** Set `TELEGRAM_ALLOWED_USERS=123456789` (your numeric user id) so only you can control the bot.
4. **Start the gateway.** `hermes gateway run` (or install as a service) — your bot goes online.
5. **Set your home chat.** Message the bot once, then send `/sethome` so scheduled jobs deliver there.
6. **Test it.** `hermes send --to telegram "Test from the course"`.

## Connect WhatsApp — the trade-off

WhatsApp is the most-used app in Nigeria. Two routes:

- **Official WhatsApp Business & Cloud API** — production-grade, multi-user, but requires Meta app approval and can cost money.
- **Self-hosted bridge** — runs a WhatsApp Web-style session for *your own number*, free and private.

For a personal agent, the self-hosted route on your own number is usually the fit. Put the credentials in `.env`, enable the adapter in gateway setup, restart the gateway. WhatsApp policy is stricter than Telegram — always use your own number and avoid anything that triggers spam flags.

## 🎯 Task

Connect Telegram end-to-end using the exact steps. Once it works, message your agent a real instruction ("Summarise today's priorities"). If you use WhatsApp heavily, attempt the self-hosted bridge too.

## 📤 Output

A screenshot or note that you messaged your agent from Telegram/WhatsApp and it replied there. Note which platform you connected.

---
**Verified fact:** The gateway, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALLOWED_USERS`, `/sethome`, and `hermes send` are documented Hermes Agent features/config. WhatsApp's two routes and stricter policy are accurate.
