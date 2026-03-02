from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail


@shared_task
def send_welcome_email(user_id: int) -> None:
    user = get_user_model().objects.filter(pk=user_id).first()
    if not user or not user.email:
        return

    send_mail(
        subject="Welcome to AIliteracy",
        message=(
            f"Hi {user.get_full_name() or user.email},\n\n"
            "Welcome to AIliteracy.ng. Start by exploring your dashboard and enrolling in a course."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=True,
    )
