import json

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from apps.catalog.models import Product

from .forms import CheckoutForm
from .models import Cart, CartItem, Order, PaymentTransaction
from .paystack import PaystackError, initialize_transaction, verify_transaction, verify_webhook_signature
from .services import create_order_from_cart, handle_paystack_webhook_payload, process_paystack_verification


def _get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@login_required
def cart(request):
    cart_obj = _get_or_create_cart(request.user)
    return render(request, "orders/cart.html", {"cart": cart_obj})


@login_required
@require_POST
def add_to_cart(request, product_id: int):
    product = get_object_or_404(Product, pk=product_id, is_active=True)
    cart_obj = _get_or_create_cart(request.user)

    item, created = CartItem.objects.get_or_create(cart=cart_obj, product=product, defaults={"quantity": 1})
    if not created:
        item.quantity += 1
        item.save(update_fields=["quantity"])

    if request.htmx:
        return render(
            request,
            "orders/partials/cart_feedback.html",
            {
                "message": f"{product.title} added to cart.",
                "cart_item_count": sum(cart_item.quantity for cart_item in cart_obj.items.all()),
            },
        )

    messages.success(request, f"{product.title} added to cart.")
    return redirect(request.META.get("HTTP_REFERER", reverse("orders:cart")))


@login_required
@require_POST
def remove_from_cart(request, item_id: int):
    cart_obj = _get_or_create_cart(request.user)
    item = get_object_or_404(CartItem, pk=item_id, cart=cart_obj)
    item.delete()
    messages.info(request, "Item removed from cart.")
    return redirect("orders:cart")


@login_required
def checkout(request):
    cart_obj = _get_or_create_cart(request.user)
    if not cart_obj.items.exists():
        messages.error(request, "Your cart is empty.")
        return redirect("orders:cart")

    initial_email = request.user.email or ""
    form = CheckoutForm(request.POST or None, initial={"email": initial_email})

    if request.method == "POST" and form.is_valid():
        try:
            order = create_order_from_cart(request.user, email=form.cleaned_data["email"])
        except ValueError:
            messages.error(request, "Your cart is empty.")
            return redirect("orders:cart")

        if not request.user.email:
            request.user.email = form.cleaned_data["email"]
            request.user.save(update_fields=["email"])

        try:
            gateway_payload = initialize_transaction(order, order.email)
            if not gateway_payload.get("status"):
                order.status = Order.Status.FAILED
                order.save(update_fields=["status"])
                messages.error(request, gateway_payload.get("message", "Unable to initialize payment."))
                return redirect("orders:checkout")

            gateway_data = gateway_payload.get("data", {})
            reference = gateway_data.get("reference")
            authorization_url = gateway_data.get("authorization_url")

            if not reference or not authorization_url:
                order.status = Order.Status.FAILED
                order.save(update_fields=["status"])
                messages.error(request, "Invalid response from payment provider.")
                return redirect("orders:checkout")

            order.paystack_reference = reference
            order.save(update_fields=["paystack_reference"])

            PaymentTransaction.objects.update_or_create(
                reference=reference,
                defaults={
                    "order": order,
                    "amount": order.total_amount,
                    "currency": order.currency,
                    "status": PaymentTransaction.Status.INITIALIZED,
                    "payload": gateway_payload,
                    "gateway_response": gateway_payload.get("message", ""),
                },
            )
            return redirect(authorization_url)
        except PaystackError:
            if not settings.PAYSTACK_ALLOW_LOCAL_FALLBACK:
                order.status = Order.Status.FAILED
                order.save(update_fields=["status"])
                messages.error(
                    request,
                    "Payment provider is unavailable right now. Please try again in a moment.",
                )
                return redirect("orders:checkout")

            # Local development fallback only.
            reference = f"local-{order.id}"
            PaymentTransaction.objects.create(
                order=order,
                reference=reference,
                amount=order.total_amount,
                currency=order.currency,
                status=PaymentTransaction.Status.SUCCESS,
                gateway_response="Local fallback",
                payload={"status": True, "data": {"status": "success", "amount": int(order.total_amount * 100)}},
            )
            process_paystack_verification(
                reference,
                {"status": True, "data": {"status": "success", "amount": int(order.total_amount * 100)}, "message": "Local payment success"},
            )
            messages.success(request, "Payment completed in local mode.")
            return redirect("orders:checkout_success")
        except Exception:
            order.status = Order.Status.FAILED
            order.save(update_fields=["status"])
            messages.error(request, "Unable to initialize payment right now. Please try again.")

    return render(
        request,
        "orders/checkout.html",
        {
            "cart": cart_obj,
            "form": form,
        },
    )


def paystack_callback(request):
    reference = request.GET.get("reference")
    if not reference:
        messages.error(request, "Missing transaction reference.")
        return redirect("orders:cart")

    try:
        gateway_payload = verify_transaction(reference)
    except Exception:
        messages.error(request, "Could not verify payment at this time.")
        return redirect("orders:cart")

    paid, order = process_paystack_verification(reference, gateway_payload)

    if paid:
        messages.success(request, "Payment verified successfully. Access granted.")
        return redirect("orders:checkout_success")

    if order:
        messages.error(request, f"Payment verification failed for order #{order.id}.")
    else:
        messages.error(request, "Payment verification failed.")
    return redirect("orders:cart")


@csrf_exempt
@require_POST
def paystack_webhook(request):
    if not verify_webhook_signature(request.body, request.headers.get("x-paystack-signature")):
        return HttpResponseBadRequest("Invalid signature")

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid payload")

    handled = handle_paystack_webhook_payload(payload)
    return JsonResponse({"received": True, "handled": handled})


@login_required
def checkout_success(request):
    paid_orders = Order.objects.filter(user=request.user, status=Order.Status.PAID).prefetch_related("items__product")[:5]
    return render(request, "orders/checkout_success.html", {"paid_orders": paid_orders})
