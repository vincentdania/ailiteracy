from django.contrib import messages
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.http import require_http_methods

from apps.ai_index.forms import AILiteracyIdentityForm
from apps.ai_index.services import (
    create_or_update_ali_from_deep_result,
    percentile_higher_than,
    share_links_for_score,
)

from .models import Attempt, Quiz
from .services import (
    can_access_attempt,
    ensure_session_key,
    finalize_attempt,
    get_or_create_random_order,
    has_timed_out,
    rank_for_score,
    save_attempt_answers,
    seconds_remaining,
)


def _active_quiz():
    return Quiz.objects.filter(is_active=True).order_by("title").first()


def home(request):
    return render(request, "quiz/home.html", {"quiz": _active_quiz()})


@require_http_methods(["POST"])
def start(request):
    quiz = _active_quiz()
    if not quiz:
        messages.error(request, "Quiz is not available right now.")
        return redirect("core:home")

    session_key = ensure_session_key(request)
    attempt = Attempt.objects.create(
        quiz=quiz,
        user=request.user if request.user.is_authenticated else None,
        session_key=session_key,
    )
    return redirect("quiz:take", attempt_id=attempt.id)


@require_http_methods(["GET", "POST"])
def take(request, attempt_id):
    attempt = get_object_or_404(
        Attempt.objects.select_related("quiz", "user").prefetch_related("quiz__questions__options", "answers__selected_options"),
        pk=attempt_id,
    )
    if not can_access_attempt(request, attempt):
        raise Http404("Attempt not found.")
    if attempt.completed_at:
        return redirect("quiz:result", attempt_id=attempt.id)

    order_payload = get_or_create_random_order(request, attempt)
    quiz_questions = list(attempt.quiz.questions.all())
    question_map = {item.id: item for item in quiz_questions}

    if request.method == "POST":
        selected_payload = {}
        for question in quiz_questions:
            values = request.POST.getlist("question_%s" % question.id)
            selected_ids = []
            for raw_value in values:
                try:
                    selected_ids.append(int(raw_value))
                except (TypeError, ValueError):
                    continue
            valid_ids = list(question.options.filter(id__in=selected_ids).values_list("id", flat=True))
            selected_payload[question.id] = valid_ids

        save_attempt_answers(attempt, selected_payload)

        timed_out = has_timed_out(attempt)
        auto_submit = request.POST.get("auto_submit") == "1"
        if timed_out:
            attempt.is_timed_out = True
            attempt.save(update_fields=["is_timed_out"])
            auto_submit = True

        if not auto_submit:
            invalid_selection_counts = []
            for question in quiz_questions:
                expected = question.expected_correct_count()
                selected_count = len(selected_payload.get(question.id, []))
                if selected_count != expected:
                    invalid_selection_counts.append(question.order)
            if invalid_selection_counts:
                messages.error(
                    request,
                    "Answer every question with the exact selection count (1 for single-select, 2 for multi-select).",
                )
            else:
                finalize_attempt(attempt)
                return redirect("quiz:result", attempt_id=attempt.id)
        else:
            finalize_attempt(attempt)
            if attempt.is_timed_out:
                messages.info(request, "Time is up. Your quiz was auto-submitted.")
            return redirect("quiz:result", attempt_id=attempt.id)

    if has_timed_out(attempt):
        attempt.is_timed_out = True
        attempt.save(update_fields=["is_timed_out"])
        finalize_attempt(attempt)
        messages.info(request, "Time is up. Your quiz was auto-submitted.")
        return redirect("quiz:result", attempt_id=attempt.id)

    answers_map = {item.question_id: list(item.selected_options.values_list("id", flat=True)) for item in attempt.answers.all()}
    ordered_questions = []
    for position, question_id in enumerate(order_payload["question_ids"], start=1):
        question = question_map.get(question_id)
        if not question:
            continue
        option_map = {option.id: option for option in question.options.all()}
        ordered_option_ids = order_payload["option_orders"].get(str(question.id), [])
        ordered_options = [option_map[option_id] for option_id in ordered_option_ids if option_id in option_map]
        for option_id, option in option_map.items():
            if option_id not in ordered_option_ids:
                ordered_options.append(option)

        ordered_questions.append(
            {
                "position": position,
                "question": question,
                "options": ordered_options,
                "selected_ids": answers_map.get(question.id, []),
            }
        )

    remaining_seconds = seconds_remaining(attempt)
    return render(
        request,
        "quiz/take.html",
        {
            "attempt": attempt,
            "ordered_questions": ordered_questions,
            "total_questions": len(ordered_questions),
            "remaining_seconds": remaining_seconds,
        },
    )


def result(request, attempt_id):
    attempt = get_object_or_404(
        Attempt.objects.select_related("quiz", "user", "result"),
        pk=attempt_id,
    )
    if not can_access_attempt(request, attempt):
        raise Http404("Attempt not found.")
    if not hasattr(attempt, "result"):
        return redirect("quiz:take", attempt_id=attempt.id)

    result_obj = attempt.result
    ali_entry = getattr(result_obj, "ali_score", None)
    identity_form = None

    if request.method == "POST" and request.POST.get("action") == "compute_ali":
        if request.user.is_authenticated and request.user.email:
            entry = create_or_update_ali_from_deep_result(
                deep_result=result_obj,
                name=request.user.get_full_name() or request.user.email,
                email=request.user.email,
                user=request.user,
                session_key=attempt.session_key,
            )
            messages.success(request, "Your AI Literacy Index has been generated.")
            return redirect("quiz:result", attempt_id=attempt.id)

        identity_form = AILiteracyIdentityForm(request.POST)
        if identity_form.is_valid():
            entry = create_or_update_ali_from_deep_result(
                deep_result=result_obj,
                name=identity_form.cleaned_data["name"],
                email=identity_form.cleaned_data["email"],
                user=request.user if request.user.is_authenticated else None,
                session_key=attempt.session_key,
            )
            messages.success(request, "Your AI Literacy Index has been generated.")
            return redirect("quiz:result", attempt_id=attempt.id)
        messages.error(request, "Please provide your name and a valid email to compute your AI Literacy Index.")

    if not ali_entry and request.user.is_authenticated and request.user.email:
        ali_entry = create_or_update_ali_from_deep_result(
            deep_result=result_obj,
            name=request.user.get_full_name() or request.user.email,
            email=request.user.email,
            user=request.user,
            session_key=attempt.session_key,
        )

    if identity_form is None:
        if request.user.is_authenticated and request.user.email:
            identity_form = AILiteracyIdentityForm(
                initial={
                    "name": request.user.get_full_name() or request.user.email,
                    "email": request.user.email,
                }
            )
        else:
            identity_form = AILiteracyIdentityForm()

    percentile = percentile_higher_than(ali_entry.ali_score) if ali_entry else None
    share_links = share_links_for_score(ali_entry.ali_score) if ali_entry else {}

    rank, playful_message = rank_for_score(attempt.result.score)
    return render(
        request,
        "quiz/result.html",
        {
            "attempt": attempt,
            "result": attempt.result,
            "rank": rank,
            "playful_message": playful_message,
            "ali_entry": ali_entry,
            "ali_identity_form": identity_form,
            "ali_percentile": percentile,
            "share_links": share_links,
        },
    )


@require_http_methods(["POST"])
def skip_prompt(request):
    next_url = request.POST.get("next") or reverse("core:home")
    if not url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
        next_url = reverse("core:home")
    return HttpResponseRedirect(next_url)
