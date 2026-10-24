---
summary: Bring everything together. Check your connections, test every job your assistant does, add a weekly review that lands on your phone every Friday, and follow a simple plan for your first month.
quiz:
  - question: Your morning briefing didn't arrive today. What should you check first?
    options:
      - Buy a new laptop
      - That your computer was on and Hermes was open, then the job's Run history in Scheduled jobs
      - Delete the job and start again
      - Ask your clients if they got it
    answer: 1
    explanation: On Hermes Desktop, scheduled jobs only run while your computer is on and Hermes is open. If it was, the Run history shows what happened, and a red box tells you why it failed.
  - question: Your weekly review lists a client email "still waiting for your reply". What happens next?
    options:
      - Hermes replies to the client for you
      - Nothing, until you ask. Send a request like "Draft a reply to... Don't send it", then check and send it yourself
      - The email is deleted
      - The client gets your weekly review
    answer: 1
    explanation: The review only reads and reports. To act on it, send a full request. Hermes saves a draft, and you press Send.
  - question: It's your first week with your assistant. What's the best habit?
    options:
      - Send every draft without reading it, to save time
      - Read every draft, check names, dates and numbers, and tell Hermes when it gets something wrong
      - Only use it on Fridays
      - Choose Always allow for everything
    answer: 1
    explanation: The first week is when you learn how your assistant thinks, and it learns how you work. Checking everything, and correcting it, is how you build trust.
---

**Read time: 10 minutes · Build time: 30 minutes · Cost: included with your Nous account**

Look at what you've built. An assistant that sorts your inbox, briefs you every morning, turns meeting notes into actions, writes proposals in your style, and gives you a board of advisers. It works on your computer and on your phone, and it asks before anything risky.

In this final lesson, you'll get it ready for real work. You'll check every connection, test every job, and add one last piece: a **weekly review** that lands on your phone every Friday afternoon. Then you'll launch, with a simple plan for your first month.

![Inbox triage, morning briefing, meeting follow-ups, proposals and updates, mentor board and weekly review. You approve risky actions and press every Send.](/lessons/professionals/professional-capstone/your-assistant.png "Your assistant. You're in charge.")

## What you'll have at the end

By the end of this lesson you'll have:

1. Every **connection checked**: your model, Gmail, Calendar and Telegram.
2. Every job **tested**, from start to end.
3. A **weekly review** every Friday at 4pm, on Telegram.
4. A **plan** for your first month.

## Before you start

- [ ] You've done Modules 1 to 6 on Hermes Desktop.
- [ ] Your phone is nearby, with **Telegram**.
- [ ] 30 quiet minutes. Testing goes faster when you're not interrupted.

## Step 1: Check your connections

Your assistant is only as good as what it can reach. Check each of these, in order:

| Check | Where | You should see |
|---|---|---|
| Your AI model | Send `Hi` in a **New session** | A reply within a few seconds |
| Gmail | **Capabilities**, then **Connectors** | Gmail says **Connected** |
| Google Calendar | **Capabilities**, then **Connectors** | Google Calendar says **Connected** |
| Telegram | Send `Hi Hermes, can you hear me?` to your bot | A reply on your phone |
| Approvals | **Settings**, **Safety**, **Approvals** | Approval Mode says **Manual** |

> **If it didn't work:** If a connector says **Access expired**, click **Reconnect** and sign in again. If Hermes doesn't reply at all, click the **gear**, then **Model**, and connect Nous Portal again. The setup lesson for each one has an **If it didn't work** box.

## Step 2: Test every job

Building it was one thing. Now test each job the way you'll use it on a real working day. Work down this table and tick each one off:

| Job | How to test it | You should see |
|---|---|---|
| Inbox triage | Send: `Please triage my inbox from the last 24 hours. Tell me what needs me today, and draft replies for anything urgent. Do not send or delete anything.` | Your email in piles, and draft replies. Nothing sent |
| Morning briefing | Open **Scheduled jobs** (**Ctrl+K** or **Cmd+K**, type `cron`), click **Morning briefing**, then **Trigger now** | Your briefing on Telegram within a minute |
| Meeting follow-ups | Paste notes from a recent meeting, with the request from the meeting lesson | Decisions, action items with owners and dates, and a draft email |
| Proposals and updates | Ask for a short client update from three bullet points, in your style | An update that sounds like you, with any gaps marked **[CHECK]** |
| Mentor board | Send a message starting with `Board:` about a real decision | Four views, where they agree and disagree, and questions for you |
| From your phone | Send your bot a request, like a client update from notes | The same result as on your computer |

**Check the words, not just that something arrived.** Are names, dates and numbers right? Does it sound like you? If something is wrong, tell Hermes in plain words, for example `Never use the word "delighted" in my emails. Remember this.`

> **Stay safe:** Testing with real clients is fine, as long as everything stays a draft. Check your Gmail **Drafts** folder afterwards, and delete any test drafts you don't need.

## Step 3: Add your weekly review

Your morning briefing plans each day. A weekly review looks back at the week, and ahead to the next one. You'll schedule it the same way as your briefing.

1. Press **Ctrl+K** (on a Mac, **Cmd+K**), type `cron`, and click **Cron**.
2. Click **New cron**.

Fill in the form from top to bottom:

1. **Start from:** leave it on **Custom**.
2. **Name:** type `Weekly review`
3. **Prompt:** paste this:

```text
Give me my weekly review: what I finished this week, client emails still waiting for my reply, my meetings and deadlines next week, and the three things I should focus on. Keep it short. Do not send, reply to, delete or change anything.
```

