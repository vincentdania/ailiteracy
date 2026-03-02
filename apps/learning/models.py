from django.conf import settings
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
