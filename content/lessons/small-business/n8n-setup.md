---
summary: Open your own n8n account, build a two-step workflow and run it. This is the workshop where all five of your assistants will live.
quiz:
  - question: In n8n, what is a node?
    options:
      - The whole automation from start to finish
      - One box on the canvas that does one step
      - Your n8n password
      - A paid add-on
    answer: 1
    explanation: A workflow is the whole recipe. Each box in it is a node, and each node does one step.
  - question: You built a workflow and want to test it right now. Which button do you press?
    options:
      - Publish
      - Execute workflow
      - Credentials
      - Unpublish
    answer: 1
    explanation: Execute workflow runs it once, straight away, so you can check the result. Publish switches it on to run by itself.
  - question: Why does this course recommend n8n Cloud for most small business owners?
    options:
      - It is the only way to use n8n
      - n8n looks after the server, updates and security for you
      - It never costs anything
      - It works without the internet
    answer: 1
    explanation: With n8n Cloud there is no server to rent, update or back up. Self-hosting can cost less, but you take on that work yourself.
---

**Read time: 15 minutes · Build time: 20 minutes · Cost: free trial, then a monthly plan**

Every assistant you build in this track runs inside **n8n** (say "n-eight-n"). In this lesson you'll open your own n8n account and build a tiny workflow to prove it works.

You don't need to know anything about code. If you can follow a recipe, you can do this.

## What you'll have at the end

By the end of this lesson you'll have:

1. Your own n8n account.
2. A workflow called **My first workflow** that runs when you click a button.
3. A green **Workflow executed successfully** message on your screen.

![The finished first workflow in n8n: a manual trigger connected to an Edit Fields step, both with green ticks, and the message Workflow executed successfully.](/lessons/small-business/n8n-setup/step-run-workflow.png "This is what your screen will look like at the end of this lesson.")

That green message proves your n8n account is ready for your first real assistant.

## What n8n is

n8n is like a workshop for automations. You put boxes on a page and connect them with lines. Each box does one small job. When the first box is triggered, the work flows from box to box, left to right.

![A workflow is a row of steps: a trigger, then steps to look up the price list, write a draft and wait for approval. A workflow is the whole recipe, a node is one step, and Execute runs it now.](/lessons/small-business/n8n-setup/workflow-anatomy.png "Three words you'll see in every n8n lesson: workflow, node and execute.")

> **New word: workflow.** A set of connected steps that run in order. Each assistant you build will be one workflow.

> **New word: node.** One box in a workflow. Each node does one step, like "read the price list" or "send a message".

Remember the five parts of an agent from Module 0? In n8n, the **trigger** is the first node, the **tools** are the nodes that connect to your apps, and the **approval** is a node that waits for your yes.

## Before you start

Tick off each item before you go on:

- [ ] A **laptop or desktop computer**. You can check n8n on a phone, but building is much easier on a bigger screen.
- [ ] An up-to-date web browser: Chrome, Edge, Safari or Firefox.
- [ ] An **email address** you check often. Use your business email if you have one.
- [ ] About **20 minutes** without interruptions.
- [ ] A new password, written down somewhere safe. Never reuse a password from another site.

You don't need a payment card to start the free trial.

## Choose where n8n runs

You can use n8n in two ways. This course uses **n8n Cloud**.

| | n8n Cloud (this course) | Self-hosted (optional) |
| --- | --- | --- |
| What it is | n8n runs it for you on their computers | You rent your own server and install n8n |
| Setup time | About 5 minutes | 1 to 3 hours |
| Cost | Free trial, then a monthly plan | Server rental, often US$5 to US$15 a month |
| Updates and backups | Done for you | You do them |
| Best for | Most small business owners | People comfortable with technical setup |

