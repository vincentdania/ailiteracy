import { expect, test } from "@playwright/test";

test("landing page exposes the course and primary conversion path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Build a personal AI agent");
  await expect(page.getByRole("link", { name: /Start learning/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Read Lesson 1 free/i })).toBeVisible();
  await expect(page.getByText(/48-hour test/).first()).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});
