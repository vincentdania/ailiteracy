from django.urls import path

from . import views

app_name = "referrals"

urlpatterns = [
    path("<str:code>/", views.accept_referral, name="accept"),
]
