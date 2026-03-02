from django.urls import path

from . import api, views

app_name = "learning"

urlpatterns = [
    path("learn/<slug:course_slug>/lessons/<slug:lesson_slug>/", views.lesson_detail, name="lesson_detail"),
    path("api/learning/lessons/<int:lesson_id>/progress/", api.LessonProgressAPIView.as_view(), name="lesson_progress_api"),
]
