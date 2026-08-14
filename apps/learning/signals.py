import logging

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from .challenge_services import CHALLENGE_SLUG
from .emails import send_challenge_welcome_email
from .models import Enrollment


logger = logging.getLogger(__name__)


@receiver(post_save, sender=Enrollment)
def send_challenge_welcome_on_enrollment(sender, instance, created, **kwargs):
    if not created or instance.course.slug != CHALLENGE_SLUG or not instance.user.email:
        return

    def deliver():
        try:
            send_challenge_welcome_email(instance.pk)
        except Exception:
            logger.exception("Could not send challenge welcome email for enrollment %s", instance.pk)

    transaction.on_commit(deliver)


@receiver(post_save, sender=Enrollment)
def reward_challenge_referral_on_enrollment(sender, instance, created, **kwargs):
    if not created or instance.course.slug != CHALLENGE_SLUG:
        return
    from apps.referrals.services import reward_referral_for_enrollment

    reward_referral_for_enrollment(instance)
