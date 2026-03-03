from datetime import timedelta

from django.core.management import call_command
from django.forms.models import inlineformset_factory
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .admin import OptionInlineFormSet
from .models import Attempt, AttemptAnswer, Option, Question, Quiz
from .services import finalize_attempt


class QuizEngineTests(TestCase):
    def _perfect_payload(self, quiz):
        payload = {}
        for question in quiz.questions.prefetch_related("options").all():
            payload["question_%s" % question.id] = list(question.options.filter(is_correct=True).values_list("id", flat=True))
        return payload

    def test_perfect_attempt_scores_ten_over_ten(self):
        call_command("seed_ai_literacy_quiz")
        quiz = Quiz.objects.get(slug="ai-literacy-africa")
        attempt = Attempt.objects.create(quiz=quiz, session_key="sess-1", time_limit_seconds=1200)

        for question in quiz.questions.prefetch_related("options").all():
            answer = AttemptAnswer.objects.create(attempt=attempt, question=question)
            answer.selected_options.set(question.options.filter(is_correct=True))

        result = finalize_attempt(attempt)
        self.assertEqual(result.score, 10)
        self.assertEqual(result.percent, 100)
        self.assertEqual(result.level, "Elite")

    def test_multi_select_strict_scoring_requires_exact_two_correct(self):
        quiz = Quiz.objects.create(title="Strict Multi Quiz", slug="strict-multi", is_active=True)
        multi = Question.objects.create(
            quiz=quiz,
            text="Pick two",
            order=1,
            kind=Question.Kind.MULTI,
            multi_select_count=2,
        )
        a = Option.objects.create(question=multi, text="A", is_correct=True)
        b = Option.objects.create(question=multi, text="B", is_correct=True)
        c = Option.objects.create(question=multi, text="C", is_correct=False)
        Option.objects.create(question=multi, text="D", is_correct=False)

        attempt = Attempt.objects.create(quiz=quiz, session_key="sess-2", time_limit_seconds=1200)
        answer = AttemptAnswer.objects.create(attempt=attempt, question=multi)
        answer.selected_options.set([a, c])  # Not exact correct pair => zero credit

        result = finalize_attempt(attempt)
        self.assertEqual(result.score, 0)
        self.assertEqual(result.percent, 0)
        self.assertEqual(result.level, "Beginner")

        attempt_2 = Attempt.objects.create(quiz=quiz, session_key="sess-3", time_limit_seconds=1200)
        answer_2 = AttemptAnswer.objects.create(attempt=attempt_2, question=multi)
        answer_2.selected_options.set([a, b])
        result_2 = finalize_attempt(attempt_2)
        self.assertEqual(result_2.score, 1)
        self.assertEqual(result_2.percent, 10)

    def test_twenty_minute_timeout_auto_submit_behavior(self):
        quiz = Quiz.objects.create(title="Timed Quiz", slug="timed-quiz", is_active=True)
        question = Question.objects.create(quiz=quiz, text="Q1", order=1, kind=Question.Kind.SINGLE)
        Option.objects.create(question=question, text="Yes", is_correct=True)
        Option.objects.create(question=question, text="No", is_correct=False)

        session = self.client.session
        session.save()
        session_key = session.session_key

        attempt = Attempt.objects.create(quiz=quiz, session_key=session_key, time_limit_seconds=1200)
        Attempt.objects.filter(pk=attempt.pk).update(started_at=timezone.now() - timedelta(minutes=21))
        attempt.refresh_from_db()

        response = self.client.get(reverse("quiz:take", kwargs={"attempt_id": attempt.id}))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse("quiz:result", kwargs={"attempt_id": attempt.id}))

        attempt.refresh_from_db()
        self.assertTrue(attempt.is_timed_out)
        self.assertIsNotNone(attempt.completed_at)
        self.assertTrue(hasattr(attempt, "result"))
        self.assertEqual(attempt.time_taken_seconds, 1200)

    def test_randomization_does_not_change_correctness(self):
        call_command("seed_ai_literacy_quiz")
        quiz = Quiz.objects.get(slug="ai-literacy-africa")

        session = self.client.session
        session.save()
        session_key = session.session_key

        attempt_one = Attempt.objects.create(quiz=quiz, session_key=session_key, time_limit_seconds=1200)
        attempt_two = Attempt.objects.create(quiz=quiz, session_key=session_key, time_limit_seconds=1200)

        self.client.get(reverse("quiz:take", kwargs={"attempt_id": attempt_one.id}))
        session = self.client.session
        random_orders = session.get("quiz_random_orders", {})

        question_ids = list(quiz.questions.values_list("id", flat=True))
        option_orders = {}
        for question in quiz.questions.prefetch_related("options").all():
            option_ids = list(question.options.values_list("id", flat=True))
            option_orders[str(question.id)] = list(reversed(option_ids))
        random_orders[str(attempt_two.id)] = {
            "question_ids": list(reversed(question_ids)),
            "option_orders": option_orders,
        }
        session["quiz_random_orders"] = random_orders
        session.save()

        perfect = self._perfect_payload(quiz)
        self.client.post(reverse("quiz:take", kwargs={"attempt_id": attempt_one.id}), data=perfect)
        self.client.post(reverse("quiz:take", kwargs={"attempt_id": attempt_two.id}), data=perfect)

        attempt_one.refresh_from_db()
        attempt_two.refresh_from_db()
        self.assertEqual(attempt_one.result.score, 10)
        self.assertEqual(attempt_two.result.score, 10)

    def test_start_view_uses_twenty_minute_time_limit(self):
        call_command("seed_ai_literacy_quiz")
        response = self.client.post(reverse("quiz:start"))
        self.assertEqual(response.status_code, 302)

        attempt = Attempt.objects.latest("id")
        self.assertEqual(attempt.time_limit_seconds, 1200)


