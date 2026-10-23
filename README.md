# Hyrax AI Academy

Next.js 15, React 19 and Prisma learning platform for [learn.hyrax.ng](https://learn.hyrax.ng). Learners choose between the Small business owners track (n8n) and Professionals track (Hermes). Each costs ₦20,000 and requires its own verified Paystack payment. Access lasts three calendar months from purchase.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, Auth.js
- PostgreSQL 16 and Prisma; Redis for rate limits and push infrastructure
- Paystack NGN checkout and a signed, server-verified, idempotent webhook
- Resend email, optional Google sign-in, reCAPTCHA, PostHog and Web Push
- Server-gated lessons and public certificate verification

## Local development

```bash
cp .env.example .env
pnpm install
# Start PostgreSQL and Redis, then:
pnpm prisma migrate deploy
pnpm db:seed
pnpm dev
```

The seeder creates two tracks with placeholder lessons. Local mock mode never grants paid access. To exercise checkout, use Paystack **test** credentials and product codes only. Run `pnpm paystack:create-products:test` with a `sk_test_` key to create or find both test products, then add the printed codes to `.env` and rerun `pnpm db:seed`.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See [two-track deployment and rollback](docs/academy-two-tracks-deploy.md) for production steps, required manual content, and the verified backup location. The old Django source is retained as a separate historical application; the live Academy is the Next.js app in `src/`.
