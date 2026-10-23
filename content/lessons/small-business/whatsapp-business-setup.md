---
summary: Connect WhatsApp to n8n through Meta's official WhatsApp Business Platform, send your first test message, and watch a WhatsApp message arrive in n8n.
quiz:
  - question: Which two values do you paste into n8n's WhatsApp OAuth API credential?
    options:
      - Access token and Business Account ID
      - App ID and App secret
      - Your Facebook email and password
      - Your phone number and WhatsApp PIN
    answer: 1
    explanation: The OAuth credential uses the App ID (as Client ID) and the App secret (as Client Secret). It lets n8n hear new messages.
  - question: Why do you create a system user token instead of using the token from Generate access token?
    options:
      - The system user token is free and the other one isn't
      - The quick token stops working after about a day; the system user token doesn't expire
      - n8n can't read the quick token
      - Meta requires a new token for every message
    answer: 1
    explanation: The quick token is for testing and expires in about 24 hours. Your assistant needs a token that keeps working.
  - question: Your test number can't send to a customer's phone. Why?
    options:
      - WhatsApp is down
      - Test numbers only send to the few numbers you add as recipients
      - The customer must install n8n
      - You need to pay first
    answer: 1
    explanation: Meta's test number only messages the numbers on your recipient list. You add a real business number when you go live.
---

**Read time: 15 minutes · Build time: 45 to 60 minutes · Cost: free to set up**

Your customers already use WhatsApp. In this lesson you'll connect WhatsApp to your n8n account, so your first assistant can read their messages in the next lesson.

There are more clicks in this lesson than in any other in the course. Take it slowly, one step at a time, and tick each part off as you go. Every one of these steps happens only once.

## What you'll have at the end

By the end of this lesson you'll have:

1. A free **WhatsApp test number** from Meta, the company that owns WhatsApp.
2. A test message from that number on **your own phone**.
3. WhatsApp **connected to n8n**, with your reply showing up inside n8n.

![A phone showing Meta's Hello World test message from the test number, and the owner's reply underneath.](/lessons/small-business/whatsapp-business-setup/phone-test-message.png "Halfway through this lesson, this test message arrives on your phone.")

## How WhatsApp reaches n8n

The free WhatsApp Business app on your phone can't talk to n8n. To connect an assistant, you use Meta's official **WhatsApp Business Platform**, the same system large companies use. It's free to set up.

