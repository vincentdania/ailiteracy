from django.core.management.base import BaseCommand
from django.db import transaction

from apps.quiz.models import Option, Question, Quiz


QUIZ_QUESTIONS = [
    {
        "text": "An Abuja procurement officer wants AI to compare vendor bids for office equipment. What is the MOST responsible workflow?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Upload full bid documents with vendor names, account details, and rates so AI can rank suppliers faster.", False),
            ("Redact confidential fields, ask AI for an evaluation rubric, then apply that rubric manually to original bids.", True),
            ("Ask AI to choose the winning vendor directly and send that recommendation to management.", False),
            ("Break each bid into smaller chunks and upload all details in parts to reduce risk.", False),
        ],
    },
    {
        "text": "A Wuse boutique uses AI-generated Instagram ads. Clicks are high but purchases are poor. What is the most likely issue?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("The prompt optimized for attention metrics, not buyer intent and offer clarity.", True),
            ("Abuja customers can always detect AI copy, so conversion drops by default.", False),
            ("Instagram automatically suppresses AI-generated captions during ad delivery.", False),
            ("The only fix is to remove all AI from marketing workflow immediately.", False),
        ],
    },
    {
        "text": "A Garki hospital operations lead uses AI to summarize patient handover notes for doctors. What is the safest operational practice?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Use AI summaries directly during rounds to save time, then update records later if needed.", False),
            ("Require clinician verification against full records before any clinical decision is made.", True),
            ("Ask AI to provide a confidence score and trust outputs above 90 percent confidence.", False),
            ("Only use AI when the hospital internet is very stable.", False),
        ],
    },
    {
        "text": "A secondary school in Kubwa uses AI to support essay grading. What is the biggest fairness risk?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("AI can penalize local writing styles or context if rubric calibration is weak.", True),
            ("Students may submit essays too quickly because AI makes grading faster.", False),
            ("Teachers might prefer manual marking because of tradition.", False),
            ("The school may spend more on electricity when using AI tools.", False),
        ],
    },
    {
        "text": "Which prompt is MOST likely to produce a high-quality crisis statement after a major water outage in Abuja?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Write a statement about the water outage in Abuja.", False),
            ("As a PR expert, draft a clear public statement.", False),
            ("Draft a 180-word public update for FCT residents: acknowledge impact, list 3 immediate actions, include hotline and update frequency, avoid unverified causes.", True),
            ("Write an emotional apology and promise instant full compensation to everyone.", False),
        ],
    },
    {
        "text": "A Gwarinpa startup wants AI to screen internship CVs at scale. Which control is most important for responsible use?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Hide AI usage from candidates so results look fully human-reviewed.", False),
            ("Run periodic bias checks and keep a human override with reasons logged.", True),
            ("Auto-reject all candidates without prior AI tool experience.", False),
            ("Keep screening criteria secret to avoid candidate gaming.", False),
        ],
    },
    {
        "text": "An NGO in Nyanya uses AI to translate beneficiary feedback before sentiment analysis. What is the best quality-control step?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Use only AI translation outputs because manual checks are too expensive.", False),
            ("Spot-check samples with a bilingual reviewer against the original responses.", True),
            ("Keep only positive comments to avoid bias from negative sentiment.", False),
            ("Run two AI tools and average the sentiment scores without manual review.", False),
        ],
    },
    {
        "text": "A Jabi real-estate founder receives confident AI market statistics without citations. What is the safest next step?",
        "kind": Question.Kind.SINGLE,
        "options": [
            ("Proceed if the figures align with business intuition and recent market gossip.", False),
            ("Publish quickly and add a disclaimer that figures came from AI analysis.", False),
            ("Verify each critical statistic against independent credible sources before decisions.", True),
            ("Ask AI to confirm the same figures in a second response and treat that as validation.", False),
        ],
    },
    {
        "text": "You are preparing a donor brief for an Abuja youth skills project. Which TWO actions best reduce hallucination risk before submission?",
        "kind": Question.Kind.MULTI,
        "multi_select_count": 2,
        "options": [
            ("Force the model to provide a definite answer even when evidence is weak.", False),
            ("Ask AI to state assumptions and explicitly mark unknowns in the output.", True),
            ("Require critical claims to be checked against official or trusted source documents.", True),
            ("Use the newest model version and skip human fact-checking to save time.", False),
        ],
    },
    {
        "text": "You want AI help for a partnership pitch to an Abuja institution. Which TWO inputs are safest and most useful to share?",
        "kind": Question.Kind.MULTI,
        "multi_select_count": 2,
        "options": [
            ("Anonymized audience personas plus non-sensitive project goals and outcomes.", True),
            ("A raw export of participant names, phone numbers, and addresses.", False),
            ("A redacted budget range with no bank details or restricted contract rates.", True),
            ("A competitor proposal with proprietary pricing copied in full.", False),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the difficult 10-question AI Literacy quiz (Abuja Applied Edition)."

    @transaction.atomic
    def handle(self, *args, **options):
        quiz, _ = Quiz.objects.get_or_create(
            slug="ai-literacy-nigeria",
            defaults={
                "title": "AI Literacy Assessment - Abuja Applied Edition",
                "is_active": True,
            },
        )
        quiz.title = "AI Literacy Assessment - Abuja Applied Edition"
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
