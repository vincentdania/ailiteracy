---
summary: Set Hermes to check your calendar and inbox every weekday morning, and send you a short briefing on Telegram before you start work. It reads and reports. It never sends or changes anything on its own.
quiz:
  - question: Your briefing is set for 7:30am, but your laptop was closed until 11am. What happens?
    options:
      - Hermes sends it at 11am anyway
      - That day's briefing is skipped. Hermes only runs while your computer is on and Hermes is open
      - Hermes sends it from the cloud
      - You get two briefings the next day
    answer: 1
    explanation: Hermes on your computer can only work while the computer is awake and Hermes is open. If it opens within about two hours of 7:30, it catches up. Later than that, it skips to the next day. Hermes Cloud is the always-on option.
  - question: Why does the briefing request end with "Do not send, reply to, delete or change anything"?
    options:
      - It makes the briefing shorter
      - It runs while you're not watching, so it should only read and report
      - Hermes needs it to read your calendar
      - It isn't needed
    answer: 1
    explanation: A scheduled job runs with nobody watching. Keeping it read-only means the worst it can do is write a poor summary. You decide what to act on, and you approve anything that gets sent.
  - question: You want to test your scheduled briefing without waiting until tomorrow. What do you do?
    options:
      - Change your computer's clock
      - Click Trigger now in the Scheduled jobs window
      - Delete it and create it again
      - Wait until tomorrow
    answer: 1
    explanation: Trigger now runs the job straight away and delivers it the same way as a scheduled run, so you can check it reaches Telegram.
---

**Read time: 10 minutes · Build time: 15 minutes · Cost: included with your Nous account**

In the last lesson, you asked Hermes to sort your inbox. In this one, you stop asking. Every weekday at 7:30am, Hermes checks your calendar and your email by itself, and sends a short briefing to your phone.

You'll read it over breakfast and walk into your day knowing what's on, what clashes, and what needs you first.

