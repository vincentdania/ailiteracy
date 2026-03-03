from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.quiz.models import Result


class BootcampInterest(models.Model):
    class AttendanceType(models.TextChoices):
        ONLINE = "ONLINE", "Online"
        IN_PERSON = "IN_PERSON", "In Person"

    name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=32)
    attendance_type = models.CharField(max_length=20, choices=AttendanceType.choices)
    location = models.CharField(max_length=80, blank=True)
    ai_level = models.CharField(max_length=20, choices=Result.Level.choices)
    quiz_score = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    occupation = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return "%s (%s)" % (self.name, self.email)
