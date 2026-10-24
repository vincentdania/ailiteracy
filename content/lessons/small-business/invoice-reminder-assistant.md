---
summary: Keep your invoices in a simple table, and every morning n8n finds the ones that are late, has the AI write a polite reminder, and sends it to your Telegram with a button that opens WhatsApp. You check it and press send.
quiz:
  - question: Kemi paid her invoice this morning. What do you do so she doesn't get another reminder?
    options:
      - Nothing, the AI will know
      - Change her invoice's Status to Paid in your Invoices table
      - Delete the workflow
      - Tell Kemi to ignore it
    answer: 1
    explanation: The workflow only picks invoices whose Status is Unpaid. Change it to Paid the moment money arrives, and the reminders stop.
  - question: Why does the workflow fill in Last_reminder after each reminder?
    options:
      - To make the table look full
      - So the same customer isn't reminded again for 7 days
      - So the AI can read it
      - It's needed for WhatsApp
    answer: 1
    explanation: Without it, a late customer would get a reminder every single morning. With it, they hear from you at most once a week, which is firm but fair.
  - question: An invoice is 25 days late. What should the reminder do?
    options:
      - Add a 10% late fee
      - Threaten to tell other customers
      - Stay polite but firm, and ask them to pay this week or call you
      - Nothing, it's too late
    answer: 2
    explanation: Your rules tell the AI to get firmer as time goes on, but never to threaten or invent fees. Anything like a late fee is your decision, not the AI's.
---

**Read time: 12 minutes · Build time: 30 minutes · Cost: free to build; AI costs less than ₦5 a reminder**

Chasing money is the job nobody wants. It feels awkward, so it gets put off, and small debts quietly become lost money.

In this lesson you'll build an assistant that does the chasing for you, politely. Every morning, n8n checks your invoices. For each one that's late, the AI writes a friendly reminder that gets firmer the longer it's been, and Telegram sends it to you with an **Open in WhatsApp** button. You read it, and send it in one tap.

![A Telegram message: Kemi Lawal owes ₦35,000, a polite reminder written for you, and an Open in WhatsApp button.](/lessons/small-business/invoice-reminder-assistant/phone-reminder.png "What arrives on your phone when someone is late.")

## What you'll have at the end

By the end of this lesson you'll have:

1. An **Invoices table** in n8n, with who owes what and when it's due.
2. A workflow called **Payment reminder assistant**, that runs every morning at 10am.
3. **Polite reminders** on Telegram, ready to send from your own WhatsApp.

![The finished workflow with five numbered steps, from Schedule Trigger to Note the reminder date.](/lessons/small-business/invoice-reminder-assistant/n8n-finished-workflow.png "Your finished assistant. You'll build it one box at a time.")

This works just like your lead follow-up assistant, with two new ideas: the reminder's tone changes with **how late** the payment is, and n8n makes sure nobody is reminded **more than once a week**.

## Before you start

This lesson builds on the lead follow-up lesson. Tick off each item before you go on:

- [ ] Your **Telegram account** credential and your **Telegram ID**.
- [ ] Your **OpenAI** credential.
- [ ] **WhatsApp** on your phone, logged in to the number you use for customers.
- [ ] A list of who owes you money: from your notebook, invoices or bank alerts.

## Part 1: Make your Invoices table

1. In n8n, click the **house icon**, then the **Data tables** tab, then **Create data table**.
2. Name it `Invoices` and click **Create**.
3. Add these seven columns, exactly as written. For **Amount**, change **Type** to **number**. Leave the others as **string**.

| Column | What goes in it | Example |
|---|---|---|
| `Invoice` | Your invoice or receipt number | INV-012 |
| `Customer` | Who owes you | Kemi Lawal |
| `Phone` | Their WhatsApp number, with country code, no + or spaces | 2348023334455 |
| `Amount` | How much they owe, as a plain number | 35000 |
| `Due` | When they should have paid, written year-month-day | 2026-10-16 |
| `Status` | `Unpaid` or `Paid`, spelled exactly like that | Unpaid |
| `Last_reminder` | Leave it empty. n8n fills it in | |

4. Click **Add Row** and add the money you're owed, one row per invoice.

![Amount as a number (1), Status Unpaid or Paid (2), and Last_reminder left empty (3).](/lessons/small-business/invoice-reminder-assistant/n8n-invoices-table.png "Your Invoices table, one row per invoice.")

> **Stay safe:** Only put people in this table who really owe you money, with the right amount. A reminder sent by mistake to someone who has paid is embarrassing, and can lose you a customer. Check each row against your bank alerts.

## Part 2: Build the assistant

### Step 1: Create the workflow and set your time zone

1. Click the **house icon**, then **Create workflow**.
2. Click **My workflow** at the top left, rename it `Payment reminder assistant`, and press Enter.
3. Click the **three dots** next to the name, then **Settings**. Set **Timezone** to yours, for example **Africa/Lagos**, and click **Save**.

