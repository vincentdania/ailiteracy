# AIliteracy Django MVP

Django project for [ailiteracy.ng](https://ailiteracy.ng) using Django Templates + HTMX + Alpine.js.

## Stack
- Django 4.2 LTS (Python 3.9 compatible)
- PostgreSQL (SQLite fallback for local quick start)
- Django REST Framework (internal APIs)
- django-allauth (email auth)
- Celery + Redis (async emails/background jobs)
- django-environ (environment config)
- django-storages (S3-compatible media storage)
- TailwindCSS (CDN for MVP UI)

## Apps
- `apps.core`
- `apps.accounts`
- `apps.catalog`
- `apps.orders`
- `apps.learning`
- `apps.content`
- `apps.marketing`
- `apps.quiz`
- `apps.bootcamp`
- `apps.certificates`
- `apps.ai_index`
- `apps.referrals`

## Local setup
1. Create and activate a virtual env.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy env file:
   ```bash
   cp .env.example .env
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```
6. Start server:
   ```bash
   python manage.py runserver
   ```

## Docker setup
```bash
docker compose up --build
```

## Celery
Worker:
```bash
celery -A config worker -l info
```

## Test
```bash
pytest
# or: python manage.py test
```

## The 21-Day AI Challenge

The challenge is a text-and-graphics course that unlocks one lesson per day from each learner's enrollment date. Day 1 is a public preview. Enrolled learners can track their current day, lesson progress, and completion streak from `/dashboard/` or the dedicated challenge page.

Import or refresh the supplied course pack after migrations:

```bash
python manage.py migrate
python manage.py import_21day_challenge
```

The import creates 1 challenge course, 5 core modules, 21 daily lessons, 1 gated referral-bonus module, and 1 linked catalog product. The core progress calculation remains 21 days; the bonus lesson never changes the completion percentage.

The importer is idempotent. Use a custom price or fully replace the existing imported challenge with:

```bash
python manage.py import_21day_challenge --price 25000.00
python manage.py import_21day_challenge --reset
```

### Daily email cron

SMTP uses the existing `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, `EMAIL_USE_SSL`, and `DEFAULT_FROM_EMAIL` environment settings. Set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` in production; development continues to use the console email backend.

Run the idempotent reminder command every morning from shared-hosting cron (adjust paths to the deployed virtual environment and project):

```cron
0 7 * * * cd /home/ACCOUNT/ailiteracy && /home/ACCOUNT/venv/bin/python manage.py send_daily_challenge_emails >> /home/ACCOUNT/logs/challenge-email.log 2>&1
```

Welcome mail is sent when a challenge enrollment is created. The daily command sends only the currently unlocked day's reminder and skips learners who already completed that lesson or were already sent its reminder.

### Payments: Paystack and Stripe

The native checkout supports both currencies without changing the existing Paystack verification and fulfilment service:

- NGN uses Paystack.
- USD uses Stripe Checkout.
- The challenge defaults to `₦20,000` and `$39` when imported.
- Access is granted only after a verified callback or signed webhook marks the order paid.

Configure these production environment variables:

```env
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=sk_live_...
PAYSTACK_CALLBACK_URL=https://ailiteracy.ng/orders/paystack/callback/
PAYSTACK_ALLOW_LOCAL_FALLBACK=False

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

Register these provider endpoints:

- Paystack callback: `https://ailiteracy.ng/orders/paystack/callback/`
- Paystack webhook: `https://ailiteracy.ng/orders/paystack/webhook/`
- Stripe webhook: `https://ailiteracy.ng/orders/stripe/webhook/`
- Stripe event: `checkout.session.completed`

`STRIPE_PRICE_ID` is optional. When it is blank, checkout uses the product's `price_usd` value. Never enable `PAYSTACK_ALLOW_LOCAL_FALLBACK` in production.

### Certificates and referrals

Completing all 21 core lessons marks the course attempt complete and issues a PDF certificate. Certificates have a public verification page at `/certificates/<uuid>/`; the PDF download remains available to its owner.

Graduates receive a single-use referral link under `/refer/<code>/`. When a new learner follows that link and then enrols in the challenge, the referral is rewarded and the gated bonus module unlocks for both accounts. Referral records and reward status are available in Django admin.

### Shared-hosting production sequence

Passenger hosts the WSGI application, so no long-running scheduler is required for the challenge. Deploy with:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py import_21day_challenge
python manage.py collectstatic --noinput
python manage.py check --deploy
pytest
```

Then configure the daily email cron shown above. Celery remains optional for asynchronous receipts; order fulfilment falls back to direct email calls when a worker is unavailable.

## New Feature Modules (Quiz + Bootcamp + Micro-course)

Run setup:

```bash
python manage.py migrate
python manage.py seed_ai_literacy_quiz
python manage.py seed_ai_fluency_microcourse
```

Main routes:

- `/quiz/` (difficult timed AI literacy quiz)
- `/bootcamp/interest/` (bootcamp interest form)
- `/course/ai-fluency/` (Introduction to AI Literacy course)
- `/certificates/my/` (logged-in certificate list)
- `/ai-literacy-index/insights/` (public AI Literacy Index insights)

Quiz behavior summary:

- 10 questions total
- Q1–Q8 single-select (choose one)
- Q9–Q10 multi-select (choose exactly two; strict scoring)
- 20-minute time limit with countdown and auto-submit
- Questions and options are shuffled per attempt
- Score is out of 10 (percent = score * 10), no score cap

URL integration points:

- Added in `config/urls.py`:
  - `path("quiz/", include(("apps.quiz.urls", "quiz"), namespace="quiz"))`
  - `path("bootcamp/", include(("apps.bootcamp.urls", "bootcamp"), namespace="bootcamp"))`
  - `path("certificates/", include(("apps.certificates.urls", "certificates"), namespace="certificates"))`
  - `path("ai-literacy-index/", include(("apps.ai_index.urls", "ai_index"), namespace="ai_index"))`
  - Micro-course routes are integrated in `apps.learning.urls` under `/course/...`

AI Literacy Funnel integration notes:

- Deep-quiz result hook:
  - `apps/quiz/views.py` now computes/loads ALI on `quiz:result`.
  - `apps/quiz/templates/quiz/result.html` renders ALI score, percentile, and share links (WhatsApp/LinkedIn/X).
- ALI model/admin:
  - `apps/ai_index/models.py` stores weighted ALI history (one record per deep-quiz completion).
  - `apps/ai_index/admin.py` provides filters and CSV export action.

Template integration point:

- Homepage prompt include added in `apps/core/templates/core/home.html`:
  - `{% include "quiz/_prompt_banner.html" %}`
  - You can move this include into `templates/base.html` if you want site-wide quiz CTA instead of homepage-only.

## Notes
- Configure Paystack keys in `.env` before using checkout.
- Configure S3 variables and set `USE_S3=True` to store media on S3-compatible storage.
