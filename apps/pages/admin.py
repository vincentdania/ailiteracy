from django.contrib import admin

from .models import MasterclassRegistration, QuizSubmission


@admin.register(QuizSubmission)
class QuizSubmissionAdmin(admin.ModelAdmin):
    list_display = ("score", "created_at")
    list_filter = ("score", "created_at")
    ordering = ("-created_at",)


@admin.register(MasterclassRegistration)
class MasterclassRegistrationAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "location", "mode", "created_at")
    list_filter = ("location", "mode", "created_at")
    search_fields = ("name", "email", "phone")
    ordering = ("-created_at",)

