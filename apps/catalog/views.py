from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from django.conf import settings
from django.shortcuts import get_object_or_404, render

from apps.learning.models import Course, Enrollment

from .models import Product


def book_landing(request, slug: str):
    product = Product.objects.filter(
        slug=slug,
        product_type=Product.ProductType.BOOK,
        is_active=True,
    ).first()
    parsed = urlparse(settings.ECOMMERCE_PARTNER_URL)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query.update(
        {
            "utm_source": "ailiteracy.ng",
            "utm_medium": "referral",
            "utm_campaign": "ecommerce_partner",
            "product": slug,
        }
    )
    partner_book_url = urlunparse(parsed._replace(query=urlencode(query)))
    return render(
        request,
        "catalog/book_landing.html",
        {
            "product": product,
            "partner_book_url": partner_book_url,
        },
    )


def course_list(request):
    courses = Course.objects.prefetch_related("modules").select_related("product").all()
    return render(request, "catalog/course_list.html", {"courses": courses})


def course_detail(request, slug: str):
    course = get_object_or_404(Course.objects.prefetch_related("modules__lessons").select_related("product"), slug=slug)
    enrollment = None
    if request.user.is_authenticated:
        enrollment = Enrollment.objects.filter(user=request.user, course=course).first()

    return render(
        request,
        "catalog/course_detail.html",
        {
            "course": course,
            "enrollment": enrollment,
            "progress": enrollment.progress_percentage if enrollment else 0,
            "product": getattr(course, "product", None),
        },
    )


def product_detail(request, slug: str):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    return render(request, "catalog/product_detail.html", {"product": product})
