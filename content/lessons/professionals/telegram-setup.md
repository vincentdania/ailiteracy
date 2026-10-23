---
summary: Connect Hermes to your own private Telegram bot, so you can message your assistant from your phone and pause it from anywhere.
quiz:
  - question: Someone asks you for your bot token "to help set it up". What do you do?
    options:
      - Send it, because they're helping
      - Say no. The token is a secret key, like a password
      - Post it in a group so everyone can help
      - Send only half of it
    answer: 1
    explanation: Anyone with your bot token can control your bot. Keep it secret. If it ever leaks, send /revoke to BotFather and paste the new token into Hermes.
  - question: Why do you paste your Telegram ID into Hermes?
    options:
      - So Hermes can read all your Telegram chats
      - So only you can talk to your Hermes bot
      - So your bot gets a nicer name
      - It isn't needed
    answer: 1
    explanation: Your ID is the guest list. Hermes only answers the IDs you add. Without it, a stranger who finds your bot could message it.
  - question: You're away from your desk and want Hermes to stop taking on new work. What do you send your bot?
    options:
      - /start
      - /pause
      - /newbot
      - Please be quiet
    answer: 1
    explanation: /pause puts Hermes on hold from anywhere. Send /pause off when you want it working again.
---

**Read time: 12 minutes · Build time: 15 minutes · Cost: free**

Right now, you can only talk to Hermes while you're sitting at your computer. In this lesson you'll connect Hermes to **Telegram**, a free messaging app, so you can reach your assistant from your phone.

You'll also get an off switch that works from anywhere: one word, **/pause**.

## What you'll have at the end

By the end of this lesson you'll have:

1. Your own **private Telegram bot**, that only you can talk to.
2. Hermes **answering you on Telegram**.
3. A **pause button** in your pocket.

![Your message to your bot on Telegram, and Hermes replying.](/lessons/professionals/telegram-setup/phone-test-chat.png "This is what your phone will show at the end of this lesson.")

## How it connects

![You send a message in Telegram, it goes to your private bot, and Hermes on your computer reads it and replies. The bot token and your Telegram ID lock it so only you can use it.](/lessons/professionals/telegram-setup/how-it-connects.png "Your bot is the doorway between your phone and Hermes.")

> **New word: bot.** A Telegram account run by software instead of a person. You'll create one, and Hermes will answer through it.

> **New word: bot token.** The secret key to your bot, a long code that looks like `7123456789:AAHk3x...`. Whoever has it controls the bot. Treat it like a password.

## Before you start

Tick off each item before you go on:

- [ ] **Hermes is set up** and answering on your computer, from the last lesson.
- [ ] **Telegram** is installed on your phone, and you're signed in. It's free from the App Store or Google Play.
- [ ] Your **computer and phone** are both near you. You'll copy codes between them.

