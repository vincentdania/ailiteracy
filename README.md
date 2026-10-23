# Hyrax AI Academy

Next.js 15, React 19 and Prisma learning platform for [learn.hyrax.ng](https://learn.hyrax.ng). Learners choose between the Small business owners track (n8n) and Professionals track (Hermes). Each costs ₦20,000 and requires its own verified Paystack payment. Access lasts three calendar months from purchase.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, Auth.js
- PostgreSQL 16 and Prisma; Redis for rate limits and push infrastructure
- Paystack NGN checkout and a signed, server-verified, idempotent webhook
- Resend email, optional Google sign-in, reCAPTCHA, PostHog and Web Push
- Server-gated lessons and public certificate verification

## Typography and visual design

The Academy design rules for future contributors and agents are in [AGENTS.md](AGENTS.md). Fonts are configured in `src/app/layout.tsx` with `next/font/google`: Fraunces 600/700 for headings and Public Sans 400/600 for body and UI, both with `display: "swap"`. The shared palette and type scale live in `src/app/globals.css`. The images in `public/images/academy/` are generated visual examples; do not present them as actual Academy learners or live product captures.

## Local development

```bash
cp .env.example .env
pnpm install
# Start PostgreSQL and Redis, then:
pnpm prisma migrate deploy
pnpm db:seed
pnpm dev
```

The seeder creates two tracks with placeholder lessons. Local mock mode never grants paid access. To exercise checkout, use Paystack **test** credentials only. Each track's product code is defined in `src/lib/tracks.ts` and sent to Paystack as checkout metadata; no Paystack products are needed.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See [two-track deployment and rollback](docs/academy-two-tracks-deploy.md) for production steps, required manual content, and the verified backup location. The old Django source is retained as a separate historical application; the live Academy is the Next.js app in `src/`.
