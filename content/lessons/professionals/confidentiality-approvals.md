---
summary: Decide what Hermes may see, practise approving and rejecting its actions, check and clean its memory, and lock down your settings, chats and phone. A 15-minute safety check that protects your clients and your reputation.
quiz:
  - question: You want help with a reply to a client about a contract dispute. What's the safest way to ask Hermes?
    options:
      - Paste the whole contract, with names and bank details
      - Describe it with roles, like "a school client", and leave out anything the task doesn't need
      - Forward the email thread to your bot's Telegram group
      - Don't use Hermes for client work at all
    answer: 1
    explanation: Roles instead of names, and only the facts the task needs. Hermes writes just as well about "a school client" as about the real name. Bank details, ID numbers and passwords never go in.
  - question: Hermes shows a card asking to run a command that deletes a folder. You're not sure which folder. What do you do?
    options:
      - Click Run. Hermes knows best
      - Pick Always allow, so it stops asking
      - Click Reject, then ask Hermes what's in the folder before you decide
      - Close Hermes and hope for the best
    answer: 2
    explanation: If you're not sure, the answer is no. Reject is always safe, because nothing happens. Ask your question, and approve only when you understand exactly what will change.
  - question: A client project has ended. What should you do with what Hermes remembers about it?
    options:
      - Nothing. Memory is private
      - Ask Hermes what it remembers about that client, and tell it to forget anything it no longer needs
      - Delete Hermes and start again
      - Post it to your mentor board
    answer: 1
    explanation: Keep only what you need. Ask "What do you remember about my clients?" every month, and say "Forget..." for anything sensitive or out of date.
---

**Read time: 10 minutes · Build time: 15 minutes · Cost: free**

Over the last few lessons, you've given Hermes a lot: your inbox, your calendar, your writing style and your clients' details. That's what makes it useful. It's also what makes this lesson important.

Your clients trust you with their information. In this lesson, you'll make sure Hermes deserves that trust too. You'll decide what it may see, practise approving and stopping its actions, check what it remembers, and lock down your settings. It takes 15 minutes, and you'll do the memory check again once a month.

![Hermes stops and asks before a risky action: Reject or Run.](/lessons/professionals/confidentiality-approvals/step-approval-card.png "At the end of this lesson, nothing happens without your yes.")

## What you'll have at the end

By the end of this lesson you'll have:

1. A simple **traffic-light rule** for what Hermes may see.
2. **Approvals** you know how to read, approve and reject.
3. A **clean memory**, with only what Hermes needs.
4. **Safe settings**, tidy chats, and a locked-down Telegram bot.

> **New word: confidential.** Information someone trusted you to keep private. A client's prices, plans, staff and problems are usually confidential, even when the contract doesn't say so.

## Where your words go

It helps to know what happens when you ask Hermes something:

1. **On your computer:** Hermes keeps your chats, its memory and your settings on your own computer.
2. **To the AI model:** your message, and anything Hermes reads to answer it, like an email, is sent to your AI model (your Nous account) to be read. The answer comes back.
3. **To your connected apps:** if you've connected Gmail or Calendar, Hermes reads from them and saves drafts there.

So the question to ask before you paste anything is simple: **would my client be happy for this to be sent to an AI service?** If you're not sure, read your model provider's privacy terms, and check your client's contract.

## Step 1: Decide what Hermes may see

Use this traffic-light rule every time:

![Green: share freely. Amber: share with care, using roles not names. Red: never paste it.](/lessons/professionals/confidentiality-approvals/share-levels.png "Step 1: one rule for everything you paste.")

**Roles, not names.** Hermes writes just as well without the real names. Here's how:

| Instead of | Write |
|---|---|
| Mrs Ade at Bright Path Schools | the head of admissions at a school client |
| Kola Foods' ₦18m loan from GTBank | a food client's bank loan |
| Mr Bello, 0803 555 0142 | the client's finance manager |

You add the real names back when you copy the draft into your email. It takes a few seconds, and it keeps your clients' details out of the AI.

