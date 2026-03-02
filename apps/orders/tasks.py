from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from .models import AccessGrant, Order


@shared_task
def send_purchase_receipt_email(order_id: int) -> None:
    order = Order.objects.filter(pk=order_id, status=Order.Status.PAID).prefetch_related("items").first()
    if not order:
        return

    items = "\n".join([f"- {item.title} x {item.quantity}" for item in order.items.all()])
    send_mail(
        subject=f"Your AIliteracy Receipt (Order #{order.id})",
        message=(
            f"Thank you for your purchase.\n\n"
            f"Order #{order.id}\n"
            f"Items:\n{items}\n\n"
            f"Total: NGN {order.total_amount}\n"
            "You can access your content from your dashboard/library."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        fail_silently=True,
    )


@shared_task
def send_download_links_email(order_id: int) -> None:
    order = Order.objects.filter(pk=order_id, status=Order.Status.PAID).first()
    if not order:
        return

    grants = AccessGrant.objects.filter(order=order).select_related("product")
    lines = []
    for grant in grants:
        if grant.product.digital_file:
            lines.append(f"- {grant.product.title}: {grant.product.digital_file.url}")
        elif grant.product.download_url:
            lines.append(f"- {grant.product.title}: {grant.product.download_url}")

    if not lines:
        return

    send_mail(
        subject="Your AIliteracy Download Links",
        message="\n".join(["Here are your available downloads:", *lines]),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        fail_silently=True,
    )
