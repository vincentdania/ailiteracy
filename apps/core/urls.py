from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("", views.home, name="home"),
    path("community/", views.community_forum, name="community_forum"),
    path("projects/", views.projects_showcase, name="projects_showcase"),
    path("projects/submit/", views.project_submit, name="project_submit"),
    path("projects/submitted/", views.project_submitted, name="project_submitted"),
    path("projects/<slug:slug>/", views.project_detail, name="project_detail"),
    path("about/", views.about, name="about"),
    path("mentors/<slug:slug>/", views.mentor_profile, name="mentor_profile"),
    path("mentorship/book/", views.mentorship_book, name="mentorship_book"),
    path("mentorship/confirm/", views.mentorship_confirm, name="mentorship_confirm"),
    path("mentorship/success/", views.mentorship_success, name="mentorship_success"),
    path("premium/dashboard/", views.premium_dashboard, name="premium_dashboard"),
    path("premium/resources/<slug:slug>/", views.premium_resource_detail, name="premium_resource_detail"),
    path("referrals/", views.referral_network, name="referral_network"),
    path("referrals/application/success/", views.referral_apply_success, name="referral_apply_success"),
    path("referrals/status/", views.referral_status, name="referral_status"),
    path("referrals/<slug:slug>/", views.referral_detail, name="referral_detail"),
    path("billing/subscription/", views.subscription_billing, name="subscription_billing"),
    path("billing/history/", views.billing_history, name="billing_history"),
    path("billing/payment-methods/", views.billing_payment_methods, name="billing_payment_methods"),
    path("billing/change-plan/", views.change_subscription_plan, name="change_subscription_plan"),
    path("billing/upgrade-success/", views.plan_upgrade_success, name="plan_upgrade_success"),
]
