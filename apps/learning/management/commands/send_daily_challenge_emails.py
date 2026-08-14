from datetime import date

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.learning.challenge_services import CHALLENGE_LENGTH, CHALLENGE_SLUG, challenge_day
from apps.learning.emails import send_challenge_daily_email
from apps.learning.models import DailyChallengeEmail, Enrollment, Lesson


class Command(BaseCommand):
    help = "Send today's 21-Day AI Challenge reminder emails. Safe to run repeatedly."

    def add_arguments(self, parser):
        parser.add_argument(
            "--date",
            dest="run_date",
            help="Override today's date in YYYY-MM-DD format (primarily for operations/tests).",
        )

    def handle(self, *args, **options):
        run_date = timezone.localdate()
        if options.get("run_date"):
            try:
                run_date = date.fromisoformat(options["run_date"])
            except ValueError as exc:
                raise CommandError("--date must use YYYY-MM-DD format") from exc

        sent = 0
        skipped = 0
        enrollments = Enrollment.objects.filter(course__slug=CHALLENGE_SLUG).select_related(
            "course", "user"
        )
        lessons = list(
            Lesson.objects.filter(module__course__slug=CHALLENGE_SLUG)
            .select_related("module")
            .order_by("module__order", "order", "id")
        )

        for enrollment in enrollments:
            day_number = challenge_day(enrollment, on_date=run_date)
            if day_number > CHALLENGE_LENGTH or day_number > len(lessons):
                skipped += 1
                continue
            lesson = lessons[day_number - 1]
            if not enrollment.user.email:
                skipped += 1
                continue
            if enrollment.lesson_progress.filter(lesson=lesson, completed_at__isnull=False).exists():
                skipped += 1
                continue
            if DailyChallengeEmail.objects.filter(enrollment=enrollment, lesson=lesson).exists():
                skipped += 1
                continue

            try:
                send_challenge_daily_email(enrollment, lesson, day_number)
            except Exception as exc:
                self.stderr.write(f"Failed for {enrollment.user.email}: {exc}")
                continue
            with transaction.atomic():
                _, created = DailyChallengeEmail.objects.get_or_create(
                    enrollment=enrollment,
                    lesson=lesson,
                )
            if created:
                sent += 1

        self.stdout.write(self.style.SUCCESS(f"Sent {sent} reminder(s); skipped {skipped}."))
