from django.core.management.base import BaseCommand
from django.db import transaction

from apps.learning.models import Course, FinalQuizOption, FinalQuizQuestion, Lesson, Module


class Command(BaseCommand):
    help = "Seed the intro AI literacy micro-course content and final quiz."

    @transaction.atomic
    def handle(self, *args, **options):
        course, _ = Course.objects.get_or_create(
            slug="ai-fluency",
            defaults={
                "title": "Introduction to AI Literacy: What is AI and Who Is Considered AI Literate?",
                "summary": "A 15-minute introduction to what AI is and what AI literacy means.",
                "description": (
                    "A short, practical course explaining what AI is, where you already use it, "
                    "what it means to be AI literate, and why AI literacy matters for African societies."
                ),
                "is_featured": True,
            },
        )
        course.title = "Introduction to AI Literacy: What is AI and Who Is Considered AI Literate?"
        course.summary = "A 15-minute introduction to what AI is and what AI literacy means."
        course.description = (
            "A short, practical course explaining what AI is, where you already use it, "
            "what it means to be AI literate, and why AI literacy matters for African societies."
        )
        course.is_featured = True
        course.save(update_fields=["title", "summary", "description", "is_featured"])

        lesson_payload = [
            {
                "module_title": "Lesson 1: What is Artificial Intelligence?",
                "lesson_title": "AI, Machine Learning, and Generative AI",
                "lesson_slug": "what-is-artificial-intelligence",
                "content": (
                    "Artificial Intelligence (AI) means computer systems performing tasks that usually require human intelligence, "
                    "such as pattern recognition, prediction, language understanding, and decision support.\n\n"
                    "Machine Learning (ML) is a part of AI. In ML, systems learn patterns from data instead of being manually programmed for every rule.\n\n"
                    "Generative AI is a type of AI that creates new content such as text, images, code, audio, or summaries.\n\n"
                    "Relatable examples in Nigerian and African contexts:\n"
                    "- AI writing tools for emails, proposals, and class notes\n"
                    "- Fraud detection systems in Nigerian banks\n"
                    "- Agriculture monitoring using drones and satellite data\n"
                    "- Customer service chatbots for telecom, fintech, and e-commerce"
                ),
            },
            {
                "module_title": "Lesson 2: Where You Already Encounter AI",
                "lesson_title": "Everyday AI in Daily Life",
                "lesson_slug": "where-you-already-encounter-ai",
                "content": (
                    "You already use AI more often than you might think.\n\n"
                    "Common examples:\n"
                    "- Google Search ranking and suggestions\n"
                    "- Netflix and YouTube recommendations\n"
                    "- Fraud detection alerts in Nigerian banking apps\n"
                    "- Ride-hailing route and pricing optimization\n"
                    "- AI writing assistants in school and work\n\n"
                    "AI is not only for engineers. It now appears in everyday tools used by students, workers, and business owners."
                ),
            },
            {
                "module_title": "Lesson 3: What Does It Mean To Be AI Literate?",
                "lesson_title": "Core Skills of an AI-Literate Person",
                "lesson_slug": "what-it-means-to-be-ai-literate",
                "content": (
                    "AI literacy is the ability to understand, use, and evaluate AI responsibly.\n\n"
                    "An AI-literate person can:\n"
                    "- Understand what AI can and cannot do\n"
                    "- Use AI tools effectively for practical outcomes\n"
                    "- Ask better prompts with clear context\n"
                    "- Verify AI outputs before relying on them\n"
                    "- Understand major risks such as hallucinations and bias\n\n"
                    "Being AI literate is less about hype and more about informed judgment."
                ),
            },
            {
                "module_title": "Lesson 4: Why AI Literacy Matters",
                "lesson_title": "AI Literacy and the Future of Africa",
                "lesson_slug": "why-ai-literacy-matters",
                "content": (
                    "AI literacy matters because AI is changing education, work, business, and public services.\n\n"
                    "Why it matters for different groups:\n"
                    "- Students: learn faster and prepare for modern careers\n"
                    "- Workers: improve productivity and remain competitive\n"
                    "- Entrepreneurs: build better products and reduce operating costs\n"
                    "- Governments: design smarter, fairer public systems\n"
                    "- African economies: increase innovation capacity and digital competitiveness\n\n"
                    "AI literacy helps people use AI as a tool for growth, not a source of confusion."
                ),
            },
        ]

        valid_orders = list(range(1, len(lesson_payload) + 1))
        Module.objects.filter(course=course).exclude(order__in=valid_orders).delete()
        for idx, payload in enumerate(lesson_payload, start=1):
            module, _ = Module.objects.get_or_create(course=course, order=idx, defaults={"title": payload["module_title"]})
            module.title = payload["module_title"]
            module.save(update_fields=["title"])
            module.lessons.exclude(order=1).delete()

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
                "text": "Which statement best defines Artificial Intelligence?",
                "options": [
                    ("AI is any software that runs on a computer.", False),
                    ("AI is a system that can perform tasks that usually require human intelligence.", True),
                    ("AI always makes perfect decisions.", False),
                    ("AI is only used by large tech companies.", False),
                ],
            },
            {
                "text": "What is the relationship between AI, machine learning, and generative AI?",
                "options": [
                    ("Machine learning and generative AI are unrelated to AI.", False),
                    ("Machine learning is part of AI, and generative AI is one AI approach for creating content.", True),
                    ("Generative AI is the same as all AI.", False),
                    ("AI is a subset of machine learning.", False),
                ],
            },
            {
                "text": "Which option is a practical example of AI in an African context?",
                "options": [
                    ("Bank fraud detection that flags suspicious transactions.", True),
                    ("A paper notebook used for bookkeeping.", False),
                    ("A calculator adding two numbers.", False),
                    ("A static poster for a business.", False),
                ],
            },
            {
                "text": "A person is AI literate when they can:",
                "options": [
                    ("Use AI outputs without checking.", False),
                    ("Understand AI limits, write better prompts, and verify outputs.", True),
                    ("Memorize AI brand names only.", False),
                    ("Avoid AI entirely to stay safe.", False),
                ],
            },
            {
                "text": "Why does AI literacy matter for African economies?",
                "options": [
                    ("It helps countries ignore digital change.", False),
                    ("It supports productivity, innovation, and better policy decisions.", True),
                    ("It removes the need for human skills.", False),
                    ("It only benefits foreign companies.", False),
                ],
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
