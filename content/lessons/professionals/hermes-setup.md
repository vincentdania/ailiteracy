---
summary: Install Hermes on your own computer, connect it to an AI model, say hello, and set it to ask before it does anything. This is the assistant you'll build on for the rest of the track.
quiz:
  - question: Where does Hermes run in this course?
    options:
      - On Nous Research's servers, always on
      - In the Hermes Desktop app on your own computer
      - Inside your web browser only
      - On your phone
    answer: 1
    explanation: You install Hermes Desktop on your Mac or Windows computer. It works while the computer is on and Hermes is open. Hermes Cloud is the always-on option if you need it later.
  - question: Which Approval Mode does this course ask you to choose?
    options:
      - Smart
      - Off
      - Manual
      - Whichever is already selected
    answer: 2
    explanation: Manual means Hermes asks you before it runs any risky action. You stay in charge, just like rule 2 of the safety lesson.
  - question: Hermes is in the middle of a task you don't want. What's the fastest way to stop it?
    options:
      - Delete the app
      - Click Stop, or press Esc
      - Wait until it finishes
      - Turn off your Wi-Fi
    answer: 1
    explanation: Stop (or the Esc key) ends the current task straight away. Your chat stays, so you can explain what you want instead.
---

**Read time: 15 minutes · Build time: 20 minutes · Cost: free app, model from free**

Every assistant you build in this track lives inside **Hermes Agent**, made by Nous Research. In this lesson you'll install it, connect it to an AI model and have your first conversation.

You don't need to know anything about code. If you can install an app and copy a password, you can do this.

## What you'll have at the end

By the end of this lesson you'll have:

1. **Hermes Desktop** installed on your computer.
2. Hermes **connected to an AI model**, so it can think and write.
3. Your **first conversation** with Hermes.
4. Hermes set to **ask you first** before it does anything risky.

![Your first message to Hermes and its reply, a short list of ways it can help you this week.](/lessons/professionals/hermes-setup/step-first-reply.png "This is what your screen will look like at the end of this lesson.")

## Where Hermes lives

Hermes is an app, like Word or Zoom. It can run in three places. This course uses the first one.

![Three places Hermes can run: your own computer (this course, free to install), Hermes Cloud (always on, paid), or your own server (for technical users).](/lessons/professionals/hermes-setup/where-hermes-lives.png "Start on your own computer. You can move to the cloud later.")

| | Your computer (this course) | Hermes Cloud | Your own server |
| --- | --- | --- | --- |
| Who runs it | You, in the Hermes Desktop app | Nous Research | You |
| Setup time | About 15 minutes | About 10 minutes | 1 to 3 hours |
| Works when your computer is off | No | Yes | Yes |
| Cost | Free app | Monthly plan | Server rental |
| Best for | Learning and daily use at your desk | Morning briefings while you sleep | Technical users |

Starting on your computer is free and keeps everything you do on your own machine. Later lessons, like the morning briefing, work best when Hermes is always on. When you get there, you can open the same Hermes Desktop app and connect it to **Hermes Cloud** from **Settings**, then **Gateways**. Check the price in your Nous account first, because plans change.

> **New word: AI model.** The "brain" Hermes uses to read and write. Hermes is the assistant; the model is what does the thinking. You'll connect one in a few minutes.

## Before you start

Tick off each item before you go on:

- [ ] A **Mac with Apple Silicon** (M1 or newer) or a **Windows computer**. Older Intel Macs aren't supported. To check, click the Apple menu, then **About This Mac**, and look for **Chip: Apple M**.
- [ ] Permission to **install apps**. If it's a work computer, ask your IT team first.
- [ ] An **email address** for your Nous Research account.
- [ ] About **20 minutes** without interruptions.

## Install Hermes Desktop

1. Open [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com/) in your web browser.
2. Click the download for your computer: **macOS** or **Windows**.
3. Open the file you downloaded, from your **Downloads** folder.
   - **Mac:** a window opens with the Hermes icon. Drag **Hermes** into the **Applications** folder. Then open **Applications** and double-click **Hermes**.
   - **Windows:** the file ends in `.appinstaller`. Double-click it, click **Install**, and wait. Hermes opens when it's done.
4. If your computer asks "Are you sure you want to open it?", click **Open**. Hermes comes from Nous Research, and the app is signed.

> **You should now see:** a window that says **Let's get you setup with Hermes Agent**, with a list of ways to connect a model.

> **If it didn't work:** On a Mac, if nothing opens, check you dragged Hermes into **Applications** and opened it from there, not from the download window. On Windows, if the installer won't open, update Windows and try again.

## Connect an AI model

Hermes needs a model before it can answer you. The simplest choice is **Nous Portal**, from the same company that makes Hermes. It has a free tier, and paid plans start at about US$20 a month. Prices change, so check in your Nous account.