4. **Frequency:** click it and choose **Custom**. A **Custom schedule** box appears at the bottom.
5. **Deliver to:** tick **Telegram**. Leave **This desktop** ticked too.
6. **Custom schedule:** type `every friday at 4pm`
7. Click **Create cron**.

![Custom (1), the name (2), your request (3), Frequency set to Custom (4), Telegram ticked (5) and the schedule (6).](/lessons/professionals/professional-capstone/step-weekly-cron.png "Step 3: the same form as your morning briefing.")

> **You should now see:** "Cron created" in the corner, and **Weekly review** in the list next to your **Morning briefing**.

![Your two jobs (1), when it runs and where it goes (2), and Trigger now (3).](/lessons/professionals/professional-capstone/step-two-jobs.png "Two scheduled jobs: one for each day, one for each week.")

Want a different time? Type your own, like `every monday at 8am`. Start with the word **every**. If you see an error under **Custom schedule**, check the spelling, for example `every friday at 4pm`, not `fridays at 4pm`.

> **If it didn't work:** If **Telegram** isn't in the **Deliver to** list, send `/sethome` to your bot, as in the morning briefing lesson. Then close **Scheduled jobs** and open it again.

## Step 4: Test your weekly review

Don't wait until Friday.

1. Click **Weekly review** in the list, then **Trigger now** at the top right.
2. Wait about a minute. Your phone buzzes with your review.
3. Click the new line under **Run history** to read it on your computer.

![Last shows your test run (1), and you click the run to read it (2).](/lessons/professionals/professional-capstone/step-weekly-run.png "Step 4: a test run, straight away.")

![What you finished (1), emails waiting for you (2), next week (3), your three priorities (4), and nothing sent (5).](/lessons/professionals/professional-capstone/step-weekly-result.png "Your week on one page.")

> **You should now see:** your week in four parts, ending with **Nothing has been sent or changed**. The same review arrives in Telegram.

**Read it like a to-do list.** Anything under **Still waiting for your reply** is a promise you haven't kept yet. To act on it, send a full request in the same chat:

![Your review on your phone (1), and a request to act on it (2).](/lessons/professionals/professional-capstone/phone-weekly.png "Friday at 4pm: plan next week in five minutes.")

```text
Draft a reply to Kola Foods offering Monday at 10am, and save it in Gmail. Don't send it.
```

> **If it didn't work:** If the review says it can't see your calendar or email, check both say **Connected** in **Connectors**. If it lists things that aren't true, like a meeting that didn't happen, tell Hermes in the chat. It only knows what's in your email and calendar.

## Step 5: Launch

Your assistant is ready. Here's how to run it well for your first month:

![Week 1: check everything. Weeks 2 to 4: build the habit. Every month: keep it safe.](/lessons/professionals/professional-capstone/first-month.png "Your first month with your assistant.")

### When something goes wrong

| What happens | What to do |
|---|---|
| The morning briefing or weekly review didn't arrive | Check your computer was on and Hermes was open. Then open **Scheduled jobs**, click the job, and read **Run history**. |
| A red box says **Last run failed** | Read the message. "Not connected" means a connector needs **Reconnect** in **Connectors**. |
| A draft is wrong or doesn't sound like you | Don't send it. Tell Hermes what to change, and say `Remember this.` |
| Hermes says it can't reach your email | **Capabilities**, **Connectors**, check Gmail says **Connected**. |
| Something looks wrong and you need it to stop, now | Send `/pause` to your bot. Send `/pause off` when you're ready. |

**Want it always on?** On Hermes Desktop, scheduled jobs only run while your computer is on and Hermes is open. If you want your briefing even when your laptop is closed, look at **Hermes Cloud** under **Settings**, then **Gateways**. Check the price in your Nous account first.

## Keep it safe

1. **You press every Send.** Hermes drafts. You check, and you send.
2. **Read every approval.** If you're not sure, click **Reject**.
3. **Roles, not names**, for anything sensitive. Red information never goes in.
4. **Do your monthly safety check**: approvals, memory, chats, Telegram and connectors.
5. **Know your off switch:** `/pause`.

## Test it: your launch checklist

Before you mark this lesson, and the course, complete:

- [ ] My model, Gmail, Calendar and Telegram all work.
- [ ] Approval Mode says **Manual**.
- [ ] I tested every job, and checked the words, not just that they arrived.
- [ ] I deleted my test drafts.
- [ ] My **Weekly review** is scheduled for Fridays at 4pm, and the test arrived on my phone.
- [ ] I acted on one thing from my review, with a full request.
- [ ] My monthly safety check is in my calendar.
- [ ] I know my off switch: `/pause`.

## Recap: look what you built

You started this course wondering what an AI agent is. You now have an assistant that:

1. **Sorts your inbox** and drafts replies for you to check.
2. **Briefs you** every weekday morning, on your phone.
3. **Turns meetings into actions**, with owners, dates and a follow-up email.
4. **Writes proposals and updates** in your own style, with gaps marked.
5. **Challenges your thinking** with a board of four advisers.
6. **Reviews your week** every Friday, and helps you plan the next one.
7. **Keeps your clients' information safe**, and asks before anything risky.

That's hours back every week, fewer dropped balls, and more time for the work only you can do. And you're in charge of all of it.

**What's next?** Keep going, one small improvement a month. When you catch yourself doing the same task twice, ask Hermes to help with it. Give it clear rules, keep everything a draft, and check its work, the same way you've done all course.

Take the quick check below, then mark this lesson complete. Congratulations!
