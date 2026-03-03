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

## Notes
- Configure Paystack keys in `.env` before using checkout.
- Configure S3 variables and set `USE_S3=True` to store media on S3-compatible storage.
