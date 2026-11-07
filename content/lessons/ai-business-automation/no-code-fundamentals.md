---
summary: Build your first working trigger-action workflow in n8n or Make, with an audit log that records every run, and learn to read executions when something goes wrong.
quiz:
  - question: Your workflow adds an order row every time a form is submitted. A customer submits twice by mistake. What design stops a duplicate?
    options:
      - Nothing can stop it
      - Check whether a matching record already exists before adding, and log the skip
      - Delete duplicates by hand every week
      - Turn the form off
    answer: 1
    explanation: Checking for an existing record before writing makes the step safe to repeat. This is called idempotency.
  - question: What should an audit log row contain?
    options:
      - Only errors
      - When it ran, what triggered it, which record it touched, what it did and whether it succeeded
      - The full customer conversation
      - Nothing; the tool keeps history anyway
    answer: 1
    explanation: Your own log shows what each run did to your data, in a place the business controls, even after tool history expires.
  - question: Where should you build and test a new workflow first?
    options:
      - On the live Orders sheet
      - On a copy of the sheet with test records
      - On the owner's phone
      - Directly in production at a quiet time
    answer: 1
    explanation: Build against test copies so a mistake can't damage real data.
---

**Week 3 · About 15 to 20 hours · Competencies 2 and 3: Connect safely and control**

This week you build. You'll create a working trigger-action workflow in n8n (or Make), connect it to Google Sheets, and add an audit log so every run leaves a trace.

## What you'll be able to do

- Build a workflow with a trigger, data steps and actions
- Map fields between apps correctly, using your data dictionary
- Make steps safe to repeat, so retries don't create duplicates
- Write an audit log row for every run, and read the tool's execution history

## Key ideas

**Trigger, steps, action.** Every workflow starts with a trigger (a form submission, a schedule, a webhook), passes data through steps (filter, look up, transform) and ends with actions (add a row, send a message to a staff channel).

**Field mapping.** Telling the tool which piece of incoming data goes into which column. Follow your data dictionary exactly: right format, right type.

**Idempotency.** A step is idempotent if running it twice has the same effect as running it once. Before adding a record, look for one with the same ID or key. Retries and double submissions then can't create duplicates.

> **New word: webhook.** A web address that starts a workflow when another app sends data to it. Like a doorbell for your automation.

**Audit log.** A separate sheet where the workflow writes one row per run. Tool execution history is useful, but it may expire, and the business may not have access to it. Your log stays.

**Test copies.** Build against a copy of each sheet filled with made-up test records. Switch to the real sheets only after testing (week 6).

## Worked example

The first Kubwa Print Hub workflow: a front-desk Google Form creates an order row.

```
WORKFLOW: New order → Orders sheet   (n8n, test copies)

1. Trigger: Google Sheets "Row added" on the Form Responses (TEST) sheet
2. Set: build order_id = "ORD-" + yyyy + "-" + 4-digit sequence
        received_date = formatted yyyy-MM-dd
3. Lookup: Orders (TEST) where form_response_id = this response's ID
4. IF found → step 6 (skip, log "duplicate ignored")
5. Append: Orders (TEST) with mapped fields; status = "new"
6. Append: Log (TEST): run_time, trigger="form", order_id, action, result

LOG SHEET COLUMNS
run_time | workflow | trigger | record_id | action | result | note
```

> **You should now see:** a new order row with an ID and status "new", and a matching row in the Log sheet. Submit the same response again: the Log shows "duplicate ignored" and no second order appears.

## Reading executions

When a run fails, open the tool's execution history:

1. Find the failed run and the step marked red.
2. Read the input that step received and the error message.
3. Ask: is the data wrong (fix the source or mapping), or is the step wrong (fix the workflow)?
4. Fix, re-run with the same test data, and note the fix in your build notes.

## Use AI well this week

AI can explain error messages and suggest expressions, but it can't see your data. Give it the error and the shape of the data, not the data itself.

```
In n8n, my Google Sheets Append step fails with this error: [paste error].
The incoming item has fields: order_id (text), received_date (text yyyy-MM-dd),
total_ngn (number). The sheet columns are [list]. What are the likely causes,
and how do I check each one?
```

> **Stay safe:** Never paste API keys, passwords or real records into an AI chat. Store credentials only in the automation tool's credential manager.

## Guided practice

> **Try it:** Build the new-order workflow above against test copies of your own sheets, with at least ten made-up records. Then add a second workflow: when a staff member submits a status form, update that order's status by `order_id` and log it.

## Your evidence this week

Hand in, as described in the week 3 evidence brief:

1. A **working trigger-action workflow**, exported (with credentials removed) and described step by step
2. Your **audit log** showing successful runs, a skipped duplicate and at least one fixed failure
3. **Build notes**: field mappings, how duplicates are prevented, and what you fixed

What the assessor looks for: correct mapping to the data dictionary, safe repeats, a useful log and evidence you can diagnose failures.

## Before you hand in

- [ ] The workflow runs on test copies, not live data
- [ ] Every field matches the data dictionary's format
- [ ] Re-running a trigger doesn't create duplicates
- [ ] Every run writes a log row
- [ ] The export contains no credentials or real personal data
