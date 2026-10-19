import { expect, test } from "@playwright/test";
import { lessonData, passQuiz, solveMission } from "./helpers/missions";

test("learner gets feedback on a wrong mission answer, then masters Day 1", async ({ page }) => {
  test.skip(process.env.E2E_FULL_FLOW !== "1", "Requires the Docker application stack with free enrolment in mock integration mode");
  test.setTimeout(180_000);
  const email = `e2e-journey-${Date.now()}@example.test`;
  const password = "E2eJourney123!";

  await page.goto("/signup");
  await page.getByLabel("Full name").fill("E2E Journey");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page.getByText("Account created. You can sign in now.")).toBeVisible();
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Tell us about your work." })).toBeVisible();
  await page.getByLabel("What is your current profession?").selectOption({ label: "Civil Servant / Public Officer" });
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByLabel("What should AI help you achieve?").fill("Write reports and letters faster while keeping them accurate.");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByText("Explorer", { exact: true }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: "Build my learning plan" }).click();
  await expect(page).toHaveURL(/\/(checkout|dashboard)$/);
  if (page.url().endsWith("/checkout")) await page.getByRole("button", { name: "Activate free access" }).click();

  await page.getByRole("link", { name: /Continue learning/ }).first().click();
  await expect(page).toHaveURL(/\/challenge\//);
  await expect(page.getByText("Almost there")).toBeVisible();

  const { activities, quiz } = lessonData(1);
  const first = activities.missions[0]!;
  if (first.type !== "choice") throw new Error("Day 1 should open with a choice mission");
  const card = page.getByRole("region", { name: first.title, exact: true });
  const wrong = first.options.findIndex((_, i) => i !== first.correct);
  await card.getByRole("radio", { name: first.options[wrong]!.text }).click();
  await card.getByRole("button", { name: "Check answer" }).click();
  await expect(card.getByText("Not quite. Read the feedback and try again.")).toBeVisible();
  await expect(card.getByText(/Hint:/)).toBeVisible();

  for (const mission of activities.missions) await solveMission(page, mission);
  await passQuiz(page, quiz);
  await page.getByRole("button", { name: /Complete/ }).last().click();
  await expect(page.getByText("Lesson complete").first()).toBeVisible();
});
