from decimal import Decimal, ROUND_HALF_UP
from urllib.parse import quote_plus

from django.db.models import Avg, Count

from apps.learning.models import CourseAttempt

from .models import AILiteracyScore


def _decimal(value):
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def final_test_raw_score_from_percent(percent_score):
    if percent_score is None:
        return 0
    clamped = max(0, min(100, int(percent_score)))
    # 5-question assessment: 20% increments
    return int(round(clamped / 20))


def compute_ali_score(deep_quiz_score, final_test_score, microcourse_completed):
    deep = Decimal(str(deep_quiz_score))
    final_norm = (Decimal(str(final_test_score)) / Decimal("5")) * Decimal("10")
    deep_component = deep * Decimal("0.6")
    final_component = final_norm * Decimal("0.2")
    micro_component = Decimal("2.0") if microcourse_completed else Decimal("0.0")
    total = deep_component + final_component + micro_component
    return _decimal(total)


def ali_level(ali_score):
    score = Decimal(str(ali_score))
    if score <= Decimal("3"):
        return AILiteracyScore.Level.BEGINNER
    if score <= Decimal("5"):
        return AILiteracyScore.Level.EMERGING
    if score <= Decimal("7"):
        return AILiteracyScore.Level.PRACTITIONER
    if score < Decimal("9"):
        return AILiteracyScore.Level.FLUENT
    return AILiteracyScore.Level.LEADER


def get_latest_microcourse_attempt(user=None, session_key="", course_slug="ai-fluency"):
    queryset = CourseAttempt.objects.filter(course__slug=course_slug, completed_at__isnull=False).order_by("-completed_at")
    if user and getattr(user, "is_authenticated", False):
        return queryset.filter(user=user).first()
    if session_key:
        return queryset.filter(user__isnull=True, session_key=session_key).first()
    return None


def percentile_higher_than(current_score):
    total = AILiteracyScore.objects.count()
    if total <= 1:
        return 0
    lower = AILiteracyScore.objects.filter(ali_score__lt=current_score).count()
    percentile = int(round((lower / total) * 100))
    return max(0, min(99, percentile))


def create_or_update_ali_from_deep_result(deep_result, name, email, user=None, session_key=""):
    course_attempt = get_latest_microcourse_attempt(user=user, session_key=session_key)
    microcourse_completed = bool(course_attempt)
    final_test_score = final_test_raw_score_from_percent(course_attempt.score) if course_attempt else 0

    deep_quiz_score = int(deep_result.score)
    ali_score_value = compute_ali_score(
        deep_quiz_score=deep_quiz_score,
        final_test_score=final_test_score,
        microcourse_completed=microcourse_completed,
    )
    level = ali_level(ali_score_value)

    entry, _ = AILiteracyScore.objects.update_or_create(
        deep_quiz_result=deep_result,
        defaults={
            "user": user if getattr(user, "is_authenticated", False) else None,
            "course_attempt": course_attempt,
            "name": name,
            "email": email,
            "deep_quiz_score": deep_quiz_score,
            "final_test_score": final_test_score,
            "microcourse_completed": microcourse_completed,
            "ali_score": ali_score_value,
            "level": level,
        },
    )
    return entry


def share_links_for_score(score):
    text = (
        "I scored %s/10 on the AI Literacy Index at ailiteracy.ng. "
        "Test your AI literacy too." % score
    )
    encoded_text = quote_plus(text)
    site_url = quote_plus("https://ailiteracy.ng/quiz/")
    return {
        "whatsapp": "https://wa.me/?text=%s" % encoded_text,
        "x": "https://twitter.com/intent/tweet?text=%s&url=%s" % (encoded_text, site_url),
        "linkedin": "https://www.linkedin.com/sharing/share-offsite/?url=%s" % site_url,
    }


def aggregate_insights():
    total = AILiteracyScore.objects.count()
    average = AILiteracyScore.objects.aggregate(avg=Avg("ali_score"))["avg"] or Decimal("0.00")
    distribution = {level: 0 for level, _ in AILiteracyScore.Level.choices}
    for row in AILiteracyScore.objects.values("level").annotate(total=Count("id")):
        distribution[row["level"]] = row["total"]
    return {
        "total": total,
        "average": _decimal(average),
        "distribution": distribution,
    }
