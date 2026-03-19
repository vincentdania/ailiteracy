from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import MasterclassRegistration, QuizSubmission
from .views import QUIZ_QUESTIONS


class PagesViewTests(TestCase):
    def _full_quiz_payload(self, confidence="medium"):
        payload = {"action": "quiz_submit"}
        for question in QUIZ_QUESTIONS:
            answer = question["correct"]
            payload[f"question_{question['id']}_answer"] = answer if len(answer) > 1 else answer[0]
            payload[f"question_{question['id']}_confidence"] = confidence
        return payload

    def test_home_page_renders(self):
        response = self.client.get(reverse("pages:home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "AI Fluency Quiz")
        self.assertContains(response, "learn@ailiteracy.ng")
        self.assertContains(response, "hyrax.ng")

    def test_quiz_submission_with_medium_confidence_preserves_base_score(self):
        response = self.client.post(reverse("pages:home"), self._full_quiz_payload(), follow=True)
        submission = QuizSubmission.objects.get()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(QuizSubmission.objects.count(), 1)
        self.assertEqual(submission.score, Decimal("10.0"))
        self.assertIsNotNone(submission.share_id)
        self.assertContains(response, "Your Score: 10.0 / 10")
        self.assertContains(response, f"/share/{submission.share_id}/")

    def test_high_confidence_correct_answers_gain_bonus_and_insight(self):
        response = self.client.post(reverse("pages:home"), self._full_quiz_payload(confidence="high"), follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(QuizSubmission.objects.count(), 1)
        self.assertEqual(QuizSubmission.objects.get().score, Decimal("12.0"))
        self.assertContains(response, "Your Score: 12.0 / 10")
        self.assertContains(response, "You show strong and confident AI fluency.")

    def test_wrong_high_confidence_answer_applies_penalty_and_insight(self):
        payload = self._full_quiz_payload()
        payload["question_9_answer"] = ["B", "D"]
        payload["question_9_confidence"] = "high"

        response = self.client.post(reverse("pages:home"), payload, follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(QuizSubmission.objects.count(), 1)
        self.assertEqual(QuizSubmission.objects.get().score, Decimal("8.0"))
        self.assertContains(response, "Your Score: 8.0 / 10")
        self.assertContains(response, "Your confidence exceeded your accuracy. Improve verification.")

    def test_low_confidence_correct_answers_show_underconfidence_insight(self):
        response = self.client.post(reverse("pages:home"), self._full_quiz_payload(confidence="low"), follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(QuizSubmission.objects.count(), 1)
        self.assertEqual(QuizSubmission.objects.get().score, Decimal("10.0"))
        self.assertContains(response, "You performed well but underestimated your knowledge.")

    def test_quiz_submission_requires_answer_and_confidence_for_every_question(self):
        payload = self._full_quiz_payload()
        del payload["question_10_confidence"]

        response = self.client.post(reverse("pages:home"), payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(QuizSubmission.objects.count(), 0)
        self.assertContains(
            response,
            "Please select the required answer(s) and a confidence level for every question before submitting your result.",
        )

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

    def test_masterclass_submission_saves_registration(self):
        response = self.client.post(
            reverse("pages:home"),
            {
                "action": "masterclass_submit",
                "name": "Vincent Dania",
                "email": "vincent@example.com",
                "phone": "+2348029115964",
                "location": "ABUJA",
                "mode": "IN_PERSON",
            },
            follow=True,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(MasterclassRegistration.objects.count(), 1)
        self.assertContains(response, "Registration received")


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
