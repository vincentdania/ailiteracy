from decimal import Decimal

import stripe
from django.conf import settings


class StripeError(Exception):
    pass


def create_checkout_session(order, success_url, cancel_url):
    if not settings.STRIPE_SECRET_KEY:
        raise StripeError("Stripe is not configured.")
    stripe.api_key = settings.STRIPE_SECRET_KEY

    items = list(order.items.select_related("product"))
    if not items:
        raise StripeError("Order has no items.")

    line_items = [
        {
            "price_data": {
                "currency": "usd",
                "unit_amount": int(Decimal(item.unit_price) * 100),
                "product_data": {"name": item.title},
            },
            "quantity": item.quantity,
        }
        for item in items
    ]
    session_kwargs = {
        "mode": "payment",
        "customer_email": order.email,
        "client_reference_id": str(order.id),
        "line_items": line_items,
        "metadata": {"order_id": str(order.id)},
        "success_url": success_url,
        "cancel_url": cancel_url,
    }
    if settings.STRIPE_PRICE_ID and len(items) == 1 and items[0].quantity == 1:
        session_kwargs["line_items"] = [{"price": settings.STRIPE_PRICE_ID, "quantity": 1}]
    return stripe.checkout.Session.create(**session_kwargs)


def construct_webhook_event(payload, signature):
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise StripeError("Stripe webhook secret is not configured.")
    return stripe.Webhook.construct_event(payload, signature, settings.STRIPE_WEBHOOK_SECRET)