![The path of a message: your customer's phone, then the WhatsApp Business Platform run by Meta, then your Meta app with its secret keys, then your n8n workflow.](/lessons/small-business/whatsapp-business-setup/how-it-connects.png "Each customer message travels this path. You'll build the middle part today.")

> **New word: Meta app.** Your private connection to the WhatsApp Business Platform. It isn't an app on your phone. It's a settings page on Meta's developer website that holds your keys.

> **New word: access token.** A long secret code that proves n8n is allowed to use your WhatsApp. Treat it like a password.

## Before you start

Tick off each item before you begin:

- [ ] A **laptop or desktop computer** with your n8n account open in one tab.
- [ ] A personal **Facebook account**. Meta uses it to sign you in. Your customers will never see it.
- [ ] A **business email address**.
- [ ] **Your own phone with WhatsApp**, to receive the test message.
- [ ] A safe place to keep secret codes, such as a password manager. A notebook kept somewhere secure works too.
- [ ] About **an hour** without interruptions.

> **Stay safe:** You'll copy four codes in this lesson. Two of them are secret: the **access token** and the **app secret**. Paste them only into n8n. Never send them by email, WhatsApp or chat, and never paste them into an AI chatbot.

## Which phone number to use

You need a phone number for your assistant. Today you'll use a free **test number** from Meta. You'll add your real business number when you're ready to go live.

![Three choices. One: Meta's free test number, used today. Two: a new number for your business, recommended when you go live. Three: your existing business number, possible with care.](/lessons/small-business/whatsapp-business-setup/number-choice.png "Start with the free test number. Decide on your live number later.")

When you go live, we recommend a **new number** for the assistant, such as a new SIM card. A number used on the Platform generally can't stay on the WhatsApp Business app at the same time. Moving your current number means its chats leave the app. Some providers can keep a number on both, but only in some countries.

**What it costs.** Setting up is free. Meta charges per message, at a rate that depends on the customer's country. Since 1 October 2026, each business number gets **1,000 free customer service replies a month**. Those are replies sent within 24 hours of the customer's last message. Messages your business starts, like reminders, use paid **templates**. Check [Meta's pricing page](https://business.whatsapp.com/products/platform-pricing) for the latest rates in your country.

## Part 1: Create your business portfolio

A **business portfolio** is your business's home on Meta. WhatsApp requires one.

1. Go to [business.facebook.com](https://business.facebook.com) and sign in with Facebook.
2. If you already manage a Facebook Page or ads for your business, you may already have a portfolio. Look for your business name at the top left. If it's there, skip to Part 2.
3. Click **Create an account**. If you see a list of portfolios instead, open it and choose **Create a business portfolio**.
4. Type your **business name** exactly as customers know it, then your **name** and **business email**.
5. Click **Submit** or **Create**.
6. Open your email and click the confirmation link Meta sends you.

> **You should now see:** your business name at the top left of Meta Business, with a settings menu down the side.

## Part 2: Become a Meta developer

Next, you need a free **developer account**. That just means you're allowed to create Meta apps.

1. Go to [developers.facebook.com](https://developers.facebook.com).
2. Click **Get Started** at the top right. If it says **My Apps** instead, you already have a developer account. Skip to Part 3.
3. Accept Meta's terms.
4. Verify your phone number with the code Meta sends you.
5. When asked about your role, choose the closest match, for example **Business owner** or **Other**.

> **If it didn't work:** If Meta asks you to verify with a card or ID, follow its steps. This is normal for new developer accounts, and Meta doesn't charge for it.

## Part 3: Create your WhatsApp app

Now create the Meta app that connects WhatsApp to n8n.

1. On [developers.facebook.com](https://developers.facebook.com), click **My Apps**, then **Create App**.
2. Give the app a name only you will see, such as `Sunrise Bakery Assistant`. Check the email address.
3. When asked what the app is for, choose **Connect with customers through WhatsApp**, then click **Next**.
4. Choose the **business portfolio** from Part 1.
5. Click **Create app**. Enter your Facebook password if asked.
6. On the **Quickstart** page, click **Start using the API**.

> **You should now see:** a page called **API Setup**, with a **WhatsApp** section in the left menu.

> **If it didn't work:** If you can't find the WhatsApp option, open your app's dashboard, find the **WhatsApp** tile under **Add products to your app** and click **Set up**.

## Part 4: Send your first test message

The **API Setup** page is where Meta gives you a free test number. Here's what to look for:

![A simplified illustration of Meta's API Setup page: Generate access token (1), the From test number (2), the WhatsApp Business Account ID (3), the To recipient list (4) and Send message (5).](/lessons/small-business/whatsapp-business-setup/meta-api-setup.png "A simplified drawing of Meta's API Setup page. Your screen will have more on it. Look for these five things.")

1. Click **Generate access token**. Accept the permissions Meta asks for. This quick token is only for today's test, and it stops working after about a day.
2. Under **From**, Meta has picked a **test number** for you. Leave it as it is.
3. Find the **WhatsApp Business Account ID**. Copy it and save it in your safe place, labelled `WhatsApp Business Account ID`.
4. Under **To**, click **Manage phone number list** and add **your own WhatsApp number**, starting with your country code (for example `+234` for Nigeria or `+44` for the UK). Type in the code WhatsApp sends to your phone.
5. Choose your number in the **To** box and click **Send message**.

> **You should now see:** a WhatsApp message on your phone from the test number, starting **Hello World** and **Welcome and congratulations!!**

**Now reply to it.** Type anything, like `Hi! This is my test reply.` Your reply opens a 24-hour window for the next part of this lesson.

> **If it didn't work:** If no message arrives, check that you added your number with the country code and no leading zero. For example, write `+234 803 123 4567`, not `0803 123 4567`. Then click **Send message** again.

## Part 5: Make a key that never expires

The quick token from Part 4 expires after about a day. Your assistant needs a key that keeps working. Meta calls this a **system user** token.

> **New word: system user.** A pretend staff member for software. Instead of using your personal login, n8n gets its own account with only the access it needs. This is Rule 1 from Module 0, smallest access, in action.

![A simplified illustration of Meta Business Settings: Add a system user (1), Assign assets (2), and Generate token with three permissions (3).](/lessons/small-business/whatsapp-business-setup/meta-system-user.png "A simplified drawing of the System users page in Meta Business Settings.")

1. Go to [business.facebook.com/settings](https://business.facebook.com/settings).
2. In the left menu, open **Users**, then **System users**.
3. Click **Add**. Name it `n8n-assistant`, choose the **Admin** role and click **Create system user**.
4. With `n8n-assistant` selected, click **Assign assets**.
5. Choose **Apps**, tick your app, and switch on **Full control** (**Manage app**).
6. Choose **WhatsApp accounts**, tick your WhatsApp account, and switch on **Full control**. Click **Assign assets**.
7. Click **Generate token** (it may say **Generate new token**). Choose your app.
8. If you're asked when the token should expire, choose **Never**.
9. Tick these three permissions: `whatsapp_business_messaging`, `whatsapp_business_management` and `business_management`.
10. Click **Generate token**. Copy the long code straight away and save it in your safe place, labelled `WhatsApp permanent token`.

> **Stay safe:** Meta shows this token only once. If you lose it, generate a new one. Anyone with this token can send WhatsApp messages as your business, so keep it secret.

## Part 6: Find your app's ID and secret

You need two more values. They let n8n hear new messages.

1. Go back to [developers.facebook.com](https://developers.facebook.com), click **My Apps**, then open your app.
2. In the left menu, click **App settings**, then **Basic**.

![A simplified illustration of the Basic app settings page: App ID (1) and App secret with its Show button (2).](/lessons/small-business/whatsapp-business-setup/meta-app-basic.png "A simplified drawing of the Basic app settings page.")

3. Copy the **App ID** and save it, labelled `App ID`.
4. Next to **App secret**, click **Show**, type your Facebook password, then copy it. Save it labelled `App secret`.

You now have four values in your safe place. Here's where each one goes in n8n:

![Four values, two credentials. The permanent access token and WhatsApp Business Account ID go into the WhatsApp API credential. The App ID and App secret go into the WhatsApp OAuth API credential as Client ID and Client Secret.](/lessons/small-business/whatsapp-business-setup/keys-map.png "Keep this picture open while you do Part 7.")

## Part 7: Add your credentials in n8n

Switch to your n8n tab. You'll create two credentials: one for **sending** messages and one for **hearing** them.

**Credential 1: WhatsApp API (for sending)**

1. Click the **house icon**, open the **Credentials** tab, then click **Create credential**.

![The Create credential button at the top right of the n8n Credentials page, marked 1.](/lessons/small-business/whatsapp-business-setup/n8n-create-credential.png "In n8n: click Create credential.")

2. Type `WhatsApp API`, choose it from the list, then click **Continue**.

![The Add new credential window with WhatsApp API selected (1) and the Continue button (2).](/lessons/small-business/whatsapp-business-setup/n8n-pick-whatsapp-api.png "In n8n: choose WhatsApp API.")

3. Paste your **permanent token** into **Access Token**.
4. Paste your **WhatsApp Business Account ID** into **Business Account ID**.
5. Click **Save**.

![The WhatsApp account credential form with Access Token (1), Business Account ID (2) and Save (3).](/lessons/small-business/whatsapp-business-setup/n8n-whatsapp-api-form.png "In n8n: paste your token and account ID, then save.")

> **You should now see:** **WhatsApp account** in your list of credentials after you close the window.

**Credential 2: WhatsApp OAuth API (for hearing)**

6. Click **Create credential** again. This time type `WhatsApp OAuth`, choose **WhatsApp OAuth API** and click **Continue**.
7. Paste your **App ID** into **Client ID**.
8. Paste your **App secret** into **Client Secret**.
9. Click **Save**.

![The WhatsApp OAuth account form with Client ID (1), Client Secret (2) and Save (3).](/lessons/small-business/whatsapp-business-setup/n8n-whatsapp-oauth-form.png "In n8n: paste your App ID and App secret, then save.")

> **If it didn't work:** A red error usually means a code was pasted with a space at the start or end. Delete the value, paste it again carefully, and click **Save**.

## Part 8: Hear your first message in n8n

Now prove the connection works by getting a WhatsApp message into n8n.

1. In n8n, click the **house icon**, then the orange **Create workflow** button at the top right.
2. Name it `WhatsApp test`.
3. Click **Add first step**, then type `WhatsApp` and click **WhatsApp Business Cloud**.

![The trigger search with WhatsApp typed in (1) and WhatsApp Business Cloud in the results (2).](/lessons/small-business/whatsapp-business-setup/n8n-search-whatsapp-trigger.png "In n8n: search for WhatsApp.")

4. Under **Triggers**, click **On messages**.

![The list of WhatsApp Business Cloud triggers with On messages marked 1.](/lessons/small-business/whatsapp-business-setup/n8n-on-messages.png "In n8n: choose On messages.")

5. In the window that opens, click **Connect to WhatsApp OAuth** and choose the OAuth credential you saved in Part 7.
6. Check that **Trigger On** says **Messages**.
7. Click **Test this trigger**. n8n now waits for a message.
8. On your phone, send a new message to the **test number**, for example `Do you deliver on Sundays?`

![The WhatsApp Trigger window: Connect to WhatsApp OAuth (1), Trigger On set to Messages (2), and the Test this trigger button (3).](/lessons/small-business/whatsapp-business-setup/n8n-whatsapp-trigger-node.png "In n8n: connect the trigger, then click Test this trigger and send a message from your phone.")

> **You should now see:** after a few seconds, your message appears in the **OUTPUT** column. Look for your words under **text** and your phone number under **from**. WhatsApp is now talking to n8n.

> **If it didn't work:** Work through these one at a time:
> 1. Wait 30 seconds and send another message. The first message can arrive slowly.
> 2. Check that your phone sent the message to the **test number**, the one that sent you Hello World.
> 3. In Meta, open your app, then **WhatsApp**, then **Configuration**. Under **Webhook fields**, make sure **messages** is switched on (subscribed).
> 4. A Meta app can only send messages to **one** WhatsApp trigger. If you made an earlier test workflow with a WhatsApp trigger, delete it, then try again.

Close the window. Keep the **WhatsApp test** workflow for now. In the next lesson you'll turn it into your customer reply assistant.

## Going live with your real number

Don't do this yet. You'll come back here after you've built and tested your assistant in the next lesson. Here's what going live involves, so you can prepare:

1. **Get the number ready.** Choose a number that can receive a text message or call, and that isn't on WhatsApp. A new SIM is easiest.
2. **Add it in Meta.** On **API Setup**, click **Add phone number**. Enter your business display name, category and description, then verify the number with the code Meta sends you.
3. **Wait for the display name.** Meta checks that your display name matches your business. This usually takes a day or two.
4. **Publish your app.** Under **App settings**, then **Basic**, add a **Privacy Policy URL**, a page on your website that explains how you use customer data. Then switch the app to **Live**.
5. **Verify your business.** In Meta Business Settings, complete **Business verification** with your registration documents. This lets you message more customers each day.

> **Stay safe:** Before going live, check your privacy policy says that customer messages are processed by WhatsApp, n8n and an AI service. Your assistant must also say it's an assistant, as you learned in Module 0.

## Test it

Before you mark this lesson complete, check each of these:

- [ ] The **Hello World** message arrived on my phone, and I replied.
- [ ] My safe place holds four values: WhatsApp Business Account ID, permanent token, App ID and App secret.
- [ ] n8n has two credentials: **WhatsApp account** and **WhatsApp OAuth account**.
- [ ] A message I sent to the test number appeared in my **WhatsApp test** workflow.
- [ ] I haven't shared my token or app secret with anyone.

## Recap and what's next

You've done the hardest setup in the whole course:

1. **A business portfolio and a Meta app**, connected to the WhatsApp Business Platform.
2. **A free test number** that sends to your own phone.
3. **A permanent token** from a system user with only the access n8n needs.
4. **Two n8n credentials**, one for sending and one for hearing.
5. **A working trigger** that brings WhatsApp messages into n8n.

**Next lesson:** Guided Telegram setup. You'll connect Telegram to n8n, so your assistants can send you private updates and ask for your approval with one tap on your phone.

Take the quick check below, then mark this lesson complete.
