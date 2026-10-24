---
summary: Keep a simple sales table in n8n, and every Friday at 5pm get a short report on Telegram with your week's total, your best sellers and one idea for next week. n8n does the adding up, so the numbers are always exact.
quiz:
  - question: Why does n8n add up the numbers before the AI sees them?
    options:
      - It's faster
      - AI can make mistakes with sums. n8n's Summarize step adds up exactly, and the AI only writes the words
      - The AI can't read numbers
      - It saves money on Telegram
    answer: 1
    explanation: AI is good at writing and bad at arithmetic. Let n8n do the counting, give the AI the finished totals, and tell it never to invent numbers.
  - question: You sold three chocolate cakes, but you typed "Chocolate cake", "chocolate cake" and "Choc cake". What does your report show?
    options:
      - 3 chocolate cakes
      - Three different products, with 1 order each
      - Nothing
      - An error
    answer: 1
    explanation: n8n groups products by their exact name. Pick one name for each product and always type it the same way.
  - question: In the Amount column, how do you write fifteen thousand naira?
    options:
      - ₦15,000
      - 15,000
      - "15000"
      - 15k
    answer: 2
    explanation: Amount is a number column, so type the plain number with no ₦ sign and no commas. The report adds the ₦ and the commas for you.
---

**Read time: 12 minutes · Build time: 35 minutes · Cost: free to build; AI costs less than ₦5 a week**

How was your week? Most owners guess. "Busy, I think." In this lesson you'll build an assistant that knows. Every Friday at 5pm it adds up your sales and sends you a short report on Telegram: how much you made, what sold best, and one idea for next week.

