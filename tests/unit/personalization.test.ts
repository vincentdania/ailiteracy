import { describe, expect, it } from "vitest";
import { chooseTrack, TRACKS } from "@/lib/personalization/tracks";
import { getCaseStudy } from "@/lib/personalization/case-studies";

describe("personalized learning tracks", () => {
  it("routes concrete outcomes to the most relevant track", () => {
    expect(chooseTrack({ profession: "Founder", industry: "Retail", primaryGoal: "Test a startup product idea with customers" })).toBe("ENTREPRENEURSHIP");
    expect(chooseTrack({ profession: "Finance analyst", industry: "Banking", primaryGoal: "Analyse data and create a better decision memo" })).toBe("DATA_DECISIONS");
    expect(chooseTrack({ profession: "Teacher", industry: "Education", primaryGoal: "Help students learn research skills" })).toBe("EDUCATION_RESEARCH");
  });

  it("gives every track milestones, tools and sourced case studies", () => {
    for (const track of Object.values(TRACKS)) {
      expect(track.milestones).toHaveLength(3);
      expect(track.tools.length).toBeGreaterThan(0);
      expect(track.caseStudies.every((slug) => Boolean(getCaseStudy(slug)?.sourceUrl))).toBe(true);
    }
  });
});
