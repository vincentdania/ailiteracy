from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Quiz(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class Question(models.Model):
    class Kind(models.TextChoices):
        SINGLE = "SINGLE", "Single Select"
        MULTI = "MULTI", "Multi Select"

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    order = models.PositiveIntegerField(default=1)
    kind = models.CharField(max_length=10, choices=Kind.choices, default=Kind.SINGLE)
    multi_select_count = models.PositiveSmallIntegerField(default=1)

    class Meta:
        ordering = ["quiz", "order"]
        constraints = [
            models.UniqueConstraint(fields=["quiz", "order"], name="unique_quiz_question_order"),
        ]

    def __str__(self):
        return "Q%s: %s" % (self.order, self.text[:72])

    def expected_correct_count(self):
        return 1 if self.kind == self.Kind.SINGLE else 2

    def clean(self):
        if self.kind == self.Kind.SINGLE and self.multi_select_count != 1:
            raise ValidationError("SINGLE questions must have multi_select_count = 1.")
        if self.kind == self.Kind.MULTI and self.multi_select_count != 2:
            raise ValidationError("MULTI questions must have multi_select_count = 2.")

    def validate_correct_option_count(self, correct_count):
        expected = self.expected_correct_count()
        if correct_count != expected:
            raise ValidationError(
                "Question '%s' expects exactly %s correct option(s), got %s."
                % (self.text[:50], expected, correct_count)
            )


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=280)
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.text


class Attempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="quiz_attempts",
    )
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_limit_seconds = models.PositiveIntegerField(default=1200)
    time_taken_seconds = models.PositiveIntegerField(default=0)
    is_timed_out = models.BooleanField(default=False)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return "Attempt %s - %s" % (self.id, self.quiz.title)

    @property
    def is_completed(self):
        return bool(self.completed_at)


class AttemptAnswer(models.Model):
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="attempt_answers")
    selected_options = models.ManyToManyField(Option, blank=True, related_name="attempt_answers")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["attempt", "question"], name="unique_attempt_question_answer"),
        ]

    def clean(self):
        if self.question.quiz_id != self.attempt.quiz_id:
            raise ValidationError("Question does not belong to this attempt quiz.")

    def __str__(self):
        return "Attempt %s - Q%s" % (self.attempt_id, self.question.order)


class Result(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "Beginner", "Beginner"
        INTERMEDIATE = "Intermediate", "Intermediate"
        PROFICIENT = "Proficient", "Proficient"
        ADVANCED = "Advanced", "Advanced"
        ELITE = "Elite", "Elite"

    attempt = models.OneToOneField(Attempt, on_delete=models.CASCADE, related_name="result")
    score = models.PositiveSmallIntegerField(default=0)
    percent = models.PositiveSmallIntegerField(default=0)
    level = models.CharField(max_length=20, choices=Level.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return "Result %s - %s/10 (%s%%, %s)" % (self.attempt_id, self.score, self.percent, self.level)
