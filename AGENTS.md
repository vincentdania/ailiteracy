# Hyrax AI Academy design rules

These rules apply to the Next.js Academy in `src/`.

## Typography

- Load fonts through `next/font/google` in `src/app/layout.tsx`. Use **Fraunces** for headings at weights **600 and 700** and **Public Sans** for body copy and UI at weights **400 and 600**. Set `display: "swap"` on both. Do not add other font weights, families, CSS imports, or runtime Google Fonts requests. Keep monospace only for code and machine-readable identifiers.
- Keep the font variables in `src/app/globals.css`: `--font-display` uses Fraunces and `--font-sans` uses Public Sans. Tailwind's bold, extrabold, and black UI utilities map to Public Sans 600; display headings may use Fraunces 700. Check computed styles after changing these mappings.
- Use left-aligned headings at roughly 30–36 px on phones and 40–56 px on desktop, with line-height near 1.1. Body copy is 17–18 px with line-height near 1.6. Give sections generous spacing.

## Visual style

- Page background: `#FAF7F2`; primary text and buttons: navy `#10294F`; warm accent: amber `#C8742B`, only for highlights and secondary emphasis. Preserve the official Hyrax wordmark paths.
- No gradients, glass or blur treatments, glowing effects, stock robot/brain/circuit imagery, emoji bullets, or sparkle icons. Vary section layouts instead of repeating rows of three identical cards.
- Keep the clearly labelled `ImageSlot` components until approved real photos and permission-safe product screenshots are supplied. Never use fabricated proof, student results, or screenshots.
- Apply this design to new public, auth, dashboard, and certificate UI. Follow existing accessibility patterns, including focus states, readable contrast, and mobile layouts.

## Next.js

Read the relevant guide in `node_modules/next/dist/docs/` before changing Next.js APIs when that directory is available in the installed version. This repository currently uses Next.js 15; do not assume another Next.js version has the same API.
