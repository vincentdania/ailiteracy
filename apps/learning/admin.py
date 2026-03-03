from django.contrib import admin

from .models import (
    Course,
    CourseAttempt,
    CourseFinalQuizAnswer,
    CourseLessonCompletion,
    Enrollment,
    FinalQuizOption,
    FinalQuizQuestion,
    Lesson,
    LessonProgress,
    Module,
)


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")
    list_filter = ("course",)
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "order", "is_preview")
    list_filter = ("module__course", "is_preview")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "created_at")
    list_filter = ("course",)


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("enrollment", "lesson", "completed_at")


class FinalQuizOptionInline(admin.TabularInline):
    model = FinalQuizOption
    extra = 1


@admin.register(FinalQuizQuestion)
class FinalQuizQuestionAdmin(admin.ModelAdmin):
    list_display = ("course", "order", "text")
    list_filter = ("course",)
    inlines = [FinalQuizOptionInline]


@admin.register(CourseAttempt)
class CourseAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "course", "user", "email", "score", "passed", "started_at", "completed_at")
    list_filter = ("course", "passed", "completed_at")
    search_fields = ("email", "name", "session_key")


@admin.register(CourseLessonCompletion)
class CourseLessonCompletionAdmin(admin.ModelAdmin):
    list_display = ("attempt", "lesson", "completed_at")
    list_filter = ("attempt__course",)


@admin.register(CourseFinalQuizAnswer)
class CourseFinalQuizAnswerAdmin(admin.ModelAdmin):
    list_display = ("attempt", "question", "selected_option")
    list_filter = ("attempt__course",)