class QuizAdminValidationTests(TestCase):
    def setUp(self):
        self.quiz = Quiz.objects.create(title="Admin Quiz", slug="admin-quiz", is_active=True)

    def test_admin_validation_enforces_correct_option_counts(self):
        question_single = Question.objects.create(
            quiz=self.quiz,
            text="Single question",
            order=1,
            kind=Question.Kind.SINGLE,
            multi_select_count=1,
        )
        single_formset_class = inlineformset_factory(
            Question,
            Option,
            formset=OptionInlineFormSet,
            fields=("text", "is_correct"),
            extra=0,
            can_delete=False,
        )
        single_data = {
            "options-TOTAL_FORMS": "2",
            "options-INITIAL_FORMS": "0",
            "options-MIN_NUM_FORMS": "0",
            "options-MAX_NUM_FORMS": "1000",
            "options-0-text": "A",
            "options-0-is_correct": "on",
            "options-1-text": "B",
            "options-1-is_correct": "on",
        }
        single_formset = single_formset_class(data=single_data, instance=question_single, prefix="options")
        self.assertFalse(single_formset.is_valid())

        question_multi = Question.objects.create(
            quiz=self.quiz,
            text="Multi question",
            order=2,
            kind=Question.Kind.MULTI,
            multi_select_count=2,
        )
        multi_formset_class = inlineformset_factory(
            Question,
            Option,
            formset=OptionInlineFormSet,
            fields=("text", "is_correct"),
            extra=0,
            can_delete=False,
        )
        multi_data = {
            "options-TOTAL_FORMS": "3",
            "options-INITIAL_FORMS": "0",
            "options-MIN_NUM_FORMS": "0",
            "options-MAX_NUM_FORMS": "1000",
            "options-0-text": "A",
            "options-0-is_correct": "on",
            "options-1-text": "B",
            "options-2-text": "C",
        }
        multi_formset = multi_formset_class(data=multi_data, instance=question_multi, prefix="options")
        self.assertFalse(multi_formset.is_valid())
