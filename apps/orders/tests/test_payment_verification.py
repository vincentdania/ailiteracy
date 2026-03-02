from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from apps.catalog.models import Product
from apps.learning.models import Course, Enrollment
from apps.orders.models import AccessGrant, Order, OrderItem, PaymentTransaction
from apps.orders.services import process_paystack_verification


@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
class PaystackVerificationTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="tester",
            email="tester@example.com",
            password="secret123",
        )
        self.course = Course.objects.create(
            title="AI Foundations",
            slug="ai-foundations",
            summary="Start using AI effectively",
            description="Full course",
        )
        self.product = Product.objects.create(
            title="AI Foundations Course",
            slug="ai-foundations-course",
            product_type=Product.ProductType.COURSE,
            price=Decimal("15000.00"),
            course=self.course,
        )

        self.order = Order.objects.create(
            user=self.user,
            email=self.user.email,
            total_amount=Decimal("15000.00"),
            paystack_reference="ref-123",
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            title=self.product.title,
            unit_price=self.product.price,
            quantity=1,
        )
        PaymentTransaction.objects.create(
            order=self.order,
            reference="ref-123",
            amount=Decimal("15000.00"),
            currency="NGN",
        )

    def test_successful_verification_marks_order_paid_and_grants_access(self):
        payload = {
            "status": True,
            "message": "Verification successful",
            "data": {
                "status": "success",
                "amount": 1500000,
                "reference": "ref-123",
            },
        }

        paid, order = process_paystack_verification("ref-123", payload)

        self.assertTrue(paid)
        self.assertIsNotNone(order)

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)

        transaction = PaymentTransaction.objects.get(reference="ref-123")
        self.assertEqual(transaction.status, PaymentTransaction.Status.SUCCESS)

        self.assertTrue(AccessGrant.objects.filter(user=self.user, order=self.order, product=self.product).exists())
        self.assertTrue(Enrollment.objects.filter(user=self.user, course=self.course).exists())
