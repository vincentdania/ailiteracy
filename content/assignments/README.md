# Weekly assignments

Each track runs as a 9-week term. Weeks 1 to 8 each have two assignments, a **build** and an **apply**. Week 9 is the portfolio project. There is no grading: an assignment counts when it's submitted on time with every part filled in.

```
content/assignments/<track>/week-<n>.md   # weeks 1 to 8
content/assignments/<track>/portfolio.md  # week 9
```

## File format

The frontmatter names the track, the week and the lessons it follows. The body has one `##` section per assignment:

```markdown
## Build assignment: <title>

A few sentences on what to do.

### What to submit

1. **<Box label>.** What goes in this box.
2. **<Box label>.** ...
```

Every numbered item under **What to submit** becomes its own box on the submission form, labelled with the bold words and the rest as the hint. The site's checks use these: every box must be filled in before the deadline, and a scan blocks anything that looks like an API key, a bot token or a phone number.

Apply assignments have a single box, 250 to 400 words.

## Competence pathways

The four competence pathways (`ai-business-growth`, `ai-business-automation`, `ai-meal-data-analysis`, `ai-project-delivery`) use the same folder layout and `### What to submit` format, with these differences from the handbook they follow (see `docs/pathways/README.md`):

```
content/assignments/<pathway>/baseline.md    # week 0: diagnostic baseline, not scored
content/assignments/<pathway>/week-<n>.md    # weeks 1 to 7: evidence + revision; week 8: independent assessment
content/assignments/<pathway>/portfolio.md   # graduate portfolio, submitted in week 8
```

- Frontmatter uses `pathway:` instead of `track:`, and weekly briefs add `evidence:`, the handbook's required practical evidence for that week.
- Each week has an **Evidence** section and a **Revision** section (after written mentor feedback) instead of build and apply.
- Pathway work **is** assessed: mentors score weekly evidence against the rubric, and an independent assessor makes the week 8 decision (80% overall plus mandatory passes). The no-grading rule above applies only to the two self-paced tracks.
