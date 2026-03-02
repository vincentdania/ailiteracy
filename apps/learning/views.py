from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import redirect, render

from .models import Enrollment, Lesson


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
