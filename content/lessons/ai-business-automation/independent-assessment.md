---
summary: How the week 8 independent assessment works, including the live demonstration and simulated failure, a practice brief to rehearse with, and how to assemble your graduate portfolio.
quiz:
  - question: During the live demonstration, the assessor disables a connection. What are they testing?
    options:
      - Whether you can work fast
      - Whether your workflow fails safely and you can diagnose and recover
      - Whether the tool is reliable
      - Nothing; it's an accident
    answer: 1
    explanation: The assessment includes a deliberate simulated failure. You show safe failure behaviour, diagnosis and recovery.
  - question: Your workflow scores 88% but sends a customer message without human approval. What is the likely result?
    options:
      - Competent
      - Not yet competent, because authorization and safety are mandatory
      - Competent with a deduction
      - The assessor ignores it
    answer: 1
    explanation: Uncontrolled external messaging fails a mandatory requirement regardless of the overall score.
  - question: What should your portfolio's time study include?
    options:
      - Only the best week
      - Measured before and after times, review and fixing time, and running costs
      - An estimate from the AI
      - The build time
    answer: 1
    explanation: An honest time study shows the full picture, including the work and costs the automation adds.
---

**Week 8 · Independent competence assessment**

This week you show, on your own, that you can do the work. An independent assessor gives you a workflow brief you haven't seen, watches you demonstrate it, breaks something on purpose, and asks you to explain your controls.

## How the assessment works

1. **The unseen brief.** An unfamiliar business process to automate, with test data.
2. **Your build.** In the time given (usually one working day), you produce:
   - a short **design**: to-be workflow, data dictionary and integration plan
   - a **working automation** on test data, with logs and a human review gate
   - a **test log** covering success and failure scenarios
3. **The live demonstration and defence.** About 45 minutes. You run the workflow, the assessor **simulates a failure** (for example, revoking a credential or feeding bad data) and you diagnose and recover. Then you explain the controls, data flow, permissions and how you'd hand it over.

You may use your notes, past workflows and an approved AI assistant. Log your AI use.

## How you're judged

| Dimension | Weight |
| --- | --- |
| Technical accuracy and completeness | 30% |
| Problem diagnosis and professional reasoning | 20% |
| Quality, usefulness and clarity of deliverable | 20% |
| Reproducibility, testing or measurement | 15% |
| Ethical practice, privacy and professional conduct | 10% |
| Oral defence and reflective improvement | 5% |

To be judged competent: **80% overall** and a pass on every mandatory requirement: no external messages or payments without human approval; no data corruption; least access; no personal data sent to unapproved services; credentials never exposed.

> **If it didn't work:** If you're judged "not yet competent", you get written feedback on the specific gaps, a short remediation plan and a reassessment date.

## Practice brief

Rehearse with this case under timed conditions. It's fictional.

> **GreenLeaf Pharmacy Supplies** distributes non-prescription health products to 30 small shops around Abuja. Shops order by phone; a sales officer writes the order into a Google Sheet. Each Friday the operations lead spends about 2 hours compiling a "low stock and pending deliveries" report for the owner, and drivers often aren't told about new deliveries until the morning. Build: (1) a workflow that notifies the driver group of new confirmed deliveries, with a daily 5pm summary for the operations lead; (2) a Friday report draft for the owner. Test data: 40 orders, including duplicates, missing dates and one row with text in the quantity column.

Ask a fellow learner or your mentor to break one thing during your demonstration.

## Prepare for the defence

Practise answering each of these in under two minutes:

- Walk me through the data flow. Where could data be corrupted, and how do you prevent it?
- What access does each credential have? Why not less?
- Show me where a person approves. What happens if they don't respond?
- I've just broken something. How do you find out what, and recover?
- How would you measure whether this saves time, honestly?
- How would the business switch this off if you weren't there?

## Assemble your graduate portfolio

| Item | From |
| --- | --- |
| As-is and to-be process maps | Weeks 1 and 2 |
| Working automation (exported, no credentials) | Weeks 5 and 7 |
| Test log | Week 6 |
| Risk assessment | Week 6 |
| Instructions (handover notes) | Week 7 |
| Before and after time study | Weeks 5 and 7 |

Before you share it anywhere, remove credentials, chat IDs, phone numbers and any real records; use a code name for the partner unless they've agreed in writing; and get permission before publishing any work sample.

> **Stay safe:** Describe your certificate as "demonstrated foundational competence, independently assessed". Don't claim to be a software engineer or certified in any vendor's product unless you are.

## After the pathway

Good next steps include workflow architecture, system integration, process improvement, software engineering and AI operations. Keep your competence record going with each new piece of supervised real work.

## Before the assessment

- [ ] I've done the practice brief under time pressure, including a simulated failure
- [ ] I can explain every permission my workflows use
- [ ] My portfolio items are final and contain no credentials or personal data
- [ ] My competence record and AI-use log are up to date
