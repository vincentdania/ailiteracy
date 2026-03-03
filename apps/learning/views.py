from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render

from .forms import MicrocourseStartForm
from .microcourse_services import (
    can_access_attempt,
    finalize_microcourse_attempt,
    get_or_create_attempt,
)
from .models import (
    Course,
    CourseAttempt,
    CourseFinalQuizAnswer,
    CourseLessonCompletion,
    Enrollment,
    Lesson,
)


@login_required
def lesson_detail(request, course_slug: str, lesson_slug: str):
    lesson = (
        Lesson.objects.select_related("module", "module__course")
        .filter(module__course__slug=course_slug, slug=lesson_slug)
        .order_by("module__order", "order")
        .first()
    )
    if not lesson:
        raise Http404("Lesson not found")

    enrollment = Enrollment.objects.filter(user=request.user, course=lesson.module.course).first()
    if not enrollment and not lesson.is_preview:
        messages.error(request, "You need to enroll in this course to access this lesson.")
        return redirect("catalog:course_detail", slug=course_slug)

    completed = False
    progress_percentage = 0
    if enrollment:
        progress = enrollment.lesson_progress.filter(lesson=lesson, completed_at__isnull=False).first()
        completed = bool(progress)
        progress_percentage = enrollment.progress_percentage

    return render(
        request,
        "learning/lesson_detail.html",
        {
            "lesson": lesson,
            "enrollment": enrollment,
            "completed": completed,
            "progress_percentage": progress_percentage,
        },
    )


def _microcourse_attempt_or_404(request, course_slug, attempt_id):
    attempt = (
        CourseAttempt.objects.select_related("course", "user")
        .prefetch_related("course__modules__lessons", "course__final_quiz_questions__options")
        .filter(pk=attempt_id, course__slug=course_slug)
        .first()
    )
    if not attempt or not can_access_attempt(request, attempt):
        raise Http404("Course attempt not found.")
    return attempt


def microcourse_overview(request, course_slug):
    course = get_object_or_404(
        Course.objects.prefetch_related("modules__lessons", "final_quiz_questions"),
        slug=course_slug,
    )
    require_identity = not request.user.is_authenticated
    start_form = MicrocourseStartForm(request.POST or None, require_identity=require_identity)

    current_attempt = None
    if request.user.is_authenticated:
        current_attempt = CourseAttempt.objects.filter(course=course, user=request.user).order_by("-started_at").first()
    elif request.session.session_key:
        current_attempt = (
            CourseAttempt.objects.filter(course=course, user__isnull=True, session_key=request.session.session_key)
            .order_by("-started_at")
            .first()
        )

    if request.method == "POST" and start_form.is_valid():
        attempt = get_or_create_attempt(
            request,
            course=course,
            name=start_form.cleaned_data.get("name", ""),
            email=start_form.cleaned_data.get("email", ""),
        )
        first_lesson = Lesson.objects.filter(module__course=course).order_by("module__order", "order").first()
        if first_lesson:
            return redirect(
                "learning:microcourse_lesson",
                course_slug=course.slug,
                attempt_id=attempt.id,
                lesson_slug=first_lesson.slug,
            )
        return redirect("learning:microcourse_final_quiz", course_slug=course.slug, attempt_id=attempt.id)

    return render(
        request,
        "learning/microcourse_overview.html",
        {
            "course": course,
            "start_form": start_form,
            "current_attempt": current_attempt,
        },
    )


def microcourse_lesson(request, course_slug, attempt_id, lesson_slug):
    attempt = _microcourse_attempt_or_404(request, course_slug, attempt_id)
    lessons = list(Lesson.objects.filter(module__course=attempt.course).order_by("module__order", "order"))
    lesson = (
        Lesson.objects.select_related("module", "module__course")
        .filter(module__course=attempt.course, slug=lesson_slug)
        .first()
    )
    if not lesson:
        raise Http404("Lesson not found.")

    completed = CourseLessonCompletion.objects.filter(attempt=attempt, lesson=lesson).exists()
    next_lesson = None
    previous_lesson = None
    for idx, item in enumerate(lessons):
        if item.id == lesson.id:
            previous_lesson = lessons[idx - 1] if idx > 0 else None
            next_lesson = lessons[idx + 1] if idx + 1 < len(lessons) else None
            break

    if request.method == "POST":
        CourseLessonCompletion.objects.get_or_create(attempt=attempt, lesson=lesson)
        if next_lesson:
            return redirect(
                "learning:microcourse_lesson",
                course_slug=attempt.course.slug,
                attempt_id=attempt.id,
                lesson_slug=next_lesson.slug,
            )
        return redirect("learning:microcourse_final_quiz", course_slug=attempt.course.slug, attempt_id=attempt.id)

    return render(
        request,
        "learning/microcourse_lesson.html",
        {
            "attempt": attempt,
            "course": attempt.course,
            "lesson": lesson,
            "completed": completed,
            "previous_lesson": previous_lesson,
            "next_lesson": next_lesson,
            "progress_percentage": attempt.progress_percentage,
        },
    )


def microcourse_final_quiz(request, course_slug, attempt_id):
    attempt = _microcourse_attempt_or_404(request, course_slug, attempt_id)
    questions = list(attempt.course.final_quiz_questions.all())
    if not questions:
        messages.error(request, "Final quiz has not been configured yet.")
        return redirect("learning:microcourse_overview", course_slug=attempt.course.slug)

    if request.method == "POST":
        missing = []
        for question in questions:
            option_id = request.POST.get("question_%s" % question.id)
            option = question.options.filter(pk=option_id).first()
            if not option:
                missing.append(question.order)
                continue
            CourseFinalQuizAnswer.objects.update_or_create(
                attempt=attempt,
                question=question,
                defaults={"selected_option": option},
            )

        if missing:
            messages.error(request, "Please answer all final quiz questions before submitting.")
        else:
            finalize_microcourse_attempt(attempt)
            if attempt.passed:
                from apps.certificates.services import issue_certificate

                holder_name = attempt.name or (request.user.get_full_name() if request.user.is_authenticated else "")
                holder_name = holder_name or attempt.email or "Learner"
                holder_email = attempt.email or (request.user.email if request.user.is_authenticated else "")
                if holder_email:
                    try:
                        certificate = issue_certificate(
                            course_attempt=attempt,
                            name=holder_name,
                            email=holder_email,
                            user=request.user if request.user.is_authenticated else None,
                        )
                        request.session["latest_certificate_id"] = str(certificate.certificate_id)
                    except RuntimeError:
                        messages.warning(request, "Certificate generation is temporarily unavailable.")
                else:
                    messages.error(request, "Name and email are required to issue a certificate.")
            return redirect("learning:microcourse_result", course_slug=attempt.course.slug, attempt_id=attempt.id)

    return render(
        request,
        "learning/microcourse_final_quiz.html",
        {
            "attempt": attempt,
            "course": attempt.course,
            "questions": questions,
        },
    )


def microcourse_result(request, course_slug, attempt_id):
    attempt = _microcourse_attempt_or_404(request, course_slug, attempt_id)
    certificate = getattr(attempt, "certificate", None)
    return render(
        request,
        "learning/microcourse_result.html",
        {
            "attempt": attempt,
            "course": attempt.course,
            "certificate": certificate,
        },
    )
