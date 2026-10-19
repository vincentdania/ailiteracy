// Regenerates the site's raster assets in the Hyrax brand: app icons, the social
// preview image and every lesson cover. Run with `pnpm brand:assets`.
// Uses Playwright's Chromium and the self-hosted brand fonts, so output is identical on any machine.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const read = (file) => readFile(path.join(root, file));
const NAVY = "#214889";
const DEEP = "#10294f";
const INK = "#0b1c30";
const ACCENT = "#0058be";
const SKY = "#bcd6ff";

const font = async (file) => `data:font/woff2;base64,${(await read(file)).toString("base64")}`;
const inter = await font("src/fonts/inter-latin-wght.woff2");
const grotesk = await font("src/fonts/space-grotesk-latin-wght.woff2");
const svgInner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const markSvg = (await read("public/brand/hyrax-mark.svg")).toString();
const MARK_PATH = /<path[^>]*\sd="([^"]+)"/.exec(markSvg)[1];
const MARK_VIEWBOX = /viewBox="([^"]+)"/.exec(markSvg)[1];
const wordmarkWhite = svgInner((await read("public/brand/hyrax-logo-white.svg")).toString());
const wordmarkNavy = wordmarkWhite.replaceAll('fill="#fff"', `fill="${NAVY}"`);
const WORDMARK_VIEWBOX = "0 0 178.721 43.026";

const mark = (fill, style = "") => `<svg viewBox="${MARK_VIEWBOX}" style="${style}"><path d="${MARK_PATH}" fill="${fill}"/></svg>`;
const wordmark = (inner, height) => `<svg viewBox="${WORDMARK_VIEWBOX}" style="height:${height}px;width:auto">${inner}</svg>`;
const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const page = (body, width, height) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(${inter}) format("woff2");font-weight:100 900}
@font-face{font-family:"Space Grotesk";src:url(${grotesk}) format("woff2");font-weight:300 700}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.display{font-family:"Space Grotesk",sans-serif;font-weight:700;letter-spacing:-.02em}
.eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.16em}
</style></head><body>${body}</body></html>`;

// App icon: the Hyrax mark in white on brand navy. Maskable icons keep the mark inside the 80% safe zone.
const icon = (size, { maskable = false } = {}) => page(`<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:${NAVY};border-radius:${maskable ? 0 : size * 0.22}px">${mark("#fff", `width:${size * (maskable ? 0.46 : 0.6)}px;height:auto`)}</div>`, size, size);

const og = () => page(`<div style="width:1200px;height:630px;display:flex;background:#f6f8fb;color:${INK}">
  <div style="flex:1;display:flex;flex-direction:column;padding:72px 0 64px 80px">
    <div style="display:flex;align-items:center;gap:22px">${wordmark(wordmarkNavy, 52)}<span style="height:46px;width:3px;background:${NAVY}"></span><span class="display" style="font-size:34px;color:${INK}">AI Academy</span></div>
    <h1 class="display" style="margin-top:70px;font-size:58px;line-height:1.02;color:${DEEP}">Expand your capabilities.<br>Make AI work for you.</h1>
    <p style="margin-top:28px;font-size:28px;line-height:1.4;color:#4d5768;max-width:600px">Practical, mobile-first AI skills for work, with Nigerian examples throughout.</p>
    <div style="margin-top:auto;display:flex;gap:14px">${["No code", "Free AI tools", "Verified certificates"].map((t) => `<span style="padding:12px 22px;border-radius:999px;background:#eaf2ff;color:${ACCENT};font-size:22px;font-weight:700">${t}</span>`).join("")}</div>
  </div>
  <div style="width:390px;position:relative;overflow:hidden;background:linear-gradient(160deg,${NAVY},${DEEP});display:flex;flex-direction:column;justify-content:flex-end;padding:56px 48px">
    ${mark("#ffffff", "position:absolute;top:70px;left:58px;width:280px;height:auto;opacity:.95")}
    <p class="eyebrow" style="font-size:16px;line-height:1.5;color:${SKY}">HYRAX<br>The AI Enablement Company.</p>
    <p style="margin-top:12px;font-size:28px;font-weight:700;color:#fff">learn.hyrax.ng</p>
  </div>
</div>`, 1200, 630);

