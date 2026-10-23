---
summary: Build your first real assistant. When a customer messages you on WhatsApp, AI writes a reply from your own price list, and nothing is sent until you tap Approve on Telegram.
quiz:
  - question: A customer asks a question and the AI writes a draft. When does the customer get it?
    options:
      - Straight away
      - Only after you tap Approve on Telegram
      - The next morning
      - When the customer asks again
    answer: 1
    explanation: The Ask me on Telegram step waits for your tap. The Did I approve? step only lets the reply through if you tapped Approve.
  - question: The AI told a customer you deliver on Sundays, but you don't. What should you change?
    options:
      - Nothing. AI is always right
      - The facts and rules in the System Message
      - The customer's phone number
      - Your Telegram ID
    answer: 1
    explanation: The AI only knows what you write in the System Message. Add the correct delivery days, and tell it to say a person will reply when it isn't sure.
  - question: Why does the workflow have an Only customer messages step?
    options:
      - To block customers you don't like
      - Because WhatsApp also sends delivery receipts, and they aren't messages to answer
      - To make the AI faster
      - It translates messages
    answer: 1
    explanation: WhatsApp tells n8n when a message is sent, delivered and read. The filter lets real customer messages through and quietly skips everything else.
---

**Read time: 15 minutes · Build time: 45 minutes · Cost: free to build; AI costs less than ₦1 per reply**

This is the lesson where it all comes together. You'll build an assistant that answers customer questions on WhatsApp, using your own prices and rules.

You stay in charge. The assistant writes a draft, sends it to you on Telegram, and **waits for your tap**. Nothing reaches a customer until you say yes.

![A customer asks a question on WhatsApp, n8n sends you a draft on Telegram, you tap Approve, and only then does the reply go to the customer.](/lessons/small-business/customer-reply-assistant/two-phones.png "What your assistant does, start to finish.")

## What you'll have at the end

By the end of this lesson you'll have:

1. A workflow called **Customer reply assistant**, switched on.
2. An AI that knows **your prices, delivery areas and opening hours**.
3. An **Approve** or **Decline** button on your phone for every reply.

![The finished workflow in n8n with eight numbered steps, from WhatsApp Trigger to Send the reply.](/lessons/small-business/customer-reply-assistant/n8n-finished-workflow.png "Your finished assistant. You'll build it one box at a time.")

## Before you start

This lesson uses everything from Module 1. Tick off each item before you go on:

- [ ] Your **WhatsApp test** workflow from the WhatsApp lesson, with a working **WhatsApp Trigger**.
- [ ] Your **Telegram account** credential and your **Telegram ID** from the Telegram lesson.
- [ ] Your phone, with WhatsApp and Telegram open.
- [ ] Your **price list**, delivery areas and opening hours. A photo of your menu board is fine. You'll type them in.

> **New word: expression.** A small piece of text inside `{{ }}` that tells n8n to fill in information from an earlier step, like the customer's name. You'll paste a few of them in this lesson. You never need to write one yourself.

**How to paste an expression.** Hover over the box, and click **Expression** at its top right. Then paste. The box turns into an expression box, and the green parts show what n8n filled in. If a box already shows **fx** on its left, just paste.

## Step 1: Open your WhatsApp test workflow

1. In n8n, click the **house icon**, then open **WhatsApp test**.
2. At the top left, click the name and change it to `Customer reply assistant`. Press Enter.

You now have one box, the **WhatsApp Trigger**. Next, you'll add seven more to its right.

**Tip:** To make testing easy, send a message from your phone to your WhatsApp test number now, for example:

```text
Hello, how much is a chocolate cake for 10 people? Do you deliver to Lekki on Saturday?
```

Then open the **WhatsApp Trigger**, click **Test this trigger** if your message isn't showing, and close it. Every step you add can now use that message, so you'll see real answers as you build.

## Step 2: Skip delivery receipts

