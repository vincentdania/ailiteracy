from datetime import datetime, time, timedelta
from decimal import Decimal
from io import StringIO

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from apps.catalog.models import Product

from .challenge_services import (
    calculate_streak,
    lesson_is_available,
    lesson_unlock_date,
    mark_lesson_complete,
)
from .models import (
    Course,
    CourseAttempt,
    DailyChallengeEmail,
    Enrollment,
    Lesson,
    LessonProgress,
    Module,
)


class ChallengeImportCommandTests(TestCase):
    def test_import_counts_and_idempotency(self):
        output = StringIO()
        call_command("import_21day_challenge", stdout=output)
        call_command("import_21day_challenge", price="25000.00", stdout=output)

        course = Course.objects.get(slug="21-day-ai-challenge")
        self.assertEqual(Course.objects.filter(slug=course.slug).count(), 1)
        self.assertEqual(course.modules.count(), 5)
        self.assertEqual(Lesson.objects.filter(module__course=course).count(), 21)
        self.assertEqual(Product.objects.filter(slug=course.slug).count(), 1)
        self.assertEqual(course.product.price, Decimal("25000.00"))

        first_lesson = Lesson.objects.filter(module__course=course).order_by(
            "module__order", "order"
        ).first()
        self.assertTrue(first_lesson.is_preview)
        self.assertEqual(first_lesson.hero_image, "/static/lesson_heroes/day01_hero.png")
        self.assertIn("Lesson recap", first_lesson.content)
        self.assertIn("<h2", first_lesson.content)


class ChallengeServiceTestCase(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="challenger",
            email="challenger@example.com",
            password="secret123",
        )
        self.course = Course.objects.create(
            title="The 21-Day AI Challenge",
            slug="21-day-ai-challenge",
            summary="Twenty-one days",
        )
        self.module = Module.objects.create(course=self.course, title="Foundations", order=1)
        self.lessons = [
            Lesson.objects.create(
                module=self.module,
                title=f"Day {day}",
                slug=f"day-{day:02d}",
                content="<p>Lesson</p>",
                order=day,
                is_preview=day == 1,
            )
            for day in range(1, 22)
        ]
        self.enrollment = Enrollment.objects.create(user=self.user, course=self.course)
        today = timezone.localdate()
        start = timezone.make_aware(
            datetime.combine(today, time(hour=9)),
            timezone.get_current_timezone(),
        )
        Enrollment.objects.filter(pk=self.enrollment.pk).update(created_at=start)
        self.enrollment.refresh_from_db()


class ChallengeDripTests(ChallengeServiceTestCase):
    def test_day_boundaries_unlock_from_enrollment_date(self):
        today = timezone.localdate()
        self.assertEqual(lesson_unlock_date(self.enrollment, 1), today)
        self.assertEqual(lesson_unlock_date(self.enrollment, 2), today + timedelta(days=1))
        self.assertTrue(lesson_is_available(self.enrollment, self.lessons[0], 1, on_date=today))
        self.assertFalse(lesson_is_available(self.enrollment, self.lessons[1], 2, on_date=today))
        self.assertTrue(
            lesson_is_available(
                self.enrollment,
                self.lessons[1],
                2,
                on_date=today + timedelta(days=1),
            )
        )
        self.assertFalse(lesson_is_available(None, self.lessons[1], 2, on_date=today))

    def test_day_one_completion_day_two_lock_and_full_completion(self):
        self.client.force_login(self.user)
        day_one_url = reverse(
            "learning:challenge_lesson",
            kwargs={"course_slug": self.course.slug, "lesson_slug": self.lessons[0].slug},
        )
        day_two_url = reverse(
            "learning:challenge_lesson",
            kwargs={"course_slug": self.course.slug, "lesson_slug": self.lessons[1].slug},
        )

        response = self.client.post(day_one_url)
        self.assertRedirects(
            response,
            reverse("learning:challenge_home", kwargs={"course_slug": self.course.slug}),
        )
        self.assertEqual(self.enrollment.completed_lessons_count, 1)
        response = self.client.get(day_two_url)
        self.assertContains(response, "still locked")

        Enrollment.objects.filter(pk=self.enrollment.pk).update(
            created_at=timezone.now() - timedelta(days=20)
        )
        self.enrollment.refresh_from_db()
        for lesson in self.lessons:
            mark_lesson_complete(self.enrollment, lesson)
        self.assertEqual(self.enrollment.progress_percentage, 100)
        attempt = CourseAttempt.objects.get(course=self.course, user=self.user)
        self.assertTrue(attempt.passed)
        self.assertEqual(attempt.score, 100)
        self.assertIsNotNone(attempt.completed_at)


class ChallengeStreakTests(ChallengeServiceTestCase):
    def _complete_on(self, lesson, completed_date):
        progress = LessonProgress.objects.create(
            enrollment=self.enrollment,
            lesson=lesson,
            completed_at=timezone.now(),
        )
        completed_at = timezone.make_aware(
            datetime.combine(completed_date, time(hour=12)),
            timezone.get_current_timezone(),
        )
        LessonProgress.objects.filter(pk=progress.pk).update(completed_at=completed_at)

    def test_streak_counts_consecutive_completion_days(self):
        today = timezone.localdate()
        self._complete_on(self.lessons[0], today - timedelta(days=2))
        self._complete_on(self.lessons[1], today - timedelta(days=1))
        self._complete_on(self.lessons[2], today)
        self.assertEqual(calculate_streak(self.enrollment, on_date=today), 3)

    def test_streak_resets_after_a_missed_day(self):
        today = timezone.localdate()
        self._complete_on(self.lessons[0], today - timedelta(days=3))
        self._complete_on(self.lessons[1], today - timedelta(days=1))
        self.assertEqual(calculate_streak(self.enrollment, on_date=today), 1)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    SITE_URL="https://testserver",
)
class ChallengeEmailCommandTests(ChallengeServiceTestCase):
    def test_command_is_idempotent_and_only_emails_missing_today_lesson(self):
        completed_user = get_user_model().objects.create_user(
            username="completed",
            email="completed@example.com",
            password="secret123",
        )
        completed_enrollment = Enrollment.objects.create(user=completed_user, course=self.course)
        Enrollment.objects.filter(pk=completed_enrollment.pk).update(
            created_at=self.enrollment.created_at
        )
        LessonProgress.objects.create(
            enrollment=completed_enrollment,
            lesson=self.lessons[0],
            completed_at=timezone.now(),
        )

        call_command("send_daily_challenge_emails", stdout=StringIO())
        call_command("send_daily_challenge_emails", stdout=StringIO())

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertEqual(DailyChallengeEmail.objects.count(), 1)
        self.assertEqual(DailyChallengeEmail.objects.get().lesson, self.lessons[0])


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    SITE_URL="https://testserver",
)
class ChallengeWelcomeEmailTests(TestCase):
    def test_new_challenge_enrollment_sends_welcome_after_commit(self):
        user = get_user_model().objects.create_user(
            username="welcome",
            email="welcome@example.com",
            password="secret123",
        )
        course = Course.objects.create(
            title="The 21-Day AI Challenge",
            slug="21-day-ai-challenge",
            summary="Twenty-one days",
        )
        with self.captureOnCommitCallbacks(execute=True):
            Enrollment.objects.create(user=user, course=course)

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [user.email])
        self.assertIn("Welcome to", mail.outbox[0].subject)
