---
summary: Never forget a lead again. Every morning n8n checks your list of people who asked but haven't bought, the AI writes each one a friendly follow-up, and one tap opens WhatsApp with the message ready for you to send.
quiz:
  - question: A lead bought a cake yesterday. What do you change in your Leads table so the assistant stops following up?
    options:
      - Delete the whole table
      - Change their Status to Won
      - Change their phone number
      - Nothing. The AI will know
    answer: 1
    explanation: The assistant only looks at leads whose Status is Open. Change it to Won, or Lost if they said no, and they won't get another message.
  - question: Who presses send on each follow-up message?
    options:
      - n8n, automatically at 9am
      - The AI
      - You, after you tap Open in WhatsApp and read the message
      - The customer
    answer: 2
    explanation: The button only opens WhatsApp with the message typed in. Nothing is sent until you read it and press send yourself.
  - question: A lead says, "Message me again after Christmas." What's the easiest way to handle it?
    options:
      - Set their Follow_up date to the first working day in January
      - Delete them
      - Remember it in your head
      - Message them every day until Christmas
    answer: 0
    explanation: The Follow_up date tells the assistant when to remind you. Put the date they asked for, and the reminder will come then.
---

**Read time: 15 minutes · Build time: 40 minutes · Cost: free to build; AI costs less than ₦1 per message**

Someone asks about a wedding cake on Monday. You're busy, and by Friday you've forgotten. They buy from someone else. That's a **lead** gone cold.

In this lesson you'll build an assistant that remembers for you. Every morning it looks at your list of leads, picks the ones you should contact today, and writes each one a friendly message. One tap opens WhatsApp with the message ready. You read it, and you press send.

![Telegram shows a lead and a suggested message with an Open in WhatsApp button. WhatsApp opens the chat with the message already typed, ready to send.](/lessons/small-business/lead-follow-up-assistant/two-phones.png "What your assistant does every morning.")

> **New word: lead.** Someone who showed interest, by asking a price or a question, but hasn't bought yet.

## What you'll have at the end

By the end of this lesson you'll have:

1. A **Leads table** in n8n, your list of people to follow up.
2. A workflow called **Lead follow-up assistant**, that runs every morning at 9.
3. A Telegram message for each lead that's due, with a message written for you and an **Open in WhatsApp** button.

![The finished workflow with six numbered steps, from Schedule Trigger to Move the follow-up date.](/lessons/small-business/lead-follow-up-assistant/n8n-finished-workflow.png "Your finished assistant. You'll build it one box at a time.")

**Why does the message come from your own WhatsApp?** Leads reach you in many ways: on Instagram, by phone, in your shop. WhatsApp only lets a business number message people who wrote to that number in the last 24 hours. Sending from your own WhatsApp avoids that rule. It's also more personal: the message comes from you, after you've read it.

## Before you start

This lesson uses your work from the customer reply lesson. Tick off each item before you go on:

- [ ] Your **Telegram account** credential and your **Telegram ID** from the Telegram lesson.
- [ ] Your **OpenAI** credential from the customer reply lesson.
- [ ] **WhatsApp** on your phone, logged in to the number you use for customers.
- [ ] A list of people who asked about something but haven't bought yet. Check your recent chats, calls and Instagram messages. Three to five people is plenty to start.

## Part 1: Make your Leads table

Your leads live in a **data table**, a simple table that's built into n8n.

> **New word: data table.** A table inside n8n, like a small spreadsheet. Your workflows can read it and change it. You don't need Google or any other account.

### Create the table

1. In n8n, click the **house icon** on the left.
2. Click the **Data tables** tab, then click **Create data table**.

![The Data tables tab (1) and the Create data table button (2).](/lessons/small-business/lead-follow-up-assistant/n8n-open-data-tables.png "Part 1: open Data tables.")

3. Type `Leads` as the name, leave **From scratch** selected, and click **Create**.

![The name box with Leads typed (1) and the Create button (2).](/lessons/small-business/lead-follow-up-assistant/n8n-name-table.png "Name your table Leads.")

### Add six columns

Your table needs six columns. Add them one at a time:

1. Click **Add Column** at the top right.
2. Type the column name **exactly** as it's written below, with the same capital letters. Column names can't have spaces, so `Follow_up` uses an underscore.
3. Leave **Type** as **string**, and click **Add Column**.

![The Add Column button (1), the name box (2), the type left as string (3), and the Add Column button (4).](/lessons/small-business/lead-follow-up-assistant/n8n-add-column.png "Add each column the same way.")