> **Stay safe:** Some contracts say client information must not be shared with outside services, including AI. If a contract says that, keep that client's details out of Hermes completely. When in doubt, ask the client. Most will appreciate being asked.

## Step 2: Check Hermes asks before it acts

You set this up when you installed Hermes. Check it's still right:

![Gear (1), Safety (2), Approvals (3), Approval Mode (4), Manual (5).](/lessons/professionals/hermes-setup/step-approvals.png "Step 2: Approval Mode should say Manual.")

1. Click the **gear** at the top right to open **Settings**.
2. Click **Safety**, then **Approvals**.
3. Check **Approval Mode** says **Manual**. If not, open it and pick **Manual**.

> **New word: approval.** A pause where Hermes shows you exactly what it's about to do, and waits for your yes. With **Manual**, Hermes asks before actions it treats as risky, like deleting a folder full of files or running certain commands on your computer.

Approvals are your safety net, not your only one. That's why every request in this course also says **"Do not send"**, and why Hermes saves emails as **drafts**. You are always the one who presses Send.

## Step 3: Practise approving and rejecting

The best time to learn the brakes is before you need them. You'll make a practice folder and ask Hermes to delete it.

1. On your computer, open your **Documents** folder and make a new folder called `Hermes practice`.
2. Put two or three files you don't need inside it. Copies of any old document are fine.
3. In Hermes, click **New session**, then send:

```text
Delete the Hermes practice folder in Documents, and everything in it.
```

![Your request (1), what Hermes plans (2), the exact action (3), Reject (4) and Run (5).](/lessons/professionals/confidentiality-approvals/step-approval-card.png "Step 3: Hermes stops and asks first.")

> **You should now see:** a card that shows the exact action, with **Reject**, **Always allow...** and **Run**. Hermes is waiting for you.

4. **Read the card.** What will change? Which folder? Is that what you asked for?
5. Click **Reject**.

![Red means the action was stopped (1), and Hermes confirms nothing changed (2).](/lessons/professionals/confidentiality-approvals/step-approval-rejected.png "Reject: nothing happens.")

> **You should now see:** the action in red, and Hermes telling you it hasn't deleted anything. Check your Documents folder: `Hermes practice` is still there.

6. Ask again, and this time click **Run**. The practice folder is deleted. You've now used both buttons.

> **If it didn't work:** If Hermes deleted the folder without asking, open **Settings**, **Safety**, **Approvals** and check **Approval Mode** says **Manual**. Hermes asks before actions it treats as risky, like deleting a folder and everything in it. Small actions, like deleting one empty folder, may not need your yes. That's another reason to keep "Do not send" in your requests.

### Never "Always allow" the big things

Next to **Run** there's a menu with more choices:

![Allow this session (1) and Always allow (2).](/lessons/professionals/confidentiality-approvals/step-approval-menu.png "Use these rarely, and never for deleting, sending or paying.")

- **Allow this session** says yes to this kind of action until you close the chat. Handy for a long, careful job you're watching.
- **Always allow** means Hermes never asks again for this kind of action.

> **Stay safe:** Never choose **Always allow** for anything that deletes, sends, pays or shares. One wrong yes, remembered forever, is how small mistakes become big ones. If you're not sure, click **Reject**. Nothing bad happens when you say no.

## Step 4: Check what Hermes remembers

Hermes remembers useful things between chats: your style, your board, your clients. Every month, check what's there.

1. Click **New session**, then send:

```text
What do you remember about me and my clients? List everything in your memory.
```

![Your question (1), things about you (2), things about your clients (3), and an offer to forget (4).](/lessons/professionals/confidentiality-approvals/step-memory-list.png "Step 4: see everything Hermes remembers.")

2. **Read the client list closely.** Look for phone numbers, prices, private details and finished projects.
3. Tell Hermes what to forget, in plain words:

```text
Forget Mr Bello's mobile number and the Bright Path price and terms.
```

![Tell Hermes what to forget (1), what it removed (2), and what it still remembers (3).](/lessons/professionals/confidentiality-approvals/step-memory-forget.png "Keep only what Hermes needs.")