**Tip:** Copying a long token from your phone to your computer is fiddly. Install [Telegram Desktop](https://desktop.telegram.org/) on your computer, or open [web.telegram.org](https://web.telegram.org/) and sign in with your phone. Then you can copy and paste on one screen.

## Open Telegram settings in Hermes

1. Open **Hermes** on your computer.
2. Click **Messaging** in the left menu.
3. Click **Telegram** in the list.

![The Messaging item in the Hermes menu (1), Telegram in the list (2), and the Create with QR button (3).](/lessons/professionals/telegram-setup/step-open-telegram.png "Step 1: open Messaging, then Telegram.")

You now have two ways to connect. Try the **quick way** first. If it doesn't work, use the **manual way**. Both end in the same place.

## The quick way: scan a QR code

1. Click **Create with QR**. Hermes shows a square QR code.
2. On your phone, open the **Camera** app and point it at the QR code. Tap the Telegram link that appears.
3. Telegram opens. Follow the prompts and tap to **confirm**.
4. Go back to Hermes. It creates your bot, finds your Telegram ID and restarts by itself.

> **You should now see:** the Telegram page in Hermes says **Enabled**, with no red warnings.

If that worked, skip to **Say hello from your phone**. If the QR code didn't open Telegram, or Hermes shows an error, use the manual way below.

## The manual way, part 1: create your bot

You'll make your bot by chatting with **BotFather**, Telegram's official bot for making bots.

1. In Telegram, tap the **search** icon and type `BotFather`.
2. Open **BotFather**. It has a **blue tick** next to its name. Ignore any copies without the tick.
3. Tap **Start**, then send:

```text
/newbot
```

4. BotFather asks for a **name**. Type anything you like, for example `My Assistant`.
5. BotFather asks for a **username**. It must be unique and end in `bot`, for example `priya_assistant_bot`.
6. BotFather replies **Done!** with your **token**. Tap the token to copy it.

![A chat with BotFather: send /newbot (1), type a name (2), type a username ending in bot (3), and copy the token (4).](/lessons/shared/telegram/botfather-newbot.png "Step 2: create your bot with BotFather.")

> **If it didn't work:** If BotFather says **Sorry, this username is already taken**, add something to it, like `priya_k_assistant_bot`, and try again.

> **Stay safe:** Never share your bot token, not even with someone "helping you set up". If it ever leaks, send `/revoke` to BotFather, pick your bot, and paste the new token into Hermes.

## The manual way, part 2: find your Telegram ID

Your Telegram ID is a number, like `5012345678`. It's how Hermes knows a message is really from you. It isn't your username or your phone number.

1. In Telegram, search for `userinfobot` and open it.
2. Tap **Start**.
3. It replies with your details. Copy the number after **Id**.

![A chat with userinfobot showing Id: 5012345678.](/lessons/shared/telegram/userinfobot-id.png "Step 3: copy the number after Id.")

## The manual way, part 3: paste them into Hermes

Back in Hermes, on the **Telegram** page, scroll down:

1. Paste your token into the **Bot token** box.
2. Paste your number into the **Allowed Telegram user IDs** box.
3. Click **Save changes** at the bottom right.

![The Bot token box (1), the Allowed Telegram user IDs box (2) and Save changes (3).](/lessons/professionals/telegram-setup/step-paste-token.png "Step 4: paste your token and ID, then save.")

> **If it didn't work:** If Hermes says **Telegram bot token must be the complete token**, part of the token is missing. Go back to BotFather and copy it again. A full token is a number, a colon (`:`), then about 35 letters and numbers.

![The error Failed to save Telegram: the bot token must be the complete token from BotFather.](/lessons/professionals/telegram-setup/step-bad-token.png "If you see this, copy the whole token again.")

Now switch it on:

4. Click the switch at the bottom left so it says **Enabled**.
5. A blue message says **Saved. Restart the messaging gateway**. Click **Restart now**.

![The Enabled switch (1) and the Restart now button (2).](/lessons/professionals/telegram-setup/step-enable-restart.png "Step 5: switch it on and restart.")

> **New word: gateway.** The part of Hermes that listens for messages from apps like Telegram. Restarting it makes your new settings take effect. It takes a few seconds.

**Always save before you switch it on.** If you switch on Telegram before the token is saved, Hermes has nothing to connect with and shows an error. Turn the switch off, save the token, then switch it on again.

## Say hello from your phone

1. In Telegram, search for your bot's username, for example `priya_assistant_bot`, and open it.
2. Tap **Start**.

![Your new bot, with the Start button marked 1.](/lessons/shared/telegram/open-your-bot.png "Step 6: open your bot and tap Start.")

3. Send it a message:

```text
Hi Hermes, can you hear me?
```

![Your message (1) and Hermes's reply (2).](/lessons/professionals/telegram-setup/phone-test-chat.png "Step 7: Hermes replies within a few seconds.")

> **You should now see:** a reply from Hermes within about 10 seconds. It will be worded differently from the picture.

> **If it didn't work:** No reply at all? Check Hermes is **open** on your computer, and the Telegram page says **Enabled**. If your bot says you're **unauthorized**, the ID in Hermes is wrong. Get it again from userinfobot, paste it, save and click **Restart now**.

## Your pocket off switch

This is rule 5 of the safety lesson, in your pocket. Try it now so you know it works.

1. Send your bot `/pause`. Hermes puts all new work on hold. Anything already running finishes.
2. Send `/pause off` to switch Hermes back on.

![Send /pause (1) to put Hermes on hold, and /pause off (2) to switch it back on.](/lessons/professionals/telegram-setup/phone-pause.png "Your off switch works from anywhere.")

Two more commands are useful:

- `/stop` stops the task Hermes is doing right now.
- `/new` starts a fresh conversation, so Hermes forgets the current topic.

## When Hermes asks first

You set Approvals to **Manual** in the last lesson. On Telegram, Hermes asks in the chat before anything risky:

![Hermes asks whether it may run a risky command, and you reply no (1).](/lessons/professionals/telegram-setup/phone-approval.png "Reply yes or no. If you're not sure, say no.")

- Reply **yes** to allow it.
- Reply **no** to stop it.

If you don't understand what it's asking, reply **no**, then ask: "Explain what you wanted to do, in plain words."

## Keep it private

1. **Only your ID goes in the guest list.** Don't add other people's IDs until you've finished the confidentiality lesson in Module 6.
2. **Hermes only works while your computer is on** and Hermes is open. Messages you send while it's off may be lost, so send them again when it's back.
3. **Your phone is now a key to Hermes.** Lock your phone with a PIN or fingerprint, and turn on Telegram's two-step verification: **Settings**, then **Privacy and Security**, then **Two-Step Verification**.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] I sent my bot a message and Hermes replied.
- [ ] I tried `/pause`, then `/pause off`.
- [ ] My bot token is saved only in Hermes. I haven't pasted it anywhere else.
- [ ] My phone has a screen lock, and Telegram has two-step verification.

## Recap and what's next

You now have:

1. A **private Telegram bot** that only answers you.
2. **Hermes on your phone**, while your computer is on.
3. A **pocket off switch**: `/pause` and `/pause off`.

**Next lesson:** Build an inbox triage assistant. Hermes will sort your email each morning and flag what needs you.

Take the quick check below, then mark this lesson complete.
