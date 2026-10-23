---
summary: Five simple rules that keep your assistants safe, and a ten-point checklist to run on every agent before you switch it on.
quiz:
  - question: Your invoice assistant only needs to read your list of unpaid invoices. What access should it get to that sheet?
    options:
      - Edit access, in case it needs it later
      - Read-only access
      - Your Google password, so it can sign in
      - Owner access
    answer: 1
    explanation: Give the smallest access that does the job. If it only needs to look, it only gets to look.
  - question: Which of these actions should always wait for a person's approval, however good the assistant gets?
    options:
      - Sorting emails into folders
      - Writing a draft reply
      - Sending money or promising a refund
      - Reading tomorrow's calendar
    answer: 2
    explanation: Money, refunds, legal promises and anything that cannot be undone are red actions. A person always approves them.
  - question: Your customer reply assistant sent a wrong price to three customers. What is the first thing to do?
    options:
      - Delete the assistant
      - Pause the assistant
      - Wait to see if anyone complains
      - Change the price list
    answer: 1
    explanation: Pause first so no more wrong messages go out. Then put it right with the customers, find the cause and fix it.
---

**Read time: 15 minutes · Nothing to install**

In the last lesson you planned your first assistant on an agent card. Before you build it, you'll check that plan against five safety rules.

These rules are short, and they apply to every assistant in this course. Learn them now and you won't have to think about them again.

## What you'll have at the end

You'll finish with a **safety-checked agent card**: the card from the last lesson, checked against a ten-point list, with any problems fixed.

![A ten-point safety checklist with every item ticked, next to the agent card from the previous lesson.](/lessons/shared/agent-safety/safety-checklist.png "You will run this checklist on your agent card at the end of this lesson, and on every assistant you build.")

Have your agent card from the last lesson ready. If you didn't keep it, go back and fill it in first. It only takes a few minutes.

## Why safety comes first

An AI assistant works fast and never gets tired. That's what makes it useful, and it's also why mistakes matter. A mistake a person makes once, an assistant can make fifty times in an hour.

Almost every problem with an assistant comes from one of three things:

1. **It says something wrong.** It gets a price or a date wrong, or it promises something you can't deliver.
2. **It can do too much.** It has access to more of your apps or data than its job needs.
3. **It shares something private.** A customer's details, a client's file or your own passwords end up where they shouldn't.

The five rules below protect you from all three.

![The five safety rules: smallest access, a person approves, protect private information, be honest it is AI, and test, watch and keep an off switch.](/lessons/shared/agent-safety/five-rules.png "Five rules for every assistant in this course.")

## Rule 1: Give the smallest access that works

Give an assistant access only to what its one job needs, and nothing more. Security experts call this **least access**.

> **New word: least access.** Giving someone the smallest set of keys they need to do their job. A cleaner gets the office key, not the key to the safe.

Here's how to choose access for the assistants in this course:

| Assistant | Needs | Does not need |
| --- | --- | --- |
| Customer replies | WhatsApp messages, price list (read only) | Your bank app, your personal email |
| Weekly report | Sales sheet (read only) | Access to edit or delete sales |
| Inbox triage | Work email (read and draft) | Permission to send without you, your personal email |
| Invoice reminders | Unpaid invoices list (read only), email (draft) | Your bank login, permission to issue refunds |

Three habits help:

- Choose **read only** whenever the assistant only needs to look.
- Use a **separate sheet or folder** for each assistant, holding only what it needs. Don't connect your whole Google Drive.
- **Never type your passwords into a prompt or a chat with an assistant.** When an app needs to connect, you'll sign in on that app's own page. Every setup lesson shows you exactly where.

## Rule 2: A person approves before it acts

Every assistant in this course starts with approval switched on. It prepares the work, then it waits for you.

Not every action carries the same risk, so it helps to sort actions into three colours:

![Approval levels as a traffic light. Green: the assistant may act alone, for example sorting or summarising. Amber: you approve each one, for example replies to customers. Red: a person always decides, for example money, refunds, legal or medical matters.](/lessons/shared/agent-safety/approval-levels.png "Start everything at amber. Only move an action to green after it has been right many times.")

- **Green: it can act alone.** Low-risk actions that stay inside your own tools and are easy to undo, like sorting emails into folders, summarising notes or preparing a report only you will read.
- **Amber: you approve each one.** Anything that reaches another person: a customer reply, a follow-up email, a reminder. **Every new assistant starts here.**
- **Red: a person always decides.** Money, refunds, discounts, legal or medical advice, anything about someone's job, and anything that can't be undone. An assistant can prepare information for these decisions, but it never makes them.

> **Try it:** Look at the Approval line on your agent card. Is your assistant's main action green, amber or red? If it's red, change the plan so the assistant only prepares the information and you make the decision.

