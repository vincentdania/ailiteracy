---
day: 15
title: Secure and Harden Your Agent
subtitle: An approval-based security model, secrets hygiene, checkpoints, and a field checklist for an always-on agent.
---

# Secure and Harden Your Agent

**Read time: 6 minutes · Task: apply this week**

A personal agent touches your data and can act on your systems. Treating it as safe-by-default is a discipline — and Hermes is built around an **approval-based security model** to help.

## 1. Understand the security model

Hermes is designed so the agent proposes and you approve for consequential, irreversible, or external actions. That means:

- **Approvals** gate sending messages, making purchases, applying, publishing, deleting — anything with a real consequence.
- **No auto-sends** by default; drafts sit for your review.
- **Isolation** for risky work (containers/backends) so a misbehaving task can't wreck your machine.

The model puts a hard boundary between *what the agent wants to do* and *what it's allowed to do without asking*.

## 2. Secrets hygiene (non-negotiable)

- Secrets live in `~/.hermes/.env`, **never** in `config.yaml`, memory, context files, or code.
- Use unique credentials per service; use app passwords where available, never your real account password.
- If you use a password manager, keep the master password out of the agent.

## 3. Checkpoints & rollback

Hermes keeps **checkpoints** so you can roll back after a bad change — configuration, memory, or context updates that went wrong. Before experimenting, note your checkpoint; if a change breaks things, restore the last good one.

## 4. Field checklist for an always-on agent

- [ ] Exposed server? SSH keys only, no default passwords, keep updates applied.
- [ ] `.env` permissions locked to your user; never committed to git.
- [ ] Messaging platforms allowlisted (`TELEGRAM_ALLOWED_USERS`, `EMAIL_ALLOWED_USERS`).
- [ ] Approval model intact — nothing auto-sends.
- [ ] Least-privilege toolsets — only enable what you use.
- [ ] Backups/checkpoints for memory and config.
- [ ] A firewall on any VPS.

## 🎯 Task

Run the checklist. Fix at least one gap — e.g., lock `.env` permissions (`chmod 600 ~/.hermes/.env`), or confirm your first checkpoint/backup.

## 📤 Output

The checklist with your fixes checked off, and note the one change you made first.

---
**Verified fact:** The approval-based security model (gate consequential actions by default), secrets-in-`.env`, and checkpoints/rollback are documented Hermes Agent security features.
