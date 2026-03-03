import importlib.util
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from apps.learning.models import Course, CourseAttempt

from .models import Certificate
from .services import issue_certificate


REPORTLAB_AVAILABLE = importlib.util.find_spec("reportlab") is not None


@override_settings(DEFAULT_FILE_STORAGE="django.core.files.storage.FileSystemStorage")
class CertificateGenerationTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.temp_media = tempfile.mkdtemp()
        cls.override = override_settings(MEDIA_ROOT=cls.temp_media)
        cls.override.enable()

    @classmethod
    def tearDownClass(cls):
        cls.override.disable()
        shutil.rmtree(cls.temp_media, ignore_errors=True)
        super().tearDownClass()

    def test_issue_certificate_creates_db_row_and_file(self):
        if not REPORTLAB_AVAILABLE:
            self.skipTest("reportlab is not installed in this environment.")

        user = get_user_model().objects.create_user(
            username="learner",
            email="learner@example.com",
            password="StrongPassword123!",
        )
        course = Course.objects.create(
            title="AI Fluency: Framework & Foundations (Nigeria Edition)",
            slug="ai-fluency-test",
            summary="15-min micro-course",
            description="desc",
        )
        attempt = CourseAttempt.objects.create(
            course=course,
            user=user,
            session_key="abc",
            name="Learner Name",
            email="learner@example.com",
            score=80,
            passed=True,
        )

        certificate = issue_certificate(
            course_attempt=attempt,
            name="Learner Name",
            email="learner@example.com",
            user=user,
        )

        self.assertTrue(Certificate.objects.filter(pk=certificate.pk).exists())
        self.assertTrue(bool(certificate.pdf_file))
        self.assertTrue(certificate.pdf_file.name.endswith(".pdf"))
