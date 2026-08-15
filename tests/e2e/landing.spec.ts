import { expect, test } from "@playwright/test";

test("landing page exposes the course and primary conversion path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("use AI");
  await expect(page.getByRole("link", { name: /Build my learning plan/i })).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});