![A Telegram message: Sunrise Bakery's week, total sales ₦204,000 from 12 orders, best sellers, sales by product and an idea for next week.](/lessons/small-business/weekly-report-assistant/phone-report.png "What arrives on your phone every Friday.")

## What you'll have at the end

By the end of this lesson you'll have:

1. A **Sales table** in n8n, where you note each sale in a few seconds.
2. A workflow called **Weekly report assistant**, that runs every Friday at 5pm.
3. A **weekly report** on Telegram, with exact totals written in plain English.

![The finished workflow with six numbered steps, from Schedule Trigger to Send me the report.](/lessons/small-business/weekly-report-assistant/n8n-finished-workflow.png "Your finished assistant. You'll build it one box at a time.")

**The big idea: n8n counts, the AI writes.** AI is very good with words and not reliable with sums. It can add ₦15,000 and ₦6,000 and get it wrong. So in this workflow, n8n does all the adding up. The AI only gets the finished totals, and turns them into a report you'll enjoy reading.

## Before you start

This lesson builds on the lead follow-up lesson. Tick off each item before you go on:

- [ ] Your **Telegram account** credential and your **Telegram ID**.
- [ ] Your **OpenAI** credential.
- [ ] You know how to make a **data table**. You made one for your leads.
- [ ] Your sales for the last week: from your notebook, receipts or bank alerts. Five to ten sales is plenty to start.

## Part 1: Make your Sales table

1. In n8n, click the **house icon**, then the **Data tables** tab, then **Create data table**.
2. Name it `Sales` and click **Create**.
3. Add these four columns, exactly as written. For **Amount**, change **Type** to **number**. Leave the others as **string**.

| Column | Type | What goes in it | Example |
|---|---|---|---|
| `Date` | string | The day of the sale, written year-month-day | 2026-10-17 |
| `Customer` | string | Who bought | Tunde |
| `Item` | string | What they bought. Always use the same name for the same product | Chocolate cake |
| `Amount` | number | How much they paid, as a plain number | 15000 |

4. Click **Add Row** and add your sales from the last seven days, one row per sale. Press **Tab** to move between boxes.

![Your Sales table: dates written year-month-day (1) and amounts as plain numbers (2).](/lessons/small-business/weekly-report-assistant/n8n-sales-table.png "Your Sales table, one row per sale.")

> **If it didn't work:** If you can't type in **Amount**, check it's a **number** column. Type `15000`, not `₦15,000`. If you made it a string column by mistake, delete the column and add it again as **number**.

**Spell each product the same way every time.** n8n groups sales by their exact name. "Chocolate cake" and "Choc cake" count as two different products. Write your product names on a sticky note and copy them.

## Part 2: Build the assistant

### Step 1: Create the workflow and set your time zone

1. Click the **house icon**, then **Create workflow**.
2. Click **My workflow** at the top left, rename it `Weekly report assistant`, and press Enter.
3. Click the **three dots** next to the name, then **Settings**. Set **Timezone** to yours, for example **Africa/Lagos**, and click **Save**.

### Step 2: Run every Friday at 5pm

1. Click **Add first step**, type `schedule` and click **Schedule Trigger**.
2. **Trigger Interval**: pick **Weeks**.
3. **Trigger on Weekdays**: pick **Friday**.
4. **Trigger at Hour**: pick **5pm**.

![Weeks (1), Friday (2) and 5pm (3).](/lessons/small-business/weekly-report-assistant/n8n-schedule-weekly.png "Step 2: every Friday at 5pm.")

5. Close the window with the **X**.

Prefer Saturday morning, or Sunday night? Pick the day and hour that suit you. The report always covers the seven days up to and including that day.

### Step 3: Get this week's sales

1. Click the **+** to the right of **Schedule Trigger**. Type `data table`, press Enter, and click **Get row(s)**.
2. **Data table**: pick **Sales**.
3. Click **Add Condition**. **Column**: **Date**. **Condition**: **Greater Than or Equal**.
4. In **Value**, paste this. It means "six days ago", so you get today plus the six days before:

```text
{{ $today.minus(6, 'days').toFormat('yyyy-MM-dd') }}
```

5. Scroll down and switch on **Return All**, so n8n gets every sale, not just the first 50.

![Sales (1), Date (2), Greater Than or Equal (3), the date formula (4) and Return All (5).](/lessons/small-business/weekly-report-assistant/n8n-get-sales.png "Step 3: only this week's sales.")

6. Click **Execute step**. On the right you should see only your sales from the last seven days.
7. Close the window, and rename the step `Get this week's sales`.

> **If it didn't work:** No sales showing? Check your **Date** column is written year-month-day, like `2026-10-17`, and that some sales are from the last seven days.

### Step 4: Add up each product

1. Click the **+** to the right of **Get this week's sales**, type `summarize` and click **Summarize**.

![Type summarize (1) and click Summarize (2).](/lessons/small-business/weekly-report-assistant/n8n-search-summarize.png "Step 4: the Summarize step does the adding up.")

2. Under **Fields to Summarize**, set **Aggregation** to **Sum** and type `Amount` in **Field**.
3. Click **Add Field**. Set this one's **Aggregation** to **Count** and type `Item` in **Field**.
4. In **Fields to Split By**, type `Item`.
5. Click **Execute step**.

![Sum of Amount (1), Count of Item (2), split by Item (3), and the result: one row per product (4).](/lessons/small-business/weekly-report-assistant/n8n-by-product.png "Step 4: money and orders for each product.")

> **You should now see:** one row for each product. **sum_Amount** is the money it made this week. **count_Item** is how many times you sold it.

6. Close the window, and rename the step `Add up by product`, **exactly** like that. A later step uses this name.

> **New word: Summarize.** A step that adds up, counts or averages a column, like the SUM button in a spreadsheet. It never makes a mistake with sums.

### Step 5: Add up the whole week

Now add up the products to get the week's total.

1. Click the **+** to the right of **Add up by product**, type `summarize` and click **Summarize** again.
2. **Aggregation**: **Sum**. **Field**: type `sum_Amount`
3. Click **Add Field**. **Aggregation**: **Sum**. **Field**: type `count_Item`
4. Leave **Fields to Split By** empty.
5. Click **Execute step**.

![Sum of sum_Amount (1), Sum of count_Item (2), no split (3), and the week's totals (4).](/lessons/small-business/weekly-report-assistant/n8n-add-week.png "Step 5: the whole week in one row.")

> **You should now see:** one row. **sum_sum_Amount** is your total sales. **sum_count_Item** is your number of orders. Check the total against your own records.

6. Close the window, and rename the step `Add up the week`.

### Step 6: Let the AI write the report

1. Click the **+** to the right of **Add up the week**, type `AI Agent` and click **AI Agent**.
2. Set **Source for Prompt (User Message)** to **Define below**, and paste this into **Prompt (User Message)**:

```text
Week: {{ $today.minus(6, 'days').toFormat('d MMMM') }} to {{ $today.toFormat('d MMMM yyyy') }}
Total sales: {{ $json.sum_sum_Amount }}
Number of orders: {{ $json.sum_count_Item }}

Sales by product:
{{ $('Add up by product').all().map(p => p.json.Item + ': ' + p.json.count_Item + ' orders, ' + p.json.sum_Amount).join('\n') }}
```

The last line looks complicated, but you don't need to understand it. It makes a list with one line per product, like `Chocolate cake: 4 orders, 60000`.

3. Under **Options**, find **System Message**. If it isn't there, click **Add Option** and choose **System Message**. Delete what's in the box, then paste this and **change the name and business to yours**:

```text
You write a short weekly sales report for Amaka, the owner of Sunrise Bakery in Lagos. She reads it on her phone on Friday evening.

Rules:
- Use only the numbers you are given. Never invent or estimate numbers.
- Write money in naira with commas, like ₦15,000.
- Start with the total sales and the number of orders.
- Then name the product that made the most money, and the one with the most orders.
- List every product with its orders and money, highest money first.
- End with one practical idea for next week, based on the numbers.
- Plain, friendly English. Under 120 words.
```

4. Add the AI's brain, the same as before: click the **+** under **Chat Model**, click **OpenAI Chat Model**, pick your OpenAI credential and the model **gpt-5-mini**.
5. Open the AI Agent again and click **Execute step**.

![Your prompt (1), your report rules (2), and the report the AI wrote (3).](/lessons/small-business/weekly-report-assistant/n8n-report-agent.png "Step 6: n8n's totals in, a friendly report out.")

> **You should now see:** your report under **output**. Check every number against **Add up the week** and **Add up by product**. They should match exactly.

6. Close the window, and rename the step `Write the report`.

> **If it didn't work:** If the prompt shows a red error about **Add up by product**, check the step in Step 4 is named exactly `Add up by product`, with the same capital A. If the report gets a number wrong, add this rule to your **System Message**: `- Copy every number exactly as given.`

### Step 7: Send it to your Telegram

1. Click the **+** to the right of **Write the report**, type `Telegram`, click **Telegram**, then **Send a text message**.
2. Check **Credential** says **Telegram account**, and paste your **Telegram ID** into **Chat ID**.
3. In **Text**, paste this:

```text
{{ $json.output }}
```

4. Under **Additional Fields**, click **Add Field**, choose **Append n8n Attribution** and leave it switched **off**.

![Chat ID (1), the report text (2), and Append n8n Attribution switched off (3).](/lessons/small-business/weekly-report-assistant/n8n-report-telegram.png "Step 7: send the report to your phone.")

5. Close the window, and rename the step `Send me the report`.

## Try it now

1. Click the orange **Execute** button at the bottom of the canvas. You don't have to wait for Friday.
2. Check your phone. Your weekly report arrives in Telegram.
3. Read it. Check the total against your own records one last time.

> **If it didn't work:**
> 1. **Nothing arrives, and the workflow stops after Get this week's sales:** there were no sales in the last seven days. Add a sale with today's date and try again.
> 2. **A product appears twice:** it's spelled two ways in your table. Fix the spelling in the **Item** column.
> 3. **The Telegram step is red:** check **Chat ID**, and that you tapped **Start** on your bot.

## Switch it on

1. Click **Publish** at the top right.

From now on, your report arrives every Friday at 5pm, even when n8n isn't open. If a week has no sales in the table, no report is sent. Your off switch is the same as before: **Publish**, then **Unpublish**.

## Your weekly routine

The report is only as good as your table:

1. **Note each sale** when it happens, or at the end of each day. It takes ten seconds: date, customer, item, amount.
2. **Keep product names the same.** Copy them from your sticky note.
3. **Read your report on Friday**, and try the idea for next week.

**Tip:** Open n8n in your phone's web browser to add sales from anywhere.

## Keep it safe

1. **Check the numbers, at least at first.** Compare your first few reports with your own records. If the AI ever changes a number, tighten your rules.
2. **Your sales are private.** The report goes only to your own Telegram chat. Never add your bot to a group.
3. **What the AI sees.** The AI sees your totals and product names. It doesn't see customer names. Keep it that way: don't add customer names to the prompt.
4. **Don't put payment details in the table.** No card numbers, bank PINs or passwords, ever.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] My **Sales** table has four columns, and **Amount** is a **number** column.
- [ ] My workflow's **Timezone** is set to my own time zone.
- [ ] **Add up the week** shows the same total as my own records.
- [ ] Running the workflow sent the report to my Telegram.
- [ ] Every number in the report matches the totals in n8n.
- [ ] My workflow is published, and I know **Unpublish** is my off switch.

## Recap and what's next

You've built your third assistant:

1. **Schedule Trigger** wakes it up every Friday.
2. **Get this week's sales** picks the last seven days from your table.
3. **Add up by product** and **Add up the week** do the maths, exactly.
4. **Write the report** turns the numbers into plain English, with an idea for next week.
5. **Send me the report** delivers it to your phone.

You've also learned a rule you'll use again and again: **let n8n count, and let the AI write.**

**Next lesson:** Build your daily brief. Instead of a report once a week, you'll get one short message every morning with what needs you today.

Take the quick check below, then mark this lesson complete.
