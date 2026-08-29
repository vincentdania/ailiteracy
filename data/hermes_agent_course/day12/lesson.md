---
day: 12
title: 'Email — Gmail, Yahoo, Zoho and Outlook'
subtitle: 'Connect your agent to a real inbox over IMAP and SMTP, and let it read and draft mail safely.'
---

# Email — Gmail, Yahoo, Zoho and Outlook

Once connected, you can email your agent and it replies in-thread — no special client needed. Hermes uses standard **IMAP** (read) and **SMTP** (send) protocols, so it works with Gmail, Outlook, Yahoo, Zoho, Fastmail or any provider that exposes them.

## Pick your provider

- **Gmail**: turn on **2-Factor Authentication**, then create an **App Password** at `myaccount.google.com/apppasswords` (choose 'Mail' or 'Other'). Copy the 16-character password — use it in place of your normal password. IMAP host `imap.gmail.com`, SMTP host `smtp.gmail.com`.
- **Outlook / Microsoft 365**: enable 2FA, then create an App Password under **Additional security options** at `account.microsoft.com/security`. IMAP host `outlook.office365.com`, SMTP host `smtp.office365.com`.
- **Yahoo and Zoho**: both support IMAP/SMTP like the rest. Also enable IMAP in each provider's settings and use an app password where it's required. Don't guess the host strings — copy the current values from each provider's help page.

A useful default: IMAP runs on port **993** with SSL, SMTP on port **587** with STARTTLS.

## Connect it

Easiest route is the setup wizard:

```bash
hermes gateway setup   # choose Email, then answer the prompts
```

It asks for your email address, the app password, the IMAP and SMTP hosts, and which senders are allowed. Or set `~/.hermes/.env` manually:

```bash
EMAIL_ADDRESS=you@example.com
EMAIL_PASSWORD=xxxxxxxxxxxxxxxx   # app password, NOT your main one
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_SMTP_HOST=smtp.gmail.com
# EMAIL_IMAP_PORT=993
# EMAIL_SMTP_PORT=587
EMAIL_ALLOWED_USERS=you@example.com,coach@example.com
# EMAIL_HOME_ADDRESS=me@example.com
```

Then start it with `hermes gateway` (foreground) or `hermes gateway install` (as a service).

## Stay safe

Use a **dedicated email account** for the agent — don't hand it your personal or bank address. Always use **app passwords**, never your main password. Restrict replies with `EMAIL_ALLOWED_USERS`, and protect `~/.hermes/.env` with `chmod 600`.

The rule that keeps you sane is the agent can **read and draft**, but nothing sends without your **approval before send**.

## Try it

The inbox is where funding calls, fellowship deadlines, RFPs and client replies appear. Ask your agent to do this:

> "Read my unread mail from this week. Summarise each thread in two lines, and flag anything that looks like a funding call, a fellowship deadline, an RFP, or a client message. Draft a short reply to the most urgent one, but don't send — show it to me first."

## Task

1. Create an app password for your chosen provider and enable IMAP where needed.
2. Connect your agent to that inbox via `hermes gateway setup`.
3. Ask it to summarise unread mail and flag funding, fellowship, RFP or client messages.
4. Confirm the draft stays unsent until you approve it.

## Output

Confirm your agent is connected, the summary it produced, the flagged items, and your decision on the draft reply.
