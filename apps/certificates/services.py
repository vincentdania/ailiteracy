from io import BytesIO

from django.core.files.base import ContentFile
from django.utils import timezone

from .models import Certificate


def _render_certificate_pdf(certificate):
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        raise RuntimeError("ReportLab is required for certificate generation.") from exc

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    pdf.setFillColor(colors.HexColor("#0a2540"))
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    pdf.setFillColor(colors.HexColor("#66ffcc"))
    pdf.roundRect(40, height - 120, width - 80, 60, 12, fill=1, stroke=0)
    pdf.setFillColor(colors.HexColor("#101816"))
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawCentredString(width / 2, height - 85, "AIliteracy.ng Certificate of Completion")

    pdf.setFillColor(colors.white)
    pdf.setFont("Helvetica", 14)
    pdf.drawCentredString(width / 2, height - 170, "This certifies that")

    pdf.setFont("Helvetica-Bold", 28)
    pdf.drawCentredString(width / 2, height - 220, certificate.name)

    pdf.setFont("Helvetica", 14)
    pdf.drawCentredString(width / 2, height - 260, "has successfully completed")

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawCentredString(width / 2, height - 295, certificate.course.title)

    pdf.setFont("Helvetica", 12)
    completion_date = timezone.localtime(certificate.issued_at).strftime("%B %d, %Y")
    pdf.drawCentredString(width / 2, height - 340, "Date Issued: %s" % completion_date)
    pdf.drawCentredString(width / 2, height - 360, "Certificate ID: %s" % certificate.certificate_id)

    pdf.setStrokeColor(colors.HexColor("#66ffcc"))
    pdf.line(120, 140, width - 120, 140)
    pdf.setFont("Helvetica-Oblique", 10)
    pdf.drawCentredString(width / 2, 125, "Verify this certificate at ailiteracy.ng")

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


def issue_certificate(course_attempt, name, email, user=None):
    certificate, created = Certificate.objects.get_or_create(
        course_attempt=course_attempt,
        defaults={
            "user": user,
            "name": name,
            "email": email,
            "course": course_attempt.course,
        },
    )
    if not created and certificate.pdf_file:
        return certificate

    certificate.user = user or certificate.user
    certificate.name = name
    certificate.email = email
    certificate.course = course_attempt.course
    certificate.save()

    pdf_bytes = _render_certificate_pdf(certificate)
    filename = "certificate-%s.pdf" % certificate.certificate_id
    certificate.pdf_file.save(filename, ContentFile(pdf_bytes), save=True)
    return certificate
