from django.contrib.auth.decorators import login_required
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404, render

from .models import Certificate


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
