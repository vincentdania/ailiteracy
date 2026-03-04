from django.urls import path

from . import views

app_name = "ai_index"

urlpatterns = [
    path("insights/", views.insights, name="insights"),
]
