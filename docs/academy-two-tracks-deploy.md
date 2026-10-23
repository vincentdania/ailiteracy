# Two-track Academy release and rollback

This runbook applies only to the live Next.js checkout `/home/vincent/apps/ailiteracy-next` (Compose project `ailiteracy-next`). The separate `/home/vincent/apps/ailiteracy` stack is outside this release.

## Verified starting state and backup

On 22 October 2026, the production PostgreSQL host was `db`, database `ailiteracy`. Before any deletion, a full custom-format dump and all `public/lessons` media were saved outside the repository at:

- `/home/vincent/backups/academy-two-tracks-20261022T213359Z/database.dump`
- `/home/vincent/backups/academy-two-tracks-20261022T213359Z/course-media.tar.gz`

The dump was verified with `pg_restore --list`, and the media archive was listed. SHA-256 digests respectively: `960876844f8ab3d3de531d5cfb7597dd8253e5fd9a417cdcf00e44caa9ff2b0f`, `e8560a2e92790f6e9f04ddeed849b566abf144ea6caffc800f11b56df0c132df`.

Take another full backup immediately before deploying if the database has changed. The old-course retirement SQL deletes the old course, modules, lessons, attempts, submissions, plans, progress, enrollments, certificates, and associated orders. It preserves every user and admin account. Deleted records can be restored only from a database backup. The schema migration has `down.sql` for the new columns, but Prisma does not execute down migrations automatically.

## Reuse the current Paystack integration

The live Next.js site already has `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` configured. Keep their existing server `.env` values; do not copy keys into the repository or replace them for this release. The live `NEXTAUTH_URL` is `https://learn.hyrax.ng` and `APP_HOST` is `learn.hyrax.ng`. The existing Traefik host rule forwards all paths to the Next.js app. On 23 October 2026, `GET https://learn.hyrax.ng/api/webhooks/paystack` returned 405 (the route only accepts POST), confirming the public endpoint is reachable.

- Keep the existing application webhook endpoint: `https://learn.hyrax.ng/api/webhooks/paystack`.
- Keep the existing checkout callback URL: `https://learn.hyrax.ng/api/payments/paystack/callback`.
- Webhook signatures continue to use `PAYSTACK_SECRET_KEY` and the `x-paystack-signature` header. There is no separate Paystack webhook secret to generate or rotate.
- The callback is now a status redirect. Only a signed webhook followed by server-side Paystack transaction verification grants or renews access. A matching existing webhook registration in the **Paystack live dashboard** is therefore required. Server files and a reachable endpoint do not reveal the URL saved in Paystack's dashboard; check that exact URL there before release. Do not make a live charge to test it.
- Existing Paystack keys and webhook routing serve both tracks with no new Paystack configuration. Each track's product code is defined on the site in `src/lib/tracks.ts` and sent to Paystack as checkout metadata.

## Keep Google sign-in and sign-up

The live `.env` has both `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` configured, and the Compose app passes them through unchanged. On 23 October 2026, the live `/api/auth/providers` endpoint listed `google` with callback `https://learn.hyrax.ng/api/auth/callback/google`. Keep the same Google OAuth client, callback registration, `AUTH_SECRET`, `AUTH_TRUST_HOST`, and `NEXTAUTH_URL` when releasing the new tracks. The `/login` and `/signup` pages both keep their Google buttons; successful sign-in uses the existing user record when its email matches and then opens the new dashboard. User and admin accounts are not removed by the retirement SQL.

## Before launch

1. Fill all placeholder lessons and copy-and-paste templates in the seeded tracks. The seed keeps existing lesson Markdown on reruns.
2. Confirm Support is ready to honour the published policy: a buyer who emails within 24 hours of purchase receives a 100% refund of the track price. Issue refunds through the existing Paystack account and absorb the original transaction charge so the buyer receives the full track price.
3. Test each track checkout with test keys, signed webhook delivery to `/api/webhooks/paystack`, duplicate delivery, renewal, and expiry. Never use a live key for these tests.
4. Confirm the existing live Paystack dashboard webhook registration points to `https://learn.hyrax.ng/api/webhooks/paystack`.
5. Keep existing auth, Paystack keys, callback domain, support, branding and other environment values. Set `INTEGRATION_MODE=live`, `ALLOW_MOCK_CHECKOUT=false`, `FREE_ENROLLMENT_ENABLED=false`, `SHOW_DEMO_CREDENTIALS=false`, and `ADMIN_PREVIEW_ENABLED=false`.

## Deploy

Push or merge `codex/academy-two-paid-tracks` to the release ref, then on the server:

```bash
ssh hetzner-vincent
cd /home/vincent/apps/ailiteracy-next
git rev-parse HEAD  # record this old commit for rollback
git fetch origin
git checkout <approved-release-ref>  # keep .env in place
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml config --services
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml build migrate app
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml stop app
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml run --rm migrate
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml exec -T db psql -U ailiteracy -d ailiteracy -v ON_ERROR_STOP=1 < scripts/retire-old-course.sql
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml up -d app
```

Check `https://learn.hyrax.ng/`, both `/tracks/...` pages, `/dashboard` for signed-in users, `/api/health`, and the sitemap. Confirm Google still appears on `/login` and `/signup`, `/api/auth/providers` still lists `google`, and a test-account Google sign-in returns to `/dashboard`. `/challenge/tracka-01` should return 301 to `/`. Unpaid and expired users must see a paywall with no lesson Markdown. Verify a new track certificate page after completing the course in a test environment. Make no live charge for QA.

## Roll back

Use the old commit recorded above and the matching pre-deploy backup. Stop the app before restoring. Full restoration also discards purchases or account changes made after the backup; assess post-backup records first.

```bash
ssh hetzner-vincent
cd /home/vincent/apps/ailiteracy-next
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml stop app
git checkout <recorded-old-commit>
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml exec -T db pg_restore -U ailiteracy -d ailiteracy --clean --if-exists --no-owner < /home/vincent/backups/academy-two-tracks-20261022T213359Z/database.dump
tar -xzf /home/vincent/backups/academy-two-tracks-20261022T213359Z/course-media.tar.gz
# Restore the pre-release .env if its values changed, then:
docker compose -p ailiteracy-next -f docker-compose.yml -f docker-compose.server.yml up -d --build app
```

This branch has not been deployed. The live database and live Paystack account remain unchanged until the release steps are executed.
