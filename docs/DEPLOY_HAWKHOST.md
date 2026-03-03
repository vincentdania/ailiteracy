# Deploy AIliteracy to HawkHost (Shared Hosting)

This guide deploys the Django app from GitHub to HawkHost cPanel using **Setup Python App + Passenger**.

## 1) Prerequisites

1. Domain is attached to your HawkHost hosting account.
2. DNS for `ailiteracy.ng` points to HawkHost nameservers.
3. GitHub repo is public, or private with an access method available on the server.

## 2) Create PostgreSQL database in cPanel

In cPanel:

1. Open **PostgreSQL Databases**.
2. Create DB: `ailiteracy`.
3. Create DB user with a strong password.
4. Add user to DB and grant **ALL PRIVILEGES**.
5. Note full prefixed names, usually:
   - DB name: `<cpanel_user>_ailiteracy`
   - DB user: `<cpanel_user>_ailiteracy_user`
   - Host: `localhost`
   - Port: `5432`

## 3) Create Python app in cPanel

In cPanel:

1. Open **Setup Python App**.
2. Click **Create Application**.
3. Use:
   - Python version: `3.9` (this repo is pinned for HawkHost shared Python 3.9)
   - Application root: `ailiteracy` (under `/home/<cpanel_user>/ailiteracy`)
   - Application URL: select your domain root or subdomain
   - Application startup file: `passenger_wsgi.py`
   - Application Entry point: `application`
4. Click **Create**.

After creation, copy the activate command shown by cPanel (you will run it in Terminal).

## 4) Pull project code from GitHub

In cPanel **Terminal**:

```bash
cd ~
rm -rf ailiteracy
git clone https://github.com/vincentdania/ailiteracy.git ailiteracy
cd ailiteracy
```

If your repo is private, use SSH deploy key or GitHub token.

## 5) Install dependencies into app virtualenv

Run the activation command from Setup Python App first, then:

```bash
cd ~/ailiteracy
pip install --upgrade pip wheel
pip install -r requirements.txt
```

## 6) Create production `.env`

Create `/home/<cpanel_user>/ailiteracy/.env`:

```env
DJANGO_SETTINGS_MODULE=config.settings.production
DJANGO_SECRET_KEY=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=ailiteracy.ng,www.ailiteracy.ng
TIME_ZONE=Africa/Lagos

DATABASE_URL=postgres://<cpanel_user>_ailiteracy_user:<db_password>@localhost:5432/<cpanel_user>_ailiteracy

# For shared hosting reliability (no always-on celery worker):
CELERY_TASK_ALWAYS_EAGER=True
CELERY_TASK_EAGER_PROPAGATES=False
REDIS_URL=redis://localhost:6379/0

PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_WEBHOOK_SECRET=sk_live_xxx
PAYSTACK_CALLBACK_URL=https://ailiteracy.ng/orders/paystack/callback/

# Use SMTP in production (example values)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=mail.ailiteracy.ng
EMAIL_PORT=465
EMAIL_USE_SSL=True
EMAIL_HOST_USER=noreply@ailiteracy.ng
EMAIL_HOST_PASSWORD=CHANGE_ME
DEFAULT_FROM_EMAIL=AIliteracy <noreply@ailiteracy.ng>

USE_S3=False
```

If your DB password contains special chars like `@` or `:`, URL-encode them in `DATABASE_URL`.

## 7) Run migrations and collect static

In Terminal (with virtualenv active):

```bash
cd ~/ailiteracy
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

## 8) Expose static/media through `public_html`

Create symlinks so Apache serves static and media directly:

```bash
ln -sfn /home/<cpanel_user>/ailiteracy/staticfiles /home/<cpanel_user>/public_html/static
ln -sfn /home/<cpanel_user>/ailiteracy/media /home/<cpanel_user>/public_html/media
```

## 9) Restart app and verify

In **Setup Python App**, click **Restart** for the app.

Then verify:

1. `https://ailiteracy.ng/` loads.
2. `https://ailiteracy.ng/admin/` loads.
3. Static CSS/JS files are not 404.

## 10) Configure Paystack webhook

In Paystack dashboard, set webhook URL:

`https://ailiteracy.ng/orders/paystack/webhook/`

Then test a payment on live mode.

## 11) Update deployment workflow (future changes)

Each time you push changes:

```bash
cd ~/ailiteracy
git pull origin main
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

Then click **Restart** in Setup Python App.

## 12) Quick troubleshooting

1. `ModuleNotFoundError: django`:
   - virtualenv not active or requirements not installed in app venv.
2. `OperationalError: could not connect to server`:
   - wrong PostgreSQL `DATABASE_URL` or DB/user privileges missing.
3. Redirect loop / SSL problems:
   - wait for AutoSSL completion and ensure domain DNS is correct.
4. 500 error:
   - check app error logs in cPanel and verify `.env` values.
