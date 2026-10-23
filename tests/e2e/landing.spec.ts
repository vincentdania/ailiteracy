import { expect, test } from "@playwright/test";

test("mobile landing page presents both paid tracks without overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pick your track. Put AI to work in your business or practice.");
  await expect(page.getByRole("link", { name: /for business owners/i }).first()).toHaveAttribute("href", "#small-business");
  await expect(page.getByRole("link", { name: /for professionals/i }).first()).toHaveAttribute("href", "#professionals");
  await expect(page.getByRole("link", { name: /enrol now/i })).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByText("Try Day 1 free")).toHaveCount(0);
});

test("each track page has curriculum and a purchase path", async ({ page }) => {
  for (const slug of ["small-business", "professionals"]) {
    await page.goto(`/tracks/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Curriculum", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /enrol now/i }).first()).toHaveAttribute("href", `/checkout?course=${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("retired lesson URL permanently redirects home", async ({ request }) => {
  const response = await request.get("/challenge/tracka-01", { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe("/");
});
