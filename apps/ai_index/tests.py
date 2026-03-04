from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from apps.learning.models import Course, CourseAttempt
from apps.quiz.models import Attempt, Quiz, Result

from .models import AILiteracyScore
from .services import create_or_update_ali_from_deep_result, percentile_higher_than


class AILiteracyComputationTests(TestCase):
    def test_ali_computation_uses_weighted_formula(self):
        user = get_user_model().objects.create_user(
            username="aliuser",
            email="ali@example.com",
            password="StrongPass123!",
        )
        course = Course.objects.get(slug="ai-fluency")
        CourseAttempt.objects.create(
            course=course,
            user=user,
            session_key="sess-ali",
            name="Ali User",
            email="ali@example.com",
            completed_at=timezone.now(),
            passed=True,
            score=80,
        )

        quiz = Quiz.objects.create(title="Deep Quiz", slug="deep-quiz", is_active=True)
        quiz_attempt = Attempt.objects.create(quiz=quiz, user=user, session_key="sess-ali")
        deep_result = Result.objects.create(attempt=quiz_attempt, score=8, percent=80, level=Result.Level.PROFICIENT)

        ali = create_or_update_ali_from_deep_result(
            deep_result=deep_result,
            name="Ali User",
            email="ali@example.com",
            user=user,
            session_key="sess-ali",
        )

        self.assertEqual(ali.deep_quiz_score, 8)
        self.assertEqual(ali.final_test_score, 4)
        self.assertTrue(ali.microcourse_completed)
        self.assertEqual(ali.ali_score, Decimal("8.40"))
        self.assertEqual(ali.level, AILiteracyScore.Level.FLUENT)

    def test_percentile_higher_than_computes_rank(self):
        quiz = Quiz.objects.create(title="Deep Quiz", slug="deep-quiz-2", is_active=True)

        def add(score):
            attempt = Attempt.objects.create(quiz=quiz, session_key="sess-%s" % score)
            result = Result.objects.create(attempt=attempt, score=score, percent=score * 10, level=Result.Level.BEGINNER)
            return AILiteracyScore.objects.create(
                deep_quiz_result=result,
                name="Learner %s" % score,
                email="l%s@example.com" % score,
                deep_quiz_score=score,
                final_test_score=0,
                microcourse_completed=False,
                ali_score=Decimal(str(score)),
                level=AILiteracyScore.Level.BEGINNER,
            )

        add(2)
        add(5)
        mid = add(7)
        add(9)

        percentile = percentile_higher_than(mid.ali_score)
        self.assertEqual(percentile, 50)