n8n Cloud's lowest plan starts at about €20 a month when you pay yearly. Prices change, so check [n8n's pricing page](https://n8n.io/pricing/) for the latest.

If you'd rather run n8n yourself, read **The self-hosted option** near the end of this lesson first, then come back here for the workflow steps. They're the same once n8n is running.

## Create your n8n Cloud account

n8n changes its sign-up pages from time to time, so these steps describe what to do rather than show every screen. Read each screen carefully and you'll be fine.

1. Open [n8n.io](https://n8n.io) in your browser.
2. Click **Get started**. It's usually at the top right. The button may say something like **Try for free** instead.
3. Type your email address and choose a password. Complete the "I am human" check if one appears.
4. If n8n asks you to name your **workspace**, type your business name, for example **sunrisebakery**. It becomes part of your n8n web address, like `sunrisebakery.app.n8n.cloud`.
5. Answer the short questions about how you'll use n8n. Your answers only change the suggestions you see, and you can pick anything.
6. If you're asked to invite teammates, click **Skip**. You can do this later.
7. Wait about a minute while n8n sets up your account. When it's ready, click the button to start, for example **Start automating**.

> **You should now see:** an n8n page with a thin menu down the left side. It may say **Let's build your first automation**, or show an empty list of workflows.

> **If it didn't work:** If no email arrives, check your spam folder and wait two minutes. If the web address you wanted is taken, add your town to the name, like **sunrisebakerylagos**.

**Bookmark your n8n web address now.** You'll come back to it in every lesson.

## Start a new workflow

Now build your first workflow. The screenshots below are real n8n screens. The numbered circles show you where to click.

On the home page, click **Build a workflow**.

![The n8n home page, Let's build your first automation, with the Build a workflow card marked 1.](/lessons/small-business/n8n-setup/step-build-workflow.png "Step 1: click Build a workflow.")

> **If it didn't work:** If you see a list of workflows instead of these two cards, click the orange **Create workflow** button at the top right.

A blank page with dots opens. This is the **canvas**, where you'll lay out your steps. Click the big **+** in the middle.

![An empty n8n canvas with a dashed box labelled Add first step, marked 1.](/lessons/small-business/n8n-setup/step-add-first-step.png "Step 2: click Add first step.")

## Add a trigger

A panel opens on the right, asking **What triggers this workflow?** This is the trigger from Module 0: what makes the workflow start.

For this test, you'll start it yourself with a button. Click **Trigger manually**.

![The trigger panel in n8n with Trigger manually marked 1, above other options such as On app event and On a schedule.](/lessons/small-business/n8n-setup/step-trigger-manually.png "Step 3: click Trigger manually.")

> **You should now see:** one box on the canvas with a pointer icon, called **When clicking 'Execute workflow'**.

You'll use other triggers later. **On app event** will start your WhatsApp assistant, and **On a schedule** will run your daily brief.

## Add a second step

Next, add a step that writes a message.

1. Click the small **+** just to the right of your trigger box.

![The trigger node on the canvas with the small plus button to its right marked 1.](/lessons/small-business/n8n-setup/step-add-next.png "Step 4: click the small + next to your trigger.")

2. A panel asks **What happens next?** Type `Edit Fields` in the search box.
3. Click **Edit Fields (Set)**.

![The What happens next panel, with Edit Fields typed in the search box (1) and the Edit Fields (Set) result (2).](/lessons/small-business/n8n-setup/step-search-edit-fields.png "Step 5: search for Edit Fields and click it.")

> **New word: Edit Fields.** A node that creates or changes pieces of information. Here it just creates one message, so you can see n8n working.

## Write your first message

A big window opens for the **Edit Fields** node. It has three columns: what comes in on the left, the settings in the middle, and what goes out on the right.

In the middle column, click **Add Field**.

![The Edit Fields settings with the Add Field link marked 1.](/lessons/small-business/n8n-setup/step-add-field.png "Step 6: click Add Field.")

Three boxes appear: **name**, **String** and **value**. Now:

1. Click the **name** box and type `message`
2. Click the **value** box and paste your hello message. Tap **Copy** below, then paste with Ctrl+V (Windows) or Cmd+V (Mac):

```text
Hello from Sunrise Bakery. n8n is working!
```

3. Click the orange **Execute step** button at the top.

![The Edit Fields node with message typed in the name box (1), the hello message in the value box (2), and the Execute step button (3).](/lessons/small-business/n8n-setup/step-fill-field.png "Step 7: name the field, paste the message, then click Execute step.")

> **Try it:** Change "Sunrise Bakery" to your own business name before you click Execute step.

## Check the result

Look at the right-hand column, **OUTPUT**.

![The OUTPUT column showing a table with one row: message, Hello from Sunrise Bakery. n8n is working!](/lessons/small-business/n8n-setup/step-output.png "Step 8: your message appears under OUTPUT.")

> **You should now see:** a small table with **message** at the top and your hello message under it, plus a green tick next to the word **OUTPUT**.

> **If it didn't work:** If the output is empty or red, check that you typed `message` in the **name** box, not the value box. Then click **Execute step** again.

Close the window with the **X** at the top right. You're back on the canvas, and your two boxes are connected by a line.

## Name and run your workflow

Give your workflow a name so you can find it later.

1. At the top left, click the words **My workflow**.
2. Delete them, type `My first workflow` and press Enter.

![The workflow name at the top of the page, changed to My first workflow, marked 1.](/lessons/small-business/n8n-setup/step-rename.png "Step 9: rename your workflow.")

Now run the whole workflow from start to finish:

3. Click the orange **Execute workflow** button next to your trigger.

![The canvas after running: the Execute workflow button (1), both nodes with green ticks (2), and the message Workflow executed successfully (3).](/lessons/small-business/n8n-setup/step-run-workflow.png "Step 10: click Execute workflow and watch both steps turn green.")

> **You should now see:** both boxes with green borders and ticks, the words **1 item** on the lines between them, and **Workflow executed successfully** at the bottom right.

n8n saves your work as you go. You don't need to press a save button.

## Your on and off switch

At the top right of every workflow is a **Publish** button with a small arrow next to it. This is the off switch from Module 0's safety rules.

![The Publish button (1) and the Unpublish option in its menu (2).](/lessons/small-business/n8n-setup/step-publish-menu.png "Publish switches a workflow on. Unpublish switches it off.")

- **Execute workflow** runs a workflow once, now, while you watch. You'll use it to test.
- **Publish** switches a workflow on, so it runs by itself whenever its trigger fires, even when your computer is off.
- **Unpublish** switches it off again. If an assistant ever misbehaves, this is the first thing you click.

Don't publish **My first workflow**. It has a manual trigger, so there's nothing for it to do on its own. You'll publish your first real assistant at the end of the customer reply lesson, after testing it.

## Find your way around

Click the **house icon** in the left menu to go back to your **Overview** page.

![The Overview page with My first workflow in the list (1) and the Credentials tab (2).](/lessons/small-business/n8n-setup/step-overview.png "Your Overview page lists every workflow you build.")

1. **Workflows** lists everything you build. Click a name to open it.
2. **Credentials** is where n8n keeps your connections to other apps, like WhatsApp or Google Sheets. You'll add your first credential in the next lesson.

> **New word: credential.** A saved, secure connection between n8n and one of your apps. You sign in once on the app's own page, and n8n remembers the connection. You never type that app's password into a workflow.

## Keep your account safe

Your n8n account will soon be connected to your customers' messages, so protect it like your bank app.

1. Click the **gear icon** at the bottom of the left menu, then **Settings**, then **Personal**.
2. Click **Enable 2FA**.
3. Scan the QR code with an authenticator app on your phone, such as Google Authenticator or Microsoft Authenticator.
4. Type the code the app shows you and click **Continue**.
5. **Save the recovery codes** n8n shows you somewhere safe and offline. You'll need them if you lose your phone.

> **New word: 2FA (two-factor authentication).** A second check when you sign in. As well as your password, you type a code from your phone, so someone who steals your password still can't get in.

> **Stay safe:** Never share your n8n login with anyone, including people offering to "help set it up". If someone needs to help you, invite them as a separate user from **Settings**, and remove them when they're done.

## The self-hosted option

Self-hosting means renting your own small server on the internet and installing n8n on it. It can cost less than n8n Cloud, and your data stays on a server you control. In exchange, you're responsible for keeping it running, updated and backed up.

Self-hosting suits you if you're comfortable with technical setup, or you have someone technical you trust. If you've never heard of the words below, stay with n8n Cloud. You can always move later.

In outline, self-hosting looks like this:

1. **Rent a server.** Choose a small Linux server (a "VPS") from a hosting company. Many offer n8n ready to install in one click.
2. **Install n8n.** Follow n8n's official [hosting guide](https://docs.n8n.io/hosting/). The usual method uses a tool called Docker.
3. **Give it a web address with HTTPS.** WhatsApp and most other apps will only talk to n8n through a secure address that starts with `https://`. Your hosting company's n8n guide normally covers this.
4. **Create your owner account.** The first time you open your own n8n, it asks you to set up an owner account:

![The Set up owner account screen in a self-hosted n8n, with email (1), first name (2), last name (3), password (4) and the Next button (5).](/lessons/small-business/n8n-setup/step-owner-setup.png "Self-hosted only: the first screen of your own n8n.")

5. **Plan your upkeep.** Update n8n at least once a month, and set up automatic daily backups with your hosting company.

Once you're signed in, your n8n works the same way as n8n Cloud. Go back to **Start a new workflow** and follow the same steps.

> **Stay safe:** A self-hosted n8n is open to the internet. Always use a strong password and 2FA, keep n8n updated, and never turn off HTTPS.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] I can open my n8n web address from my bookmarks and sign in.
- [ ] **My first workflow** is in my workflow list.
- [ ] When I open it and click **Execute workflow**, both boxes turn green.
- [ ] I know that **Unpublish** is my off switch.
- [ ] 2FA is on for my account.

> **If it didn't work:** If a box turns red when you execute, click it to see the error message at the top of its window. Most first-time errors come from a typo in the **name** box. Fix it, close the window and click **Execute workflow** again.

## Recap and what's next

You now have:

1. **Your own n8n account**, bookmarked and protected with 2FA.
2. **Your first workflow**: a manual trigger connected to an Edit Fields node.
3. The words you'll use from now on: **workflow**, **node**, **execute**, **publish** and **credential**.

**Next lesson:** Guided WhatsApp Business setup. You'll connect your business WhatsApp number to n8n, so your first assistant can read and answer customer messages, always with your approval.

Take the quick check below, then mark this lesson complete.
