from django.core.management.base import BaseCommand
from django.db import transaction

from apps.quiz.models import Option, Question, Quiz


QUIZ_QUESTIONS = [
    {
        "text": "A Lagos-based founder asks AI: “Write a proposal for my agritech startup.”\n\nThe output is generic and unusable. Which prompt improvement is MOST likely to produce a strategic, investor-ready result?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("“Act like a world-class consultant.”", False),
            ("“Write a better version.”", False),
            ("“Create a 5-page investor-ready proposal for a Lagos-based agritech startup serving smallholder farmers in Oyo State. Include revenue model in naira, unit economics, market risks, and a 3-year projection table.”", True),
            ("“Be detailed and professional.”", False),
        ],
    },
    {
        "text": "An AI tool generates statistics about youth unemployment in Nigeria but provides no sources. What is the most accurate explanation?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("The model searched the internet live and summarized it.", False),
            ("The model predicted plausible numbers based on training patterns.", True),
            ("The model accessed government databases directly.", False),
            ("The numbers must be accurate if phrased confidently.", False),
        ],
    },
    {
        "text": "A Kenyan fintech trains an AI credit scoring model using past lending data. The model consistently scores rural applicants lower.\n\nWhat is the most likely cause?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Rural applicants are objectively less creditworthy.", False),
            ("The model discovered a hidden economic truth.", False),
            ("Historical lending bias was encoded into training data.", True),
            ("The algorithm prefers urban inputs automatically.", False),
        ],
    },
    {
        "text": "Which statement BEST distinguishes current AI systems from true Artificial General Intelligence (AGI)?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Current AI systems can reason like humans.", False),
            ("AGI would be able to autonomously transfer learning across domains without task-specific retraining.", True),
            ("AGI already exists but is hidden.", False),
            ("Current AI cannot process language.", False),
        ],
    },
    {
        "text": "A Nigerian logistics company deploys an AI system that:\n- Reads incoming orders\n- Optimizes routes\n- Dispatches drivers\n- Adjusts pricing dynamically\n- Learns from delivery outcomes\n\nThis system is best described as:",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("A chatbot", False),
            ("A static machine learning model", False),
            ("An agentic AI system", True),
            ("Embodied robotics", False),
        ],
    },
    {
        "text": "Which scenario BEST represents embodied AI?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("A chatbot answering WAEC exam questions.", False),
            ("A drone autonomously mapping farmland in Kaduna and adjusting flight path in real time.", True),
            ("A spreadsheet forecasting revenue.", False),
            ("A WhatsApp auto-reply bot.", False),
        ],
    },
    {
        "text": "A hospital in Abuja wants to use AI to assist in diagnosis. What governance measure is MOST critical before deployment?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Faster internet connection.", False),
            ("Clear human oversight and audit trails for decisions.", True),
            ("Replacing doctors to reduce cost.", False),
            ("Removing patient consent requirements.", False),
        ],
    },
    {
        "text": "In an African context, which statement about AI and employment is MOST accurate?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AI will eliminate all jobs permanently.", False),
            ("AI will only create jobs in Silicon Valley.", False),
            ("AI will automate some tasks while augmenting others, reshaping skill demand.", True),
            ("AI has no impact on developing economies.", False),
        ],
    },
    {
        "text": "You are using AI to help draft a donor-funded proposal in Ghana. Which TWO actions are MOST responsible?",
        "kind": Question.Kind.MULTI,
        "multi_select_count": 2,
        "options": [
            ("Upload another NGO's full proposal including confidential budgets.", False),
            ("Provide high-level project goals and non-sensitive contextual details.", True),
            ("Share personal beneficiary data for realism.", False),
            ("Remove sensitive financial or personal data before using AI.", True),
        ],
    },
    {
        "text": "Which TWO statements are TRUE about modern large language models?",
        "kind": Question.Kind.MULTI,
        "multi_select_count": 2,
        "options": [
            ("They understand truth the way humans do.", False),
            ("They predict the next token based on statistical patterns.", True),
            ("They have consciousness and intent.", False),
            ("They can simulate reasoning without possessing internal self-awareness.", True),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the difficult 10-question AI Literacy quiz (Africa Edition)."

    @transaction.atomic
    def handle(self, *args, **options):
        quiz, _ = Quiz.objects.get_or_create(
            slug="ai-literacy-africa",
            defaults={
                "title": "AI Literacy Deep Assessment – Africa Edition",
                "is_active": True,
            },
        )
        quiz.title = "AI Literacy Deep Assessment – Africa Edition"
        quiz.is_active = True
        quiz.save(update_fields=["title", "is_active"])
        Quiz.objects.exclude(pk=quiz.pk).update(is_active=False)

        quiz.questions.all().delete()
        for index, payload in enumerate(QUIZ_QUESTIONS, start=1):
            question = Question.objects.create(
                quiz=quiz,
                text=payload["text"],
                order=index,
                kind=payload["kind"],
                multi_select_count=payload.get("multi_select_count", 1),
            )
            for option_text, is_correct in payload["options"]:
                Option.objects.create(
                    question=question,
                    text=option_text,
                    is_correct=is_correct,
                )
            question.validate_correct_option_count(question.options.filter(is_correct=True).count())

        self.stdout.write(self.style.SUCCESS("Difficult AI Literacy quiz seeded successfully."))