WhatsApp also tells n8n when your messages are **sent**, **delivered** and **read**. Those aren't questions to answer, so this step lets real messages through and skips the rest.

1. Click the small **+** to the right of the **WhatsApp Trigger**.
2. Type `Filter` and click **Filter**.

![The search box with Filter typed (1) and the Filter result (2).](/lessons/small-business/customer-reply-assistant/n8n-search-filter.png "Step 2: add a Filter.")

3. In the first **value** box, paste this expression:

```text
{{ $json.messages[0].text.body }}
```

4. Click the box that says **is equal to**. Point to **String**, then click **exists**.

![The condition: the message expression (1) and exists (2).](/lessons/small-business/customer-reply-assistant/n8n-filter-node.png "Keep only items that contain a message.")

5. Close the window. Click the Filter's name, **Filter**, and rename it `Only customer messages`.

> **New word: filter.** A step that lets some items through and stops others. Here, it only lets through items that contain a customer's text.

## Step 3: Let the AI write a draft

1. Click the **+** to the right of **Only customer messages**.
2. Type `AI Agent` and click **AI Agent**.

![The search box with AI Agent typed (1) and the AI Agent result (2).](/lessons/small-business/customer-reply-assistant/n8n-search-agent.png "Step 3: add an AI Agent.")

3. Set **Source for Prompt (User Message)** to **Define below**.
4. Paste this into **Prompt (User Message)**. It tells the AI who wrote and what they said:

```text
Customer name: {{ $json.contacts[0].profile.name }}
Customer message: {{ $json.messages[0].text.body }}
```

5. Under **Options**, find **System Message**. If it isn't there, click **Add Option** and choose **System Message**.
6. Delete what's in the **System Message** box. Copy the text below, paste it in, and **change it to your business**: your name, your prices, your areas and your hours.

```text
You are the WhatsApp assistant for Sunrise Bakery in Lagos.
Write a short, friendly reply to the customer's message.

Our facts:
- Chocolate cake: ₦15,000 (serves 10)
- Vanilla cake: ₦12,000 (serves 10)
- Meat pie: ₦800 each
- Delivery: Lekki, Ikoyi and Victoria Island, ₦2,500, Tuesday to Saturday
- Open: 8am to 6pm, Monday to Saturday

Rules:
- Use only the facts above. If you're not sure, say a person will reply soon.
- Never promise discounts, refunds or anything not listed above.
- Keep it under 60 words.
- End with: (Sunrise Bakery's assistant)
```

![Define below (1), the customer details prompt (2) and your business facts in the System Message (3).](/lessons/small-business/customer-reply-assistant/n8n-agent-prompt.png "Tell the AI who is asking, and what your business offers.")

> **New word: system message.** Your standing instructions to the AI: who it works for, what it knows and what it must never do. It's the most important box in this lesson. The AI can only be as good as what you write here.

7. Close the window, and rename the step `Write a draft reply`.

> **Stay safe:** The last line, "(Sunrise Bakery's assistant)", tells customers they're talking to an assistant. That's rule 4 from the safety lesson: be honest that it's AI. Keep it.

## Step 4: Give the AI a brain

Under **Write a draft reply** there's a small **+** labelled **Chat Model**, with a red star. The AI needs a model to think with.

1. Click the **+** under **Chat Model**, then click **OpenAI Chat Model**.
2. Open **Credential** and click **Create new credential**.
3. On n8n Cloud, look for a button to **get free OpenAI API credits**. Click it, and n8n sets up the credential for you. The free credits are enough for hundreds of test replies.

   If you don't see that button, you need your own key. Go to [platform.openai.com](https://platform.openai.com/api-keys), sign in, click **Create new secret key**, copy it, and paste it into **API Key**. Then click **Save**.

4. Set **Model** to **gpt-5-mini**. It's fast, cheap and good at short replies.