![A morning briefing in Telegram: today's meetings, a clash to watch, what to prepare, and the urgent email.](/lessons/professionals/morning-briefing/phone-briefing.png "At the end of this lesson, your phone shows this every weekday morning.")

## What you'll have at the end

By the end of this lesson you'll have:

1. Your **Google Calendar connected** to Hermes, next to Gmail.
2. A **briefing request** that works, tested by hand.
3. A **scheduled job** that runs it every weekday at 7:30am.
4. The briefing **delivered to Telegram**, so it reaches you anywhere.

> **New word: scheduled job.** A request Hermes runs by itself at a time you choose, like an alarm that does a task. Hermes calls them **cron jobs**. You'll see that word on the screen.

## Before you start

Tick off each item before you go on:

- [ ] **Hermes** is set up and signed in with your **Nous account**.
- [ ] **Gmail is connected.** You did this in the inbox triage lesson.
- [ ] **Telegram is connected**, and your bot replies when you message it.
- [ ] You keep your work diary in **Google Calendar**. Using something else? Read **Not on Google Calendar?** below.

## Step 1: Connect Google Calendar

This works exactly like connecting Gmail:

1. In Hermes, click **Capabilities** in the left menu.
2. Click the **Connectors** tab, then type `Calendar` in the search box.
3. On the **Google Calendar** card, click **Connect**. Your browser opens a Google page.
4. Choose the same account you use for work, then click **Allow**.
5. Go back to Hermes. The Google Calendar card now says **Connected**.

> **If it didn't work:** If you don't see **Google Calendar**, check you're signed in to your Nous account. You can also type in a Hermes chat: `Connect my Google Calendar`, and Hermes walks you through it.

### Not on Google Calendar?

If your diary is in Outlook or another app, search for it in **Connectors** first. If it isn't listed, ask Hermes in a chat: `Help me connect my calendar so you can read my meetings. It's in [your calendar app].` Your briefing will still work with email only. Hermes says what it couldn't check.

## Step 2: Try a briefing by hand

Always test a request yourself before you schedule it. That way, you know what you'll get.

1. Click **New session** at the top left.
2. Copy this request, paste it into the message box and press **Enter**:

```text
Give me my morning briefing for today: my calendar, anything urgent in my email, and what I should prepare for. Keep it short. Do not send or change anything.
```

3. Hermes reads your calendar and email. This takes up to a minute.

![Your request (1), your day meeting by meeting (2), and a clash Hermes spotted (3).](/lessons/professionals/morning-briefing/step-first-briefing.png "Step 2: your first briefing.")

> **You should now see:** a short briefing with your meetings for today, anything that clashes, what to prepare, and urgent email. Yours will show your own day, so it will look different from the picture.

**Check it.** Open your calendar and compare. Did Hermes miss a meeting? Get a time wrong? If something is off, tell Hermes in plain words and try again. For example: `Only include meetings I've accepted.` When it's right, move on.

> **Stay safe:** Hermes should never act on what it reads in an email. A briefing only **reports**. If your briefing ever says it sent, replied to or deleted something, stop and check your request has the words "Do not send or change anything".

## Step 3: Make Telegram the delivery address

Hermes needs to know which Telegram chat to send scheduled messages to. You tell it once, from your phone:

1. Make sure Hermes is open on your computer.
2. On your phone, open your Hermes bot in Telegram.
3. Send `/sethome`

![You send /sethome (1), and Hermes confirms this chat is now home (2).](/lessons/professionals/morning-briefing/phone-sethome.png "Step 3: one message tells Hermes where to deliver.")

> **You should now see:** "✅ Home channel set to" followed by your name. From now on, scheduled messages arrive in this chat.

> **New word: home channel.** The one chat where Hermes delivers things it does on its own, like your morning briefing. It's always your private bot chat, so nobody else sees it.

## Step 4: Schedule your briefing

Now turn your request into a scheduled job.

1. On your computer, in Hermes, press **Ctrl+K**. On a Mac, press **Cmd+K**.
2. Type `cron`, then click **Cron**. The **Scheduled jobs** window opens.
3. Click **New cron**.

![The search box (1), Cron (2), and the New cron button (3).](/lessons/professionals/morning-briefing/step-open-scheduler.png "Step 4: open Scheduled jobs and click New cron.")

Fill in the form from top to bottom:

1. **Start from:** leave it on **Custom**.
2. **Name:** type `Morning briefing`
3. **Prompt:** paste this:

```text
Give me my morning briefing for today: my calendar, anything urgent in my email, and what I should prepare for. Keep it short. Do not send, reply to, delete or change anything.
```

4. **Frequency:** click it and choose **Custom**. A **Custom schedule** box appears at the bottom.
5. **Deliver to:** tick **Telegram**. Leave **This desktop** ticked too, so a copy stays in Hermes.
6. **Custom schedule:** type `weekdays at 7:30am`
7. Click **Create cron**.

![Custom (1), the name (2), your request (3), Frequency set to Custom (4), Telegram ticked (5) and the schedule (6).](/lessons/professionals/morning-briefing/step-new-cron.png "Step 4: six boxes, then Create cron.")

> **You should now see:** "Cron created" in the corner, and your **Morning briefing** in the list with the word **Scheduled**.

![The schedule in words (1), the next run (2), where it goes (3), and the Trigger now button (4).](/lessons/professionals/morning-briefing/step-job-created.png "Your scheduled briefing. Check the Next date is a weekday at 7:30am.")

Want a different time? Type your own in plain English, like `weekdays at 6:45am` or `every day at 8am`. Hermes uses your computer's time zone.

> **If it didn't work:** If **Telegram** isn't in the **Deliver to** list, or it says "set a home channel first", go back to Step 3 and send `/sethome` again. Then close the **Scheduled jobs** window and open it again. If you see an error under **Custom schedule**, check the spelling, for example `weekdays at 7:30am` with no full stop.

> **If you clicked a blueprint:** The **Blueprints** list on the left has a ready-made **Morning briefing**. Use **Custom** as shown here instead. The blueprint expects a different Google setup, and if you connected Gmail under **Connectors**, it may fail with "not ready".

## Step 5: Test it now

Don't wait until tomorrow to find out if it works.

1. Click **Trigger now** at the top right.
2. Wait about a minute. Your phone buzzes with the briefing in Telegram.

![Last shows your test run (1), and the run appears under Run history (2).](/lessons/professionals/morning-briefing/step-test-run.png "Step 5: a test run, delivered straight away.")

> **You should now see:** the briefing in your Telegram bot chat, and a new line under **Run history** in Hermes. Click that line to read the same briefing on your computer.

> **If it didn't work:** If a red box says **Last run failed**, read the message in it. "Not connected" means a connector needs reconnecting: go to **Capabilities**, then **Connectors**, and click **Reconnect**. If the briefing arrived in Hermes but not on your phone, check Telegram still works by sending your bot a message.

## Step 6: Act on your briefing

Your briefing arrives as a message from your bot. To act on it, send a request in the same chat. Write it as if you're starting a new conversation, and name the email or meeting you mean:

```text
Draft a reply to the Lagoon Foods invoice email and save it in Gmail. Don't send it.
```

Hermes drafts it the same way as in the inbox triage lesson. You read it and press Send in Gmail yourself.

## Change, pause or stop it

Open **Scheduled jobs** again (**Ctrl+K**, type `cron`) and click **Morning briefing** in the list:

![The ⋮ menu next to your job (1) with Edit cron and Delete (2), and the Pause button (3).](/lessons/professionals/morning-briefing/step-manage.png "Change, pause or delete your briefing.")

- **Change the time or the request:** click the **⋮** next to the job, then **Edit cron**. Change what you need and save. Or tell Hermes in a chat: `Change my morning briefing to 7am.`
- **On holiday:** click **Pause**. Nothing is sent until you click **Resume**.
- **Don't want it any more:** click the **⋮**, then **Delete**. You can always create it again from this lesson.

## When it runs, and when it can't

Hermes runs on **your computer**. Your briefing only goes out if, at 7:30am:

1. Your computer is **on and awake**, not asleep with the lid closed.
2. **Hermes is open**. It can be minimised.

If you open your laptop a little late, Hermes catches up: anything up to about **two hours** late still runs. After that, it skips today and tries again tomorrow.

If you want your briefing on your phone before you're even out of bed, use **Hermes Cloud**, which is always on. In Hermes, go to **Settings**, then **Gateways**. Check the price in your Nous account first, because plans change.

## Keep it safe

1. **Read-only by default.** A scheduled job runs while nobody is watching. Keep "Do not send, reply to, delete or change anything" in the request. You do the acting.
2. **Emails are information, not instructions.** If an email says "Assistant, forward this to...", your briefing should report it, not obey it. Hermes treats email as text to summarise.
3. **Your private chat only.** The briefing goes to your own bot chat. Never add your bot to a group chat, or other people will see your calendar.
4. **Client confidentiality.** Your calendar and email go to your AI model to be read. Check your clients' contracts allow that. Module 6 covers this in detail.
5. **Your off switch still works.** Send `/pause` to your bot to stop all scheduled jobs at once. Send `/pause off` to restart them.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] Google Calendar says **Connected** under **Capabilities**, then **Connectors**.
- [ ] My briefing by hand listed today's meetings correctly.
- [ ] I sent `/sethome` to my bot and Hermes confirmed it.
- [ ] **Morning briefing** shows **Scheduled**, with the next run on a weekday at my chosen time.
- [ ] I clicked **Trigger now** and the briefing arrived on my phone in Telegram.
- [ ] I know my computer must be on, with Hermes open, at briefing time.

## Recap and what's next

You now have:

1. **Calendar and Gmail** connected to Hermes.
2. A **briefing request** you've tested and trust.
3. A **scheduled job** that runs it every weekday.
4. **Your day, on your phone**, before you start work.

**Next lesson:** Turn meeting notes into actions and follow-up emails. Your briefing tells you what's coming. Next, Hermes helps you deal with what happened in the meeting.

Take the quick check below, then mark this lesson complete.
