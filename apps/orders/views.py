from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from django.conf import settings
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from apps.catalog.models import Product

def _partner_url(**params):
    parsed = urlparse(settings.ECOMMERCE_PARTNER_URL)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query.setdefault("utm_source", "ailiteracy.ng")
    query.setdefault("utm_medium", "referral")
    query.setdefault("utm_campaign", "ecommerce_partner")
    query.update({key: value for key, value in params.items() if value})
    return urlunparse(parsed._replace(query=urlencode(query)))


def _redirect_to_partner(request, **params):
    target_url = _partner_url(**params)
    if request.headers.get("HX-Request") == "true":
        response = HttpResponse("")
        response["HX-Redirect"] = target_url
        return response
    return redirect(target_url)


def cart(request):
    messages.info(request, f"Purchases are processed by {settings.ECOMMERCE_PARTNER_NAME}.")
    return _redirect_to_partner(request, entry="cart")


@require_POST
def add_to_cart(request, product_id: int):
    product = get_object_or_404(Product, pk=product_id, is_active=True)
    messages.info(request, f"{product.title} is available via {settings.ECOMMERCE_PARTNER_NAME}.")
    return _redirect_to_partner(request, entry="product", product=product.slug)


@require_POST
def remove_from_cart(request, item_id: int):
    messages.info(request, f"Shopping cart is managed on {settings.ECOMMERCE_PARTNER_NAME}.")
    return _redirect_to_partner(request, entry="cart")


def checkout(request):
    messages.info(request, f"Secure checkout is handled by {settings.ECOMMERCE_PARTNER_NAME}.")
    return _redirect_to_partner(request, entry="checkout")


def paystack_callback(request):
    messages.info(request, f"Payment processing now runs on {settings.ECOMMERCE_PARTNER_NAME}.")
    return _redirect_to_partner(request, entry="payment_callback")


@csrf_exempt
@require_POST
def paystack_webhook(request):
    return JsonResponse(
        {"received": False, "detail": "Payments are handled by the ecommerce partner."},
        status=410,
    )


def checkout_success(request):
    return _redirect_to_partner(request, entry="checkout_success")
