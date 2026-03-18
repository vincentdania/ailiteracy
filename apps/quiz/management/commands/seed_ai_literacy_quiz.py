from django.core.management.base import BaseCommand
from django.db import transaction

from apps.quiz.models import Option, Question, Quiz


QUIZ_QUESTIONS = [
    {
        "text": "Which scenario BEST reflects the difference between traditional software and AI systems?",
        "explanation": "AI systems, especially machine learning systems, learn patterns from data instead of following only fixed rules. A calculator, spreadsheet, and database are deterministic tools, while fraud detection learns from examples and adapts to new patterns.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("A calculator computing sums based on fixed formulas", False),
            ("A fraud detection system learning patterns from transaction data", True),
            ("A spreadsheet applying predefined rules", False),
            ("A database retrieving stored records", False),
        ],
    },
    {
        "text": "A user asks an AI tool: “Give me accurate statistics on unemployment in Nigeria” and receives confident but incorrect numbers. What is the most accurate explanation?",
        "explanation": "Modern AI models generate likely continuations based on learned patterns rather than verifying truth first. That is why they can sound confident while still giving incorrect numbers.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("The AI intentionally misled the user", False),
            ("The AI retrieved outdated government data", False),
            ("The AI generated a plausible response based on learned patterns", True),
            ("The AI accessed unreliable internet sources", False),
        ],
    },
    {
        "text": "A startup founder in Lagos wants AI to generate a market entry strategy. Which prompt is MOST effective?",
        "explanation": "High-quality prompts give the model context, audience, constraints, and expected output. That makes the response far more useful than vague requests.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("“Write a business strategy.”", False),
            ("“Act like a business expert and give strategy.”", False),
            ("“Create a detailed market entry strategy for a Lagos-based fintech targeting informal traders. Include risks, pricing in naira, and customer acquisition channels.”", True),
            ("“Give me ideas for business growth.”", False),
        ],
    },
    {
        "text": "A Nigerian hospital wants to use AI to summarize patient records. What is the MOST responsible approach?",
        "explanation": "Sensitive health data should be anonymized or redacted before using AI tools. Privacy and human oversight matter more than convenience.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Upload full patient data to AI for faster processing", False),
            ("Use anonymized or redacted data before processing", True),
            ("Allow AI to directly make medical decisions", False),
            ("Share data freely since AI improves accuracy", False),
        ],
    },
    {
        "text": "A company uses historical hiring data to train an AI recruitment tool. Over time, it favors candidates from a specific region. What is the most likely cause?",
        "explanation": "AI reflects the patterns in its training data, including bias. If the historical data is biased, the model can reproduce that bias at scale.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("The AI developed independent preferences", False),
            ("The dataset contained historical bias", True),
            ("The algorithm is malfunctioning", False),
            ("AI systems always prefer majority groups", False),
        ],
    },
    {
        "text": "A policymaker in Nigeria is evaluating AI deployment in public services. Which is the MOST critical governance principle?",
        "explanation": "Responsible AI governance depends on transparency, accountability, and meaningful human oversight. Cost and speed matter, but they cannot replace safety and responsibility.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Maximizing automation to reduce costs", False),
            ("Ensuring transparency, accountability, and human oversight", True),
            ("Replacing human workers entirely", False),
            ("Prioritizing speed over accuracy", False),
        ],
    },
    {
        "text": "Which scenario BEST represents an agentic AI system?",
        "explanation": "Agentic AI systems can plan, act, and adjust autonomously to achieve goals. A standard chatbot is mostly reactive, not agentic.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("A chatbot answering customer questions", False),
            ("A system that autonomously plans, executes, and adjusts tasks to achieve goals", True),
            ("A static predictive model", False),
            ("A spreadsheet automation tool", False),
        ],
    },
    {
        "text": "Which scenario BEST represents embodied AI?",
        "explanation": "Embodied AI interacts with the physical world through sensors, movement, and feedback loops. A robot navigating a warehouse is a clear example.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("A language model generating essays", False),
            ("A robot navigating a warehouse and adjusting movements in real time", True),
            ("A recommendation algorithm", False),
            ("A chatbot responding to messages", False),
        ],
    },
    {
        "text": "Which statement BEST distinguishes AGI from current AI systems?",
        "explanation": "AGI refers to flexible intelligence that can transfer knowledge across different domains without task-specific retraining. Current AI systems are much narrower.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AGI can process larger datasets", False),
            ("AGI can autonomously transfer knowledge across domains without retraining", True),
            ("AGI is faster than current AI", False),
            ("AGI only exists in robotics", False),
        ],
    },
    {
        "text": "Which statement about Artificial Superintelligence (ASI) is MOST accurate?",
        "explanation": "ASI is a theoretical idea about systems exceeding human intelligence across all domains. The major concern is not just power, but alignment and safety.",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("ASI is simply a larger version of current AI", False),
            ("ASI would surpass human intelligence across all domains, raising alignment risks", True),
            ("ASI already exists in advanced AI tools", False),
            ("ASI refers only to physical robots", False),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the 10-question untimed AI Literacy quiz."

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

        updated_question_ids = []
        for index, payload in enumerate(QUIZ_QUESTIONS, start=1):
            question, _ = Question.objects.update_or_create(
                quiz=quiz,
                order=index,
                defaults={
                    "text": payload["text"],
                    "explanation": payload.get("explanation", ""),
                    "kind": payload["kind"],
                    "multi_select_count": payload.get("multi_select_count", 1),
                },
            )
            updated_question_ids.append(question.id)

            existing_options = list(question.options.order_by("id"))
            for option_index, (option_text, is_correct) in enumerate(payload["options"]):
                if option_index < len(existing_options):
                    option = existing_options[option_index]
                    option.text = option_text
                    option.is_correct = is_correct
                    option.save(update_fields=["text", "is_correct"])
                else:
                    Option.objects.create(
                        question=question,
                        text=option_text,
                        is_correct=is_correct,
                    )

            for option in existing_options[len(payload["options"]):]:
                option.delete()

            question.validate_correct_option_count(question.options.filter(is_correct=True).count())

        quiz.questions.exclude(id__in=updated_question_ids).delete()
        self.stdout.write(self.style.SUCCESS("AI Literacy quiz seeded successfully."))
