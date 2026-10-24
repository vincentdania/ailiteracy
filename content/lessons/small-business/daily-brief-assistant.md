---
summary: Keep your orders in a simple table, and every morning at 7am get one short Telegram message with today's orders in time order and the leads to call back. You start the day knowing exactly what needs you.
quiz:
  - question: Why do both Get row(s) steps have "Always Output Data" switched on?
    options:
      - It makes the workflow faster
      - So the workflow carries on and still sends your brief on a day with no orders or no leads
      - It shows more rows
      - It's needed for Telegram
    answer: 1
    explanation: Without it, a day with no orders would stop the workflow and you'd get no brief at all. With it switched on, the step passes along an empty result and your brief says "no orders today".
  - question: You have three orders today. What does "Execute Once" on Leads due today stop?
    options:
      - It stops the leads being fetched three times, and you getting three briefs
      - It stops the workflow running tomorrow
      - It stops the AI reading your orders
      - Nothing. It's optional
    answer: 0
    explanation: n8n runs each step once for every item coming in. Three orders would mean three runs, and three briefs on your phone. Execute Once makes the step run one time, however many orders there are.
  - question: A customer changes their cake to Saturday. What do you do?
    options:
      - Tell the AI in Telegram
      - Change the Due date in your Orders table
      - Nothing, the AI will guess
      - Delete the workflow
    answer: 1
    explanation: Your brief is only as good as your table. The AI writes from the table, so keep the table up to date and tomorrow's brief will be right.
---

**Read time: 10 minutes · Build time: 30 minutes · Cost: free to build; AI costs less than ₦10 a month**

What's due today? Who promised to call back? Most owners keep it all in their head, and something always slips: a cake nobody started, a customer nobody called.

In this lesson you'll build an assistant that remembers for you. Every morning at 7am, it checks your orders and your leads, and sends you one short message on Telegram: what's going out today, in time order, who to call back, and your first job of the day.

![A Telegram message at 7am: three orders to get out today with times and notes, two leads to call back, and the first job of the day.](/lessons/small-business/daily-brief-assistant/phone-brief.png "What arrives on your phone every morning.")

## What you'll have at the end

By the end of this lesson you'll have:

1. An **Orders table** in n8n, where you note each order and when it's due.
2. A workflow called **Daily brief**, that runs every morning at 7am.
3. A **morning brief** on Telegram, with today's orders and the leads to call back.

![The finished workflow with five numbered steps, from Schedule Trigger to Send me the brief.](/lessons/small-business/daily-brief-assistant/n8n-finished-workflow.png "Your finished assistant. You'll build it one box at a time.")

**The big idea:** n8n picks the right rows from your tables, and the AI turns them into a message you can read in ten seconds. The AI never decides what's due. Your tables do.

## Before you start

This lesson builds on the lead follow-up and weekly report lessons. Tick off each item before you go on:

- [ ] Your **Leads** table from the lead follow-up lesson.
- [ ] Your **Telegram account** credential and your **Telegram ID**.
- [ ] Your **OpenAI** credential.
- [ ] Your orders for the next few days, from your notebook or WhatsApp chats.

## Part 1: Make your Orders table

1. In n8n, click the **house icon**, then the **Data tables** tab, then **Create data table**.
2. Name it `Orders` and click **Create**.
3. Add these five columns, exactly as written. Leave them all as **string**.

| Column | What goes in it | Example |
|---|---|---|
| `Due` | The day it must be ready, written year-month-day | 2026-10-23 |
| `Time` | When it's collected or delivered | 10am |
| `Customer` | Who it's for | Kemi Lawal |
| `Item` | What they ordered | Birthday cake, 2 tiers |
| `Notes` | Anything you mustn't forget | Write "Happy 40th Dapo". Paid half |

4. Click **Add Row** and add your orders, one row per order. Add a few for today, so you can test.

