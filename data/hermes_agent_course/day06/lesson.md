---
day: 6
title: Run It 24/7 on a VPS
subtitle: Keep your agent alive while your laptop is closed — with low-cost VPS options that work in Nigeria.
---

# Run It 24/7 on a VPS

**Read time: 5 minutes · Task: varies (registration)**

Your agent is most powerful when it is *always on*. A laptop that sleeps at night means an agent that is unreachable. The fix: run it on a **VPS** (a small cloud server) that never sleeps, then talk to it from anywhere — including your phone.

## What you need

A VPS is a rented Linux server. Hermes runs fine on a modest one; you don't need much CPU or RAM for a personal agent. This makes it cheap.

## Pick a host (Verified pricing, Aug 2026 — re-check before buying)

- **Oracle Cloud** — a genuinely free Arm tier (always free, generous specs). Best *free* starting point.
- **Contabo** — very budget-friendly monthly plans, popular with Nigerian users.
- **Hostinger** — cheap VPS plans, easy control panel.
- **DigitalOcean** — reliable $5–7 droplets, huge community of tutorials.

> **Nigerian tip:** the free Oracle tier is the smart start. Many Nigerian users also buy from local resellers who accept naira and provide `cPanel`. Always verify features and pricing before paying.

## Provision and connect

Create the server, then SSH into it:

```bash
ssh root@YOUR_SERVER_IP
```

## Install and deamonise

Run the normal installer on the VPS, connect your model, then start the gateway and make it survive reboots:

```bash
# install (same one-command install as your laptop)
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# run the messaging gateway (keeps Telegram/email connected)
hermes gateway run
```

For always-on reliability, run the gateway as a **system service** (systemd) so it starts on boot and restarts if it crashes. The documentation covers `hermes gateway install` for this. Your agent becomes a background worker you can reach 24/7.

## Security reminder

A server exposed to the internet must be protected. The full hardening steps come in Lab 15, but at minimum: use SSH keys, keep the system updated, and never expose secrets. Change the default password, and keep `.env` private.

## 🎯 Task

Choose a VPS path (the free Oracle tier is a sensible default). Provision it, SSH in, install Hermes, connect your model, and start the gateway. Set it up so it survives a reboot.

## 📤 Output

A note of: your host, the monthly cost (or free), and confirmation that the gateway starts. If you didn't provision yet, write down the host and price you plan to use.

---
**Verified fact:** Oracle Cloud's always-free Arm tier and the ~$5–7 DigitalOcean/Contabo ranges are representative as of August 2026; always re-confirm current pricing before purchase. The gateway/service commands are from the official Hermes gateway documentation.
