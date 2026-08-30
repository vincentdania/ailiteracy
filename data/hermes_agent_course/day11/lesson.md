---
day: 11
title: Integrate Email Without Losing Control
subtitle: Know the difference between an email bot and mailbox work, then choose the safer setup.
---

# Integrate Email Without Losing Control

**Read time: 7 minutes · Task: 20 minutes**

“Connect my email” can mean two different things in Hermes. Mixing them up creates both confusion and risk.

## Route 1: the email gateway

The email gateway gives the agent its own inbox. An allowed sender emails that address and Hermes can reply in the same thread. This is useful when you want to send tasks to your agent by email.

It is not a draft-only mailbox assistant. By design, the gateway can send a reply. Do not use it on your personal inbox.

The setup wizard is the safest starting point:

```bash
hermes gateway setup
```

Choose Email and supply a dedicated address, an app password, the IMAP and SMTP hosts, and an allowlist. Manual settings live in `~/.hermes/.env`:

```dotenv
EMAIL_ADDRESS=hermes@example.com
EMAIL_PASSWORD=APP_PASSWORD
EMAIL_IMAP_HOST=imap.example.com
EMAIL_SMTP_HOST=smtp.example.com
EMAIL_ALLOWED_USERS=you@example.com
EMAIL_HOME_ADDRESS=you@example.com
```

Protect the file with `chmod 600 ~/.hermes/.env`. Do not paste a real password into the course submission.

## Route 2: mailbox management

If you want Hermes to inspect, organise or draft from an existing mailbox, use a mailbox tool such as the documented Himalaya skill. That route has its own command-line dependency and configuration. Keep sending behind your review process. Do not assume the email gateway provides draft-only behaviour.

## Use the least access you can

- Create a dedicated, low-privilege inbox.
- Use an app password, not the account's main password.
- Set `EMAIL_ALLOWED_USERS`; unknown senders are ignored by default.
- Keep bank, password-reset, legal and safeguarding mail out of the account.
- Start by emailing the agent from your own allowlisted address.
- Read the first reply carefully before widening access.

## Task

Configure a dedicated email gateway inbox. Send it one harmless test message from your allowlisted address and confirm the reply threads correctly. If your real goal is mailbox triage, stop after documenting the Himalaya route; do not grant broader inbox access for the sake of finishing a lesson.

## Output

Record which route you chose, the provider, the allowed sender and whether the test worked. Never submit a password, token or full `.env` file.

---
**Official guide:** [Email setup and security](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email).
