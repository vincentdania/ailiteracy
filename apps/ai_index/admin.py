import csv

from django.contrib import admin
from django.http import HttpResponse

from .models import AILiteracyScore


def export_ali_scores_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="ai_literacy_scores.csv"'
    writer = csv.writer(response)
    writer.writerow(
        [
            "Created At",
            "Name",
            "Email",
            "Deep Quiz Score",
            "Final Test Score",
            "Microcourse Completed",
            "ALI Score",
            "Level",
        ]
    )
    for item in queryset:
        writer.writerow(
            [
                item.created_at.isoformat(),
                item.name,
                item.email,
                item.deep_quiz_score,
                item.final_test_score,
                item.microcourse_completed,
                item.ali_score,
                item.level,
            ]
        )
    return response


export_ali_scores_csv.short_description = "Export selected ALI scores as CSV"


@admin.register(AILiteracyScore)
class AILiteracyScoreAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "name",
        "email",
        "deep_quiz_score",
        "final_test_score",
        "microcourse_completed",
        "ali_score",
        "level",
    )
    list_filter = ("level", "created_at", "microcourse_completed")
    search_fields = ("name", "email", "deep_quiz_result__attempt__session_key", "user__email")
    actions = [export_ali_scores_csv]
