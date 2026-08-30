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
    !evidence && "Add how you checked important claims, calculations or sources.",
    !humanJudgment && "Explain one decision or improvement that came from you, not the tool.",
    !outcome && "Name the result this artefact should improve and how you will measure it.",
    !safeguards && "Identify one privacy, bias or failure risk and how you will handle it.",
    !specificity && `Add a little more working detail${isCapstone ? " to make the capstone auditable" : ""}.`,
  ].filter(Boolean);
  return {
    score,
    feedback: {
      summary: score >= 80 ? "Strong evidence of applied learning." : score >= 70 ? "A useful submission with one clear improvement to make." : isCapstone ? "This capstone does not yet show enough evidence to pass. Address the points below and resubmit." : "The foundation is here; strengthen the evidence before treating it as complete.",
      nextSteps,
      rubric: { evidence, humanJudgment, outcome, safeguards, specificity },
      source: "curated-rubric-v2",
    },
  };
}
