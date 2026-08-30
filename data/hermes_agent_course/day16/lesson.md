---
day: 16
title: Capstone — Put Your Personal Agent in Production
subtitle: Bring every part together and your agent to 24/7 production with the exact checklist to call it 'done'.
---

# Capstone — Put Your Personal Agent in Production

**Read time: 5 minutes · Task: capstone project**

This is the integration test. Complete it before describing the setup as production-ready.

## Production means

- **Always on** — running on a VPS or service that survives reboots.
- **Reachable** — via Telegram/app you check daily.
- **Remembering** — memory, skills, and context intact.
- **Scheduled** — at least one cron job running without supervision.
- **Secure** — the checklist from Lesson 15 done.

## The capstone build

Assemble what you've made into one living system. A model config:

1. **Host**: Hermes on your VPS, gateway as a system service.
2. **Brain**: model connected, memory populated, `SOUL.md` set.
3. **Surfaces**: Telegram connected and allowlisted; email on a dedicated mailbox.
4. **Skills**: your briefing format saved and tested from another surface.
5. **Automation**: a cron morning briefing delivers to your home chat.
6. **Security**: checklist complete, `.env` locked, checkpoints working.

## The "is it really production?" test

Leave it running for **48 hours**. Then answer honestly:

- Did my morning brief arrive every scheduled day?
- Could I message it from my phone at 9pm and get a useful reply?
- Did it remember who I am and my preferences across those 48 hours?
- Did the agent stay within the access and approval rules I configured?

Four “yes” answers show that the setup passed this course's minimum test. They do not prove enterprise reliability or security.

## Use it or lose it

After the test, keep only the standing tasks that produce work you can verify. Remove schedules that create noise or cost without a useful result.

## 🎯 Task

Complete the capstone build. Run the 48-hour production test. Then write down your **standing weekly tasks** (the things it will do for you every week from now on).

## 📤 Output

A short "production report": your stack, the four test answers, and your standing weekly tasks. Save it — it's your achievement record.

---
**Course standard:** The 48-hour test is the minimum evidence required for the capstone. Keep the record with your submission.
