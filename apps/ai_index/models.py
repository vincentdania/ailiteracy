from decimal import Decimal

from django.conf import settings
from django.db import models


class AILiteracyScore(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "Beginner", "Beginner"
        EMERGING = "Emerging", "Emerging"
        PRACTITIONER = "AI Practitioner", "AI Practitioner"
        FLUENT = "AI Fluent", "AI Fluent"
        LEADER = "AI Leader", "AI Leader"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ai_literacy_scores",
    )
    deep_quiz_result = models.OneToOneField(
        "quiz.Result",
        on_delete=models.CASCADE,
        related_name="ali_score",
    )
    course_attempt = models.ForeignKey(
        "learning.CourseAttempt",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ali_scores",
    )
    name = models.CharField(max_length=160)
    email = models.EmailField()

    deep_quiz_score = models.PositiveSmallIntegerField(default=0)
    final_test_score = models.PositiveSmallIntegerField(default=0)
    microcourse_completed = models.BooleanField(default=False)

    ali_score = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal("0.00"))
    level = models.CharField(max_length=24, choices=Level.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return "%s - %s (%s)" % (self.name, self.ali_score, self.level)
