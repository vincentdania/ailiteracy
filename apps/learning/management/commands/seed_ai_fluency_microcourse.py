from django.core.management.base import BaseCommand
from django.db import transaction

from apps.learning.models import Course, FinalQuizOption, FinalQuizQuestion, Lesson, Module


class Command(BaseCommand):
    help = "Seed AI Fluency micro-course content and final quiz."

    @transaction.atomic
    def handle(self, *args, **options):
        course, _ = Course.objects.get_or_create(
            slug="ai-fluency",
            defaults={
                "title": "AI Fluency: Framework & Foundations (Nigeria Edition)",
                "summary": "A practical 15-minute micro-course for AI foundations.",
                "description": (
                    "A concise course covering AI fundamentals, prompting basics, "
                    "and responsible AI use in Nigeria."
                ),
                "is_featured": True,
            },
        )
        course.title = "AI Fluency: Framework & Foundations (Nigeria Edition)"
        course.summary = "A practical 15-minute micro-course for AI foundations."
        course.description = (
            "A concise course covering AI fundamentals, prompting basics, "
            "and responsible AI use in Nigeria."
        )
        course.is_featured = True
        course.save(update_fields=["title", "summary", "description", "is_featured"])

        lesson_payload = [
            {
                "module_title": "Module 1: What AI Is (and Is Not) – Nigerian Context (3 mins)",
                "lesson_title": "AI in Practical Nigerian Context",
                "lesson_slug": "what-ai-is-nigeria-context",
                "content": (
                    "AI helps with prediction, generation, and decision support.\n\n"
                    "What AI is not:\n"
                    "- Magic that is always correct\n"
                    "- A replacement for judgment and accountability\n\n"
                    "Examples in Nigeria:\n"
                    "- SMEs using AI for customer support drafts\n"
                    "- Teachers using AI to prepare lesson outlines\n"
                    "- Founders using AI for market research summaries"
                ),
            },
            {
                "module_title": "Module 2: AI Fluency Framework (4 mins)",
                "lesson_title": "Understand the AI Fluency Framework",
                "lesson_slug": "ai-fluency-framework",
                "content": (
                    "Framework:\n"
                    "1) Define objective\n"
                    "2) Provide context\n"
                    "3) Give constraints\n"
                    "4) Ask for structure\n"
                    "5) Validate output\n\n"
                    "Use this framework before every prompt."
                ),
            },
            {
                "module_title": "Module 3: Prompting Basics + 3 Practice Prompts (4 mins)",
                "lesson_title": "Prompting Basics and Practice",
                "lesson_slug": "prompting-basics-practice",
                "content": (
                    "Prompt pattern:\n"
                    "- Role + Goal + Context + Constraints + Output format\n\n"
                    "Practice prompts:\n"
                    "1) Draft a concise proposal email for a Lagos client.\n"
                    "2) Summarize meeting notes into 5 action items.\n"
                    "3) Generate 3 social captions for a fintech campaign."
                ),
            },
            {
                "module_title": "Module 4: Risks, Ethics & Responsible Use in Nigeria (4 mins)",
                "lesson_title": "Risks, Ethics, and Responsible Use",
                "lesson_slug": "risks-ethics-responsible-use",
                "content": (
                    "Responsible use checklist:\n"
                    "- Do not upload sensitive personal data\n"
                    "- Verify factual claims\n"
                    "- Watch for bias\n"
                    "- Keep human review in high-stakes tasks\n"
                    "- Disclose AI-assisted outputs where appropriate"
                ),
            },
        ]

        Module.objects.filter(course=course).exclude(order__in=[1, 2, 3, 4]).delete()
        for idx, payload in enumerate(lesson_payload, start=1):
            module, _ = Module.objects.get_or_create(course=course, order=idx, defaults={"title": payload["module_title"]})
            module.title = payload["module_title"]
            module.save(update_fields=["title"])

            lesson, _ = Lesson.objects.get_or_create(
                module=module,
                order=1,
                defaults={
                    "title": payload["lesson_title"],
                    "slug": payload["lesson_slug"],
                    "content": payload["content"],
                },
            )
            lesson.title = payload["lesson_title"]
            lesson.slug = payload["lesson_slug"]
            lesson.content = payload["content"]
            lesson.is_preview = True
            lesson.save(update_fields=["title", "slug", "content", "is_preview"])

        quiz_payload = [
            {
                "text": "What is the passing score for this micro-course final quiz?",
                "options": [("50%", False), ("60%", False), ("80%", True), ("90%", False)],
            },
            {
                "text": "Which prompt element improves output reliability?",
                "options": [("No context", False), ("Specific constraints", True), ("Random emojis", False), ("One-word requests", False)],
            },
            {
                "text": "Which is responsible AI practice in Nigeria?",
                "options": [("Share customer passwords", False), ("Validate critical outputs", True), ("Use outputs blindly", False), ("Ignore bias", False)],
            },
            {
                "text": "What does AI fluency primarily involve?",
                "options": [("Using AI without review", False), ("Clear prompting and verification", True), ("Memorizing model names only", False), ("Avoiding all experiments", False)],
            },
            {
                "text": "Before adopting AI in a workflow, you should:",
                "options": [("Define your objective", True), ("Skip constraints", False), ("Hide all assumptions", False), ("Ignore quality checks", False)],
            },
        ]

        course.final_quiz_questions.all().delete()
        for q_index, question_payload in enumerate(quiz_payload, start=1):
            question = FinalQuizQuestion.objects.create(course=course, text=question_payload["text"], order=q_index)
            for o_index, (option_text, is_correct) in enumerate(question_payload["options"], start=1):
                FinalQuizOption.objects.create(
                    question=question,
                    text=option_text,
                    is_correct=is_correct,
                    order=o_index,
                )

        self.stdout.write(self.style.SUCCESS("AI Fluency micro-course seeded successfully."))
