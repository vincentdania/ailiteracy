from decimal import Decimal
from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse

from .models import MasterclassRegistration, QuizSubmission


class ChallengeFirstHomepageTests(TestCase):
    def test_home_page_is_the_21_day_challenge(self):
        response = self.client.get(reverse("pages:home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "From zero to")
        self.assertContains(response, "focused days")
        self.assertContains(response, "Do I need a paid AI subscription?")
        self.assertNotContains(response, "Join the AI Masterclass")

    def test_imported_challenge_populates_homepage_curriculum_and_preview(self):
        call_command("import_21day_challenge", stdout=StringIO())

        response = self.client.get(reverse("pages:home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Foundations")
        self.assertContains(response, "Agentic AI")
        self.assertContains(response, "Take the free AI self-check")
        self.assertContains(response, "/challenge/21-day-ai-challenge/lessons/day-01-")

    def test_public_site_routes_still_resolve(self):
        routes = [
            ("account_login", {}, 200),
            ("dashboard", {}, 302),
            ("library", {}, 302),
            ("catalog:course_list", {}, 200),
            ("catalog:book_landing", {"slug": "ai-confidence-in-21-days"}, 200),
            ("content:resource_list", {}, 200),
            ("core:community_forum", {}, 200),
            ("core:about", {}, 200),
            ("quiz:home", {}, 200),
            ("bootcamp:interest", {}, 200),
            ("ai_index:insights", {}, 200),
            ("orders:cart", {}, 302),
            ("certificates:my", {}, 302),
        ]

        for route_name, kwargs, expected_status in routes:
            with self.subTest(route=route_name):
                response = self.client.get(reverse(route_name, kwargs=kwargs or None))
                self.assertEqual(response.status_code, expected_status)


class SharedScorePageTests(TestCase):
    def test_share_page_renders_og_tags_and_cta(self):
        submission = QuizSubmission.objects.create(score=Decimal("7.4"))

        response = self.client.get(reverse("pages:share", kwargs={"share_id": submission.share_id}))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My AI Literacy Score is 7.4/10")
        self.assertContains(response, f"/share-image/{submission.share_id}/")
        self.assertContains(response, "Test Your AI Fluency")
        self.assertContains(response, 'name="twitter:card" content="summary_large_image"', html=False)

    def test_share_image_endpoint_returns_png(self):
        submission = QuizSubmission.objects.create(score=Decimal("7.4"))

        response = self.client.get(reverse("pages:share_image", kwargs={"share_id": submission.share_id}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertTrue(response.content.startswith(b"\x89PNG\r\n\x1a\n"))

    def test_share_page_caps_legacy_scores_at_ten(self):
        submission = QuizSubmission.objects.create(score=Decimal("12.0"))

        response = self.client.get(reverse("pages:share", kwargs={"share_id": submission.share_id}))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My AI Literacy Score is 10.0/10")
        self.assertNotContains(response, "12.0/10")


class AdminDashboardTests(TestCase):
    def test_admin_dashboard_renders_for_staff_user(self):
        user_model = get_user_model()
        admin_user = user_model.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="strong-pass-123",
        )
        self.client.force_login(admin_user)

        MasterclassRegistration.objects.create(
            name="Ada Obi",
            email="ada@example.com",
            phone="+2348029115964",
            location="ABUJA",
            mode="IN_PERSON",
        )
        QuizSubmission.objects.create(score=8)

        response = self.client.get(reverse("admin:index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dashboard")
        self.assertContains(response, "Masterclass registrations")
        self.assertContains(response, "Recent quiz activity")
