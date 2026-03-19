from django.core.validators import RegexValidator
from django.db import models


class QuizSubmission(models.Model):
    score = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Quiz score {self.score}/10"


class MasterclassRegistration(models.Model):
    class Location(models.TextChoices):
        ABUJA = "ABUJA", "Abuja"
        ONLINE = "ONLINE", "Online"

    class Mode(models.TextChoices):
        IN_PERSON = "IN_PERSON", "In-person"
        ONLINE = "ONLINE", "Online"

    phone_validator = RegexValidator(
        regex=r"^\+?[0-9\s\-]{7,20}$",
        message="Enter a valid phone number.",
    )

    name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=32, validators=[phone_validator])
    location = models.CharField(max_length=20, choices=Location.choices)
    mode = models.CharField(max_length=20, choices=Mode.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.email})"
