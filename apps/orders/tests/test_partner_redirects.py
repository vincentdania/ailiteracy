from django.test import TestCase, override_settings
from django.urls import reverse


@override_settings(ECOMMERCE_PARTNER_URL="https://hyrax.ng/")
class PartnerCommerceRedirectTests(TestCase):
    def test_cart_redirects_to_partner(self):
        response = self.client.get(reverse("orders:cart"))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith("https://hyrax.ng/"))

    def test_checkout_redirects_to_partner(self):
        response = self.client.get(reverse("orders:checkout"))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith("https://hyrax.ng/"))

    def test_paystack_webhook_is_disabled(self):
        response = self.client.post(
            reverse("orders:paystack_webhook"),
            data=b"{}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 410)