### Step 2: Run every morning at 10am

1. Click **Add first step**, type `schedule` and click **Schedule Trigger**.
2. **Trigger Interval**: pick **Days**.
3. **Trigger at Hour**: pick **10am**. That's a polite time to receive a reminder.

![Days (1) and 10am (2).](/lessons/small-business/invoice-reminder-assistant/n8n-schedule-daily.png "Step 2: every morning at 10am.")

4. Close the window with the **X**.

### Step 3: Get the invoices that need a reminder

This step finds invoices that are **unpaid**, **late**, and **not reminded in the last week**.

1. Click the **+** to the right of **Schedule Trigger**. Type `data table`, press Enter, and click **Get row(s)**.
2. **Data table**: pick **Invoices**. **Must Match**: **All Conditions**.
3. Click **Add Condition**. **Column**: **Status**. **Condition**: **Equals**. **Value**: type `Unpaid`
4. Click **Add Condition**. **Column**: **Due**. **Condition**: **Less Than**. **Value**: paste this. It means "today":

```text
{{ $today.toFormat('yyyy-MM-dd') }}
```

5. Click **Add Condition**. **Column**: **Last_reminder**. **Condition**: **Less Than or Equal**. **Value**: paste this. It means "7 days ago":

```text
{{ $today.minus(7, 'days').toFormat('yyyy-MM-dd') }}
```

6. Switch on **Return All**, then click **Execute step**.

![Status equals Unpaid (1), Due before today (2), Last_reminder at least 7 days ago (3), and the invoices that need a reminder (4).](/lessons/small-business/invoice-reminder-assistant/n8n-unpaid-invoices.png "Step 3: three conditions, all must match.")

> **You should now see:** only invoices that are unpaid, past their due date, and haven't had a reminder this week. An empty **Last_reminder** counts as "never reminded", so new late invoices are always included.

7. Close the window, and rename the step `Get unpaid invoices`, **exactly** like that.

### Step 4: Let the AI write the reminder

1. Click the **+** to the right of **Get unpaid invoices**, type `AI Agent` and click **AI Agent**.
2. Set **Source for Prompt (User Message)** to **Define below**, and paste this into **Prompt (User Message)**:

```text
Customer: {{ $json.Customer }}
Invoice: {{ $json.Invoice }}
Amount: ₦{{ $json.Amount.toLocaleString('en-NG') }}
Was due: {{ DateTime.fromISO($json.Due).toFormat('d MMMM') }}
Days late: {{ Math.floor($today.diff(DateTime.fromISO($json.Due), 'days').days) }}
```

n8n works out the amount with commas and the number of days late. The AI never does the maths.

3. Under **Options**, find **System Message**. If it isn't there, click **Add Option** and choose **System Message**. Delete what's in the box, then paste this and **change the name, business and payment line to yours**:

```text
You write polite WhatsApp payment reminders for Amaka, the owner of Sunrise Bakery in Lagos.

Rules:
- Write as Amaka: warm, respectful and clear.
- Always mention the invoice number and the amount exactly as given.
- 1 to 6 days late: a friendly nudge. Assume they forgot.
- 7 to 20 days late: polite but firmer. Ask when they can pay.
- 21 days or more: firm and respectful. Ask them to pay this week or call Amaka.
- Never threaten, never add late fees or interest, never mention other customers.
- End with how to pay: "You can pay by transfer to the usual account."
- Under 60 words.
```

4. Add the AI's brain: click the **+** under **Chat Model**, click **OpenAI Chat Model**, pick your OpenAI credential and the model **gpt-5-mini**.
5. Open the AI Agent again and click **Execute step**.

![Your prompt (1), your reminder rules (2), and one reminder for each invoice (3).](/lessons/small-business/invoice-reminder-assistant/n8n-reminder-agent.png "Step 4: gentle when it's new, firmer when it's old.")

> **You should now see:** one reminder for each late invoice. Compare them: the oldest debt gets the firmest message.

6. Close the window, and rename the step `Write a reminder`.

> **Stay safe:** Never put bank account numbers in the System Message. If a scammer ever changed your rules, they could swap the number. "The usual account" keeps your bank details out of the AI's hands. Customers who need the details can ask you.

### Step 5: Send it to your Telegram, with a button

This is just like your lead follow-up assistant.

1. Click the **+** to the right of **Write a reminder**, type `Telegram`, click **Telegram**, then **Send a text message**.
2. Check **Credential** says **Telegram account**, and paste your **Telegram ID** into **Chat ID**.
3. Paste this into **Text**:

```text
💸 {{ $('Get unpaid invoices').item.json.Customer }} owes ₦{{ $('Get unpaid invoices').item.json.Amount.toLocaleString('en-NG') }} ({{ $('Get unpaid invoices').item.json.Invoice }}), due {{ DateTime.fromISO($('Get unpaid invoices').item.json.Due).toFormat('d MMMM') }}.

Suggested reminder:
{{ $json.output }}
```

