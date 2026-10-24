---
summary: Bring your five assistants together. Describe and tag each one, test them all from start to end, get a Telegram alert the moment anything breaks, and follow a simple plan for your first month.
quiz:
  - question: Your lead follow-up assistant didn't send anything this morning, and there's no Published badge next to it. What's wrong?
    options:
      - The AI is on holiday
      - It isn't published, so it only runs when you click Execute. Open it and click Publish
      - Your leads table is too long
      - Telegram is down for everyone
    answer: 1
    explanation: Only published workflows run on their own. Check for the green Published badge on every assistant in your AI team list.
  - question: Why do you set an Error Workflow on each assistant?
    options:
      - It makes the assistants faster
      - So you get a Telegram alert, with the step and the problem, the moment one of them fails
      - So customers know when something breaks
      - n8n needs it to publish
    answer: 1
    explanation: Without it, a broken assistant fails quietly and you only notice days later. With it, your phone tells you straight away which assistant stopped, and why.
  - question: You've launched. In week 1, what should you do with the messages your assistants draft?
    options:
      - Send them all without reading, to save time
      - Read every one before you send it, and fix the rules when a draft is wrong
      - Ask a friend to check them
      - Turn the assistants off until week 2
    answer: 1
    explanation: The first week is when you learn how your assistants think. Reading everything, and fixing the rules, is how they get better, and how you learn to trust them.
---

**Read time: 12 minutes · Build time: 40 minutes · Cost: free**

Look at what you've built. Five assistants that answer customers, chase leads, add up your week, brief you every morning, and remind people who owe you money. That's an AI team.

In this final lesson, you'll get your team ready for real work. You'll give each assistant a clear description, test them all from start to end, and set up an alert that tells you the moment anything breaks. Then you'll launch, with a simple plan for your first month.

![Five assistants: customer replies, lead follow-up, weekly report, daily brief and payment reminders. Nothing reaches a customer until you say so.](/lessons/small-business/business-capstone/ai-team.png "Your AI team. You're the boss.")

## What you'll have at the end

By the end of this lesson you'll have:

1. All five assistants **described, tagged and published**, in one list.
2. Each assistant **tested**, from start to end.
3. A **Telegram alert** if any assistant stops working.
4. A **plan** for your first month.

## Before you start

- [ ] You've built the five assistants in Modules 1 to 5.
- [ ] Your phone is nearby, with **Telegram** and **WhatsApp**.
- [ ] 40 minutes without customers. Testing goes faster when you're not interrupted.

## Step 1: Describe and tag each assistant

In three months you won't remember exactly what each one does. A one-line description and a tag fix that.

1. Click the **house icon**, then open your **Payment reminder assistant**.
2. Click the **three dots** next to its name, then **Edit description and tags**.

![The three dots (1), Edit description and tags (2), and Settings (3).](/lessons/small-business/business-capstone/n8n-workflow-menu.png "Step 1: everything about the workflow lives in this menu.")

3. In **Description**, write one sentence: what it does, and who checks it.
4. Click **Tags**, type `AI team`, and press **Enter**.
5. Click **Save**.

![A one-sentence description (1), the AI team tag (2), and Save (3).](/lessons/small-business/business-capstone/n8n-description-tags.png "Step 1: describe it so future you understands it.")

6. Do the same for your other four assistants. Here are descriptions you can copy and change:

| Assistant | Description |
|---|---|
| Customer reply assistant | When a customer messages on WhatsApp, drafts a reply for me to approve on Telegram. |
| Lead follow-up assistant | Every morning at 9am, sends me follow-ups for today's leads. I send each one myself. |
| Weekly report assistant | Every Friday at 5pm, sends me my week's sales report on Telegram. |
| Daily brief | Every morning at 7am, sends me today's orders and leads on Telegram. |
| Payment reminder assistant | Every morning at 10am, reminds me about late invoices. I send each reminder myself. |

## Step 2: See your whole team

1. Click the **house icon**.
2. Click the **AI team** tag on any assistant. Or click the **filter** button, open **Tags**, and pick **AI team**.

