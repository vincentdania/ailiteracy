from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse

from apps.learning.challenge_services import build_challenge_outline
from apps.learning.models import Course, Enrollment

from .models import Referral
from .services import attach_referral, get_or_create_share_referral, user_has_referral_reward


class ReferralRewardTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_21day_challenge", stdout=StringIO())
        cls.course = Course.objects.get(slug="21-day-ai-challenge")

    def setUp(self):
        user_model = get_user_model()
        self.referrer = user_model.objects.create_user(
            username="graduate",
            email="graduate@example.com",
            password="secret123",
        )
        self.referee = user_model.objects.create_user(
            username="colleague",
            email="colleague@example.com",
            password="secret123",
        )
        self.referrer_enrollment = Enrollment.objects.create(user=self.referrer, course=self.course)

    def test_referral_rewards_both_users_and_unlocks_bonus(self):
        referral = get_or_create_share_referral(self.referrer)
        self.assertEqual(attach_referral(self.referee, referral.code), referral)

        referee_enrollment = Enrollment.objects.create(user=self.referee, course=self.course)
        referral.refresh_from_db()

        self.assertEqual(referral.status, Referral.Status.REWARDED)
        self.assertTrue(user_has_referral_reward(self.referrer))
        self.assertTrue(user_has_referral_reward(self.referee))
        self.assertEqual(self.referrer_enrollment.total_lessons_count, 21)
        self.assertEqual(referee_enrollment.total_lessons_count, 21)
        self.assertTrue(build_challenge_outline(self.course, self.referrer_enrollment)[-1]["module"].is_bonus)
        self.assertTrue(build_challenge_outline(self.course, referee_enrollment)[-1]["module"].is_bonus)

    def test_bonus_module_is_hidden_without_reward(self):
        outline = build_challenge_outline(self.course, self.referrer_enrollment)

        self.assertEqual(len(outline), 5)
        self.client.force_login(self.referrer)
        response = self.client.get(
            reverse(
                "learning:challenge_module",
                kwargs={"course_slug": self.course.slug, "module_order": 6},
            )
        )
        self.assertEqual(response.status_code, 404)

    def test_referral_link_records_anonymous_invitation(self):
        referral = get_or_create_share_referral(self.referrer)

        response = self.client.get(reverse("referrals:accept", kwargs={"code": referral.code}))

        self.assertRedirects(response, reverse("pages:home"))
        self.assertEqual(self.client.session["challenge_referral_code"], referral.code)
