---
day: 3
title: The Documents of Your Job
subtitle: Produce your job's most common document in the correct format, and turn one old example into a template you can reuse.
---

# The Documents of Your Job

**Read time: 6 minutes · Task: 20 minutes**

Every job has three to five documents it produces again and again. These are not unusual documents. They are the ones you have written dozens of times and will write dozens more. Today you get AI to produce yours, in the correct format, in minutes.

## Name your repeating documents

- **Civil servants:** memos and official correspondence in civil-service format, minutes, submissions.
- **Teachers:** lesson plans, schemes of work, exam questions and marking guides.
- **SME owners:** price lists, customer agreements, quotes and receipts.
- **NGO staff:** concept-note sections, activity reports, field-visit summaries.
- **Bankers and admin staff:** formal emails, internal memos, briefing notes.
- **Jobseekers:** CV updates and cover letters.

Pick the one you write most often. That is today's target.

## The mistake to avoid

Do not ask AI to "write a memo". It will give you a generic memo based on what it has seen online: American in structure, with the wrong headings and the wrong tone. Your office has its own way of doing things: its own heading block, its own routing line, its own phrases.

**The fix: paste one real old example of the document (one you wrote and someone accepted) and tell the AI to follow that exact structure for the new content.** The old document carries the format, the vocabulary and the house style, so the AI does not have to guess.

## The format-following prompt

```
ROLE: You are an experienced [your role] in a Nigerian [ministry/school/
business/organisation].

CONTEXT: I need to draft a new [document type]. Below is an OLD example
of the same document type from my workplace, which was accepted as
correct. New content for the draft is also below.

TASK: Follow the old example's exact structure (same headings, same
order, same style of numbering), but use only the new content. Do not
copy information from the old example. Do not invent anything.

OLD EXAMPLE:
[paste it]

NEW CONTENT:
[paste your notes]
```

Replace everything in square brackets before you send it.

## The template-extraction prompt

This prompt turns any good old document into a reusable fill-in template:

```
Study the document below and turn it into a reusable template: keep its
exact structure and headings, but replace the specific information with
clearly marked fill-in slots like [DATE], [RECIPIENT], [SUBJECT].
Add one line under each slot saying what goes there. Output the template
only.

DOCUMENT:
[paste your good old document]
```

You should get back the same document with every name, date and figure replaced by a slot in capital letters. Copy the template into your phone's notes app and save it. From now on, every document of that type can start from your own office's real format instead of a generic one.

## An illustrative story

*(Composite and illustrative, not a real named person.)* Mr Adeyemi, an admin officer in a state ministry, used to spend a full morning on each memo: hunting for an old example, retyping the heading block, getting the routing line right. When he tried the prompts above, he pasted in one old memo, got back a template with slots, and drafted his next memo in minutes. The format was right because it was his office's own.

## Tone control

The same content can be written in three registers, and each has its place in Nigerian workplaces:

- **Official:** for permanent secretaries, regulators and formal correspondence. Full phrases, no contractions. "I wish to respectfully submit…"
- **Concise:** for busy colleagues and internal notes. Short sentences, bullet points, the ask up front.
- **Warm:** for customers, community members and parents. Greetings, friendly phrasing, "we appreciate…"

To switch, add one line to the end of any prompt, or send it as a follow-up message: "Rewrite this in a more official tone, keeping the structure." Swap "official" for "concise" or "warm" as needed.

## 🎯 Task

1. Choose the ONE document you write most often.
2. Find one good old example: one that was accepted without corrections. Remove names, phone numbers and confidential figures first (see the privacy note below).
3. Run the template-extraction prompt on it. Copy the template the AI returns into your phone's notes app and save it.
4. Pick a real document you owe someone this week. Fill in the format-following prompt: paste your old example under OLD EXAMPLE and your notes for the new document under NEW CONTENT. Send it.
5. Check the draft for wrong or invented details, then use the tone line to match the reader, for example: "Rewrite this in a more official tone, keeping the structure."
6. Copy the finished document into your notes or a document on your phone, ready to send.

## 📤 Output

A saved template in your notes and one finished, ready-to-send document. Keep both for your Playbook (Day 7). The template is the most reusable thing you will build this week.

---
**Privacy note:** use an old example only if you are allowed to share it outside your organisation, and remove identifying details and confidential information first. The Day 2 privacy rules apply every day.
