from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from .models import CourseAttempt, Lesson, LessonProgress


CHALLENGE_SLUG = "21-day-ai-challenge"
CHALLENGE_LENGTH = 21


def ordered_course_lessons(course):
    return Lesson.objects.filter(module__course=course).select_related("module").order_by(
        "module__order", "order", "id"
    )


def enrollment_start_date(enrollment):
    return timezone.localtime(enrollment.created_at).date()


def challenge_day(enrollment, on_date=None):
    on_date = on_date or timezone.localdate()
    elapsed = (on_date - enrollment_start_date(enrollment)).days
    return max(1, min(CHALLENGE_LENGTH, elapsed + 1))


def lesson_unlock_date(enrollment, day_number):
    return enrollment_start_date(enrollment) + timedelta(days=day_number - 1)


def lesson_is_available(enrollment, lesson, day_number, on_date=None):
    if lesson.is_preview:
        return True
    if enrollment is None:
        return False
    on_date = on_date or timezone.localdate()
    return on_date >= lesson_unlock_date(enrollment, day_number)


def days_until_lesson_unlock(enrollment, day_number, on_date=None):
    if enrollment is None:
        return None
    on_date = on_date or timezone.localdate()
    return max(0, (lesson_unlock_date(enrollment, day_number) - on_date).days)


def calculate_streak(enrollment, on_date=None):
    on_date = on_date or timezone.localdate()
    completion_dates = {
        timezone.localtime(value).date()
        for value in enrollment.lesson_progress.filter(completed_at__isnull=False).values_list(
            "completed_at", flat=True
        )
    }
    if not completion_dates:
        return 0

    latest = max(completion_dates)
    if latest < on_date - timedelta(days=1):
        return 0

    cursor = min(latest, on_date)
    streak = 0
    while cursor in completion_dates:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def build_challenge_outline(course, enrollment=None, on_date=None):
    on_date = on_date or timezone.localdate()
    completed_ids = set()
    if enrollment:
        completed_ids = set(
            enrollment.lesson_progress.filter(completed_at__isnull=False).values_list(
                "lesson_id", flat=True
            )
        )

    rows_by_module = []
    day_number = 0
    for module in course.modules.all():
        lesson_rows = []
        for lesson in module.lessons.all():
            day_number += 1
            available = lesson_is_available(enrollment, lesson, day_number, on_date=on_date)
            lesson_rows.append(
                {
                    "lesson": lesson,
                    "day_number": day_number,
                    "available": available,
                    "completed": lesson.id in completed_ids,
                    "days_until_unlock": days_until_lesson_unlock(
                        enrollment, day_number, on_date=on_date
                    ),
                }
            )
        rows_by_module.append({"module": module, "lessons": lesson_rows})
    return rows_by_module


def find_lesson_row(course, lesson, enrollment=None, on_date=None):
    for module_row in build_challenge_outline(course, enrollment, on_date=on_date):
        for row in module_row["lessons"]:
            if row["lesson"].pk == lesson.pk:
                return row
    return None


def next_action_for_enrollment(enrollment, on_date=None):
    outline = build_challenge_outline(enrollment.course, enrollment, on_date=on_date)
    first_locked = None
    for module_row in outline:
        for row in module_row["lessons"]:
            if row["completed"]:
                continue
            if row["available"]:
                return row
            if first_locked is None:
                first_locked = row
    return first_locked


def challenge_summary(enrollment, on_date=None):
    next_action = next_action_for_enrollment(enrollment, on_date=on_date)
    return {
        "day_number": challenge_day(enrollment, on_date=on_date),
        "streak": calculate_streak(enrollment, on_date=on_date),
        "progress": enrollment.progress_percentage,
        "completed_lessons": enrollment.completed_lessons_count,
        "total_lessons": enrollment.total_lessons_count,
        "next_action": next_action,
        "is_complete": enrollment.progress_percentage == 100,
    }


@transaction.atomic
def mark_lesson_complete(enrollment, lesson):
    if lesson.module.course_id != enrollment.course_id:
        raise ValueError("Lesson does not belong to this enrollment.")
    progress, _ = LessonProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
    if progress.completed_at is None:
        progress.completed_at = timezone.now()
        progress.save(update_fields=["completed_at"])
    sync_challenge_completion(enrollment)
    return progress


def sync_challenge_completion(enrollment):
    total = enrollment.total_lessons_count
    if total == 0 or enrollment.completed_lessons_count < total:
        return None

    attempt = (
        CourseAttempt.objects.filter(course=enrollment.course, user=enrollment.user)
        .order_by("started_at")
        .first()
    )
    if attempt is None:
        attempt = CourseAttempt.objects.create(
            course=enrollment.course,
            user=enrollment.user,
            name=enrollment.user.get_full_name() or enrollment.user.email,
            email=enrollment.user.email,
        )
    if attempt.completed_at is None or not attempt.passed or attempt.score != 100:
        attempt.completed_at = timezone.now()
        attempt.passed = True
        attempt.score = 100
        attempt.save(update_fields=["completed_at", "passed", "score"])
    return attempt
