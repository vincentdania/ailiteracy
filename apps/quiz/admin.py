from django.contrib import admin
from django.forms import BaseInlineFormSet

from .models import Attempt, AttemptAnswer, Option, Question, Quiz, Result


class OptionInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()
        correct_count = 0
        for form in self.forms:
            if not getattr(form, "cleaned_data", None):
                continue
            if form.cleaned_data.get("DELETE"):
                continue
            if form.cleaned_data.get("is_correct"):
                correct_count += 1

        self.instance.validate_correct_option_count(correct_count)


class OptionInline(admin.TabularInline):
    model = Option
    extra = 1
    formset = OptionInlineFormSet


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("quiz", "order", "kind", "multi_select_count", "short_text")
    list_filter = ("quiz", "kind")
    inlines = [OptionInline]

    def short_text(self, obj):
        return obj.text[:80]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_active")
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ("is_active",)


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz", "user", "started_at", "completed_at", "time_limit_seconds", "is_timed_out")
    list_filter = ("quiz", "is_timed_out", "started_at", "completed_at")
    search_fields = ("session_key", "user__email")


@admin.register(AttemptAnswer)
class AttemptAnswerAdmin(admin.ModelAdmin):
    list_display = ("attempt", "question", "selected_option_count")
    list_filter = ("question__quiz",)

    def selected_option_count(self, obj):
        return obj.selected_options.count()


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("attempt", "score", "percent", "level", "created_at", "attempt_started_at", "attempt_completed_at")
    list_filter = ("level", "created_at")
    search_fields = ("attempt__session_key", "attempt__user__email")

    def attempt_started_at(self, obj):
        return obj.attempt.started_at

    def attempt_completed_at(self, obj):
        return obj.attempt.completed_at