4. Set **Reply Markup** to **Inline Keyboard**.
5. Under **Inline Keyboard**, click **Add Keyboard Row**, then **Add Button**.
6. In the button's **Text**, type `Open in WhatsApp`.
7. Under the button's **Additional Fields**, click **Add Field** and choose **URL**. Paste this:

```text
https://wa.me/{{ $('Get unpaid invoices').item.json.Phone }}?text={{ encodeURIComponent($json.output) }}
```

![Inline Keyboard (1), the button text (2), and the WhatsApp link (3).](/lessons/small-business/invoice-reminder-assistant/n8n-reminder-button.png "Step 5: one tap opens WhatsApp with the reminder ready.")

8. Under the **Additional Fields** at the bottom, click **Add Field**, choose **Append n8n Attribution** and leave it switched **off**.
9. Close the window, and rename the step `Send me the reminder`.

### Step 6: Note the reminder date

This step writes today's date into **Last_reminder**, so the same customer isn't reminded again for 7 days.

1. Click the **+** to the right of **Send me the reminder**. Type `data table`, press Enter, and click **Update row(s)**.
2. **Data table**: **Invoices**. **Must Match**: **All Conditions**.
3. Click **Add Condition**. **Column**: **id**. **Condition**: **Equals**. In **Value**, paste:

```text
{{ $('Get unpaid invoices').item.json.id }}
```

4. Scroll down to **Values to update**. Leave every box **empty** except **Last_reminder**. Paste this into **Last_reminder**:

```text
{{ $today.toFormat('yyyy-MM-dd') }}
```

5. Close the window, and rename the step `Note the reminder date`.

Want reminders more or less often? In Step 3, change the `7` to `3` or `14`.

## Try it now

1. Click the orange **Execute** button at the bottom of the canvas.
2. Check your phone. Telegram shows one message for each late invoice, each with an **Open in WhatsApp** button.
3. Tap **Open in WhatsApp**. Your chat with that customer opens, with the reminder typed in.
4. Read it. Check the amount and the invoice number against your records. Then press send, or don't.
5. In n8n, open your **Invoices** table. **Last_reminder** now shows today's date for each invoice you were sent.

> **If it didn't work:**
> 1. **No messages arrive:** check **Status** says exactly `Unpaid`, with a capital U, and the **Due** date is before today.
> 2. **The amount has no commas, like ₦35000:** check **Amount** is a **number** column.
> 3. **WhatsApp opens the wrong chat:** check **Phone** has the country code and no + sign, like `2348023334455`.
> 4. **You want to test again today:** clear the **Last_reminder** box for one invoice, then click **Execute** again.

## Switch it on

1. Click **Publish** at the top right.

From now on, n8n checks your invoices every morning at 10am. Your off switch is the same as before: **Publish**, then **Unpublish**.

## Your money routine

1. **Add an invoice** to the table the moment you give credit. Ten seconds.
2. **Mark it Paid** the moment the money arrives. This is the most important habit. It's what stops the reminders.
3. **Check your Telegram at 10am**, and send the reminders that are right.
4. **For long debts**, call. When a reminder says "21 days or more", a friendly phone call often works better than another message.

## Keep it safe

1. **You press send.** n8n never messages your customers directly. You check every reminder first.
2. **Paid means paid.** Update **Status** as soon as money arrives, so nobody who has paid gets chased.
3. **No bank details in the AI.** Keep account numbers out of your rules and prompts.
4. **Polite, always.** Your rules forbid threats and invented fees. A good relationship is worth more than one late payment.
5. **Your private chat only.** Reminders go only to your own Telegram. Never add your bot to a group.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] My **Invoices** table has seven columns, **Amount** is a **number** column, and **Status** says `Unpaid` or `Paid`.
- [ ] **Get unpaid invoices** shows only late, unpaid invoices.
- [ ] The reminders mention the right invoice number and amount.
- [ ] Tapping **Open in WhatsApp** opened the right customer's chat.
- [ ] **Last_reminder** was filled in with today's date.
- [ ] My workflow is published, and I know **Unpublish** is my off switch.

## Recap and what's next

You've built your fifth assistant:

1. **Schedule Trigger** wakes it up every morning.
2. **Get unpaid invoices** finds who's late, and hasn't been reminded this week.
3. **Write a reminder** writes a polite message that fits how late it is.
4. **Send me the reminder** puts it on your phone, one tap from WhatsApp.
5. **Note the reminder date** makes sure nobody is chased too often.

That's your whole AI team: customer replies, lead follow-ups, a weekly report, a daily brief, and payment reminders.

**Next lesson:** Review, test and launch your five assistants. You'll check each one, switch them all on, and set up a simple weekly routine to keep them working.

Take the quick check below, then mark this lesson complete.
