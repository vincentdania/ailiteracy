---
summary: Connect Telegram to n8n so your assistants can send you private updates and wait for your Approve or Decline with one tap on your phone.
quiz:
  - question: What does BotFather give you that you paste into n8n?
    options:
      - Your Telegram password
      - A bot token, the secret key to your bot
      - Your phone number
      - A QR code
    answer: 1
    explanation: BotFather creates your bot and gives you its token. n8n uses the token to send messages as your bot. Keep it secret, like a password.
  - question: n8n runs your test, but nothing arrives on your phone. What is the most likely reason?
    options:
      - Telegram is down everywhere
      - You haven't opened your bot and tapped Start yet
      - n8n Cloud doesn't support Telegram
      - Your phone is on silent
    answer: 1
    explanation: A Telegram bot can only message people who have started a chat with it first. Open your bot, tap Start, then run the workflow again.
  - question: Why do you paste your own Telegram ID into Restrict Who Can Approve?
    options:
      - So the message looks nicer
      - So only you can tap Approve, even if someone else sees the message
      - n8n needs it to save the workflow
      - So the bot can read your other chats
    answer: 1
    explanation: Approvals are your safety net. Restricting them to your ID means nobody else can approve on your behalf.
---

**Read time: 12 minutes · Build time: 20 minutes · Cost: free**

Your customers talk to you on WhatsApp. **Telegram** is where your assistants will talk to **you**. In this lesson you'll create a private Telegram bot and connect it to n8n.

Once it's set up, your assistants can send you updates and ask for your approval with an **Approve** or **Decline** button on your phone. No laptop needed.

## What you'll have at the end

By the end of this lesson you'll have:

1. Your own **private Telegram bot**.
2. A **Telegram credential** in n8n.
3. A test workflow that **messages your phone** and **waits for your tap**.

![A Telegram message from your assistant with Approve and Decline buttons.](/lessons/small-business/telegram-setup/phone-approval.png "At the end of this lesson, n8n will ask you like this.")

## How it connects

![You in Telegram, your bot, and n8n Cloud, connected in a row. The bot token lets n8n send as your bot; your Telegram ID says where to send and who may approve.](/lessons/small-business/telegram-setup/how-it-connects.png "Your bot is the doorway between n8n and your phone.")

> **New word: bot.** A Telegram account run by software instead of a person. You'll create one, and n8n will send messages through it.

> **New word: bot token.** The secret key to your bot, a long code that looks like `7123456789:AAHk3x...`. Whoever has it controls your bot. Treat it like a password.

**Why Telegram as well as WhatsApp?** Telegram bots are free, take five minutes to set up and can show buttons. That makes Telegram the easiest way for n8n to ask "Shall I send this?" and get your answer straight away.

## Before you start

Tick off each item before you go on:

- [ ] Your **n8n account** works, from the n8n setup lesson.
- [ ] **Telegram** is installed on your phone, and you're signed in. It's free from the App Store or Google Play.
- [ ] Your **computer and phone** are both near you.

