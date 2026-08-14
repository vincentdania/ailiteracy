import json
from uuid import uuid4

import stripe
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from apps.catalog.models import Product

from .forms import CheckoutForm
from .models import Cart, CartItem, Order, PaymentTransaction
from .paystack import PaystackError, initialize_transaction, verify_transaction, verify_webhook_signature
from .services import (
    create_order_for_product,
    create_order_from_cart,
    fulfill_paid_order,
    handle_paystack_webhook_payload,
    process_paystack_verification,
    process_stripe_checkout_session,
)
from .stripe_gateway import StripeError, construct_webhook_event, create_checkout_session


def _initial_currency(request):
    currency = str(request.GET.get("currency") or "NGN").upper()
    return currency if currency in {"NGN", "USD"} else "NGN"


def _start_order_payment(request, order, cancel_url):
    if order.currency == "USD":
        try:
            success_url = request.build_absolute_uri(reverse("orders:checkout_success"))
            success_url += f"?order={order.id}&session_id={{CHECKOUT_SESSION_ID}}"
            session = create_checkout_session(
                order,
                success_url=success_url,
                cancel_url=request.build_absolute_uri(cancel_url),
            )
        except (StripeError, stripe.error.StripeError) as exc:
            messages.error(request, f"Stripe checkout could not start: {exc}")
            return redirect(cancel_url)
        order.stripe_session_id = session.id
        order.save(update_fields=["stripe_session_id"])
        PaymentTransaction.objects.get_or_create(
            reference=session.id,
            defaults={
                "order": order,
                "amount": order.total_amount,
                "currency": "USD",
            },
        )
        return redirect(session.url)

    if not settings.PAYSTACK_SECRET_KEY and settings.PAYSTACK_ALLOW_LOCAL_FALLBACK:
        reference = f"local-order-{order.id}-{uuid4().hex[:8]}"
        PaymentTransaction.objects.create(
            order=order,
            reference=reference,
            amount=order.total_amount,
            currency="NGN",
            status=PaymentTransaction.Status.SUCCESS,
            gateway_response="Local development payment",
        )
        fulfill_paid_order(order, reference=reference, gateway="paystack")
        return redirect(f"{reverse('orders:checkout_success')}?order={order.id}")

    try:
        payload = initialize_transaction(order, order.email)
        data = payload.get("data") or {}
        reference = data.get("reference")
        authorization_url = data.get("authorization_url")
        if not payload.get("status") or not reference or not authorization_url:
            raise PaystackError(payload.get("message") or "Paystack did not return a checkout URL.")
    except Exception as exc:
        messages.error(request, f"Paystack checkout could not start: {exc}")
        return redirect(cancel_url)

    order.paystack_reference = reference
    order.save(update_fields=["paystack_reference"])
    PaymentTransaction.objects.get_or_create(
        reference=reference,
        defaults={
            "order": order,
            "amount": order.total_amount,
            "currency": "NGN",
            "payload": payload,
        },
    )
    return redirect(authorization_url)


@login_required
def cart(request):
    cart_obj, _ = Cart.objects.get_or_create(user=request.user)
    return render(request, "orders/cart.html", {"cart": cart_obj})


@login_required
@require_POST
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id, is_active=True)
    cart_obj, _ = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart_obj, product=product)
    if not created:
        item.quantity += 1
        item.save(update_fields=["quantity"])
    messages.success(request, f"{product.title} added to your cart.")
    return redirect("orders:cart")


@login_required
@require_POST
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, pk=item_id, cart__user=request.user)
    item.delete()
    messages.success(request, "Item removed from your cart.")
    return redirect("orders:cart")


@login_required
def buy_product(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    initial_currency = _initial_currency(request)
    form = CheckoutForm(
        request.POST or None,
        initial={"email": request.user.email, "currency": initial_currency},
    )
    if request.method == "POST" and form.is_valid():
        try:
            order = create_order_for_product(
                user=request.user,
                product=product,
                email=form.cleaned_data["email"],
                currency=form.cleaned_data["currency"],
            )
        except ValueError as exc:
            form.add_error("currency", str(exc))
        else:
            return _start_order_payment(
                request,
                order,
                reverse("orders:buy_product", kwargs={"slug": product.slug}),
            )
    return render(
        request,
        "orders/checkout.html",
        {"form": form, "products": [product], "product": product},
    )


@login_required
def checkout(request):
    cart_obj = Cart.objects.filter(user=request.user).prefetch_related("items__product").first()
    if not cart_obj or not cart_obj.items.exists():
        messages.info(request, "Your cart is empty.")
        return redirect("pages:home")
    initial_currency = _initial_currency(request)
    form = CheckoutForm(
        request.POST or None,
        initial={"email": request.user.email, "currency": initial_currency},
    )
    if request.method == "POST" and form.is_valid():
        try:
            order = create_order_from_cart(
                request.user,
                email=form.cleaned_data["email"],
                currency=form.cleaned_data["currency"],
            )
        except ValueError as exc:
            form.add_error("currency", str(exc))
        else:
            return _start_order_payment(request, order, reverse("orders:checkout"))
    return render(
        request,
        "orders/checkout.html",
        {"form": form, "products": [item.product for item in cart_obj.items.all()], "cart": cart_obj},
    )


def paystack_callback(request):
    reference = request.GET.get("reference") or request.GET.get("trxref")
    if not reference:
        messages.error(request, "Missing Paystack payment reference.")
        return redirect("pages:home")
    try:
        payload = verify_transaction(reference)
    except Exception as exc:
        messages.error(request, f"We could not verify that payment yet: {exc}")
        return redirect("pages:home")
    paid, order = process_paystack_verification(reference, payload)
    if paid and order:
        return redirect(f"{reverse('orders:checkout_success')}?order={order.id}")
    messages.error(request, "Payment was not completed.")
    return redirect("pages:home")


@csrf_exempt
@require_POST
def paystack_webhook(request):
    if not verify_webhook_signature(request.body, request.headers.get("x-paystack-signature")):
        return JsonResponse({"received": False}, status=400)
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"received": False}, status=400)
    handle_paystack_webhook_payload(payload)
    return JsonResponse({"received": True})


@csrf_exempt
@require_POST
def stripe_webhook(request):
    try:
        event = construct_webhook_event(request.body, request.headers.get("stripe-signature"))
    except (ValueError, StripeError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)
    event_payload = event.to_dict() if hasattr(event, "to_dict") else dict(event)
    if event_payload.get("type") == "checkout.session.completed":
        process_stripe_checkout_session(event_payload["data"]["object"])
    return JsonResponse({"received": True})


@login_required
def checkout_success(request):
    order = get_object_or_404(
        Order.objects.prefetch_related("items").filter(user=request.user),
        pk=request.GET.get("order"),
    )
    return render(request, "orders/checkout_success.html", {"order": order})