> **You should now see:** what Hermes removed, and **Memory updated**. Ask the first question again to check.

**A good rule:** Hermes may remember **who** your clients are and **how** you like to work. It doesn't need phone numbers, prices or anything private. Those belong in your own files.

## Step 5: Check your privacy settings

1. Open **Settings** (the gear), then **Safety**, then **Privacy & network**.

![The menu path (1), usage stats (2), and Redact Secrets (3).](/lessons/professionals/confidentiality-approvals/step-privacy.png "Step 5: two switches to check.")

2. **Redact Secrets:** keep it **on**. Hermes then tries to hide things like passwords and keys before anything reaches the AI model. It's a backstop, not a promise, so still never paste them.
3. **Share usage stats with Nous:** counts only, never your messages or files. On or off is your choice.

## Step 6: Clean up old chats

Old chats can hold client emails, notes and drafts. When a job is finished, tidy up:

![Right-click a chat (1), Archive (2) or Delete (3).](/lessons/professionals/confidentiality-approvals/step-delete-chat.png "Step 6: keep your chat list clean.")

1. **Right-click** a chat in the list on the left.
2. Pick **Archive** to hide it and keep every message, or **Delete** to remove it for good.

**Delete** chats that held sensitive client details once you've saved what you need somewhere safe. **Archive** chats you might want to look back on.

## Step 7: Lock down your phone and apps

Your assistant is only as safe as the ways into it.

1. **Telegram:** in Hermes, open **Messaging**, then **Telegram**. Check **Allowed Telegram user IDs** has **only your** number. Never add your bot to a group.
2. **Your bot token:** if you think anyone has seen it, send `/revoke` to BotFather, pick your bot, and paste the new token into Hermes.
3. **The off switch:** if anything ever looks wrong, send `/pause` to your bot. Hermes stops taking new work until you send `/pause off`.
4. **Connected apps:** in **Capabilities**, then **Connectors**, remove any you no longer use. You can also see every app with access to your Google account at **myaccount.google.com/connections**, and remove access there.
5. **Your computer:** Hermes is only as safe as the computer it runs on. Use a password or PIN, lock the screen when you walk away, and keep it updated.

> **If it didn't work:** If your laptop is lost or stolen, act fast. From your phone, remove Hermes's access in **myaccount.google.com/connections**, send `/revoke` to BotFather, and change your Nous account password.

## Your monthly safety check

Put a 10-minute reminder in your calendar for the first Monday of each month:

- [ ] **Approvals:** Approval Mode still says **Manual**.
- [ ] **Memory:** asked what Hermes remembers, and told it to forget what it doesn't need.
- [ ] **Chats:** deleted or archived finished client work.
- [ ] **Telegram:** only my user ID is allowed.
- [ ] **Connectors:** only the apps I still use.

## Keep it safe

1. **Traffic lights.** Green: share. Amber: roles, not names. Red: never.
2. **Read every approval.** If you're not sure, click **Reject**.
3. **Never Always allow** deleting, sending, paying or sharing.
4. **Less memory is safer.** Who and how, not numbers and secrets.
5. **Ask the client** when a contract is unclear. Being open builds trust.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] I know the traffic-light rule, and rewrote one request with roles instead of names.
- [ ] Approval Mode says **Manual**.
- [ ] I rejected an action, and then approved it, using my practice folder.
- [ ] I asked Hermes what it remembers, and told it to forget something.
- [ ] **Redact Secrets** is on.
- [ ] Only my user ID is allowed in Telegram, and I know `/pause`.
- [ ] My monthly safety check is in my calendar.

## Recap and what's next

You now have:

1. **A clear rule** for what Hermes may see.
2. **Confidence with approvals:** read, then Run or Reject.
3. **A clean memory**, and a monthly habit to keep it that way.
4. **Locked-down settings, chats, phone and apps.**

**Next lesson:** Review, test and launch your assistant. You'll put everything together, test each part, and plan your first week with your new assistant.

Take the quick check below, then mark this lesson complete.
