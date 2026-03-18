import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

from .models import AILiteracyScore

logger = logging.getLogger(__name__)


@shared_task
def send_ali_score_email(ali_score_id: int) -> None:
    entry = (
        AILiteracyScore.objects.select_related("deep_quiz_result", "course_attempt")
        .filter(pk=ali_score_id)
        .first()
    )
    if not entry or not entry.email or entry.emailed_at:
        return

    context = {
        "entry": entry,
        "deep_level": entry.deep_quiz_result.level,
        "deep_percent": entry.deep_quiz_result.percent,
        "site_url": settings.SITE_URL.rstrip("/"),
    }

    try:
        send_mail(
            subject="Your AI Literacy Assessment Result",
            message=render_to_string("ai_index/emails/result_email.txt", context),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[entry.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send AI Literacy result email to %s", entry.email)
        return

    entry.emailed_at = timezone.now()
    entry.save(update_fields=["emailed_at"])
