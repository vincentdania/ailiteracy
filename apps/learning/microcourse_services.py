from django.db import transaction
from django.utils import timezone

from .models import CourseAttempt, CourseFinalQuizAnswer


def ensure_session_key(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key or ""


def get_or_create_attempt(request, course, name="", email=""):
    if request.user.is_authenticated:
        attempt = CourseAttempt.objects.filter(
            course=course,
            user=request.user,
            completed_at__isnull=True,
        ).first()
        if attempt:
            return attempt
        return CourseAttempt.objects.create(
            course=course,
            user=request.user,
            session_key=ensure_session_key(request),
            name=name or request.user.get_full_name() or request.user.email,
            email=email or request.user.email or "",
        )

    session_key = ensure_session_key(request)
    attempt = CourseAttempt.objects.filter(
        course=course,
        user__isnull=True,
        session_key=session_key,
        completed_at__isnull=True,
    ).first()
    if attempt:
        if name and not attempt.name:
            attempt.name = name
        if email and not attempt.email:
            attempt.email = email
        if name or email:
            attempt.save(update_fields=["name", "email"])
        return attempt
    return CourseAttempt.objects.create(
        course=course,
        session_key=session_key,
        name=name,
        email=email,
    )


def can_access_attempt(request, attempt):
    if request.user.is_authenticated and attempt.user_id == request.user.id:
        return True
    return bool(attempt.user_id is None and request.session.session_key and attempt.session_key == request.session.session_key)


def calculate_final_quiz_score(attempt):
    total = attempt.course.final_quiz_questions.count()
    if total == 0:
        return 0
    correct = CourseFinalQuizAnswer.objects.filter(
        attempt=attempt,
        selected_option__is_correct=True,
    ).count()
    return int((correct / total) * 100)


@transaction.atomic
def finalize_microcourse_attempt(attempt):
    score = calculate_final_quiz_score(attempt)
    attempt.score = score
    attempt.passed = score >= 80
    attempt.completed_at = timezone.now()
    attempt.save(update_fields=["score", "passed", "completed_at"])
    return attempt
