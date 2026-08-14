from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import redirect_to_login
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect, render
from urllib.parse import quote

from .forms import MicrocourseStartForm
from .challenge_services import (
    CHALLENGE_SLUG,
    build_challenge_outline,
    challenge_summary,
    find_lesson_row,
    mark_lesson_complete,
    ordered_course_lessons,
)
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


def lesson_detail(request, course_slug: str, lesson_slug: str):
    lesson = (
        Lesson.objects.select_related("module", "module__course")
        .filter(module__course__slug=course_slug, slug=lesson_slug)
        .order_by("module__order", "order")
        .first()
    )
    if not lesson:
        raise Http404("Lesson not found")

    if lesson.module.course.slug == CHALLENGE_SLUG:
        return redirect(
            "learning:challenge_lesson",
            course_slug=course_slug,
            lesson_slug=lesson_slug,
        )
    if not request.user.is_authenticated:
        return redirect_to_login(request.get_full_path())

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


def challenge_home(request, course_slug):
    course = get_object_or_404(
        Course.objects.prefetch_related("modules__lessons").select_related("product"),
        slug=course_slug,
    )
    enrollment = None
    if request.user.is_authenticated:
        enrollment = Enrollment.objects.filter(user=request.user, course=course).first()
    outline = build_challenge_outline(course, enrollment)
    summary = challenge_summary(enrollment) if enrollment else None
    return render(
        request,
        "learning/challenge_home.html",
        {
            "course": course,
            "product": getattr(course, "product", None),
            "enrollment": enrollment,
            "outline": outline,
            "challenge_summary": summary,
        },
    )


def challenge_module(request, course_slug, module_order):
    course = get_object_or_404(
        Course.objects.prefetch_related("modules__lessons"),
        slug=course_slug,
    )
    module = get_object_or_404(course.modules.all(), order=module_order)
    enrollment = None
    if request.user.is_authenticated:
        enrollment = Enrollment.objects.filter(user=request.user, course=course).first()
    module_row = next(
        (row for row in build_challenge_outline(course, enrollment) if row["module"].pk == module.pk),
        None,
    )
    if module_row is None:
        raise Http404("Module not found.")
    return render(
        request,
        "learning/challenge_module.html",
        {
            "course": course,
            "module_row": module_row,
            "enrollment": enrollment,
        },
    )


def challenge_lesson(request, course_slug, lesson_slug):
    course = get_object_or_404(
        Course.objects.prefetch_related("modules__lessons").select_related("product"),
        slug=course_slug,
    )
    lesson = get_object_or_404(
        Lesson.objects.select_related("module", "module__course"),
        module__course=course,
        slug=lesson_slug,
    )
    enrollment = None
    if request.user.is_authenticated:
        enrollment = Enrollment.objects.filter(user=request.user, course=course).first()
    row = find_lesson_row(course, lesson, enrollment)
    if row is None:
        raise Http404("Lesson not found.")

    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect_to_login(request.get_full_path())
        if enrollment is None:
            messages.error(request, "Enroll in the challenge before completing lessons.")
            return redirect("learning:challenge_home", course_slug=course.slug)
        if not row["available"]:
            messages.info(request, f"Day {row['day_number']} has not unlocked yet.")
            return redirect(
                "learning:challenge_lesson",
                course_slug=course.slug,
                lesson_slug=lesson.slug,
            )
        mark_lesson_complete(enrollment, lesson)
        if row["is_bonus"]:
            messages.success(request, "Bonus lesson marked complete.")
        else:
            messages.success(request, f"Day {row['day_number']} marked complete.")
            if challenge_summary(enrollment)["is_complete"]:
                return redirect("learning:challenge_graduation", course_slug=course.slug)
        return redirect("learning:challenge_home", course_slug=course.slug)

    lessons = list(ordered_course_lessons(course, include_bonus=row["is_bonus"]))
    current_index = next(index for index, item in enumerate(lessons) if item.pk == lesson.pk)
    previous_lesson = lessons[current_index - 1] if current_index > 0 else None
    next_lesson = lessons[current_index + 1] if current_index + 1 < len(lessons) else None
    summary = challenge_summary(enrollment) if enrollment else None
    return render(
        request,
        "learning/challenge_lesson.html",
        {
            "course": course,
            "product": getattr(course, "product", None),
            "lesson": lesson,
            "lesson_row": row,
            "enrollment": enrollment,
            "challenge_summary": summary,
            "previous_lesson": previous_lesson,
            "next_lesson": next_lesson,
        },
    )


@login_required
def challenge_graduation(request, course_slug):
    course = get_object_or_404(Course, slug=course_slug)
    enrollment = get_object_or_404(Enrollment, user=request.user, course=course)
    summary = challenge_summary(enrollment)
    if not summary["is_complete"]:
        messages.info(request, "Complete all 21 challenge days to open graduation.")
        return redirect("learning:challenge_home", course_slug=course.slug)

    attempt = get_object_or_404(
        CourseAttempt.objects.select_related("certificate"),
        course=course,
        user=request.user,
        completed_at__isnull=False,
    )
    certificate = getattr(attempt, "certificate", None)

    from apps.referrals.services import build_referral_url, get_or_create_share_referral

    referral = get_or_create_share_referral(request.user)
    referral_url = build_referral_url(request, referral)
    share_message = (
        "I just completed the 21-Day AI Challenge and built a practical AI habit. "
        f"Join me here: {referral_url}"
    )
    return render(
        request,
        "learning/challenge_graduation.html",
        {
            "course": course,
            "enrollment": enrollment,
            "challenge_summary": summary,
            "attempt": attempt,
            "certificate": certificate,
            "referral_url": referral_url,
            "referral_message": share_message,
            "whatsapp_share_url": f"https://wa.me/?text={quote(share_message)}",
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
            "lessons": lessons,
            "completed": completed,
            "completed_lesson_ids": set(attempt.lesson_completions.values_list("lesson_id", flat=True)),
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
