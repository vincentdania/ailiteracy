import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse


logger = logging.getLogger(__name__)


def _absolute_course_url(course):
    path = reverse("learning:challenge_home", kwargs={"course_slug": course.slug})
    return f"{settings.SITE_URL.rstrip('/')}{path}"


def send_challenge_welcome_email(enrollment_id):
    from .models import Enrollment

    enrollment = Enrollment.objects.select_related("user", "course").filter(pk=enrollment_id).first()
    if not enrollment or not enrollment.user.email:
        return 0
    context = {
        "enrollment": enrollment,
        "user": enrollment.user,
        "course": enrollment.course,
        "course_url": _absolute_course_url(enrollment.course),
    }
    return send_mail(
        subject=f"Welcome to {enrollment.course.title}",
        message=render_to_string("emails/challenge_welcome.txt", context),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[enrollment.user.email],
        fail_silently=False,
    )


def send_challenge_daily_email(enrollment, lesson, day_number):
    context = {
        "enrollment": enrollment,
        "user": enrollment.user,
        "course": enrollment.course,
        "lesson": lesson,
        "day_number": day_number,
        "lesson_url": (
            f"{settings.SITE_URL.rstrip('/')}"
            f"{reverse('learning:challenge_lesson', kwargs={'course_slug': enrollment.course.slug, 'lesson_slug': lesson.slug})}"
        ),
    }
    return send_mail(
        subject=f"Day {day_number}: {lesson.title}",
        message=render_to_string("emails/challenge_daily.txt", context),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[enrollment.user.email],
        fail_silently=False,
    )
