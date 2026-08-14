from django.db import transaction
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone

from apps.learning.challenge_services import CHALLENGE_SLUG

from .models import Referral


REFERRAL_SESSION_KEY = "challenge_referral_code"


def get_or_create_share_referral(user):
    referral = Referral.objects.filter(
        referrer=user,
        referee__isnull=True,
        status=Referral.Status.PENDING,
    ).first()
    return referral or Referral.objects.create(referrer=user)


def build_referral_url(request, referral):
    return request.build_absolute_uri(reverse("referrals:accept", kwargs={"code": referral.code}))


@transaction.atomic
def attach_referral(user, code):
    from apps.learning.models import Enrollment

    if Enrollment.objects.filter(user=user, course__slug=CHALLENGE_SLUG).exists():
        return None
    referral = (
        Referral.objects.select_for_update()
        .filter(code=code, status=Referral.Status.PENDING, referee__isnull=True)
        .first()
    )
    if not referral or referral.referrer_id == user.id:
        return None
    if Referral.objects.filter(referee=user).exists():
        return None
    referral.referee = user
    referral.save(update_fields=["referee"])
    return referral


def attach_referral_from_request(request, user):
    if request is None:
        return None
    code = request.session.get(REFERRAL_SESSION_KEY)
    if not code:
        return None
    referral = attach_referral(user, code)
    if referral:
        request.session.pop(REFERRAL_SESSION_KEY, None)
    return referral


@transaction.atomic
def reward_referral_for_enrollment(enrollment):
    if enrollment.course.slug != CHALLENGE_SLUG:
        return None
    referral = (
        Referral.objects.select_for_update()
        .filter(referee=enrollment.user, status=Referral.Status.PENDING)
        .first()
    )
    if referral is None:
        return None
    referral.status = Referral.Status.REWARDED
    referral.rewarded_at = timezone.now()
    referral.save(update_fields=["status", "rewarded_at"])
    return referral


def user_has_referral_reward(user):
    if not user or not user.is_authenticated:
        return False
    return Referral.objects.filter(
        Q(referrer=user) | Q(referee=user),
        status=Referral.Status.REWARDED,
    ).exists()
