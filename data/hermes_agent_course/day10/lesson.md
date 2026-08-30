---
day: 10
title: The Messaging Gateway — Telegram and WhatsApp
subtitle: Exact steps to reach your agent from the apps you already use. The gateway is the always-on switchboard.
---

# The Messaging Gateway — Telegram and WhatsApp

**Read time: 6 minutes · Task: 20 minutes (hands-on)**

The messaging gateway connects one Hermes profile to the platforms you configure. It must be running for adapters that keep a live connection.

## The gateway

Run `hermes gateway setup` to pick your platforms. Use `hermes gateway` in the foreground while testing. For an always-on setup, use `hermes gateway install`, `hermes gateway start` and `hermes gateway status`. Platforms share memory and skills only when they point to the same Hermes profile.

To send it a message from the CLI:

```bash
hermes send --to telegram "Good morning, brief me"
```

## Connect Telegram — exact steps

1. **Create a bot.** In Telegram, message **@BotFather** → send `/newbot` → name it → copy the HTTP API token.
2. **Store the token.** In `~/.hermes/.env`, set `TELEGRAM_BOT_TOKEN=...`.
3. **Allowlist yourself.** Set `TELEGRAM_ALLOWED_USERS=123456789` (your numeric user id) so only you can control the bot.
4. **Start the gateway.** Run `hermes gateway` while testing, or start the installed service.
5. **Set your home chat.** Message the bot once, then send `/sethome` so scheduled jobs deliver there.
6. **Test it.** `hermes send --to telegram "Test from the course"`.

## Connect WhatsApp — the trade-off

WhatsApp is the most-used app in Nigeria. Two routes:

- **Official WhatsApp Business & Cloud API** — production-grade, multi-user, but requires Meta app approval and can cost money.
- **Self-hosted bridge** — runs a WhatsApp Web-style session. It is unofficial and carries an account-restriction risk.

If you test the self-hosted bridge, use a dedicated number, not the number you depend on for personal or business communication. The Cloud API is the supported route for a business bot but needs Meta setup and a public webhook.

## 🎯 Task

Connect Telegram end to end. Once it works, message your agent a real instruction such as “Summarise today's priorities.” Treat WhatsApp as an optional lab after you have read the official risk notice.

## 📤 Output

A screenshot or note that you messaged your agent from Telegram/WhatsApp and it replied there. Note which platform you connected.

---
**Official guides:** [Telegram](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram/) and [WhatsApp](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/whatsapp/).
