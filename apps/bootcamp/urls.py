from django.urls import path

from . import views

app_name = "bootcamp"

urlpatterns = [
    path("interest/", views.interest, name="interest"),
]
