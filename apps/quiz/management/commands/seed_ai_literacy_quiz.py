from django.core.management.base import BaseCommand
from django.db import transaction

from apps.quiz.models import Option, Question, Quiz


QUIZ_QUESTIONS = [
    {
        "text": "A civil servant uses ChatGPT to draft a confidential memo containing internal budget allocations. What is the MOST responsible approach?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Paste the full memo and ask ChatGPT to improve clarity.", False),
            ("Remove all sensitive figures and identifiers before using AI.", True),
            ("Use ChatGPT normally because it does not store data permanently.", False),
            ("Convert the memo into bullet points and paste it anyway.", False),
        ],
    },
    {
        "text": "A Nigerian SME owner uses AI to generate Facebook ad copy. The ads get high clicks but very low sales. What is the most likely issue?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AI content is always generic and cannot convert.", False),
            ("The prompt likely optimized for engagement instead of buyer intent.", True),
            ("Nigerians do not trust AI-written ads.", False),
            ("Facebook penalizes AI-generated content automatically.", False),
        ],
    },
    {
        "text": "A student uses AI to summarize lecture notes but later discovers inaccuracies. What is the best corrective workflow?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Stop using AI for academic work entirely.", False),
            ("Cross-check AI summaries against original material before relying on them.", True),
            ("Use a different AI tool instead.", False),
            ("Ask AI to confirm its own summary is accurate.", False),
        ],
    },
    {
        "text": "A fintech startup in Lagos wants to use AI to assess loan applications. What is the biggest ethical risk?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AI will reject too many applicants.", False),
            ("AI may reinforce historical bias present in past lending data.", True),
            ("AI is too expensive to scale.", False),
            ("Customers prefer human decision-makers.", False),
        ],
    },
    {
        "text": "Which prompt is MOST likely to produce a high-quality business strategy output?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Write a business plan for my startup.", False),
            ("Act like a McKinsey consultant and write a detailed strategy.", False),
            ("Create a 6-month growth strategy for a Lagos-based logistics startup targeting SMEs. Include cost estimates in naira and key risks.", True),
            ("Give me ideas for business.", False),
        ],
    },
    {
        "text": "A WhatsApp message claims AI predicted the next Nigerian election outcome with 100% certainty. What is the most accurate assessment?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AI can predict elections with enough data.", False),
            ("AI may simulate analysis, but cannot guarantee political certainty.", True),
            ("If it used machine learning, it must be accurate.", False),
            ("AI predictions are always manipulated.", False),
        ],
    },
    {
        "text": "A hospital administrator wants to use AI to automate patient record summaries. What is the PRIMARY compliance concern?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AI may summarize too slowly.", False),
            ("Patient data privacy and consent requirements.", True),
            ("Doctors may resist technology.", False),
            ("AI summaries may use medical jargon.", False),
        ],
    },
    {
        "text": "A founder asks AI to analyze the Nigerian market for electric vehicles and receives confident statistics without citations. What is the safest next step?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Assume the data is correct because it sounds detailed.", False),
            ("Publish the report but add a disclaimer.", False),
            ("Verify statistics using independent credible sources.", True),
            ("Ask the AI if it is sure.", False),
        ],
    },
    {
        "text": "Which TWO actions best reduce the risk of AI “hallucinations” causing harm in a Nigerian workplace?",
        "kind": Question.Kind.MULTI,
        "multi_select_count": 2,
        "options": [
            ("Ask the AI to “double-check itself” before responding.", False),
            ("Require a human to verify critical claims against trusted sources.", True),
            ("Use AI only when internet access is available.", False),
            ("Ask for citations and then validate those citations independently.", True),
        ],
    },
    {
        "text": "You want to use AI to help draft a proposal for a Nigerian donor-funded project. Which TWO inputs are safest and most useful to share with the AI?",
        "kind": Question.Kind.MULTI,
        "multi_select_count": 2,
        "options": [
            ("Full proposal from another organization you copied (including their budget).", False),
            ("Your project goals, target communities, and non-sensitive context.", True),
            ("Personal data of beneficiaries (names, phone numbers, addresses).", False),
            ("A redacted budget summary (no bank details; no personal data; no confidential rates if restricted).", True),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the difficult 10-question AI Literacy quiz (Nigeria Edition)."

    @transaction.atomic
    def handle(self, *args, **options):
        quiz, _ = Quiz.objects.get_or_create(
            slug="ai-literacy-nigeria",
            defaults={
                "title": "AI Literacy Assessment – Nigeria Edition",
                "is_active": True,
            },
        )
        quiz.title = "AI Literacy Assessment – Nigeria Edition"
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
