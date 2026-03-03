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
python manage.py test
```

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
- `/course/ai-fluency/` (15-minute micro-course)
- `/certificates/my/` (logged-in certificate list)

Quiz behavior summary:

- 10 questions total
- Q1–Q8 single-select (choose one)
- Q9–Q10 multi-select (choose exactly two; strict scoring)
- 30-minute time limit with countdown and auto-submit
- Questions and options are shuffled per attempt
- Score is out of 10 (percent = score * 10), no score cap

URL integration points:

- Added in `config/urls.py`:
  - `path("quiz/", include(("apps.quiz.urls", "quiz"), namespace="quiz"))`
  - `path("bootcamp/", include(("apps.bootcamp.urls", "bootcamp"), namespace="bootcamp"))`
  - `path("certificates/", include(("apps.certificates.urls", "certificates"), namespace="certificates"))`
  - Micro-course routes are integrated in `apps.learning.urls` under `/course/...`

Template integration point:

- Homepage prompt include added in `apps/core/templates/core/home.html`:
  - `{% include "quiz/_prompt_banner.html" %}`
  - You can move this include into `templates/base.html` if you want site-wide quiz CTA instead of homepage-only.

## Notes
- Configure Paystack keys in `.env` before using checkout.
- Configure S3 variables and set `USE_S3=True` to store media on S3-compatible storage.
