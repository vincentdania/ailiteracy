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
