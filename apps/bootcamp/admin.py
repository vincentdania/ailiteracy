import csv

from django.contrib import admin
from django.http import HttpResponse

from .models import BootcampInterest


def export_as_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="bootcamp_interest_export.csv"'
    writer = csv.writer(response)
    writer.writerow(
        [
            "Name",
            "Email",
            "Phone",
            "Attendance Type",
            "Location",
            "AI Level",
            "Quiz Score",
            "Occupation",
            "Created At",
        ]
    )
    for item in queryset:
        writer.writerow(
            [
                item.name,
                item.email,
                item.phone,
                item.attendance_type,
                item.location,
                item.ai_level,
                item.quiz_score,
                item.occupation,
                item.created_at.isoformat(),
            ]
        )
    return response


export_as_csv.short_description = "Export selected entries as CSV"


@admin.register(BootcampInterest)
class BootcampInterestAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "attendance_type", "location", "ai_level", "quiz_score", "created_at")
    list_filter = ("attendance_type", "ai_level", "created_at")
    search_fields = ("name", "email", "phone")
    actions = [export_as_csv]