![The OpenAI Chat Model settings: your OpenAI credential (1) and the gpt-5-mini model (2).](/lessons/small-business/customer-reply-assistant/n8n-chat-model.png "Step 4: pick your credential and model.")

5. Close the window. Open **Write a draft reply** again, and click **Execute step**.

![The AI's draft under output: Hi Tunde! Our chocolate cake for 10 people is ₦15,000...](/lessons/small-business/customer-reply-assistant/n8n-agent-output.png "The AI's first draft, written from your facts.")

> **You should now see:** a draft reply under **output** on the right. Read it carefully. Is every price correct? If not, fix your **System Message** and click **Execute step** again.

> **If it didn't work:** If you see an error about the credential or **quota**, your free credits may be used up, or your OpenAI account needs a payment card. Check your key at [platform.openai.com](https://platform.openai.com/).

## Step 5: Ask your approval on Telegram

This is the step from the Telegram lesson, with the real customer message and draft inside.

1. Click the **+** to the right of **Write a draft reply**.
2. Type `Telegram`, click **Telegram**, type `send` and click **Send message and wait for response**.
3. Check **Credential** says **Telegram account**.
4. Paste your **Telegram ID** into **Chat ID**.
5. Paste this into **Message**:

```text
New WhatsApp message from {{ $('WhatsApp Trigger').item.json.contacts[0].profile.name }}:
{{ $('WhatsApp Trigger').item.json.messages[0].text.body }}

Draft reply:
{{ $json.output }}

Send this reply?
```

6. **Response Type**: **Approval**. **Type of Approval**: **Approve and Disapprove**.

![Chat ID (1), the approval message (2), Response Type (3) and Type of Approval (4).](/lessons/small-business/customer-reply-assistant/n8n-ask-telegram.png "Step 5: what Telegram will ask you.")

7. Scroll down. Switch on **Approve Within Chat**, and paste your Telegram ID into **Restrict Who Can Approve**. These are the same settings as Part 6 of the Telegram lesson.
8. Close the window, and rename the step `Ask me on Telegram`.

## Step 6: Check your answer

Now n8n needs to know which button you tapped.

1. Click the **+** to the right of **Ask me on Telegram**.
2. Type `If` and click **If**.
3. In the first **value** box, paste:

```text
{{ $json.data.approved }}
```

4. Click **is equal to**, point to **Boolean**, then click **is true**.

![The approval check (1), is true (2), and the True Branch (3).](/lessons/small-business/customer-reply-assistant/n8n-if-node.png "Step 6: did you tap Approve?")

5. Close the window, and rename the step `Did I approve?`

> **New word: If.** A step with two exits. Items that pass the check go out of **true**. Items that don't go out of **false**. Here, **true** means you tapped Approve.

## Step 7: Send the reply to the customer

This step only runs if you tapped **Approve**.

1. Click the **+** next to the word **true** on **Did I approve?**
2. Type `WhatsApp`, click **WhatsApp Business Cloud**, then click **Send message**.
3. Check **Credential** says **WhatsApp account**.
4. **Sender Phone Number**: pick your test number from the list.
5. Paste this into **Recipient's Phone Number**. It's the number of the customer who wrote to you:

```text
{{ $('WhatsApp Trigger').item.json.messages[0].from }}
```

6. Paste this into **Text Body**. It's the draft you approved:

```text
{{ $('Write a draft reply').item.json.output }}
```

![Send message (1), the customer's number (2) and the approved draft (3).](/lessons/small-business/customer-reply-assistant/n8n-whatsapp-send.png "Step 7: send the approved reply.")

7. Close the window, and rename the step `Send the reply`.

## Step 8: If you said no

If you tap **Decline**, nothing goes to the customer. This step reminds you to answer them yourself.

1. Click the **+** next to the word **false** on **Did I approve?**
2. Type `Telegram`, click **Telegram**, type `send` and click **Send a text message**.
3. Paste your **Telegram ID** into **Chat ID**.
4. Paste this into **Text**:

```text
Not sent. Please reply to {{ $('WhatsApp Trigger').item.json.contacts[0].profile.name }} yourself in WhatsApp.
```

5. Under **Additional Fields**, click **Add Field**, choose **Append n8n Attribution** and leave it switched **off**. This stops n8n adding its own line to your messages.

![Chat ID (1), the not-sent message (2) and Append n8n Attribution switched off (3).](/lessons/small-business/customer-reply-assistant/n8n-not-sent.png "Step 8: a reminder when you decline.")

6. Close the window, and rename the step `Tell me it wasn't sent`.

## Test it from your phone

Time to try the whole thing, the way a customer would.

1. Click the orange **Execute** button at the bottom of the canvas. n8n waits for a WhatsApp message.
2. On your phone, send your WhatsApp **test number** a question, for example:

```text
Do you have vanilla cake? How much?
```

3. Within about 10 seconds, Telegram shows the customer message, the draft and two buttons.
4. Read the draft. If it's right, tap **Approve**.

> **You should now see:** the buttons disappear and your Telegram message says it was approved. Then the reply arrives in WhatsApp on your phone, and every box in n8n is green.

5. Run it again with a question your facts don't answer, like `Do you make wedding cakes?` The draft should say a person will reply soon. This time, tap **Decline**.

> **You should now see:** **Not sent. Please reply to ... yourself in WhatsApp.** in Telegram, and nothing new in WhatsApp.

> **If it didn't work:** Click the step that turned red to read its error. The most common causes:
> 1. **Nothing happens at all:** check **Only customer messages**. Did your message pass, or was it **Discarded**?
> 2. **The draft is wrong:** fix your **System Message**. The AI only knows what you write there.
> 3. **No buttons on Telegram:** check **Chat ID** and that you tapped **Start** on your bot.
> 4. **The reply doesn't arrive:** check the **Sender Phone Number** and that your phone is on your Meta test number's recipient list.

## Switch it on

Testing only works while you watch. To let your assistant work by itself:

1. Click **Publish** at the top right.

Now every customer message gets a draft on your Telegram, even when n8n isn't open. Remember your off switch: **Publish**, then **Unpublish**.

**Reply within a day.** WhatsApp only lets businesses send normal replies within **24 hours** of the customer's last message. If you approve after that, the reply won't send. Check Telegram at least twice a day.

> **Stay safe:** Before you go live with your real number, read the **Going live** part of the WhatsApp lesson. Your privacy policy must say that customer messages are processed by WhatsApp, n8n and an AI service.

## Make it better each week

Your assistant gets smarter every time you improve the **System Message**. Once a week:

1. Look at the drafts you declined. What did the AI get wrong?
2. Add the missing fact or rule. For example: `- We don't make wedding cakes. Suggest our 3-tier celebration cake (₦45,000).`
3. Click **Execute step** on **Write a draft reply** to test, then click **Publish** again.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] A test question on WhatsApp sent me a draft on Telegram.
- [ ] When I tapped **Approve**, the reply arrived in WhatsApp.
- [ ] When I tapped **Decline**, nothing was sent and Telegram reminded me to reply.
- [ ] My **System Message** has my real prices, areas and hours, and ends with the assistant line.
- [ ] My workflow is published, and I know **Unpublish** is my off switch.

## Recap and what's next

You've built your first AI assistant:

1. **WhatsApp Trigger** hears the customer.
2. **Only customer messages** skips receipts.
3. **Write a draft reply** uses your facts and rules.
4. **Ask me on Telegram** waits for your tap.
5. **Did I approve?** sends the reply, or reminds you to answer yourself.

The pattern **draft, ask, then act** is the heart of every assistant in this course.

**Next lesson:** Build a lead follow-up assistant. You'll use the same pattern so that no new enquiry is forgotten, and every follow-up message is drafted for you.

Take the quick check below, then mark this lesson complete.
