from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.learning.challenge_services import CHALLENGE_SLUG, challenge_summary
from apps.learning.models import Enrollment
from apps.orders.models import AccessGrant, Order


@login_required
def dashboard(request):
    orders = Order.objects.filter(user=request.user, status=Order.Status.PAID).prefetch_related("items__product")
    enrollments = Enrollment.objects.filter(user=request.user).select_related("course")

    enrollment_rows = []
    for enrollment in enrollments:
        row = {
            "enrollment": enrollment,
            "progress": enrollment.progress_percentage,
            "completed_lessons": enrollment.completed_lessons_count,
            "total_lessons": enrollment.total_lessons_count,
            "is_challenge": enrollment.course.slug == CHALLENGE_SLUG,
        }
        if row["is_challenge"]:
            row["challenge"] = challenge_summary(enrollment)
            row["continue_url_name"] = "learning:challenge_home"
        enrollment_rows.append(row)

    overall_progress = 0
    if enrollment_rows:
        overall_progress = int(sum(row["progress"] for row in enrollment_rows) / len(enrollment_rows))

    next_enrollment = None
    if enrollment_rows:
        next_enrollment = sorted(enrollment_rows, key=lambda row: row["progress"], reverse=True)[0]

    return render(
        request,
        "accounts/dashboard.html",
        {
            "orders": orders,
            "enrollment_rows": enrollment_rows,
            "overall_progress": overall_progress,
            "next_enrollment": next_enrollment,
        },
    )


@login_required
def library(request):
    grants = (
        AccessGrant.objects.filter(user=request.user)
        .select_related("product", "order")
        .filter(product__is_active=True)
        .order_by("-granted_at")
    )
    return render(request, "accounts/library.html", {"grants": grants})
