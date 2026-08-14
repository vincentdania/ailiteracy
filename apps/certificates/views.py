from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from apps.learning.models import CourseAttempt

from .models import Certificate
from .services import issue_certificate


@login_required
def my_certificates(request):
    certificates = Certificate.objects.filter(user=request.user).select_related("course")
    return render(request, "certificates/my_certificates.html", {"certificates": certificates})


def download_certificate(request, certificate_id):
    certificate = get_object_or_404(Certificate.objects.select_related("user"), certificate_id=certificate_id)

    if certificate.user_id and (not request.user.is_authenticated or request.user.id != certificate.user_id):
        raise Http404("Certificate not found.")
    if not certificate.pdf_file:
        raise Http404("Certificate file not available.")

    return FileResponse(
        certificate.pdf_file.open("rb"),
        as_attachment=True,
        filename="ailiteracy-certificate-%s.pdf" % certificate.certificate_id,
    )


def verify_certificate(request, certificate_id):
    certificate = get_object_or_404(
        Certificate.objects.select_related("course", "course_attempt"),
        certificate_id=certificate_id,
    )
    completion_date = (
        certificate.course_attempt.completed_at
        if certificate.course_attempt and certificate.course_attempt.completed_at
        else certificate.issued_at
    )
    return render(
        request,
        "certificates/verify.html",
        {"certificate": certificate, "completion_date": completion_date},
    )


@login_required
@require_POST
def claim_certificate(request, attempt_id):
    attempt = get_object_or_404(
        CourseAttempt.objects.select_related("course", "user"),
        pk=attempt_id,
        user=request.user,
        completed_at__isnull=False,
        passed=True,
    )
    certificate = issue_certificate(
        course_attempt=attempt,
        name=request.user.get_full_name() or request.user.email,
        email=request.user.email,
        user=request.user,
    )
    messages.success(request, "Your certificate is ready.")
    return redirect("certificates:verify", certificate_id=certificate.certificate_id)
