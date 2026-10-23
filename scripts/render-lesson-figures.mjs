// Renders every lesson figure in content/figures/**/<name>.html to public/lessons/**/<name>.png.
// Each figure is the page's .fig element, captured at 2x for sharp text on phones.
// Usage: node scripts/render-lesson-figures.mjs [path filter]
import { readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "content", "figures");
const target = path.join(root, "public", "lessons");
const filter = process.argv[2] ?? "";

const figures = readdirSync(source, { recursive: true })
  .filter((file) => file.endsWith(".html") && file.includes(filter));

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 800, height: 800 } });
for (const file of figures) {
  await page.goto(pathToFileURL(path.join(source, file)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const output = path.join(target, file.replace(/\.html$/, ".png"));
  mkdirSync(path.dirname(output), { recursive: true });
  await page.locator(".fig").screenshot({ path: output });
  console.info(`Rendered ${path.relative(root, output)}`);
}
await browser.close();
