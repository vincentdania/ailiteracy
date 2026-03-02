from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from apps.catalog.models import Product
from apps.learning.models import Course, Enrollment
from apps.orders.models import AccessGrant, Order, OrderItem
from apps.orders.services import fulfill_paid_order


@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
class EnrollmentGrantTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="bundleuser",
            email="bundle@example.com",
            password="secret123",
        )

        self.course = Course.objects.create(
            title="AI Operations",
            slug="ai-operations",
            summary="Learn AI ops",
            description="Operations-focused course",
        )

        self.course_product = Product.objects.create(
            title="AI Operations Course",
            slug="ai-operations-course",
            product_type=Product.ProductType.COURSE,
            price=Decimal("30000.00"),
            course=self.course,
        )

        self.book_product = Product.objects.create(
            title="AI Confidence in 21 Days",
            slug="ai-confidence-in-21-days",
            product_type=Product.ProductType.BOOK,
            price=Decimal("10000.00"),
            download_url="https://downloads.example.com/ai-confidence.pdf",
        )

        self.bundle = Product.objects.create(
            title="AI Starter Bundle",
            slug="ai-starter-bundle",
            product_type=Product.ProductType.BUNDLE,
            price=Decimal("35000.00"),
        )
        self.bundle.bundle_items.add(self.course_product, self.book_product)

        self.order = Order.objects.create(
            user=self.user,
            email=self.user.email,
            total_amount=self.bundle.price,
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.bundle,
            title=self.bundle.title,
            unit_price=self.bundle.price,
            quantity=1,
        )

    def test_fulfill_paid_order_creates_enrollment_and_library_access(self):
        fulfilled = fulfill_paid_order(self.order, reference="bundle-ref")

        self.assertTrue(fulfilled)

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)
        self.assertTrue(Enrollment.objects.filter(user=self.user, course=self.course).exists())
        self.assertTrue(AccessGrant.objects.filter(user=self.user, order=self.order, product=self.bundle).exists())
        self.assertTrue(AccessGrant.objects.filter(user=self.user, order=self.order, product=self.book_product).exists())
        self.assertTrue(AccessGrant.objects.filter(user=self.user, order=self.order, product=self.course_product).exists())
