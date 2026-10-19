export function assessSubmission(content: string, isCapstone: boolean) {
  const lower = content.toLowerCase();
  const evidence = /check|verif|source|evidence|test/.test(lower);
  const humanJudgment = /i changed|i chose|my decision|human|review/.test(lower);
  const outcome = /result|outcome|improv|save|measure|impact/.test(lower);
  const safeguards = /privacy|consent|bias|risk|confidential|safe/.test(lower);
  const specificity = content.trim().split(/\s+/).length >= (isCapstone ? 140 : 45);
  const checks = [evidence, humanJudgment, outcome, safeguards, specificity];
  const score = isCapstone ? checks.filter(Boolean).length * 20 : 50 + checks.filter(Boolean).length * 10;
  const nextSteps = [
    !evidence && "Say how you checked the important facts, figures or sources.",
    !humanJudgment && "Describe one decision or change you made yourself, rather than the AI tool.",
    !outcome && "Name the result this work should improve and how you will measure it.",
    !safeguards && "Name one risk (privacy, bias or errors) and how you will handle it.",
    !specificity && `Add more detail: write at least ${isCapstone ? 140 : 45} words.`,
  ].filter(Boolean);
  return {
    score,
    feedback: {
      summary: score >= 80 ? "Strong work. It clearly shows how you applied the lesson." : score >= 70 ? "Passed. The points below would make it stronger." : isCapstone ? "Not passed yet. The capstone needs 70 or more. Add the points below and submit it again." : "Not passed yet. Add the points below and submit it again to reach 70.",
      nextSteps,
      rubric: { evidence, humanJudgment, outcome, safeguards, specificity },
      source: "curated-rubric-v2",
    },
  };
}
