from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import MasterclassRegistration, QuizSubmission
from .views import QUIZ_QUESTIONS


class PagesViewTests(TestCase):
    def test_home_page_renders(self):
        response = self.client.get(reverse("pages:home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "AI Fluency Quiz")
        self.assertContains(response, "learn@ailiteracy.ng")
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
