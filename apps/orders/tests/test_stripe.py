import hashlib
import hmac
import json
import time
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse

from apps.catalog.models import Product
from apps.learning.models import Course, Enrollment
from apps.orders.models import Order, OrderItem, PaymentTransaction


@override_settings(
    STRIPE_WEBHOOK_SECRET="whsec_test_secret",
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class StripeWebhookTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="global-learner",
            email="global@example.com",
            password="secret123",
        )
        self.course = Course.objects.create(
            title="The 21-Day AI Challenge",
            slug="21-day-ai-challenge",
            summary="Build an AI habit",
        )
        self.product = Product.objects.create(
            title="The 21-Day AI Challenge",
            slug="21-day-ai-challenge",
            product_type=Product.ProductType.COURSE,
            price=Decimal("20000.00"),
            price_usd=Decimal("39.00"),
            course=self.course,
        )
        self.order = Order.objects.create(
            user=self.user,
            email=self.user.email,
            total_amount=Decimal("39.00"),
            currency="USD",
            stripe_session_id="cs_test_123",
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            title=self.product.title,
            unit_price=Decimal("39.00"),
            quantity=1,
        )

    def _signed_payload(self):
        payload = json.dumps(
            {
                "id": "evt_test_123",
                "object": "event",
                "type": "checkout.session.completed",
                "data": {
                    "object": {
                        "id": "cs_test_123",
                        "object": "checkout.session",
                        "client_reference_id": str(self.order.id),
                        "metadata": {"order_id": str(self.order.id)},
                        "payment_status": "paid",
                        "currency": "usd",
                        "amount_total": 3900,
                    }
                },
            },
            separators=(",", ":"),
        ).encode("utf-8")
        timestamp = int(time.time())
        signature = hmac.new(
            b"whsec_test_secret",
            f"{timestamp}.".encode("utf-8") + payload,
            hashlib.sha256,
        ).hexdigest()
        return payload, f"t={timestamp},v1={signature}"

    def test_valid_signature_marks_order_paid_and_grants_access(self):
        payload, signature = self._signed_payload()

        response = self.client.post(
            reverse("orders:stripe_webhook"),
            data=payload,
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE=signature,
        )

        self.assertEqual(response.status_code, 200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)
        self.assertTrue(PaymentTransaction.objects.filter(reference="cs_test_123", status=PaymentTransaction.Status.SUCCESS).exists())
        self.assertTrue(Enrollment.objects.filter(user=self.user, course=self.course).exists())

    def test_invalid_signature_is_rejected(self):
        payload, _ = self._signed_payload()

        response = self.client.post(
            reverse("orders:stripe_webhook"),
            data=payload,
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="t=1,v1=invalid",
        )

        self.assertEqual(response.status_code, 400)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PENDING)
