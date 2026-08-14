from django.urls import path

from . import views

app_name = "certificates"

urlpatterns = [
    path("my/", views.my_certificates, name="my"),
    path("claim/<int:attempt_id>/", views.claim_certificate, name="claim"),
    path("<uuid:certificate_id>/", views.verify_certificate, name="verify"),
    path("<uuid:certificate_id>/download/", views.download_certificate, name="download"),
]
