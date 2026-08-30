---
day: 15
title: Secure and Harden Your Agent
subtitle: An approval-based security model, secrets hygiene, checkpoints, and a field checklist for an always-on agent.
---

# Secure and Harden Your Agent

**Read time: 6 minutes · Task: apply this week**

A personal agent can read data and run tools. Security comes from several controls working together, not from trusting one prompt or toggle.

## 1. Understand the security model

Hermes checks terminal commands against dangerous patterns. In the default smart mode, low-risk commands may run, clearly dangerous commands may be denied, and uncertain cases may be sent to you for approval. This does not guarantee that every external action in every tool will ask first.

- Keep `approvals.mode` set to `smart` or `manual`; never use `off` on a normal work machine.
- Keep `approvals.cron_mode` at `deny` unless a headless task has been designed and tested for broader access.
- Use allowlists to control who can reach messaging adapters.
- Use a Docker or other isolated terminal backend for work that should not touch the host directly.

Approvals reduce risk; they do not replace least privilege, backups, review or good account separation.

## 2. Secrets hygiene (non-negotiable)

- Secrets live in `~/.hermes/.env`, **never** in `config.yaml`, memory, context files, or code.
- Use unique credentials per service; use app passwords where available, never your real account password.
- If you use a password manager, keep the master password out of the agent.

## 3. Checkpoints & rollback

Checkpoints are opt-in filesystem snapshots for supported working directories. Enable them with `hermes chat --checkpoints` or in `config.yaml`. Preview a restore with `/rollback diff N` before running `/rollback N`. Checkpoints do not replace a normal backup of `~/.hermes`.

## 4. Field checklist for an always-on agent

- [ ] Exposed server? SSH keys only, no default passwords, keep updates applied.
- [ ] `.env` permissions locked to your user; never committed to git.
- [ ] Messaging platforms allowlisted (`TELEGRAM_ALLOWED_USERS`, `EMAIL_ALLOWED_USERS`).
- [ ] Approval mode checked; cron denies dangerous commands by default.
- [ ] Least-privilege toolsets — only enable what you use.
- [ ] A backup of Hermes state; checkpoints enabled where rollback is needed.
- [ ] A firewall on any VPS.

## 🎯 Task

Run the checklist. Fix every failed item before the capstone. At minimum, lock `.env` permissions (`chmod 600 ~/.hermes/.env`), run `hermes security audit`, and confirm a backup or rollback path.

## 📤 Output

The checklist with your fixes checked off, and note the one change you made first.

---
**Official guides:** [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security/) and [Checkpoints and rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback/).
