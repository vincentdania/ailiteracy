from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    summary = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    hero_image = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=220)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["course", "order"]
        constraints = [
            models.UniqueConstraint(fields=["course", "order"], name="unique_module_order_per_course"),
        ]

    def __str__(self) -> str:
        return f"{self.course.title}: {self.title}"


class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=220)
    slug = models.SlugField()
    content = models.TextField()
    video_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=1)
    is_preview = models.BooleanField(default=False)

    class Meta:
        ordering = ["module", "order"]
        constraints = [
            models.UniqueConstraint(fields=["module", "order"], name="unique_lesson_order_per_module"),
            models.UniqueConstraint(fields=["module", "slug"], name="unique_lesson_slug_per_module"),
        ]

    def __str__(self) -> str:
        return self.title


class Enrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "course"], name="unique_enrollment_per_user_course"),
        ]

    def __str__(self) -> str:
        return f"{self.user} - {self.course}"

    @property
    def total_lessons_count(self) -> int:
        return Lesson.objects.filter(module__course=self.course).count()

    @property
    def completed_lessons_count(self) -> int:
        return LessonProgress.objects.filter(enrollment=self, completed_at__isnull=False).count()

    @property
    def progress_percentage(self) -> int:
        total = self.total_lessons_count
        if total == 0:
            return 0
        return int((self.completed_lessons_count / total) * 100)


class LessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress_entries")
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["enrollment", "lesson"], name="unique_lesson_progress_per_enrollment"),
        ]

    def __str__(self) -> str:
        return f"{self.enrollment} - {self.lesson}"


class FinalQuizQuestion(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="final_quiz_questions")
    text = models.TextField()
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["course", "order"]
        constraints = [
            models.UniqueConstraint(fields=["course", "order"], name="unique_final_quiz_question_order_per_course"),
        ]

    def __str__(self) -> str:
        return f"{self.course.title} Q{self.order}"


class FinalQuizOption(models.Model):
    question = models.ForeignKey(FinalQuizQuestion, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["question", "order"]
        constraints = [
            models.UniqueConstraint(fields=["question", "order"], name="unique_final_quiz_option_order_per_question"),
        ]

    def __str__(self) -> str:
        return self.text


class CourseAttempt(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_attempts")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="course_attempts",
    )
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    name = models.CharField(max_length=160, blank=True)
    email = models.EmailField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    passed = models.BooleanField(default=False)
    score = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self) -> str:
        return f"{self.course.slug} attempt #{self.id}"

    @property
    def total_lessons(self) -> int:
        return Lesson.objects.filter(module__course=self.course).count()

    @property
    def completed_lessons(self) -> int:
        return self.lesson_completions.count()

    @property
    def progress_percentage(self) -> int:
        total = self.total_lessons
        if total == 0:
            return 0
        return int((self.completed_lessons / total) * 100)


class CourseLessonCompletion(models.Model):
    attempt = models.ForeignKey(CourseAttempt, on_delete=models.CASCADE, related_name="lesson_completions")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="course_attempt_completions")
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["attempt", "lesson"], name="unique_course_lesson_completion_per_attempt"),
        ]

    def clean(self):
        if self.lesson.module.course_id != self.attempt.course_id:
            raise ValidationError("Lesson does not belong to this course attempt.")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class CourseFinalQuizAnswer(models.Model):
    attempt = models.ForeignKey(CourseAttempt, on_delete=models.CASCADE, related_name="final_quiz_answers")
    question = models.ForeignKey(FinalQuizQuestion, on_delete=models.CASCADE, related_name="attempt_answers")
    selected_option = models.ForeignKey(FinalQuizOption, on_delete=models.PROTECT, related_name="+")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["attempt", "question"], name="unique_final_quiz_answer_per_attempt"),
        ]

    def clean(self):
        if self.question.course_id != self.attempt.course_id:
            raise ValidationError("Question does not belong to this course attempt.")
        if self.selected_option.question_id != self.question_id:
            raise ValidationError("Selected option does not belong to this question.")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
