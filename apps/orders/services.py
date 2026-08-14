from decimal import Decimal
from typing import Any, Dict, Optional, Set, Tuple

from django.db import transaction
from django.utils import timezone

from apps.learning.models import Enrollment

from .models import AccessGrant, Cart, Order, OrderItem, PaymentTransaction


def create_order_from_cart(user, email: Optional[str] = None, currency: str = "NGN") -> Order:
    cart = Cart.objects.filter(user=user).prefetch_related("items__product").first()
    if not cart or not cart.items.exists():
        raise ValueError("Cart is empty.")

    with transaction.atomic():
        total = Decimal("0.00")
        order = Order.objects.create(
            user=user,
            email=email or user.email,
            total_amount=Decimal("0.00"),
            currency=currency,
        )

        for item in cart.items.select_related("product"):
            item_price = item.product.price_usd if currency == "USD" else item.product.price
            if item_price is None:
                raise ValueError(f"{item.product.title} is not available in {currency}.")
            OrderItem.objects.create(
                order=order,
                product=item.product,
                title=item.product.title,
                unit_price=item_price,
                quantity=item.quantity,
            )
            total += item_price * item.quantity

        order.total_amount = total
        order.save(update_fields=["total_amount"])

        cart.items.all().delete()

    return order


def create_order_for_product(user, product, email=None, currency="NGN"):
    unit_price = product.price_usd if currency == "USD" else product.price
    if unit_price is None:
        raise ValueError(f"{product.title} is not available in {currency}.")
    with transaction.atomic():
        order = Order.objects.create(
            user=user,
            email=email or user.email,
            total_amount=unit_price,
            currency=currency,
        )
        OrderItem.objects.create(
            order=order,
            product=product,
            title=product.title,
            unit_price=unit_price,
            quantity=1,
        )
    return order


def grant_product_access(
    user,
    product,
    order,
    source_product=None,
    visited: Optional[Set[int]] = None,
) -> None:
    visited = visited or set()
    if product.id in visited:
        return
    visited.add(product.id)

    AccessGrant.objects.get_or_create(
        user=user,
        product=product,
        order=order,
        defaults={"source_product": source_product},
    )

    if product.product_type == product.ProductType.COURSE and product.course:
        Enrollment.objects.get_or_create(user=user, course=product.course)

    if product.product_type == product.ProductType.BUNDLE:
        for bundled_product in product.bundle_items.filter(is_active=True).exclude(pk=product.pk):
            grant_product_access(
                user=user,
                product=bundled_product,
                order=order,
                source_product=source_product or product,
                visited=visited,
            )


def fulfill_paid_order(
    order: Order,
    reference: Optional[str] = None,
    payload: Optional[Dict[str, Any]] = None,
    gateway: str = "paystack",
) -> bool:
    with transaction.atomic():
        locked_order = Order.objects.select_for_update().get(pk=order.pk)
        if locked_order.status == Order.Status.PAID:
            return False

        locked_order.status = Order.Status.PAID
        locked_order.paid_at = timezone.now()
        update_fields = ["status", "paid_at"]
        if reference and gateway == "paystack":
            locked_order.paystack_reference = reference
            update_fields.append("paystack_reference")
        if reference and gateway == "stripe":
            locked_order.stripe_session_id = reference
            update_fields.append("stripe_session_id")
        locked_order.save(update_fields=update_fields)

        order_items = locked_order.items.select_related("product", "product__course").prefetch_related("product__bundle_items")
        for order_item in order_items:
            grant_product_access(locked_order.user, order_item.product, locked_order)

    from .tasks import send_download_links_email, send_purchase_receipt_email

    try:
        send_purchase_receipt_email.delay(locked_order.id)
        send_download_links_email.delay(locked_order.id)
    except Exception:
        # Keep checkout resilient if the worker/broker is temporarily unavailable.
        send_purchase_receipt_email(locked_order.id)
        send_download_links_email(locked_order.id)
    return True


def process_stripe_checkout_session(session):
    session_payload = session.to_dict() if hasattr(session, "to_dict") else dict(session)
    metadata = session.get("metadata") or {}
    order_id = metadata.get("order_id") or session.get("client_reference_id")
    session_id = session.get("id")
    if not order_id or not session_id:
        return False, None

    order = Order.objects.filter(pk=order_id).first()
    if order is None:
        return False, None

    payment_status = session.get("payment_status")
    currency = str(session.get("currency") or "").upper()
    amount_total = session.get("amount_total")
    amount = Decimal(amount_total or 0) / 100
    is_success = (
        payment_status == "paid"
        and currency == order.currency
        and amount == order.total_amount
    )

    transaction_obj, _ = PaymentTransaction.objects.get_or_create(
        reference=session_id,
        defaults={
            "order": order,
            "amount": amount,
            "currency": currency or order.currency,
        },
    )
    transaction_obj.amount = amount
    transaction_obj.currency = currency or order.currency
    transaction_obj.status = (
        PaymentTransaction.Status.SUCCESS if is_success else PaymentTransaction.Status.FAILED
    )
    transaction_obj.gateway_response = payment_status or "Stripe checkout event"
    transaction_obj.payload = session_payload
    transaction_obj.save()

    if is_success:
        fulfill_paid_order(order, reference=session_id, payload=session_payload, gateway="stripe")
    elif order.status == Order.Status.PENDING:
        order.status = Order.Status.FAILED
        order.save(update_fields=["status"])
    return is_success, order


def process_paystack_verification(
    reference: str, payload: Dict[str, Any]
) -> Tuple[bool, Optional[Order]]:
    transaction_obj = PaymentTransaction.objects.select_related("order").filter(reference=reference).first()
    order = transaction_obj.order if transaction_obj else Order.objects.filter(paystack_reference=reference).first()

    if not order:
        return False, None

    if not transaction_obj:
        transaction_obj = PaymentTransaction.objects.create(
            order=order,
            reference=reference,
            amount=order.total_amount,
            currency=order.currency,
        )

    data = payload.get("data", {})
    amount_kobo = data.get("amount")
    verified_amount = Decimal(amount_kobo or 0) / 100
    verified_currency = str(data.get("currency") or order.currency).upper()
    is_success = (
        bool(payload.get("status"))
        and data.get("status") == "success"
        and verified_amount == order.total_amount
        and verified_currency == order.currency
    )

    if amount_kobo is not None:
        transaction_obj.amount = verified_amount
    transaction_obj.currency = verified_currency

    transaction_obj.status = (
        PaymentTransaction.Status.SUCCESS if is_success else PaymentTransaction.Status.FAILED
    )
    transaction_obj.gateway_response = payload.get("message", "")
    transaction_obj.payload = payload
    transaction_obj.save()

    if is_success:
        fulfill_paid_order(order, reference=reference, payload=payload)
    elif order.status == Order.Status.PENDING:
        order.status = Order.Status.FAILED
        order.save(update_fields=["status"])

    return is_success, order


def handle_paystack_webhook_payload(payload: Dict[str, Any]) -> bool:
    event = payload.get("event")
    data = payload.get("data", {})
    reference = data.get("reference")

    if event not in {"charge.success", "charge.failed"} or not reference:
        return False

    normalized = {
        "status": event == "charge.success",
        "message": payload.get("message", "Webhook notification"),
        "data": data,
    }

    success, _ = process_paystack_verification(reference, normalized)
    return success
