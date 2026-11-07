---
summary: Analyse campaign performance, calculate the core acquisition metrics correctly, and make recommendations you can defend without overstating what caused the results.
quiz:
  - question: An ad cost ₦30,000 and brought 10 quote requests, of which 3 became orders worth ₦135,000 in total. What was the cost per order?
    options:
      - ₦3,000
      - ₦10,000
      - ₦13,500
      - ₦45,000
    answer: 1
    explanation: Cost per order = spend ÷ orders = ₦30,000 ÷ 3 = ₦10,000. Cost per quote request would be ₦3,000.
  - question: Orders rose in February, the month the campaign ran. February also had more public holidays and a new office opened nearby. What can you say?
    options:
      - The campaign caused the increase
      - Orders rose during the campaign; other factors may have contributed, so we can't say how much was due to the campaign
      - The campaign had no effect
      - The new office caused it
    answer: 1
    explanation: A rise during a campaign is an association. Name the other possible causes and avoid claiming the campaign alone caused it.
  - question: 'What makes a recommendation "defensible"?'
    options:
      - It sounds confident
      - It follows from the data, says how sure you are, and proposes a way to test it
      - The AI suggested it
      - It uses a lot of charts
    answer: 1
    explanation: A defensible recommendation links clearly to evidence, is honest about uncertainty, and can be checked.
---

**Week 6 · About 15 to 20 hours · Competency 5: Measurement**

The campaign has data now. This week you'll turn it into an honest picture of what happened, what probably drove it, and what to do next.

## What you'll be able to do

- Calculate conversion rates, cost per lead, cost per acquisition and return on ad spend
- Build a simple measurement dashboard in Google Sheets
- Tell apart what the data shows, what it suggests, and what it can't show
- Write recommendations with their evidence, confidence and next test

## Key ideas

**Core metrics.**

| Metric | Formula |
| --- | --- |
| Click-through rate (CTR) | Clicks ÷ impressions |
| Conversion rate | Conversions ÷ clicks (or ÷ visitors) |
| Cost per lead (CPL) | Spend ÷ leads |
| Cost per acquisition (CPA) | Spend ÷ paying customers |
| Return on ad spend (ROAS) | Revenue from the ads ÷ ad spend |

ROAS uses revenue, not profit. A ROAS of 4 on a product with a thin margin may still lose money. Ask the owner about margins before calling a campaign profitable.

**Attribution.** Deciding which touchpoint gets credit for a sale. Customers often see a post, hear from a colleague and then search on Google. Platforms usually take credit for any sale they touched. Treat platform-reported conversions as one view, and compare them with the business's own order records.

**Association is not causation.** Results that rise during a campaign might be due to the campaign, the season, a competitor closing or chance. Say what you can see, name other explanations, and suggest a test that would separate them.

**Small numbers.** With 10 leads, one extra lead changes the rate a lot. Report counts alongside percentages.

## Worked example

```
FEBRUARY RESULTS: Zuma Bakes office trays (sources: Ads Manager, WhatsApp labels, order book)

                      Instagram ads   Google Maps   LinkedIn   Referral   Total
Quote requests              10             6            3          4        23
Orders                       3             3            1          3        10
Order value (₦)          135,000       150,000       45,000    165,000   495,000
Spend (₦)                 30,000             0            0          0     30,000
Cost per order (₦)        10,000             –            –          –         –
ROAS (ads only)             4.5              –            –          –         –

WHAT IT SHOWS
- 23 quote requests against an objective of 12; 10 orders against about 2 a month before.
- Ads produced the most quote requests but converted at 30%; referrals converted at 75%.

WHAT IT MIGHT MEAN (not proven)
- The visible prices and invoice line may have helped every channel, not just ads.
- Maps results may reflect the new profile, or more searches in a busy month.

WHAT WE CAN'T SAY
- How many orders would have come without the campaign. No comparison period with
  the same season, and numbers are small.

RECOMMENDATIONS
1. Keep the Google Business Profile updated weekly (strong signal, no cost). Confidence: medium.
2. Continue ads at ₦30,000 for one more month to check the result holds. Confidence: low.
3. Ask each repeat office customer for a referral to another department. Test: count referrals in March.
```

## Use AI well this week

AI can help check calculations and suggest alternative explanations. It must not be the source of your numbers.

```
Here are my campaign results (no personal data). Check my calculations for
CTR, conversion rate, CPL, CPA and ROAS. Then list other explanations for the
increase in orders that I should mention, and a low-cost test for each.
```

Recalculate anything the AI says is wrong, yourself, in your spreadsheet.

> **Stay safe:** Never present a platform's "estimated" results as confirmed sales. Never change or drop data to make a result look better.

## Guided practice

> **Try it:** Build a one-tab dashboard in Google Sheets for your partner campaign: inputs from each source, calculated metrics with formulas visible, and a short "shows / might mean / can't say" box.

## Your evidence this week

Hand in, as described in the week 6 evidence brief:

1. A **measurement dashboard** with sources and working formulas
2. A **performance analysis** in the "shows / might mean / can't say" format
3. **Recommendations**, each with evidence, confidence and a next test

What the assessor looks for: correct calculations, results reconciled across sources, no overstated attribution, and recommendations that follow from the evidence.

## Before you hand in

- [ ] I've checked every calculation in the spreadsheet itself
- [ ] Platform figures and the business's own records are compared
- [ ] Counts are shown beside percentages
- [ ] I've named other explanations and haven't claimed causation
- [ ] Each recommendation has a confidence level and a test
