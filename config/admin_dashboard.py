from django.contrib import admin
from django.contrib.auth import get_user_model
from django.db.models import Avg
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils import timezone

from apps.ai_index.models import AILiteracyScore
from apps.catalog.models import Product
from apps.certificates.models import Certificate
from apps.content.models import BlogPost, Resource
from apps.pages.models import MasterclassRegistration, QuizSubmission


def _quiz_level(score):
    if score <= 3:
        return "Beginner"
    if score <= 6:
        return "Intermediate"
    if score <= 8:
        return "Advanced"
    return "AI Fluent"


def _build_quick_link(request, model, title, caption):
    model_admin = admin.site._registry.get(model)
    if not model_admin:
        return None

    permissions = model_admin.get_model_perms(request)
    if not any(permissions.values()):
        return None

    return {
        "title": title,
        "caption": caption,
        "url": reverse(f"admin:{model._meta.app_label}_{model._meta.model_name}_changelist"),
        "count": model.objects.count(),
    }


def dashboard_view(request):
    today = timezone.localdate()
    user_model = get_user_model()

    registrations = MasterclassRegistration.objects.all()
    quiz_submissions = QuizSubmission.objects.all()

    registrations_today = registrations.filter(created_at__date=today).count()
    quiz_today = quiz_submissions.filter(created_at__date=today).count()
    average_quiz_score = quiz_submissions.aggregate(avg=Avg("score")).get("avg") or 0
    unique_registration_emails = registrations.values("email").distinct().count()

    recent_registrations = registrations.order_by("-created_at")[:8]
    recent_quiz_submissions = [
        {
            "score": submission.score,
            "level": _quiz_level(submission.score),
            "created_at": submission.created_at,
        }
        for submission in quiz_submissions.order_by("-created_at")[:8]
    ]

    quick_links = [
        _build_quick_link(request, MasterclassRegistration, "Masterclass registrations", "View and export new leads"),
        _build_quick_link(request, QuizSubmission, "Quiz submissions", "Monitor score activity"),
        _build_quick_link(request, user_model, "Users", "Manage admin and site users"),
        _build_quick_link(request, Product, "Products", "Update workbook and digital offers"),
        _build_quick_link(request, BlogPost, "Blog posts", "Edit articles and announcements"),
        _build_quick_link(request, Resource, "Resources", "Manage free downloads and guides"),
        _build_quick_link(request, Certificate, "Certificates", "Review issued certificates"),
        _build_quick_link(request, AILiteracyScore, "AI literacy scores", "Inspect deeper assessment outcomes"),
    ]

    context = {
        **admin.site.each_context(request),
        "title": "Dashboard",
        "dashboard_cards": [
            {
                "title": "Masterclass registrations",
                "value": registrations.count(),
                "delta": f"+{registrations_today} today",
                "tone": "emerald",
            },
            {
                "title": "Quiz submissions",
                "value": quiz_submissions.count(),
                "delta": f"+{quiz_today} today",
                "tone": "blue",
            },
            {
                "title": "Average quiz score",
                "value": f"{average_quiz_score:.1f}/10",
                "delta": "Across all submissions",
                "tone": "amber",
            },
            {
                "title": "Unique emails",
                "value": unique_registration_emails,
                "delta": "Masterclass leads captured",
                "tone": "violet",
            },
        ],
        "dashboard_highlights": [
            {
                "title": "In-person interest",
                "value": registrations.filter(mode=MasterclassRegistration.Mode.IN_PERSON).count(),
            },
            {
                "title": "Online interest",
                "value": registrations.filter(mode=MasterclassRegistration.Mode.ONLINE).count(),
            },
            {
                "title": "Abuja leads",
                "value": registrations.filter(location=MasterclassRegistration.Location.ABUJA).count(),
            },
            {
                "title": "Certificates issued",
                "value": Certificate.objects.count(),
            },
        ],
        "recent_registrations": recent_registrations,
        "recent_quiz_submissions": recent_quiz_submissions,
        "quick_links": [link for link in quick_links if link],
        "dashboard_meta": {
            "users": user_model.objects.count(),
            "products": Product.objects.count(),
            "blog_posts": BlogPost.objects.count(),
            "resources": Resource.objects.count(),
            "ai_scores": AILiteracyScore.objects.count(),
            "certificates": Certificate.objects.count(),
        },
    }
    request.current_app = admin.site.name
    return TemplateResponse(request, "admin/dashboard.html", context)
