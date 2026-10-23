---
summary: Learn the five parts every AI agent is made of, in plain words, and plan your first one on a single card.
quiz:
  - question: Your assistant should start working every morning at 7am. Which part of the agent is that?
    options:
      - Role
      - Memory
      - Trigger
      - Tools
    answer: 2
    explanation: A trigger is whatever makes the agent start. A time of day is one of the most common triggers.
  - question: Which of these is the safest way to set up an assistant that replies to customers?
    options:
      - It sends replies on its own so customers never wait
      - It drafts each reply and you approve it before it is sent
      - It only replies when it feels sure
      - It copies your old replies word for word
    answer: 1
    explanation: An approval step means nothing leaves your business without your yes. Every assistant in this course starts this way.
  - question: Your price list is saved in a Google Sheet that the agent reads. Which two parts of the agent does this touch?
    options:
      - Tools and memory
      - Role and trigger
      - Trigger and approval
      - Role and approval
    answer: 0
    explanation: Google Sheets is a tool the agent is allowed to use, and the prices it reads there become part of what it knows, its memory.
---

**Read time: 15 minutes · Nothing to install**

Every assistant you build in this course is made from the same five parts. Learn them once here, and every later lesson will feel familiar.

Use the **Next** button to move through the lesson one part at a time. You need nothing but this page.

## What you'll have at the end

By the end of this lesson you will have an **agent card**: one page that describes your first AI assistant in plain words.

You will not build anything yet. You will plan. Builders who plan on one page first finish faster and make fewer mistakes.