// Lesson cover in the brand: navy field, wordmark, course and lesson label, title, summary, faint mark.
const cover = ({ course, label, module, title, summary }, width, height) => {
  const s = width / 1200;
  return page(`<div style="width:${width}px;height:${height}px;position:relative;overflow:hidden;background:linear-gradient(150deg,${NAVY} 0%,${DEEP} 62%,${INK} 100%);color:#fff;display:flex;flex-direction:column;padding:${64 * s}px ${72 * s}px">
    ${mark("#ffffff", `position:absolute;right:${-120 * s}px;bottom:${-150 * s}px;width:${620 * s}px;height:auto;opacity:.07`)}
    <div style="display:flex;align-items:center;gap:${16 * s}px">${wordmark(wordmarkWhite, 34 * s)}<span style="height:${30 * s}px;width:${2 * s}px;background:rgba(255,255,255,.5)"></span><span class="display" style="font-size:${23 * s}px">AI Academy</span></div>
    <p class="eyebrow" style="margin-top:${66 * s}px;font-size:${21 * s}px;color:${SKY}">${escape(course)} · ${escape(label)}</p>
    <h1 class="display" style="margin-top:${18 * s}px;font-size:${(title.length > 48 ? 58 : 68) * s}px;line-height:1.06;max-width:${1000 * s}px">${escape(title)}</h1>
    ${summary ? `<p style="margin-top:${24 * s}px;font-size:${27 * s}px;line-height:1.45;color:#d6e3f7;max-width:${900 * s}px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${escape(summary)}</p>` : ""}
    <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:${24 * s}px">
      <div style="display:flex;align-items:center;gap:${14 * s}px"><span style="width:${56 * s}px;height:${6 * s}px;border-radius:9px;background:${ACCENT}"></span><span style="font-size:${20 * s}px;font-weight:600;color:#d6e3f7">${escape(module ?? "")}</span></div>
      <span class="eyebrow" style="font-size:${15 * s}px;color:rgba(255,255,255,.55)">HYRAX · The AI Enablement Company.</span>
    </div>
  </div>`, width, height);
};

function frontmatter(raw) {
  const block = /^---\n([\s\S]*?)\n---/.exec(raw)?.[1] ?? "";
  const value = (key) => new RegExp(`^${key}:\\s*(.+)$`, "m").exec(block)?.[1]?.trim();
  const heading = /^#\s+(.+)$/m.exec(raw)?.[1]?.trim();
  return { title: value("title") ?? heading ?? "", subtitle: value("subtitle") };
}

async function lessons() {
  const out = [];
  const courses = [
    { dir: "track_a_course", prefix: "tracka-", course: "AI for Your Work", label: (d) => `Day ${d}`, size: [960, 540] },
  ];
  for (const c of courses) {
    let manifest = null;
    try { manifest = JSON.parse(await readFile(path.join(root, "data", c.dir, "manifest.json"), "utf8")); } catch { /* no modules */ }
    const days = (await readdir(path.join(root, "data", c.dir))).filter((d) => /^day\d{2}$/.test(d)).sort();
    for (const day of days) {
      const n = Number(day.slice(3));
      const { title, subtitle } = frontmatter(await readFile(path.join(root, "data", c.dir, day, "lesson.md"), "utf8"));
      const module = manifest?.modules?.find((m) => m.lessons.includes(n))?.title;
      out.push({ file: `public/lessons/${c.prefix}${day}_hero.png`, size: c.size, data: { course: c.course, label: c.label(String(n).padStart(2, "0")), module, title: title.replace(/^Day \d+\s*[—-]\s*/, ""), summary: subtitle } });
    }
  }
  return out;
}

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1 });
const tab = await context.newPage();
async function shoot(html, width, height) {
  await tab.setViewportSize({ width, height });
  await tab.setContent(html, { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  return tab.screenshot({ type: "png", clip: { x: 0, y: 0, width, height }, omitBackground: true });
}
async function render(file, html, width, height) {
  await writeFile(path.join(root, file), await shoot(html, width, height));
  console.info(`wrote ${file}`);
}
// favicon.ico holding PNG frames (supported by every current browser).
async function favicon(file, sizes) {
  const frames = [];
  for (const size of sizes) frames.push({ size, png: await shoot(icon(size), size, size) });
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, png }, i) => {
    const at = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, at); header.writeUInt8(size >= 256 ? 0 : size, at + 1);
    header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(png.length, at + 8); header.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  await writeFile(path.join(root, file), Buffer.concat([header, ...frames.map((f) => f.png)]));
  console.info(`wrote ${file}`);
}

await render("public/icons/icon-192.png", icon(192), 192, 192);
await render("public/icons/icon-512.png", icon(512), 512, 512);
await render("public/icons/icon-maskable-512.png", icon(512, { maskable: true }), 512, 512);
await render("public/icons/apple-touch-icon.png", icon(180, { maskable: true }), 180, 180);
await favicon("public/favicon.ico", [16, 32, 48]);
await render("public/og.png", og(), 1200, 630);
for (const lesson of await lessons()) await render(lesson.file, cover(lesson.data, ...lesson.size), ...lesson.size);
await writeFile(path.join(root, "public/icons/icon-source.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="${NAVY}"/><svg x="102.4" y="102.4" width="307.2" height="307.2" viewBox="${MARK_VIEWBOX}"><path d="${MARK_PATH}" fill="#fff"/></svg></svg>\n`);
console.info("wrote public/icons/icon-source.svg");
await browser.close();
