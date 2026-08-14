from allauth.account.signals import user_signed_up
from django.dispatch import receiver

from .services import attach_referral_from_request


@receiver(user_signed_up)
def attach_signup_referral(request, user, **kwargs):
    attach_referral_from_request(request, user)
