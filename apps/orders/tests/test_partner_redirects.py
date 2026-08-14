from django.test import TestCase, override_settings
from django.urls import reverse


@override_settings(ECOMMERCE_PARTNER_URL="https://hyrax.ng/")
class CommerceRouteTests(TestCase):
    def test_cart_requires_login(self):
        response = self.client.get(reverse("orders:cart"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/accounts/login/", response.url)

    def test_checkout_requires_login(self):
        response = self.client.get(reverse("orders:checkout"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/accounts/login/", response.url)

    def test_paystack_webhook_rejects_invalid_signature(self):
        response = self.client.post(
            reverse("orders:paystack_webhook"),
            data=b"{}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
