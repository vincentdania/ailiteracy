from io import BytesIO

from django.core.files.base import ContentFile
from django.utils import timezone

from .models import Certificate


def _fit_font_size(pdf, text, font_name, max_width, start_size, min_size):
    size = start_size
    while size > min_size and pdf.stringWidth(text, font_name, size) > max_width:
        size -= 1
    return size


def _render_certificate_pdf(certificate):
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib.utils import simpleSplit
        from reportlab.lib.units import mm
        from reportlab.pdfgen import canvas
    except ImportError as exc:
        raise RuntimeError("ReportLab is required for certificate generation.") from exc

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)

    # Background and frame
    pdf.setFillColor(colors.HexColor("#f8f6ef"))
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    outer_margin = 16 * mm
    inner_margin = 22 * mm
    pdf.setStrokeColor(colors.HexColor("#0a2540"))
    pdf.setLineWidth(2.2)
    pdf.roundRect(
        outer_margin,
        outer_margin,
        width - (outer_margin * 2),
        height - (outer_margin * 2),
        10,
        stroke=1,
        fill=0,
    )

    pdf.setStrokeColor(colors.HexColor("#b9933f"))
    pdf.setLineWidth(1.1)
    pdf.roundRect(
        inner_margin,
        inner_margin,
        width - (inner_margin * 2),
        height - (inner_margin * 2),
        8,
        stroke=1,
        fill=0,
    )

    # Header ribbon
    ribbon_h = 22 * mm
    ribbon_y = height - inner_margin - ribbon_h
    pdf.setFillColor(colors.HexColor("#0a2540"))
    pdf.roundRect(inner_margin, ribbon_y, width - (inner_margin * 2), ribbon_h, 6, fill=1, stroke=0)

    pdf.setFillColor(colors.HexColor("#66ffcc"))
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(inner_margin + (9 * mm), ribbon_y + (8.2 * mm), "AILiteracy.ng")
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawRightString(width - inner_margin - (9 * mm), ribbon_y + (8.5 * mm), "CERTIFICATE OF COMPLETION")

    # Watermark
    pdf.saveState()
    pdf.setFillColor(colors.HexColor("#e6ebf1"))
    pdf.setFont("Helvetica-Bold", 58)
    pdf.translate(width / 2, height / 2)
    pdf.rotate(24)
    pdf.drawCentredString(0, 0, "AI LITERACY")
    pdf.restoreState()

    # Main content
    top_y = ribbon_y - (13 * mm)
    pdf.setFillColor(colors.HexColor("#475569"))
    pdf.setFont("Helvetica", 13)
    pdf.drawCentredString(width / 2, top_y, "This certifies that")

    max_name_width = width - (inner_margin * 2) - (35 * mm)
    name_font_size = _fit_font_size(
        pdf,
        certificate.name,
        "Helvetica-Bold",
        max_name_width,
        start_size=40,
        min_size=24,
    )
    pdf.setFillColor(colors.HexColor("#0a2540"))
    pdf.setFont("Helvetica-Bold", name_font_size)
    name_y = top_y - (18 * mm)
    pdf.drawCentredString(width / 2, name_y, certificate.name)

    pdf.setStrokeColor(colors.HexColor("#b9933f"))
    pdf.setLineWidth(1)
    pdf.line(inner_margin + (42 * mm), name_y - (4 * mm), width - inner_margin - (42 * mm), name_y - (4 * mm))

    pdf.setFillColor(colors.HexColor("#475569"))
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(width / 2, name_y - (13 * mm), "has successfully completed the course")

    course_font = "Helvetica-Bold"
    course_font_size = 18
    course_max_width = width - (inner_margin * 2) - (50 * mm)
    course_lines = simpleSplit(certificate.course.title, course_font, course_font_size, course_max_width)
    while len(course_lines) > 2 and course_font_size > 14:
        course_font_size -= 1
        course_lines = simpleSplit(certificate.course.title, course_font, course_font_size, course_max_width)

    course_y = name_y - (24 * mm)
    pdf.setFillColor(colors.HexColor("#0a2540"))
    pdf.setFont(course_font, course_font_size)
    for index, line in enumerate(course_lines[:2]):
        pdf.drawCentredString(width / 2, course_y - (index * (course_font_size + 4)), line)

    # Certificate metadata area
    info_top = inner_margin + (42 * mm)
    box_h = 16 * mm
    box_w = (width - (inner_margin * 2) - (22 * mm)) / 2

    pdf.setStrokeColor(colors.HexColor("#cbd5e1"))
    pdf.setLineWidth(1)
    pdf.roundRect(inner_margin + (6 * mm), info_top, box_w, box_h, 4, fill=0, stroke=1)
    pdf.roundRect(inner_margin + (16 * mm) + box_w, info_top, box_w, box_h, 4, fill=0, stroke=1)

    pdf.setFillColor(colors.HexColor("#64748b"))
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(inner_margin + (10 * mm), info_top + (10 * mm), "DATE ISSUED")
    pdf.drawString(inner_margin + (20 * mm) + box_w, info_top + (10 * mm), "CERTIFICATE ID")

    pdf.setFillColor(colors.HexColor("#0f172a"))
    pdf.setFont("Helvetica", 10)
    completion_date = timezone.localtime(certificate.issued_at).strftime("%B %d, %Y")
    pdf.drawString(inner_margin + (10 * mm), info_top + (5.2 * mm), completion_date)
    pdf.drawString(inner_margin + (20 * mm) + box_w, info_top + (5.2 * mm), str(certificate.certificate_id))

    # Signature area
    sig_y = inner_margin + (17 * mm)
    left_sig_x1 = inner_margin + (14 * mm)
    left_sig_x2 = left_sig_x1 + (58 * mm)
    right_sig_x2 = width - inner_margin - (14 * mm)
    right_sig_x1 = right_sig_x2 - (58 * mm)

    pdf.setStrokeColor(colors.HexColor("#94a3b8"))
    pdf.setLineWidth(1)
    pdf.line(left_sig_x1, sig_y, left_sig_x2, sig_y)
    pdf.line(right_sig_x1, sig_y, right_sig_x2, sig_y)

    pdf.setFillColor(colors.HexColor("#475569"))
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(left_sig_x1, sig_y - (4.5 * mm), "Program Director")
    pdf.drawString(right_sig_x1, sig_y - (4.5 * mm), "Certification Office")

    # Verification seal
    seal_x = width - inner_margin - (34 * mm)
    seal_y = inner_margin + (45 * mm)
    pdf.setStrokeColor(colors.HexColor("#b9933f"))
    pdf.setLineWidth(1.6)
    pdf.circle(seal_x, seal_y, 16 * mm, stroke=1, fill=0)
    pdf.circle(seal_x, seal_y, 13 * mm, stroke=1, fill=0)
    pdf.setFillColor(colors.HexColor("#0a2540"))
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawCentredString(seal_x, seal_y + (2 * mm), "VERIFIED")
    pdf.setFont("Helvetica", 7)
    pdf.drawCentredString(seal_x, seal_y - (2.8 * mm), "AILITERACY.NG")

    pdf.setFillColor(colors.HexColor("#64748b"))
    pdf.setFont("Helvetica-Oblique", 9)
    pdf.drawCentredString(width / 2, inner_margin + (7 * mm), "Verify this certificate at ailiteracy.ng")

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