![Filter by AI team (1), the tag (2), Published (3), and one assistant that isn't published (4).](/lessons/small-business/business-capstone/n8n-ai-team-list.png "Step 2: your whole team on one screen.")

> **You should now see:** your five assistants, each with **AI team** and a green **Published** badge.

3. **Look for any assistant without Published.** It isn't running on its own. Open it, click **Publish** at the top right, and come back. In the picture, the customer reply assistant still needs publishing.

## Step 3: Test each assistant, from start to end

Testing each step was part of building. Now test each assistant as your customers and your mornings will use it. Work down this table, and tick each one off:

| Assistant | How to test it | You should see on Telegram |
|---|---|---|
| Customer reply | From another phone, send your business WhatsApp: `Do you deliver to Lekki?` | A draft reply with **Approve** and **Reject**. Tap **Approve**, and the reply arrives on the other phone. |
| Lead follow-up | In **Leads**, add a test lead with **Follow_up** set to today. Open the workflow and click **Execute**. | A follow-up with an **Open in WhatsApp** button. |
| Weekly report | Open the workflow and click **Execute**. | This week's report, with totals that match your Sales table. |
| Daily brief | In **Orders**, add a test order due today. Click **Execute**. | One brief, with your test order in it. |
| Payment reminders | In **Invoices**, add a test invoice: **Unpaid**, due last week, **Last_reminder** empty. Click **Execute**. | A reminder with an **Open in WhatsApp** button. |

**Check the words, not just that it arrived.** Are names, amounts and dates right? Does it sound like you? If a draft is wrong, change the rules in that assistant's **System Message**, and test again.

> **Stay safe:** When you've finished testing, delete your test rows from **Leads**, **Orders** and **Invoices**, so no real customer gets a test message.

> **If it didn't work:** Open the assistant and look for the step with a red mark. Click it to read the error. The most common causes are a missing **Credential**, a **Chat ID** typo, or OpenAI credits that have run out. The lesson where you built that assistant has an **If it didn't work** box for its steps.

## Step 4: Get an alert when something breaks

Assistants can stop working: a password changes, a credit card expires, a table gets renamed. Without an alert, you'd only notice days later. You'll build one small workflow that watches all five.

### Make the alert workflow

1. Click the **house icon**, then **Create workflow**. Rename it `Tell me if something breaks`.
2. Click **Add first step**, type `error` and click **Error Trigger**.
3. Click **Fetch Test Event** to load an example error.

![Fetch Test Event (1), and an example error with the workflow name, the step and the problem (2).](/lessons/small-business/business-capstone/n8n-error-test.png "An example error, so you can build the alert.")

4. Close the window. Click the **+** to the right of **Error Trigger**, type `Telegram`, click **Telegram**, then **Send a text message**.
5. Check **Credential** says **Telegram account**, and paste your **Telegram ID** into **Chat ID**.
6. Paste this into **Text**:

```text
⚠️ {{ $json.workflow.name }} stopped working.

Step: {{ $json.execution.lastNodeExecuted }}
Problem: {{ $json.execution.error.message }}
```

7. Set **Reply Markup** to **Inline Keyboard**. Click **Add Keyboard Row**, then **Add Button**. In the button's **Text**, type `Open in n8n`.
8. Under the button's **Additional Fields**, click **Add Field**, choose **URL**, and paste:

```text
{{ $json.execution.url }}
```

![Chat ID (1), the alert text (2), Inline Keyboard (3), and the Open in n8n button (4).](/lessons/small-business/business-capstone/n8n-alert-telegram.png "Step 4: what the alert says.")

9. Under the **Additional Fields** at the bottom, click **Add Field**, choose **Append n8n Attribution** and leave it switched **off**.
10. Click **Execute step**. Rename the step `Send me an alert`.

> **You should now see:** a test alert on Telegram that says **Example Workflow stopped working**. The button won't open anything useful yet, because it's an example.

![Error Trigger (1) starts when another assistant fails, and Send me an alert (2) tells you on Telegram.](/lessons/small-business/business-capstone/n8n-error-canvas.png "Your alert workflow: two steps.")

11. Click **Publish** at the top right. **This is important:** n8n only lets you choose an alert workflow once it's published.

### Connect it to each assistant

1. Open your **Daily brief**.
2. Click the **three dots** next to its name, then **Settings**.
3. Open **Error Workflow** and pick **Tell me if something breaks**.
4. Click **Save** at the bottom.

![Error Workflow set to Tell me if something breaks.](/lessons/small-business/business-capstone/n8n-error-setting.png "Step 4: do this in all five assistants.")

5. Do the same for your other four assistants.

From now on, if any assistant fails while it's running on its own, your phone tells you which one, at which step, and why:

![A Telegram alert: the Payment reminder assistant stopped at the Send me the reminder step, with an Open in n8n button.](/lessons/small-business/business-capstone/phone-alert.png "When something breaks, you'll know within seconds.")

> **New word: error workflow.** A workflow that runs when another one fails. It only fires for published assistants running on their own, not when you click **Execute** yourself.

## Step 5: Your weekly check

Alerts tell you when something fails. Once a week, it's also worth seeing everything that ran.

1. Click the **house icon**, then the **Executions** tab.

![Executions (1), a successful run (2), and a failed run in red (3).](/lessons/small-business/business-capstone/n8n-executions.png "Step 5: two minutes every Friday.")

2. Look down the **Status** column. Green **Success** means the assistant ran from start to end.
3. Click any red **Error** row. n8n opens that run and shows which step failed, in red.

**Count your wins too.** How many replies, follow-ups and reminders went out this week? That's time you got back.

## Step 6: Launch

Your team is ready. Here's how to run it well for the first month:

![Week 1: read everything. Weeks 2 to 4: build trust. Every month: keep it healthy.](/lessons/small-business/business-capstone/launch-plan.png "Your first month as the boss of an AI team.")

### When something goes wrong

| What happens | What to do |
|---|---|
| A Telegram alert arrives | Tap **Open in n8n**, read the red step, and fix it. The build lesson for that assistant explains each step. |
| A draft is wrong or sounds off | Don't send it. Add a rule to that assistant's **System Message**, for example `Never promise delivery times.` |
| Nothing arrived this morning | Check the assistant says **Published**, and look in **Executions**. |
| Errors about **quota** or credits | Your OpenAI credits are used up. Add credit at [platform.openai.com](https://platform.openai.com/), and set a monthly budget there so there are no surprises. |
| You need everything to stop, now | Open each assistant and click **Unpublish**. Nothing runs until you publish again. |

## Keep it safe

1. **You approve everything** that reaches a customer. Keep it that way, even when the drafts are good.
2. **Keep your rules up to date.** New prices, new opening hours, a new product: update the System Message the same day.
3. **Guard your keys.** Your Telegram bot token, WhatsApp token and OpenAI key are passwords. Never share them or paste them into a chat.
4. **Keep customer data tidy.** Delete leads and invoices you no longer need. Don't store more about people than the job needs.
5. **Know your off switch:** **Unpublish**.

## Test it: your launch checklist

Before you mark this lesson, and the course, complete:

- [ ] All five assistants have a description and the **AI team** tag.
- [ ] All five say **Published**.
- [ ] I tested all five from start to end, and checked the words.
- [ ] I deleted my test rows.
- [ ] My **Tell me if something breaks** workflow is published, and I got the test alert.
- [ ] All five assistants have it set as their **Error Workflow**.
- [ ] I know where **Executions** is, and I've put a weekly check in my calendar.
- [ ] I know my off switch: **Unpublish**.

## Recap: look what you built

You started this course wondering what an AI agent is. You now have:

1. A **customer reply assistant** that drafts WhatsApp answers for you to approve.
2. A **lead follow-up assistant** that makes sure no lead goes cold.
3. A **weekly report** with your real numbers, every Friday.
4. A **daily brief** that plans your morning.
5. A **payment reminder assistant** that chases money politely.
6. An **alert** that tells you when anything breaks, and a plan to run it all.

That's hours back every week, and a business that answers faster and forgets less. You're in charge of all of it.

**What's next?** Keep going, one small improvement a month. Add a new rule when a customer asks something new. Try a new idea from the weekly report. And when you're ready, build your next assistant, using the same pattern you've used five times: a trigger, the facts, the AI, and you on Telegram.

Take the quick check below, then mark this lesson complete. Congratulations!
