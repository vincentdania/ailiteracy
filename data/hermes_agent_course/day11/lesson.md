---
day: 11
title: Integrate Your Email — Draft, Don't Auto-Send
subtitle: Let your agent triage the inbox and draft replies, with a hard rule: nothing sends without your approval.
---

# Integrate Your Email — Draft, Don't Auto-Send

**Read time: 5 minutes · Task: 15 minutes (hands-on)**

For a professional, email integration is the single highest-value use. Your agent can read an inbox, flag what matters, and draft a reply — while **you** remain the only person who presses send.

## Set it up safely

1. **Use a dedicated mailbox.** Never point the agent at your personal/bank/password-reset inbox. Create a low-work mailbox for it — usually a separate Gmail/Zoho/Outlook address.
2. **Connect it.** Use an app password (IMAP/SMTP) and store the credentials in `~/.hermes/.env`.
3. **Allowlist senders.** Set an allowlist (e.g., `EMAIL_ALLOWED_USERS`) so only approved addresses can reach the agent — a strong spam and safety control.

## What you can ask it to do

- **Inbox summary** — "Summarise my unread email and flag anything urgent."
- **Opportunity triage** — "Highlight any funding, fellowship, job or consulting messages."
- **Draft replies** — "Draft a reply to the funder deadline reminder in my voice."
- **Schedule review** — turn an email thread into actions.

## The safety rule

The rule that keeps you in control: **replies are drafted and approved by you. Nothing is ever sent automatically.** Your agent drafts in your voice; you review, edit, and send. This is non-negotiable for a trustworthy setup — and it's how you use the power without the risk.

## Hero use case for a Nigerian professional

You run a consultancy or work your network. Ask your agent each morning:

> "Read my inbox. List any funding, fellowship, RFP, or client emails. Draft replies that mention my one-line pitch. Show me before sending anything."

That's a personal chief-of-staff handling inbound opportunities while you keep final say.

## 🎯 Task

Set up email integration with a **dedicated mailbox** and app password. Ask your agent to summarise unread mail and draft one reply *to you* (so nothing external is involved) to see your voice reflected. Review the draft.

## 📤 Output

Confirmation the mailbox is connected, plus one drafted reply you reviewed. No external email sent.

---
**Verified fact:** The approve-before-send model and allowlisting senders are the safe, documented pattern for agent email use. Always use a dedicated low-privilege mailbox with an app password.