| Column | What goes in it | Example |
|---|---|---|
| `Name` | The person's name | Chioma Okafor |
| `Phone` | Their WhatsApp number with the country code, no + sign and no spaces | 2348021234567 |
| `Wants` | What they asked about | Wedding cake for 150 guests |
| `Notes` | Anything useful: dates, what they said | Wedding on 14 December. Asked for a price on Instagram. |
| `Status` | `Open`, `Won` or `Lost` | Open |
| `Follow_up` | The day to contact them next, written year-month-day | 2026-10-23 |

> **If it didn't work:** If n8n says **Invalid column name**, check for spaces or a hyphen. Use `Follow_up`, with an underscore.

### Add your leads

1. Click **Add Row**. A new row appears, and the first box is ready for typing.
2. Type the name, then press **Tab** to jump to the next box. Fill in every box.
3. For **Status**, type `Open`.
4. For **Follow_up**, type **today's date** for anyone you haven't contacted for a few days. Write it year-month-day, for example `2026-10-23` for 23 October 2026.
5. Press **Enter** when the row is done. n8n saves it straight away.

![The Leads table: Phone numbers with country codes (1), Status (2) and Follow_up dates (3).](/lessons/small-business/lead-follow-up-assistant/n8n-leads-table.png "Your Leads table, with a few people to follow up.")

**Why year-month-day?** Dates written this way sort in the right order, so n8n can tell which dates are today or earlier. `2026-10-23` works. `23/10/2026` and `Oct 23` don't.

> **Stay safe:** Only add people who contacted you first, about something you sell. Never add numbers from a bought list or a group chat. Messaging strangers is spam, and WhatsApp may ban your number.

## Part 2: Build the assistant

### Step 1: Create the workflow and set your time zone

1. Click the **house icon**, then **Create workflow**.
2. Click **My workflow** at the top left, rename it `Lead follow-up assistant`, and press Enter.
3. Click the **three dots** next to the name, then **Settings**.
4. In **Timezone**, type your country or city and pick it, for example **Africa/Lagos**. Click **Save**.

![The three dots (1), Settings (2), and the Timezone box (3).](/lessons/small-business/lead-follow-up-assistant/n8n-timezone.png "Step 1: set your time zone, so 9am means 9am where you are.")

> **If you skip this:** n8n Cloud may use a time zone from the other side of the world. Your 9am reminder could arrive at 2pm.

### Step 2: Run every morning at 9

1. Click **Add first step**, type `schedule` and click **Schedule Trigger**.

![The search box with schedule typed (1) and the Schedule Trigger result (2).](/lessons/small-business/lead-follow-up-assistant/n8n-search-schedule.png "Step 2: add a Schedule Trigger.")

2. **Trigger Interval**: leave it on **Days**.
3. **Days Between Triggers**: leave it on **1**.
4. **Trigger at Hour**: pick **9am**. Pick another time if it suits your mornings better.

![Trigger Interval set to Days (1), every 1 day (2), at 9am (3).](/lessons/small-business/lead-follow-up-assistant/n8n-schedule-node.png "Every day at 9am.")

5. Close the window with the **X**.

> **New word: Schedule Trigger.** A trigger that starts your workflow at set times, like an alarm clock. Your customer reply assistant waited for a message. This one wakes up by itself.

### Step 3: Find the leads that are due

1. Click the small **+** to the right of **Schedule Trigger**.
2. Type `data table`, press Enter, and click **Get row(s)**.

![The Data table actions: Get row(s) (1) and Update row(s) (2).](/lessons/small-business/lead-follow-up-assistant/n8n-datatable-actions.png "Step 3: pick Get row(s).")

3. **Data table**: pick **Leads**.
4. **Must Match**: pick **All Conditions**.
5. Click **Add Condition**. Set **Column** to **Status**, **Condition** to **Equals**, and type `Open` in **Value**.

![Data table set to Leads (1), All Conditions (2), and the condition Status Equals Open (3).](/lessons/small-business/lead-follow-up-assistant/n8n-get-leads.png "Only leads that are still open.")

6. Click **Add Condition** again. Set **Column** to **Follow_up** and **Condition** to **Less Than or Equal**.
7. In **Value**, paste this expression. It means "today's date":

```text
{{ $today.toFormat('yyyy-MM-dd') }}
```

![Follow_up (1), Less Than or Equal (2), and today's date expression (3), with today's date showing underneath.](/lessons/small-business/lead-follow-up-assistant/n8n-get-leads-date.png "Only leads whose follow-up day is today or earlier.")

