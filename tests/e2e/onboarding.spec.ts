import { expect, test } from "@playwright/test";

test("new learner completes onboarding and reaches checkout without a redirect loop", async ({ page }) => {
  test.skip(process.env.E2E_FULL_FLOW !== "1", "Requires the Docker application stack in mock integration mode");
  const email = process.env.E2E_NEW_USER_EMAIL ?? `e2e-${Date.now()}@example.test`;
  const password = process.env.E2E_NEW_USER_PASSWORD ?? "E2eProduction123!";

  await page.goto("/signup");
  await page.getByLabel("Full name").fill("E2E Learner");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page.getByText("Account created. You can sign in now.")).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);

  await page.getByLabel("What is your current profession?").fill("Product manager");
  await page.getByLabel(/Industry/).fill("Technology");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByLabel("What should AI help you achieve?").fill("Create reliable product research workflows with clear quality checks.");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByText("Explorer", { exact: true }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: "Build my learning plan" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole("heading", { name: "Choose your checkout." })).toBeVisible();

  await page.getByRole("button", { name: "Pay in NGN" }).click();
  await expect(page).toHaveURL(/\/dashboard\?checkout=success$/);
  await expect(page.getByRole("heading", { name: /Welcome back, E2E/ })).toBeVisible();
  await expect(page.getByText("Your personalized certificate path")).toBeVisible();
});
