from django.urls import path

from . import views

app_name = "certificates"

urlpatterns = [
    path("my/", views.my_certificates, name="my"),
    path("<uuid:certificate_id>/download/", views.download_certificate, name="download"),
]