8. Click **Execute step**. On the right you should see only the leads that are **Open** and due today or earlier.
9. Close the window. Rename the step `Get leads to follow up`, **exactly** like that. Later steps use this name to find each lead's details.

> **If it didn't work:** No leads at all? Check that **Status** says exactly `Open`, with a capital O, and that **Follow_up** is written year-month-day and isn't in the future.

### Step 4: Let the AI write each message

1. Click the **+** to the right of **Get leads to follow up**, type `AI Agent` and click **AI Agent**.
2. Set **Source for Prompt (User Message)** to **Define below**.
3. Paste this into **Prompt (User Message)**:

```text
Lead name: {{ $json.Name }}
They wanted: {{ $json.Wants }}
Notes: {{ $json.Notes }}
```

4. Under **Options**, find **System Message**. If it isn't there, click **Add Option** and choose **System Message**. Delete what's in the box, then paste this and **change the name and business to yours**:

```text
You write WhatsApp follow-up messages for Amaka, the owner of Sunrise Bakery in Lagos.
Each message goes to someone who asked about an order but hasn't bought yet.

Rules:
- Write as Amaka, warm and personal, like a friendly shopkeeper.
- Mention what they wanted, and use the notes.
- End with one simple question that helps them decide.
- Never invent prices, discounts or promises.
- No pressure. Keep it under 50 words.
```

![Define below (1), the lead details prompt (2) and your instructions in the System Message (3).](/lessons/small-business/lead-follow-up-assistant/n8n-followup-agent.png "Step 4: tell the AI who the lead is, and how you like to write.")

5. Close the window, and rename the step `Write a follow-up`.

### Step 5: Give the AI a brain

This is the same as Step 4 of the customer reply lesson.

1. Click the **+** under **Chat Model** on **Write a follow-up**, then click **OpenAI Chat Model**.
2. **Credential**: pick the OpenAI credential you made last time.
3. **Model**: pick **gpt-5-mini**.
4. Close the window. Open **Write a follow-up** again and click **Execute step**.