![A finished agent card for a bakery's customer reply assistant, with five filled-in rows: role, tools, memory, trigger and approval.](/lessons/shared/agent-foundations/finished-agent-card.png "This is the card you will fill in for your own assistant at the end of this lesson.")

## An AI agent is a new team member

You have probably used a **chatbot** like ChatGPT. You type a question, it types an answer, and then it waits for you again.

An **AI agent** goes one step further. It can do a small job for you, again and again, without being asked each time.

> **New word: AI agent.** A computer assistant that has a job, can use some of your apps, and starts working when something happens. In this course we use "agent" and "assistant" to mean the same thing.

The easiest way to understand an agent is to imagine hiring a new team member. Before their first day, you would decide:

1. What their job is.
2. Which tools and logins they get.
3. What they need to know about your work.
4. When they should start each task.
5. Which things they must check with you first.

Those five decisions are exactly the five parts of an AI agent.

| A chatbot | An AI agent |
| --- | --- |
| Waits for you to type | Starts on its own when something happens |
| Only talks | Can read and write in your apps |
| Forgets you when you close it | Remembers the facts you give it |
| You copy its answer somewhere | It puts the result where it is needed, after your approval |

## The five parts of every agent

Here are the five parts on one page. The next five parts of this lesson explain one each.

![The five parts of an AI agent: role, tools, memory, trigger and approval, each with a one-line meaning and an everyday example.](/lessons/shared/agent-foundations/five-parts.png "Role, tools, memory, trigger and approval. Every assistant in this course has all five.")

Remember them with one sentence: **an agent has a job (role), keys (tools), a notebook (memory), a doorbell (trigger) and a boss (approval).**

## Role: the job description

The **role** tells the agent what it is for and how to behave. You write it in normal sentences, just like a job description.

A good role answers four questions:

1. **Who is it working for?** "You work for Sunrise Bakery, a family bakery in Lagos."
2. **What is its one job?** "You answer customer questions about prices, opening hours and delivery."
3. **How should it sound?** "Friendly, short and polite. Use the customer's name."
4. **What must it never do?** "Never promise refunds or discounts. Never make up a price."

> **Try it:** Read the four lines above again. Could a new human employee follow them on day one? If yes, the agent can too. If a human would be confused, the agent will be confused.

Keep each agent to **one job**. An agent that does one thing well is easier to test and safer to trust than one that tries to do everything.

## Tools: the apps it may use

**Tools** are the apps the agent is allowed to open: WhatsApp, Gmail, Google Sheets, your calendar, a web search.

There are two kinds of tool access, and the difference matters:

- **Read access** lets the agent look. For example, it can read your price list. Reading is low risk.
- **Write access** lets the agent change something or send something. For example, it can send an email or add a row to a sheet. Writing needs care.

> **New word: access.** Permission to use an app. You give access by signing in once and connecting the app, a bit like handing someone a key. You can take it back at any time.

Give each agent only the tools its one job needs. A customer reply assistant needs WhatsApp and your price list. It does not need your bank account or your personal email.

## Memory: what it knows

**Memory** is everything the agent knows when it starts a task. There are three kinds:

1. **Instructions.** The job description from the Role section.
2. **Facts about your work.** Prices, opening hours, delivery areas, client names, your usual way of signing emails. You usually keep these in a document or a Google Sheet that the agent reads.
3. **Recent history.** The last few messages in this conversation, so it does not ask the same question twice.

An agent only knows what you give it. If your price list is out of date, its answers will be out of date. If you never told it your Sunday hours, it will not know them.

> **Stay safe:** Never put passwords, bank PINs or card numbers in an agent's memory. It does not need them, and anything in memory could appear in a reply.

## Trigger: what makes it start

A **trigger** is the event that wakes the agent up. Nothing happens until the trigger fires.

The four triggers you will use in this course:

| Trigger | What it means | Example from this course |
| --- | --- | --- |
| A new message | Someone writes to you | A customer asks a question on WhatsApp |
| A time | A set time of day or week | Your daily brief arrives at 7am |
| A new entry | A new row, form or email appears | A new lead fills in your enquiry form |
| You ask | You send it a request | You paste meeting notes and ask for a follow-up email |

Every agent has **one** trigger. When you plan an agent, finish this sentence: "It starts when…"

## Approval: your yes before it acts

**Approval** means the agent prepares the work and then waits for you. You read it, and you choose **Approve**, **Edit** or **Reject**. Only after your approval does anything get sent or changed.

This is the most important part of the course. **Every assistant you build here starts with approval switched on.**

Why?

- AI can sound confident and still be wrong.
- A wrong price or a rude reply sent to a customer cannot be unsent.
- Checking a ready-made draft takes seconds. Writing it yourself takes minutes. You still save most of the time.

Later, once an assistant has been right many times in a row, you may decide some small, low-risk actions do not need your approval. The next lesson shows you how to decide that safely.

## See it all together

Here is one real job from the Small business track, from the moment a customer writes to the moment they get an answer. Watch for all five parts.

![How the five parts work together: a WhatsApp message triggers the agent, it reads its role and memory, checks a price sheet, writes a draft, waits for the owner's approval, and only then sends the reply.](/lessons/shared/agent-foundations/agent-flow.png "From trigger to reply. Nothing reaches the customer until the owner taps Approve.")

The same five parts work for professionals. Here are both examples side by side:

| Part | Small business: customer replies | Professional: inbox triage |
| --- | --- | --- |
| Role | Answer customer questions for Sunrise Bakery, friendly and short | Sort Priya's work email by urgency and draft short replies |
| Tools | WhatsApp, price list in Google Sheets (read only) | Gmail (read and draft), calendar (read only) |
| Memory | Prices, hours, delivery areas, the last 10 messages | Key clients, Priya's signature, how she likes replies written |
| Trigger | A new WhatsApp message arrives | Every weekday at 7am |
| Approval | Amaka approves each reply before it is sent | Priya approves each draft before it is sent |

## Your turn: fill in your agent card

Now plan your own first assistant. Pick one small, boring job that you do at least three times a week.

1. Tap **Copy** on the card below.
2. Paste it into a note on your phone, a document or a piece of paper.
3. Replace every line in square brackets with your own words. Keep each answer to one or two sentences.

```text
MY AGENT CARD

Name of my assistant: [for example, "Customer reply assistant"]

ROLE (its one job)
Who it works for: [your business or your name]
Its one job: [what it does, in one sentence]
How it should sound: [for example, friendly, short, formal]
It must never: [one or two things it must not do]

TOOLS (apps it may use)
Read only: [apps it may look at]
Read and write: [apps it may change or send from]

MEMORY (what it needs to know)
[the facts, documents or sheets it should read]

TRIGGER (it starts when...)
[a new message / a time / a new entry / I ask it]

APPROVAL (what I check before it acts)
[what you will read and approve every time]
```

> **You should now see:** a card with all five sections filled in, and no square brackets left. If you are stuck on one section, tap **Back** to see the side-by-side examples again and copy the pattern.

> **If it didn't work:** If your "one job" sentence has the word "and" in it more than once, the job is probably too big. Split it into two agents and pick the easier one first.

Keep this card. You will use it in the next lesson to check your plan is safe, and again when you build.

## Recap and what's next

You now know the five parts of every AI agent:

1. **Role:** its one job, written like a job description.
2. **Tools:** the apps it may use, with only the access it needs.
3. **Memory:** the facts and instructions it reads before each task.
4. **Trigger:** the one event that makes it start.
5. **Approval:** your yes before anything is sent or changed.

**Next lesson:** Safe access, human approval and responsible use. You will check your agent card against a simple safety checklist before you build anything.

Take the quick check below, then mark this lesson complete.
