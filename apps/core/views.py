from datetime import date, timedelta

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from apps.catalog.models import Product
from apps.learning.models import Course, Enrollment
from apps.orders.models import Order

from .forms import MentorshipBookingForm, ProjectSubmissionForm, ReferralApplicationForm
from .models import Mentor, PremiumResource, Project, ReferralProgram, Testimonial


# Public landing page

def home(request):
    featured_book = Product.objects.filter(
        slug="ai-confidence-in-21-days", product_type=Product.ProductType.BOOK, is_active=True
    ).first()
    featured_courses = Course.objects.filter(is_featured=True).select_related("product")[:3]
    testimonials = Testimonial.objects.filter(is_featured=True)[:3]
    context = {
        "featured_book": featured_book,
        "featured_courses": featured_courses,
        "testimonials": testimonials,
    }
    return render(request, "core/home.html", context)


# Community and projects

def community_forum(request):
    discussions = [
        "Weekly AI ethics debate",
        "Nigerian startup automation ideas",
        "Prompt critique sessions",
        "Local AI events and meetups",
    ]
    return render(request, "core/community_forum.html", {"discussions": discussions})


def projects_showcase(request):
    projects = Project.objects.filter(is_published=True)
    return render(request, "core/projects_showcase.html", {"projects": projects})


def project_detail(request, slug: str):
    project = get_object_or_404(Project, slug=slug, is_published=True)
    return render(request, "core/project_detail.html", {"project": project})


def about(request):
    stats = {
        "learners": "5,000+",
        "courses": "12+",
        "projects": str(Project.objects.filter(is_published=True).count()) + "+",
    }
    return render(request, "core/about.html", {"stats": stats})


# Mentorship flow

def mentor_profile(request, slug: str = "tunde-bakare"):
    mentor = get_object_or_404(Mentor, slug=slug, is_active=True)
    return render(request, "core/mentor_profile.html", {"mentor": mentor})


def mentorship_book(request):
    form = MentorshipBookingForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        data = form.cleaned_data.copy()
        data["preferred_date"] = data["preferred_date"].isoformat()
        data["preferred_time"] = data["preferred_time"].strftime("%H:%M")
        request.session["mentorship_booking_draft"] = data
        return redirect("core:mentorship_confirm")

    return render(request, "core/mentorship_book.html", {"form": form})


def mentorship_confirm(request):
    booking = request.session.get("mentorship_booking_draft")
    if not booking:
        messages.info(request, "Please fill the booking form first.")
        return redirect("core:mentorship_book")

    if request.method == "POST":
        request.session["mentorship_booking_last"] = booking
        request.session.pop("mentorship_booking_draft", None)
        return redirect("core:mentorship_success")

    return render(request, "core/mentorship_confirm.html", {"booking": booking})


def mentorship_success(request):
    booking = request.session.get("mentorship_booking_last")
    return render(request, "core/mentorship_success.html", {"booking": booking})


# Premium pages
@login_required
def premium_dashboard(request):
    enrollments = Enrollment.objects.filter(user=request.user).select_related("course")
    paid_orders_count = Order.objects.filter(user=request.user, status=Order.Status.PAID).count()
    premium_resources = PremiumResource.objects.filter(is_published=True)

    return render(
        request,
        "core/premium_dashboard.html",
        {
            "enrollments": enrollments,
            "premium_resources": premium_resources,
            "paid_orders_count": paid_orders_count,
        },
    )


@login_required
def premium_resource_detail(request, slug: str):
    resource = get_object_or_404(PremiumResource, slug=slug, is_published=True)

    return render(request, "core/premium_resource_detail.html", {"resource": resource})


# Referral pages

def referral_network(request):
    form = ReferralApplicationForm(request.POST or None)
    programs = ReferralProgram.objects.filter(is_active=True)
    if request.method == "POST" and form.is_valid():
        request.session["referral_application_last"] = form.cleaned_data
        return redirect("core:referral_apply_success")

    return render(
        request,
        "core/referral_network.html",
        {
            "programs": programs,
            "form": form,
        },
    )


def referral_detail(request, slug: str):
    program = get_object_or_404(ReferralProgram, slug=slug, is_active=True)

    return render(request, "core/referral_detail.html", {"program": program})


def referral_apply_success(request):
    application = request.session.get("referral_application_last")
    return render(request, "core/referral_apply_success.html", {"application": application})


@login_required
def referral_status(request):
    application = request.session.get("referral_application_last", {})
    statuses = [
        {"step": "Application Submitted", "status": "Completed"},
        {"step": "Review in Progress", "status": "In Progress"},
        {"step": "Activation", "status": "Pending"},
    ]
    return render(
        request,
        "core/referral_status.html",
        {
            "application": application,
            "statuses": statuses,
        },
    )


# Project submission

def project_submit(request):
    form = ProjectSubmissionForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        request.session["project_submission_last"] = form.cleaned_data
        return redirect("core:project_submitted")
    return render(request, "core/project_submit.html", {"form": form})


def project_submitted(request):
    submission = request.session.get("project_submission_last")
    return render(request, "core/project_submitted.html", {"submission": submission})


# Billing and subscription pages
@login_required
def subscription_billing(request):
    next_renewal = date.today() + timedelta(days=30)
    return render(
        request,
        "core/subscription_billing.html",
        {
            "current_plan": request.session.get("subscription_plan", "Pro Plan"),
            "next_renewal": next_renewal,
            "paid_orders_count": Order.objects.filter(user=request.user, status=Order.Status.PAID).count(),
        },
    )


@login_required
def billing_history(request):
    orders = Order.objects.filter(user=request.user, status=Order.Status.PAID).prefetch_related("items")
    return render(request, "core/billing_history.html", {"orders": orders})


@login_required
def billing_payment_methods(request):
    methods = [
        {"label": "Visa **** 4821", "primary": True, "expires": "08/28"},
        {"label": "Mastercard **** 1994", "primary": False, "expires": "11/27"},
    ]
    return render(request, "core/billing_payment_methods.html", {"methods": methods})


@login_required
def change_subscription_plan(request):
    available_plans = [
        {"code": "starter", "name": "Starter", "price": "₦15,000 / month"},
        {"code": "pro", "name": "Pro", "price": "₦30,000 / month"},
        {"code": "elite", "name": "Elite", "price": "₦55,000 / month"},
    ]

    if request.method == "POST":
        selected = request.POST.get("plan")
        valid = {plan["code"]: plan for plan in available_plans}
        if selected in valid:
            request.session["subscription_plan"] = valid[selected]["name"]
            return redirect("core:plan_upgrade_success")
        messages.error(request, "Please select a valid plan.")

    return render(
        request,
        "core/change_subscription_plan.html",
        {
            "available_plans": available_plans,
            "current_plan": request.session.get("subscription_plan", "Pro Plan"),
        },
    )


@login_required
def plan_upgrade_success(request):
    return render(
        request,
        "core/plan_upgrade_success.html",
        {"current_plan": request.session.get("subscription_plan", "Pro Plan")},
    )