![The Due column (1) written year-month-day, and today's orders (2).](/lessons/small-business/daily-brief-assistant/n8n-orders-table.png "Your Orders table, one row per order.")

**Use your Notes.** "Paid half", "deliver to Ikeja", "no nuts": anything you write here appears in your brief on the morning it matters.

## Part 2: Build the assistant

### Step 1: Create the workflow and set your time zone

1. Click the **house icon**, then **Create workflow**.
2. Click **My workflow** at the top left, rename it `Daily brief`, and press Enter.
3. Click the **three dots** next to the name, then **Settings**. Set **Timezone** to yours, for example **Africa/Lagos**, and click **Save**.

The time zone matters here: it decides what "today" means.

### Step 2: Run every morning at 7am

1. Click **Add first step**, type `schedule` and click **Schedule Trigger**.
2. **Trigger Interval**: pick **Days**.
3. **Trigger at Hour**: pick **7am**.

![Days (1) and 7am (2).](/lessons/small-business/daily-brief-assistant/n8n-schedule-daily.png "Step 2: every morning at 7am.")

4. Close the window with the **X**.

Start earlier or later? Pick any hour. Choose a time before you'd normally start work.

### Step 3: Get today's orders

1. Click the **+** to the right of **Schedule Trigger**. Type `data table`, press Enter, and click **Get row(s)**.
2. **Data table**: pick **Orders**.
3. Click **Add Condition**. **Column**: **Due**. **Condition**: **Equals**.
4. In **Value**, paste this. It means "today's date", written year-month-day:

```text
{{ $today.toFormat('yyyy-MM-dd') }}
```

5. Scroll down and switch on **Return All**.
6. Click **Execute step**.

![Orders (1), Due (2), Equals (3), the date formula (4), Return All (5), and today's orders (6).](/lessons/small-business/daily-brief-assistant/n8n-orders-node.png "Step 3: only today's orders.")

> **You should now see:** on the right, only the orders due today.

7. Now click the **Settings** tab at the top of the window, and switch on **Always Output Data**.

![Click Settings (1), then switch on Always Output Data (2).](/lessons/small-business/daily-brief-assistant/n8n-orders-settings.png "Step 3: keep going, even on a day with no orders.")

8. Close the window, and rename the step `Orders due today`, **exactly** like that. A later step uses this name.

> **New word: Always Output Data.** Normally, if a step finds nothing, the workflow stops there. On a quiet day with no orders, you'd get no brief at all. With this switched on, the step says "I found nothing" and the workflow carries on.

### Step 4: Get the leads to call back

1. Click the **+** to the right of **Orders due today**. Type `data table`, press Enter, and click **Get row(s)**.
2. **Data table**: pick **Leads**.
3. Click **Add Condition**. **Column**: **Status**. **Condition**: **Equals**. **Value**: type `Open`
4. Click **Add Condition** again. **Column**: **Follow_up**. **Condition**: **Less Than or Equal**. **Value**: paste the same formula:

```text
{{ $today.toFormat('yyyy-MM-dd') }}
```

5. Switch on **Return All**.

![Leads (1), Status (2) equals Open (3), Follow_up on or before today (4), and the leads to call (5).](/lessons/small-business/daily-brief-assistant/n8n-leads-node.png "Step 4: open leads that are due today or overdue.")

6. Click the **Settings** tab. Switch on **Always Output Data**, and also switch on **Execute Once**.

![Click Settings (1), switch on Always Output Data (2) and Execute Once (3).](/lessons/small-business/daily-brief-assistant/n8n-leads-settings.png "Step 4: two switches this time.")

7. Close the window, and rename the step `Leads due today`, exactly like that.

> **New word: Execute Once.** n8n normally runs a step once for **each** item coming in. Three orders today would mean three runs of this step, and three briefs on your phone. **Execute Once** makes the step run one time, however many orders there are.

These are the same leads your lead follow-up assistant works on, so your brief and your follow-up drafts always agree.

### Step 5: Let the AI write your brief

1. Click the **+** to the right of **Leads due today**, type `AI Agent` and click **AI Agent**.
2. Set **Source for Prompt (User Message)** to **Define below**, and paste this into **Prompt (User Message)**:

```text
Today is {{ $today.toFormat('cccc d MMMM') }}.

Orders to deliver today:
{{ $('Orders due today').all().filter(o => o.json.Customer).map(o => o.json.Time + ', ' + o.json.Customer + ': ' + o.json.Item + '. ' + o.json.Notes).join('\n') || 'None' }}

Leads to call back:
{{ $('Leads due today').all().filter(l => l.json.Name).map(l => l.json.Name + ': ' + l.json.Wants + '. Follow-up date ' + l.json.Follow_up).join('\n') || 'None' }}
```

Like last time, you don't need to understand the long lines. Each one makes a list, one line per order or lead, or writes **None** if there aren't any.

3. Under **Options**, find **System Message**. If it isn't there, click **Add Option** and choose **System Message**. Delete what's in the box, then paste this and **change the name and business to yours**:

```text
You write a short morning brief for Amaka, the owner of Sunrise Bakery in Lagos. She reads it on her phone at 7am.

Rules:
- Use only the orders and leads you are given. Never invent orders, times, names or amounts.
- Start with a one-line greeting and today's date.
- List today's orders in time order, with the time, customer, item and any notes that need action.
- Then list the leads to call back. Say which one to call first.
- If there are no orders or no leads, say so in one line.
- End with the first job of the day.
- Plain, friendly English. Under 120 words.
```

4. Add the AI's brain: click the **+** under **Chat Model**, click **OpenAI Chat Model**, pick your OpenAI credential and the model **gpt-5-mini**.
5. Open the AI Agent again. Click the **Settings** tab and switch on **Execute Once**, for the same reason as Step 4. Then go back to **Parameters**.
6. Click **Execute step**.

![Your prompt (1), your brief rules (2), and the brief the AI wrote (3).](/lessons/small-business/daily-brief-assistant/n8n-brief-agent.png "Step 5: your orders and leads in, a short brief out.")

> **You should now see:** your brief under **output**. Check every order and lead in it is really in your tables, and nothing is missing.

7. Close the window, and rename the step `Write my brief`.

> **If it didn't work:** If the prompt shows a red error about **Orders due today** or **Leads due today**, check those steps are named exactly like that, with the same capital letters.

### Step 6: Send it to your Telegram

1. Click the **+** to the right of **Write my brief**, type `Telegram`, click **Telegram**, then **Send a text message**.
2. Check **Credential** says **Telegram account**, and paste your **Telegram ID** into **Chat ID**.
3. In **Text**, paste this:

```text
{{ $json.output }}
```

4. Under **Additional Fields**, click **Add Field**, choose **Append n8n Attribution** and leave it switched **off**.

![Chat ID (1), the brief text (2), and Append n8n Attribution switched off (3).](/lessons/small-business/daily-brief-assistant/n8n-brief-telegram.png "Step 6: send the brief to your phone.")

5. Close the window, and rename the step `Send me the brief`.

## Try it now

1. Click the orange **Execute** button at the bottom of the canvas.
2. Check your phone. Your brief arrives in Telegram.
3. Look at the canvas. Each line should say **1 item** after **Write my brief**. If it says more, go back and switch on **Execute Once** on that step.

> **If it didn't work:**
> 1. **You got several briefs at once:** switch on **Execute Once** on **Leads due today** and **Write my brief**.
> 2. **No orders in the brief, but you have some today:** check the **Due** column is written year-month-day, like `2026-10-23`, and the workflow **Timezone** is yours.
> 3. **The Telegram step is red:** check **Chat ID**, and that you tapped **Start** on your bot.

## Switch it on

1. Click **Publish** at the top right.

From now on, your brief arrives every morning at 7am, even when n8n isn't open. On a quiet day it tells you so. Your off switch is the same as before: **Publish**, then **Unpublish**.

## Your daily routine

1. **Add each order** to the table as soon as you take it, with its due date. Ten seconds, from your phone's browser.
2. **Read your brief at 7am**, and do the first job first.
3. **When an order changes**, change the row. Tomorrow's brief follows the table.
4. **When a lead is won or lost**, change its **Status**, so it stops appearing.

## Keep it safe

1. **The table is the truth.** The AI only rewrites what's in your tables. If the brief is wrong, fix the table, not the AI.
2. **Check the first few briefs.** Compare them with your tables for a week. If the AI ever adds something that isn't there, add a rule: `- Only mention orders that are in the list.`
3. **Your brief is private.** It goes only to your own Telegram chat. Never add your bot to a group.
4. **What the AI sees.** Your customers' names, orders and notes go to the AI to be written up. Don't put phone numbers, addresses or payment details in **Notes**.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] My **Orders** table has five columns, and **Due** is written year-month-day.
- [ ] **Orders due today** shows only today's orders.
- [ ] **Leads due today** shows only Open leads that are due or overdue.
- [ ] **Always Output Data** is on for both Get row(s) steps, and **Execute Once** is on for **Leads due today** and **Write my brief**.
- [ ] Running the workflow sent **one** brief to my Telegram.
- [ ] My workflow is published, and I know **Unpublish** is my off switch.

## Recap and what's next

You've built your fourth assistant:

1. **Schedule Trigger** wakes it up every morning.
2. **Orders due today** and **Leads due today** pick the right rows from your tables.
3. **Write my brief** turns them into a short message, in time order.
4. **Send me the brief** delivers it to your phone before you start.

You've also learned two switches you'll use again: **Always Output Data**, so quiet days don't stop your workflow, and **Execute Once**, so many items still mean one message.

**Next lesson:** Build an invoice and payment reminder assistant. You'll track who owes you money, and get polite reminders drafted for you to send.

Take the quick check below, then mark this lesson complete.
