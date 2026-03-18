import random
from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from .models import AttemptAnswer, Result


def level_from_score(score):
    if score <= 3:
        return Result.Level.BEGINNER
    if score <= 6:
        return Result.Level.INTERMEDIATE
    if score <= 8:
        return Result.Level.PROFICIENT
    if score == 9:
        return Result.Level.ADVANCED
    return Result.Level.ELITE


def rank_for_score(score):
    if score <= 3:
        return (
            "Explorer",
            "Strong start. Join the AI Literacy Bootcamp to build world-class execution depth for Africa’s AI future.",
        )
    if score <= 6:
        return (
            "Emerging Practitioner",
            "You are building momentum. The Bootcamp helps you convert promising judgment into high-impact outcomes across African markets.",
        )
    if score <= 8:
        return (
            "AI Fluent",
            "You demonstrate strong fluency. Join the Bootcamp to sharpen governance, strategy, and execution for scale.",
        )
    if score == 9:
        return (
            "Advanced Strategist",
            "Excellent strategic command. The Bootcamp can help you operationalize this level into durable AI leadership in Africa.",
        )
    return (
        "Elite AI Thinker",
        "Exceptional performance. Join the Bootcamp to drive frontier-grade, responsible AI systems for African institutions.",
    )


def attempt_deadline(attempt):
    if attempt.time_limit_seconds <= 0:
        return None
    return attempt.started_at + timedelta(seconds=attempt.time_limit_seconds)


def seconds_remaining(attempt):
    deadline = attempt_deadline(attempt)
    if deadline is None:
        return None
    remaining = int((deadline - timezone.now()).total_seconds())
    return max(0, remaining)


def has_timed_out(attempt):
    remaining = seconds_remaining(attempt)
    if remaining is None:
        return False
    return remaining <= 0


def calculate_score(attempt):
    total_questions = attempt.quiz.questions.count()
    if total_questions <= 0:
        return 0

    answers = AttemptAnswer.objects.filter(attempt=attempt).prefetch_related("selected_options")
    answer_map = {answer.question_id: answer for answer in answers}
    score = 0
    for question in attempt.quiz.questions.prefetch_related("options").all():
        answer = answer_map.get(question.id)
        selected_ids = set()
        if answer:
            selected_ids = set(answer.selected_options.values_list("id", flat=True))
        correct_ids = set(question.options.filter(is_correct=True).values_list("id", flat=True))

        expected_count = question.expected_correct_count()
        if len(selected_ids) != expected_count:
            continue
        if selected_ids == correct_ids:
            score += 1
    return score


def get_or_create_random_order(request, attempt):
    if not request.session.session_key:
        request.session.create()

    key = "quiz_random_orders"
    container = request.session.get(key, {})
    attempt_key = str(attempt.id)
    payload = container.get(attempt_key)
    if payload:
        return payload

    question_ids = list(attempt.quiz.questions.values_list("id", flat=True))
    random.shuffle(question_ids)

    option_orders = {}
    for question in attempt.quiz.questions.prefetch_related("options").all():
        option_ids = list(question.options.values_list("id", flat=True))
        random.shuffle(option_ids)
        option_orders[str(question.id)] = option_ids

    payload = {
        "question_ids": question_ids,
        "option_orders": option_orders,
    }
    container[attempt_key] = payload
    request.session[key] = container
    request.session.modified = True
    return payload


def save_attempt_answers(attempt, payload):
    for question in attempt.quiz.questions.all():
        selected_option_ids = payload.get(question.id, [])
        valid_options = list(question.options.filter(id__in=selected_option_ids))

        answer, _ = AttemptAnswer.objects.get_or_create(
            attempt=attempt,
            question=question,
        )
        answer.selected_options.set(valid_options)


@transaction.atomic
def finalize_attempt(attempt):
    if attempt.completed_at and hasattr(attempt, "result"):
        return attempt.result

    score = calculate_score(attempt)
    percent = score * 10
    level = level_from_score(score)
    attempt.completed_at = timezone.now()
    elapsed = int((attempt.completed_at - attempt.started_at).total_seconds())
    if attempt.time_limit_seconds > 0:
        attempt.time_taken_seconds = max(0, min(elapsed, attempt.time_limit_seconds))
        attempt.is_timed_out = has_timed_out(attempt)
    else:
        attempt.time_taken_seconds = max(0, elapsed)
        attempt.is_timed_out = False
    attempt.save(update_fields=["completed_at", "time_taken_seconds", "is_timed_out"])
    result, _ = Result.objects.update_or_create(
        attempt=attempt,
        defaults={
            "score": score,
            "percent": percent,
            "level": level,
        },
    )
    return result


def ensure_session_key(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key or ""


def can_access_attempt(request, attempt):
    if request.user.is_authenticated and attempt.user_id == request.user.id:
        return True
    session_key = request.session.session_key
    if attempt.user_id is None and session_key and attempt.session_key == session_key:
        return True
    return False
