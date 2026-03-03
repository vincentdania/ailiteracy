from django.urls import path

from . import views

app_name = "quiz"

urlpatterns = [
    path("", views.home, name="home"),
    path("start/", views.start, name="start"),
    path("attempt/<int:attempt_id>/", views.take, name="take"),
    path("attempt/<int:attempt_id>/result/", views.result, name="result"),
    path("prompt/skip/", views.skip_prompt, name="skip_prompt"),
]
