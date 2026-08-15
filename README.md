# AI Literacy LMS

A mobile-first Next.js 15 learning platform for the 21-Day AI Challenge. The legacy Django source remains in the repository as migration reference; the production application is the Next.js app under `src/`.

## Local stack

- Next.js 15 App Router, React 19, strict TypeScript and Tailwind CSS 4
- PostgreSQL 16 with Prisma ORM
- Redis 7 for streak activity and rate limits, with an in-memory test fallback
- Auth.js v5 credentials and optional Google OAuth, JWT sessions and USER/ADMIN RBAC
- Paystack NGN and Stripe USD checkout with signed, idempotent webhooks
- Resend, PostHog and Web Push behind environment flags or local mock adapters
- Serwist PWA caching and server-rendered PDF certificates

## Run locally with Docker

Docker Compose starts PostgreSQL and Redis, bootstraps the schema, imports all 21 Markdown lessons, creates demo users, then starts the app.

```bash
cp .env.example .env
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). No cloud keys are required while `INTEGRATION_MODE=mock`.

Demo accounts (password `ChangeMe123!`):

- `learner@ailiteracy.local`
- `admin@ailiteracy.local`

Change all demo credentials and secrets before exposing an instance publicly.

Set `SEED_PASSWORD` to a strong instance-specific value before a public deployment; rerunning the seed rotates both demo account passwords.

## Run without Docker

Start PostgreSQL 16 and Redis 7, copy `.env.example` to `.env`, then:

```bash
pnpm install
pnpm prisma migrate deploy
pnpm db:seed
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

The unit suite does not connect to PostgreSQL, Redis, payment providers, email providers, or analytics services.

## Production configuration

Set strong values for `AUTH_SECRET`, `POSTGRES_PASSWORD`, and `ADMIN_TRIGGER_SECRET`. Set `NEXTAUTH_URL` to the public HTTPS origin. Add provider keys only for the integrations you enable, then change `INTEGRATION_MODE` from `mock` to `live`.

Production launch gates:

- Use a DNS hostname with HTTPS; do not use the direct HTTP IP address for a live payment deployment.
- Keep PostgreSQL and Redis bound to loopback or a private container network.
- Configure Resend, Stripe, Paystack, Google OAuth and VAPID credentials before enabling their respective features.
- Register the exact HTTPS webhook URLs below and verify provider test events before accepting payments.
- Run `pnpm audit --prod`, `pnpm check`, and the full-flow Playwright test before each release.
- Back up the `postgres_data` volume and test restoration before launch.

The protected reminder endpoint is `POST /api/push/reminders` with `x-admin-key: $ADMIN_TRIGGER_SECRET`. Payment webhooks are:

- `POST /api/webhooks/paystack`
- `POST /api/webhooks/stripe`

For the existing Hetzner Traefik network, use both Compose files with a unique project name and unused host ports:

```bash
APP_HOST=learn.example.com APP_PORT=3100 POSTGRES_PORT=5434 REDIS_PORT=6381 \
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml up -d --build
```
