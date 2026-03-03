import uuid

from django.conf import settings
from django.db import models


class Certificate(models.Model):
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="certificates",
    )
    name = models.CharField(max_length=160)
    email = models.EmailField()
    course = models.ForeignKey("learning.Course", on_delete=models.CASCADE, related_name="certificates")
    course_attempt = models.OneToOneField(
        "learning.CourseAttempt",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="certificate",
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to="certificates/%Y/%m/", blank=True)

    class Meta:
        ordering = ["-issued_at"]

    def __str__(self):
        return "Certificate %s" % self.certificate_id
