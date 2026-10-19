import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

type Option = { text: string };
type Mission =
  | { key: string; type: "choice"; title: string; options: Option[]; correct: number }
  | { key: string; type: "multi"; title: string; options: Option[]; correct: number[] }
  | { key: string; type: "order"; title: string; items: string[] }
  | { key: string; type: "sort"; title: string; categories: string[]; items: { text: string; category: number }[] };

export function lessonData(day: number) {
  const dir = path.join(process.cwd(), "data", "track_a_course", `day${String(day).padStart(2, "0")}`);
  const activities = JSON.parse(readFileSync(path.join(dir, "activities.json"), "utf8")) as { missions: Mission[]; advanced?: Mission };
  const quiz = JSON.parse(readFileSync(path.join(dir, "quiz.json"), "utf8")) as { q: string; options: string[]; answer: number }[];
  return { activities, quiz };
}

/** Close a celebration dialog if one is open. */
export async function dismissCelebration(page: Page) {
  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible().catch(() => false)) await dialog.getByRole("button", { name: "Close" }).click();
}

export async function solveMission(page: Page, mission: Mission) {
  const card = page.getByRole("region", { name: mission.title, exact: true });
  await card.scrollIntoViewIfNeeded();
  if (mission.type === "choice") {
    await card.getByRole("radio", { name: mission.options[mission.correct]!.text }).click();
  } else if (mission.type === "multi") {
    for (const i of mission.correct) await card.getByRole("checkbox", { name: mission.options[i]!.text }).click();
  } else if (mission.type === "sort") {
    for (const item of mission.items) {
      const group = card.getByRole("group", { name: item.text });
      await group.getByRole("button", { name: mission.categories[item.category]!, exact: true }).click();
    }
  } else {
    // Bubble each step up into its authored position with the accessible move buttons.
    for (let target = 0; target < mission.items.length; target++) {
      const text = mission.items[target]!;
      for (;;) {
        const order = await card.locator("ol li").allInnerTexts();
        const at = order.findIndex((row) => row.includes(text));
        if (at <= target) break;
        await card.getByRole("button", { name: `Move “${text}” up` }).click();
      }
    }
  }
  await card.getByRole("button", { name: /Check (answer|again)/ }).click();
  await expect(card.getByText(/Spot on|Solved\. You worked it out|Correct again/)).toBeVisible();
  await dismissCelebration(page);
}

export async function passQuiz(page: Page, quiz: { q: string; options: string[]; answer: number }[]) {
  const check = page.getByRole("region", { name: "Check your understanding" });
  for (let i = 0; i < quiz.length; i++) {
    const question = check.locator("fieldset").nth(i);
    await question.getByLabel(quiz[i]!.options[quiz[i]!.answer]!, { exact: true }).check();
  }
  await check.getByRole("button", { name: "Check my answers" }).click();
  await expect(check.getByText(/Passed/).first()).toBeVisible();
  await dismissCelebration(page);
}
