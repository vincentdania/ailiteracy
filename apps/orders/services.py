from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.learning.models import Enrollment

from .models import AccessGrant, Cart, Order, OrderItem, PaymentTransaction


def create_order_from_cart(user, email: str | None = None) -> Order:
    cart = Cart.objects.filter(user=user).prefetch_related("items__product").first()
    if not cart or not cart.items.exists():
        raise ValueError("Cart is empty.")

    with transaction.atomic():
        total = Decimal("0.00")
        order = Order.objects.create(
            user=user,
            email=email or user.email,
            total_amount=Decimal("0.00"),
            currency="NGN",
        )

        for item in cart.items.select_related("product"):
            OrderItem.objects.create(
                order=order,
                product=item.product,
                title=item.product.title,
                unit_price=item.product.price,
                quantity=item.quantity,
            )
            total += item.product.price * item.quantity

        order.total_amount = total
        order.save(update_fields=["total_amount"])

        cart.items.all().delete()

    return order


def grant_product_access(user, product, order, source_product=None, visited: set[int] | None = None) -> None:
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


def fulfill_paid_order(order: Order, reference: str | None = None, payload: dict | None = None) -> bool:
    with transaction.atomic():
        locked_order = Order.objects.select_for_update().get(pk=order.pk)
        if locked_order.status == Order.Status.PAID:
            return False

        locked_order.status = Order.Status.PAID
        locked_order.paid_at = timezone.now()
        if reference:
            locked_order.paystack_reference = reference
        locked_order.save(update_fields=["status", "paid_at", "paystack_reference"])

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


def process_paystack_verification(reference: str, payload: dict) -> tuple[bool, Order | None]:
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
    is_success = bool(payload.get("status")) and data.get("status") == "success"

    amount_kobo = data.get("amount")
    if amount_kobo is not None:
        transaction_obj.amount = Decimal(amount_kobo) / 100

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


def handle_paystack_webhook_payload(payload: dict) -> bool:
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
