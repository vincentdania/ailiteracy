# Two-track Academy release and rollback

This runbook applies only to the live Next.js checkout `/home/vincent/apps/ailiteracy-next` (Compose project `ailiteracy-next`). The separate `/home/vincent/apps/ailiteracy` stack is outside this release.

## Verified starting state and backup

On 22 October 2026, the production PostgreSQL host was `db`, database `ailiteracy`. Before any deletion, a full custom-format dump and all `public/lessons` media were saved outside the repository at:

- `/home/vincent/backups/academy-two-tracks-20261022T213359Z/database.dump`
- `/home/vincent/backups/academy-two-tracks-20261022T213359Z/course-media.tar.gz`

The dump was verified with `pg_restore --list`, and the media archive was listed. SHA-256 digests respectively: `960876844f8ab3d3de531d5cfb7597dd8253e5fd9a417cdcf00e44caa9ff2b0f`, `e8560a2e92790f6e9f04ddeed849b566abf144ea6caffc800f11b56df0c132df`.

Take another full backup immediately before deploying if the database has changed. The old-course retirement SQL deletes the old course, modules, lessons, attempts, submissions, plans, progress, enrollments, certificates, and associated orders. It preserves every user and admin account. Deleted records can be restored only from a database backup. The schema migration has `down.sql` for the new columns, but Prisma does not execute down migrations automatically.

## Before launch

1. Fill all placeholder lessons and copy-and-paste templates in the seeded tracks. The seed keeps existing lesson Markdown on reruns.
2. Publish a refund policy and replace the marked TODO in both sales pages.
3. In a Paystack **test** account, run `PAYSTACK_SECRET_KEY=sk_test_... pnpm paystack:create-products:test`. Add the two printed product codes to a test `.env` as `PAYSTACK_SMALL_BUSINESS_PRODUCT_CODE` and `PAYSTACK_PROFESSIONALS_PRODUCT_CODE`.
4. Test each track checkout with test keys, signed webhook delivery to `/api/webhooks/paystack`, duplicate delivery, renewal, and expiry. Never use a live key for these tests.
5. Create two matching ₦20,000 products in the Paystack live dashboard for the actual launch, then set their live product codes in the server `.env`. The setup script intentionally blocks live keys.
6. Keep existing auth, Paystack, support, branding and other environment values. Set `INTEGRATION_MODE=live`, `ALLOW_MOCK_CHECKOUT=false`, `FREE_ENROLLMENT_ENABLED=false`, `SHOW_DEMO_CREDENTIALS=false`, and `ADMIN_PREVIEW_ENABLED=false`. Both new product code variables are required.

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

Check `https://learn.hyrax.ng/`, both `/tracks/...` pages, `/dashboard` for signed-in users, `/api/health`, and the sitemap. `/challenge/tracka-01` should return 301 to `/`. Unpaid and expired users must see a paywall with no lesson Markdown. Verify a new track certificate page after completing the course in a test environment. Make no live charge for QA.

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
