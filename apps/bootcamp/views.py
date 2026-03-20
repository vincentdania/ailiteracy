import logging

from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme

from apps.quiz.models import Result

from .forms import BootcampInterestForm
from .models import BootcampInterest

logger = logging.getLogger(__name__)


def _safe_next_url(request):
    candidate = request.POST.get("next") or request.GET.get("next")
    if candidate and url_has_allowed_host_and_scheme(candidate, allowed_hosts={request.get_host()}):
        return candidate
    return reverse("core:home")


def interest(request):
    result_id = request.POST.get("result_id") or request.GET.get("result")
    result = Result.objects.select_related("attempt", "attempt__user").filter(pk=result_id).first()
    if result:
        allow = False
        if request.user.is_authenticated and result.attempt.user_id == request.user.id:
            allow = True
        elif result.attempt.user_id is None and request.session.session_key and result.attempt.session_key == request.session.session_key:
            allow = True
        if not allow:
            result = None

    initial = {"attendance_type": BootcampInterest.AttendanceType.ONLINE}
    if result:
        user = result.attempt.user
        if user and user.is_authenticated:
            initial["name"] = user.get_full_name() or user.email
            initial["email"] = user.email

    next_url = request.POST.get("next") or request.GET.get("next") or ""

    form = BootcampInterestForm(request.POST or None, initial=initial)
    if request.method == "POST" and form.is_valid():
        interest_obj = form.save(commit=False)
        interest_obj.ai_level = result.level if result else Result.Level.BEGINNER
        interest_obj.quiz_score = result.percent if result else 0
        interest_obj.save()

        context = {"interest": interest_obj}
        try:
            send_mail(
                subject="Masterclass Registration Received - AIliteracy.ng",
                message=render_to_string("bootcamp/emails/confirmation.txt", context),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[interest_obj.email],
                fail_silently=False,
            )
        except Exception:
            logger.exception("Failed to send bootcamp confirmation email to %s", interest_obj.email)

        if settings.DEFAULT_FROM_EMAIL:
            try:
                send_mail(
                    subject="New Masterclass Registration",
                    message=render_to_string("bootcamp/emails/admin_notification.txt", context),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.DEFAULT_FROM_EMAIL],
                    fail_silently=False,
                )
            except Exception:
                logger.exception("Failed to send bootcamp admin notification for interest %s", interest_obj.id)

        messages.success(request, "Thanks! Your masterclass registration has been recorded.")
        return redirect(_safe_next_url(request))

    context = {
        "form": form,
        "result": result,
        "ai_level": result.level if result else "",
        "quiz_score": result.percent if result else "",
        "next_url": next_url,
        "selected_attendance": form["attendance_type"].value() or initial["attendance_type"],
    }
    return render(request, "bootcamp/interest.html", context)
