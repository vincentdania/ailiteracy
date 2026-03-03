from django.urls import path

from . import api, views

app_name = "learning"

urlpatterns = [
    path("learn/<slug:course_slug>/lessons/<slug:lesson_slug>/", views.lesson_detail, name="lesson_detail"),
    path("api/learning/lessons/<int:lesson_id>/progress/", api.LessonProgressAPIView.as_view(), name="lesson_progress_api"),
    path("course/<slug:course_slug>/", views.microcourse_overview, name="microcourse_overview"),
    path(
        "course/<slug:course_slug>/attempt/<int:attempt_id>/lessons/<slug:lesson_slug>/",
        views.microcourse_lesson,
        name="microcourse_lesson",
    ),
    path(
        "course/<slug:course_slug>/attempt/<int:attempt_id>/final-quiz/",
        views.microcourse_final_quiz,
        name="microcourse_final_quiz",
    ),
    path(
        "course/<slug:course_slug>/attempt/<int:attempt_id>/result/",
        views.microcourse_result,
        name="microcourse_result",
    ),
]