![The AI's output: one friendly message for Chioma and one for Bayo.](/lessons/small-business/lead-follow-up-assistant/n8n-followup-output.png "One message for each lead that's due.")

> **You should now see:** one message for each lead under **output**. Read them. Do they sound like you? If not, change the rules in your **System Message** and try again. For example: `- Write in a mix of English and Pidgin, like I do.`

### Step 6: Send it to your Telegram, with a button

1. Click the **+** to the right of **Write a follow-up**, type `Telegram`, click **Telegram**, then **Send a text message**.
2. Check **Credential** says **Telegram account**, and paste your **Telegram ID** into **Chat ID**.
3. Paste this into **Text**:

```text
Time to follow up with {{ $('Get leads to follow up').item.json.Name }}.
They wanted: {{ $('Get leads to follow up').item.json.Wants }}

Suggested message:
{{ $json.output }}
```

4. Set **Reply Markup** to **Inline Keyboard**.

![Chat ID (1), the message text (2) and Reply Markup set to Inline Keyboard (3).](/lessons/small-business/lead-follow-up-assistant/n8n-telegram-draft.png "Step 6: what Telegram will show you.")

Now add the button:

5. Under **Inline Keyboard**, click **Add Keyboard Row**, then **Add Button**.
6. In the button's **Text**, type `Open in WhatsApp`.
7. Under the button's **Additional Fields**, click **Add Field** and choose **URL**. Paste this:

```text
https://wa.me/{{ $('Get leads to follow up').item.json.Phone }}?text={{ encodeURIComponent($json.output) }}
```

8. Under the **Additional Fields** at the bottom, click **Add Field**, choose **Append n8n Attribution** and leave it switched **off**.

![The button text Open in WhatsApp (1), the WhatsApp link (2) and Append n8n Attribution switched off (3).](/lessons/small-business/lead-follow-up-assistant/n8n-telegram-button.png "The button that opens WhatsApp with your message ready.")

9. Close the window, and rename the step `Send me the draft`.

> **New word: wa.me link.** A web link that opens a WhatsApp chat with a phone number. The part after `?text=` fills in a message for you. Nothing is sent until you press send.

### Step 7: Move the follow-up date

If you don't do anything, the same lead would come back tomorrow, and the day after. This step moves their **Follow_up** date three days ahead. If you haven't heard back by then, you'll get another reminder.

1. Click the **+** to the right of **Send me the draft**. Type `data table`, press Enter, and click **Update row(s)**.
2. **Data table**: **Leads**. **Must Match**: **All Conditions**.
3. Click **Add Condition**. **Column**: **id**. **Condition**: **Equals**. In **Value**, paste:

```text
{{ $('Get leads to follow up').item.json.id }}
```

![Operation Update (1), the condition id Equals (2), and the lead's id expression (3).](/lessons/small-business/lead-follow-up-assistant/n8n-update-row.png "Step 7: find the same lead again.")

4. Scroll down to **Values to update**. Leave every box **empty** except **Follow_up**. Paste this into **Follow_up**:

```text
{{ $today.plus(3, 'days').toFormat('yyyy-MM-dd') }}
```

![The empty boxes (1) and the new Follow_up date expression (2).](/lessons/small-business/lead-follow-up-assistant/n8n-update-values.png "Only the follow-up date changes.")

5. Close the window, and rename the step `Move the follow-up date`.

> **New word: id.** A number n8n gives every row in a data table, starting at 1. It's how this step finds the right lead to update. You don't need to type it anywhere.

Want a different gap? Change the `3` to `2` or `7`.

## Try it now

1. Click the orange **Execute** button at the bottom of the canvas. You don't have to wait for 9am.
2. Check your phone. Telegram shows one message for each lead that's due, each with an **Open in WhatsApp** button.
3. Tap **Open in WhatsApp**. WhatsApp opens your chat with that lead, and the message is already typed.
4. Read it. Change anything that isn't right. Then press send, or don't. It's your choice.
5. In n8n, open your **Leads** table. The **Follow_up** date for each lead has moved three days ahead.

> **If it didn't work:**
> 1. **No Telegram messages:** open **Get leads to follow up** and click **Execute step**. If it finds no leads, set a lead's **Follow_up** to today's date and try again.
> 2. **The button opens the wrong chat, or says the number isn't on WhatsApp:** check the **Phone** column. It needs the country code, with no `+`, no spaces and no leading 0. `2348021234567` works. `08021234567` doesn't.
> 3. **The Telegram step is red:** check **Chat ID**, and that you tapped **Start** on your bot.

To test again, change a lead's **Follow_up** back to today's date.

## Switch it on

1. Click **Publish** at the top right.

From tomorrow, your follow-ups arrive at 9am every day, even when n8n isn't open. On days when nobody is due, you won't get anything. Remember your off switch: **Publish**, then **Unpublish**.

## Your daily routine

The assistant only knows what's in your table, so keep it up to date. It takes a minute a day:

1. **New enquiry?** Add a row with **Status** `Open` and **Follow_up** set to two or three days from now.
2. **They bought?** Change **Status** to `Won`.
3. **They said no?** Change **Status** to `Lost`.
4. **"Call me next month"?** Change **Follow_up** to that date.

**Tip:** You can open n8n in your phone's web browser and update the table there.

## Keep it safe

1. **Only follow up with people who contacted you first.** Never add numbers from bought lists or group chats.
2. **Know when to stop.** If someone hasn't answered after three follow-ups, change their **Status** to `Lost`. If anyone asks you to stop, stop straight away and mark them `Lost`.
3. **Read before you send.** The AI can get a date or a detail wrong. You're the last check.
4. **Keep notes polite.** Write notes as if the customer might read them one day. Never put card numbers or passwords in your table.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] My **Leads** table has six columns and at least three real leads.
- [ ] My workflow's **Timezone** is set to my own time zone.
- [ ] Running the workflow sent me a Telegram message for each lead that was due.
- [ ] Tapping **Open in WhatsApp** opened the right chat with the message typed in.
- [ ] Each lead's **Follow_up** date moved three days ahead.
- [ ] My workflow is published, and I know **Unpublish** is my off switch.

## Recap and what's next

You've built your second assistant:

1. **Schedule Trigger** wakes it up every morning.
2. **Get leads to follow up** finds open leads that are due.
3. **Write a follow-up** writes a message in your voice.
4. **Send me the draft** sends it to Telegram, with a button that opens WhatsApp.
5. **Move the follow-up date** makes sure nobody is forgotten, or pestered.

You've also learned two new building blocks: a **schedule** that runs by itself, and a **data table** that remembers things between runs.

**Next lesson:** Build a weekly report assistant. Every Friday, n8n will gather your week's numbers and send you a short, clear report on Telegram.

Take the quick check below, then mark this lesson complete.
