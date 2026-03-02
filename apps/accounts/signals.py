from allauth.account.signals import user_signed_up
from django.dispatch import receiver

from .tasks import send_welcome_email


@receiver(user_signed_up)
def on_user_signed_up(request, user, **kwargs):
    try:
        send_welcome_email.delay(user.id)
    except Exception:
        send_welcome_email(user.id)