**Tip:** Copying a long token from your phone to your computer is fiddly. Open [web.telegram.org](https://web.telegram.org/) on your computer and sign in with your phone, or install [Telegram Desktop](https://desktop.telegram.org/). Then you can copy and paste on one screen.

## Part 1: Create your bot

You'll make your bot by chatting with **BotFather**, Telegram's official bot for making bots.

1. In Telegram, tap the **search** icon and type `BotFather`.
2. Open **BotFather**. It has a **blue tick** next to its name. Ignore any copies without the tick.
3. Tap **Start**, then send:

```text
/newbot
```

4. BotFather asks for a **name**. Type anything you like, for example `Sunrise Assistant`.
5. BotFather asks for a **username**. It must be unique and end in `bot`, for example `sunrise_bakery_bot`.
6. BotFather replies **Done!** with your **token**. Tap the token to copy it, and keep it in your safe place.

![A chat with BotFather: send /newbot (1), type a name (2), type a username ending in bot (3), and copy the token (4).](/lessons/shared/telegram/botfather-newbot.png "Part 1: create your bot with BotFather.")

> **If it didn't work:** If BotFather says **Sorry, this username is already taken**, add your town or a number, like `sunrise_bakery_lagos_bot`, and try again.

> **Stay safe:** Never share your bot token, not even with someone "helping you set up". If it ever leaks, send `/revoke` to BotFather, pick your bot, and paste the new token into your n8n credential.

## Part 2: Find your Telegram ID

Your Telegram ID is a number, like `5012345678`. It tells n8n which chat to send to. It isn't your username or phone number.

1. In Telegram, search for `userinfobot` and open it.
2. Tap **Start**.
3. It replies with your details. Copy the number after **Id** and keep it in your safe place.

![A chat with userinfobot showing Id: 5012345678.](/lessons/shared/telegram/userinfobot-id.png "Part 2: copy the number after Id.")

## Part 3: Say hello to your bot

A Telegram bot can only message people who've started a chat with it. So start one now:

1. In Telegram, search for your bot's username, for example `sunrise_bakery_bot`, and open it.
2. Tap **Start**.

![Your new bot, with the Start button marked 1.](/lessons/shared/telegram/open-your-bot.png "Part 3: open your bot and tap Start.")

Nothing will happen yet. That's fine. Your bot is waiting for n8n.

## Part 4: Add your Telegram credential in n8n

1. In n8n, click the **house icon**, open the **Credentials** tab, then click **Create credential**. This is the same button you used for WhatsApp.
2. Type `Telegram`, click **Telegram API**, then click **Continue**.

![The Add new credential window with Telegram API marked 1.](/lessons/small-business/telegram-setup/n8n-pick-telegram-api.png "Part 4: choose Telegram API.")

3. Paste your bot token into **Access Token**. Leave **Base URL** as it is.
4. Click **Save**.

![The Access Token box (1) and the Save button (2).](/lessons/small-business/telegram-setup/n8n-telegram-token.png "Paste your token, then save.")

> **You should now see:** a green message that says the connection was tested successfully, and **Telegram account** in your list of credentials after you close the window.

> **If it didn't work:** If n8n says **Couldn't connect with these settings**, the token is wrong or incomplete. Go back to BotFather and copy it again. A full token is a number, a colon (`:`), then about 35 letters and numbers.

![The red message Couldn't connect with these settings, marked 1.](/lessons/small-business/telegram-setup/n8n-telegram-error.png "If you see this, copy the whole token again.")

## Part 5: Send yourself a message

Now build a small test workflow, the same way you built your first one.

1. Click **Create workflow**, then **Add first step**, then **Trigger manually**.
2. Click the small **+** next to your trigger.
3. Type `Telegram` in the search box and click **Telegram**.
4. In **Search Telegram Actions**, type `send`, then click **Send a text message**.

![The search box with Telegram typed (1), the Telegram result (2), and the Search Telegram Actions box (3).](/lessons/small-business/telegram-setup/n8n-search-telegram.png "Part 5: find Telegram and its Send a text message action.")

The **Send a text message** window opens:

5. Check that **Credential** says **Telegram account**. If it's empty, pick it from the list.
6. Paste your Telegram ID into **Chat ID**.
7. Paste this into **Text**, with your own name:

```text
Hello Amaka! n8n can reach you on Telegram.
```

8. Click **Execute step**.

![The Send a text message settings: Credential (1), Chat ID (2), Text (3) and Execute step (4).](/lessons/small-business/telegram-setup/n8n-send-message.png "Fill in the Chat ID and Text, then click Execute step.")

> **You should now see:** your message arrive in your bot's chat on your phone, within a few seconds.

![Your test message from n8n in your Telegram bot chat.](/lessons/small-business/telegram-setup/phone-test-message.png "Your phone: the message from n8n arrives.")

> **If it didn't work:** If n8n shows **chat not found**, either the Chat ID is wrong or you haven't tapped **Start** on your bot yet. Check both, then click **Execute step** again.

Close the window with the **X** at the top right.

## Part 6: Ask for your approval

This is the step that makes Telegram so useful. n8n will send you a question and **wait** until you tap a button.

1. Click the small **+** to the right of **Send a text message**.
2. Search for `Telegram` again, click it, type `send`, and this time click **Send message and wait for response**.
3. Paste your Telegram ID into **Chat ID**.
4. In **Message**, type the question you want to approve. For example:

```text
Test: please approve this reply. Hi! Our chocolate cake is 15,000 naira and we deliver tomorrow.
```

![The Chat ID box (1) and the Message box (2).](/lessons/small-business/telegram-setup/n8n-wait-message.png "Part 6: who to ask, and what to ask.")

Now scroll down and set how you'll answer:

5. **Response Type**: pick **Approval**.
6. **Type of Approval**: pick **Approve and Disapprove**. Two buttons appear, **✅ Approve** and **❌ Decline**.
7. Under **Advanced Interactivity**, switch on **Approve Within Chat**, so you can tap the buttons right inside Telegram.
8. **Restrict Who Can Approve**: paste your own Telegram ID. Now nobody else can approve for you.

![Response Type set to Approval (1), Approve and Disapprove (2), Approve Within Chat switched on (3), and your ID in Restrict Who Can Approve (4).](/lessons/small-business/telegram-setup/n8n-wait-options.png "Set up the Approve and Decline buttons.")

> **New word: send and wait.** A step that sends a message and then pauses the whole workflow until you answer. Every assistant in this course uses one before anything goes out to a customer.

Close the window with the **X**.

## Part 7: Run the whole test

1. At the top left, click **My workflow** and rename it to `Telegram test`.
2. Click the orange **Execute** button at the bottom of the canvas.

![The three steps on the canvas, and the Execute button at the bottom (1).](/lessons/small-business/telegram-setup/n8n-telegram-canvas.png "Part 7: run all three steps.")

3. On your phone, you'll get your hello message, then your question with two buttons. Tap **Approve**.

![Your question in Telegram with Approve (1) and Decline buttons.](/lessons/small-business/telegram-setup/phone-approval.png "Tap Approve. n8n has been waiting for you.")

> **You should now see:** all three boxes in n8n turn green after you tap **Approve**. Until you tap, the last box keeps spinning. That's n8n waiting for you.

> **If it didn't work:** If tapping a button opens a web page instead, tap the button on that page. It does the same job. If the last box never turns green, check your ID is in **Restrict Who Can Approve**.

Try it again and tap **Decline**. The workflow still finishes, but n8n records that you said no. In later lessons, **Decline** means "don't send it".

## One bot, one listener

Later, you may want n8n to **read** messages you send to your bot, for example "send me today's orders". n8n does that with the **Telegram Trigger** and its **On message** event.

A bot can only have **one** listening workflow at a time. If you set up two workflows with a Telegram Trigger on the same bot, the newest one takes over and the other goes quiet. If you need two, make a second bot with BotFather. It only takes a minute.

## Keep it safe

1. **Your bot token lives only in n8n.** Don't paste it into workflows, emails or documents.
2. **Approvals go to you only.** Always put your own ID in **Restrict Who Can Approve**.
3. **Your phone is now a key to your business.** Lock it with a PIN or fingerprint, and turn on Telegram's two-step verification: **Settings**, then **Privacy and Security**, then **Two-Step Verification**.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] My safe place holds my **bot token** and my **Telegram ID**.
- [ ] n8n has a **Telegram account** credential.
- [ ] My **Telegram test** workflow sent me a message, and waited until I tapped **Approve**.
- [ ] My phone has a screen lock, and Telegram has two-step verification.

## Recap and what's next

You now have:

1. A **private Telegram bot** that n8n uses to reach you.
2. A **Telegram credential** in n8n.
3. The most important pattern in this course: **send and wait for approval**.

**Next lesson:** Build a customer reply assistant. You'll connect WhatsApp and Telegram: a customer asks a question on WhatsApp, n8n drafts the answer, and Telegram asks for your **Approve** before anything is sent.

Take the quick check below, then mark this lesson complete.
