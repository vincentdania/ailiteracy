from django.test import TestCase
from django.urls import reverse

from .models import MasterclassRegistration, QuizSubmission
from .views import QUIZ_QUESTIONS


class PagesViewTests(TestCase):
    def test_home_page_renders(self):
        response = self.client.get(reverse("pages:home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "AI Fluency Quiz")
        self.assertContains(response, "request@ailiteracy.ng")
        self.assertContains(response, "hyrax.ng")

    def test_quiz_submission_saves_score(self):
        payload = {"action": "quiz_submit"}
        for question in QUIZ_QUESTIONS:
            payload[f"question_{question['id']}"] = question["correct"]

        response = self.client.post(reverse("pages:home"), payload, follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(QuizSubmission.objects.count(), 1)
        self.assertContains(response, "You scored 10/10")

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
