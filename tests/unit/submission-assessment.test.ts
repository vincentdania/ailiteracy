import { describe, expect, it } from "vitest";
import { assessSubmission } from "@/lib/submission-assessment";

describe("submission assessment", () => {
  it("does not pass a thin capstone that only mentions two rubric terms", () => {
    const result = assessSubmission("I checked the source and reviewed the result. ".repeat(8), true);
    expect(result.score).toBeLessThan(70);
  });

  it("passes a detailed capstone with evidence, judgement, outcomes and safeguards", () => {
    const content = `${"This production test ran for 48 hours and I verified each scheduled result against the source record. ".repeat(8)} I changed the briefing format after my review. I measured the outcome and documented the improvement. I kept confidential data out of the workflow and recorded the privacy risk.`;
    const result = assessSubmission(content, true);
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.feedback.rubric).toEqual({ evidence: true, humanJudgment: true, outcome: true, safeguards: true, specificity: true });
  });
});