When can amber become green? Only when the action is low risk, and you have read at least **50 approvals in a row** with no changes needed. Even then, spot-check a few every week.

## Rule 3: Protect private information

Assistants read and write real information about real people. Treat it the way you'd want your own information treated.

**Never** put these into an assistant's memory, a prompt or a sheet it can read:

- passwords, PINs or one-time codes
- bank card or account numbers
- national ID or passport numbers
- health information about a person
- anything a client has asked you to keep confidential

Instead:

- **Keep only what the job needs.** A delivery assistant needs a customer's first name and area, not their date of birth.
- **Use first names or client codes** where you can. Write "Client A, design project", not a full name and address.
- **Delete old data.** Clear out old conversations and sheets you no longer need, for example every three months.

> **Stay safe:** Many countries have data protection laws, such as Nigeria's Data Protection Act 2023 and the European Union's GDPR. They require you to protect people's personal data and use it only for the reason you collected it. If your business holds a lot of customer data, or works in health, finance or law, check the rules where you work before you connect an assistant to that data.

## Rule 4: Be honest that it is AI

People have a right to know when they're talking to an assistant. Being open also builds trust: customers forgive a slow reply far more easily than one that felt dishonest.

- **Tell customers.** Your assistant's first message in a new conversation should say that an assistant helps you reply and that a person checks every message.
- **Never let it pretend to be a specific person.** It can write in your style, but it must never claim to be you on a call or sign a contract in your name.
- **Make it easy to reach a human.** Every customer-facing assistant should say how to talk to a person.

Here's a line you can use. Tap **Copy** and keep it for Module 1:

```text
Hi! Thanks for your message. Our assistant helps us reply quickly, and a member of our team checks every reply before it is sent. If you would like to speak to a person, just type "person".
```

## Rule 5: Test, watch and keep an off switch

An assistant is never finished. Like a new team member, it needs checking, most of all in the first few weeks.

1. **Test before launch.** Every build lesson includes test messages. Run all of them before real customers or clients ever see the assistant.
2. **Watch for the first two weeks.** Read every draft before you approve it. Note anything you had to change.
3. **Review every week.** Spend ten minutes each week looking at what the assistant did. Your notes will show you how to improve its instructions.
4. **Know where the off switch is.** Every build lesson shows you how to pause the assistant with one click. Find it before you need it.

> **You should now see:** five rules you can repeat from memory: smallest access, a person approves, protect private information, be honest it's AI, and test, watch and keep an off switch.

## If something goes wrong

Even a careful setup will make a mistake one day. When it happens, follow these four steps in order:

1. **Pause.** Switch the assistant off so no more messages go out. Do this first, before anything else.
2. **Put it right.** Contact anyone who got a wrong message. A short, honest note is enough: "Sorry, the price we sent earlier was wrong. The correct price is..."
3. **Find the cause.** Was it out-of-date memory, an unclear instruction, or too much access?
4. **Fix and re-test.** Change the instruction, the data or the access, then run the test messages again before you switch it back on.

> **If it didn't work:** If you can't tell why the assistant made the mistake, keep it paused and make its job smaller. A smaller job is easier to get right.

## Check your agent card

Now run the safety checklist on the agent card you made in the last lesson.

1. Tap **Copy** on the checklist below.
2. Paste it under your agent card.
3. Answer **yes** or **no** to each line. Fix anything that's a no, then check again.

```text
SAFETY CHECKLIST

[ ] 1. My assistant has one job, written in one sentence.
[ ] 2. It only has access to the apps that job needs.
[ ] 3. It has read-only access wherever it only needs to look.
[ ] 4. No passwords, PINs, card numbers or ID numbers are in its memory.
[ ] 5. It only keeps the personal details its job needs.
[ ] 6. Anything it sends to another person waits for my approval.
[ ] 7. It never decides about money, refunds, legal or medical matters.
[ ] 8. It tells people it is an assistant and how to reach a person.
[ ] 9. I have test messages ready to try before launch.
[ ] 10. I know how to pause it.
```

> **You should now see:** ten ticks. Items 9 and 10 can stay open for now. You'll complete them in your first build lesson.

> **If it didn't work:** If more than two lines say no, go back to your agent card and make the job smaller. The problem is usually item 1 or item 2.

## Recap and what's next

You now have the five safety rules:

1. **Smallest access:** only the apps and data the job needs, read only where possible.
2. **A person approves:** green, amber and red actions. Every new assistant starts at amber.
3. **Protect private information:** no passwords, card numbers, ID numbers or health details, ever.
4. **Be honest it's AI:** tell people, and make it easy to reach a person.
5. **Test, watch and keep an off switch:** test before launch, review weekly, and know how to pause.

Your agent card is planned and safety-checked. **Next, you'll start building.** Small business owners set up n8n, the tool your assistants run on. Professionals set up Hermes, their own private assistant.

Take the quick check below, then mark this lesson complete.