![The Let's get you setup with Hermes Agent screen with Nous Portal, marked Recommended, marked 1.](/lessons/professionals/hermes-setup/step-connect-model.png "Step 1: click Nous Portal.")

1. Click **Nous Portal**. Your web browser opens.
2. Sign in, or create your Nous account with your email. Then click to approve Hermes.
3. Go back to the Hermes window. It's now connected.

> **You should now see:** Hermes asking **What should I call you?**

> **If it didn't work:** If you see **Sign-in with Nous Portal did not finish**, the browser step was closed or the internet dropped. Check your internet and click **Try again**.

![The red message Sign-in with Nous Portal did not finish, with the Try again button marked 1.](/lessons/professionals/hermes-setup/step-signin-failed.png "If sign-in didn't finish, click Try again.")

### Already have an API key? (optional)

If you already pay for a model company like OpenRouter or OpenAI, you can use that instead of Nous Portal.

> **New word: API key.** A long secret code that lets an app use your account with a model company. Treat it like a password.

1. On the first screen, click **I have an API key** at the bottom right.
2. Pick the company that gave you the key, for example **OpenRouter**.
3. Paste your key into the box and click **Connect**.

![The list of model companies with OpenRouter (1), the API key box (2) and the Connect button (3).](/lessons/professionals/hermes-setup/step-api-key.png "Optional: connect with your own API key.")

> **Stay safe:** Never paste your API key into a chat, an email or a document. Only paste it into this box. If you think someone has seen it, delete it on the company's website and make a new one.

## Say hello

Hermes now asks a few quick questions.

![What should I call you? with the name box (1) and Continue (2).](/lessons/professionals/hermes-setup/step-name.png "Step 2: type your name and click Continue.")

1. Type the name you want Hermes to call you, for example `Priya`.
2. Click **Continue**.

Next, Hermes asks which layout you want.

![Which layout? with Basic (1) and Continue (2).](/lessons/professionals/hermes-setup/step-layout.png "Step 3: pick Basic and click Continue.")

3. Click **Basic**. It's made for talking to Hermes. **Elite** is for software developers.
4. Click **Continue**.
5. If Hermes offers more setup steps, like building a profile, click **Skip** for now. You'll teach Hermes about your work in later lessons.

Now send your first message. Tap **Copy** below, then paste it into the message box with Ctrl+V (Windows) or Cmd+V (Mac). Change the name and job to yours.

```text
Hi Hermes. I am Priya, a marketing consultant. In three bullet points, what can you help me with this week?
```

![The message box at the bottom with the message typed in (1) and the round send button (2).](/lessons/professionals/hermes-setup/step-first-message.png "Step 4: paste your message and press Enter.")

6. Click the message box at the bottom and paste your message.
7. Press **Enter**, or click the round **send** button.

![Your message (1) with Hermes's reply below it.](/lessons/professionals/hermes-setup/step-first-reply.png "Step 5: Hermes replies. Yours will be worded differently.")

> **You should now see:** your message, and a reply from Hermes underneath it. The reply will be different from the picture. That's normal: AI models never write the same thing twice.

> **If it didn't work:** If Hermes shows an error instead of a reply, your model isn't connected. Click the **gear** at the top right, then **Model**, and connect Nous Portal again.

## Make Hermes ask you first

This is the most important setting in the lesson. It's rule 2 from the safety lesson: **a person approves**.

![Open Settings with the gear (1), click Safety (2) and Approvals (3), open Approval Mode (4) and pick Manual (5).](/lessons/professionals/hermes-setup/step-approvals.png "Step 6: set Approval Mode to Manual.")

1. Click the **gear** at the top right to open **Settings**.
2. Click **Safety** in the left menu.
3. Click **Approvals**.
4. Open the **Approval Mode** menu. It probably says **Smart**.
5. Pick **Manual**.
6. Close Settings with the **X** or the Esc key.

> **New word: approval.** A pause where Hermes shows you what it's about to do and waits for your yes. With **Manual**, Hermes asks every time before a risky action, like changing a file or running a command.

**Smart** lets Hermes decide for itself which actions are safe. That's handy later, once you trust it. While you're learning, keep **Manual**.

## Your stop button and off switch

Find these now, before you need them. This is rule 5 from the safety lesson.

- **Stop a task:** while Hermes is working, click **Stop** next to the message box, or press **Esc**. It ends straight away, and your chat stays.
- **Turn Hermes off:** quit the app. On a Mac, press **Cmd+Q**. On Windows, close the window, or right-click Hermes in the taskbar and choose **Close window**. Nothing runs on your computer until you open it again.

In the next lesson you'll also get an off switch you can use from your phone.

> **Stay safe:** Hermes can read and change files on your computer, but only when it asks and you say yes. If an approval ever asks for something you don't understand, say no and ask Hermes to explain in plain words.

## Keep your work private

Hermes runs on your computer, and your chats are saved there. But each message you send goes to your **AI model** to be answered, so the model company sees it.

1. **Don't paste client secrets yet.** No passwords, bank details or confidential client files until you've done the confidentiality lesson in Module 6.
2. **Read your model's privacy terms.** Check whether they keep or train on your messages. Nous Portal's terms are in your Nous account.
3. **Lock your computer** when you step away (Windows key + L, or Ctrl+Cmd+Q on a Mac). Anyone at your keyboard can talk to Hermes.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] I can open **Hermes** from my Applications folder or Start menu.
- [ ] Hermes answers when I send it a message.
- [ ] **Settings**, then **Safety**, then **Approvals** says **Manual**.
- [ ] I know that **Stop** or **Esc** stops a task, and quitting the app turns Hermes off.

> **If it didn't work:** If Hermes stops answering, quit the app and open it again. If it still doesn't answer, check your internet, then reconnect your model from **Settings**, then **Model**.

## Recap and what's next

You now have:

1. **Hermes Desktop** on your own computer.
2. A **connected AI model**, through Nous Portal or your own API key.
3. **Manual approvals**, so Hermes always asks you first.
4. A **stop button** and an **off switch** you know how to use.

**Next lesson:** Guided Telegram setup. You'll connect Hermes to Telegram, so you can message your assistant from your phone, and pause it from anywhere.

Take the quick check below, then mark this lesson complete.
