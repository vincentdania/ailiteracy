from urllib.parse import quote

from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import MasterclassRegistrationForm
from .models import QuizSubmission

WHATSAPP_NUMBER = "2348029115964"
CONTACT_PHONE_DISPLAY = "08029115964"
CONTACT_EMAIL = "learn@ailiteracy.ng"
HYRAX_BOOKS_URL = "https://hyrax.ng/product/ai-confidence-in-21-days-workbook"
HYRAX_EBOOK_URL = "https://hyrax.ng/digital-product/ai-confidence-in-21-days"
HERO_IMAGE_URL = (
    "https://lh3.googleusercontent.com/aida-public/"
    "AB6AXuDFmkU_II7ZWcKJO6v_erO7MBd1bTLf3Z_9gGOl7_9bVMmOWBcq3WGdAk7iDbbMjkYC6ZLFxSQWDTziO2IdgZjkGIsE9MtoS7LGCLVbbM0S2FskulcaaKPNBJRckw7PHXaZ9_a1nhoY0F9WsbF3fhiLxQ72jjM__9VcYSVI_1YFxaNBhykoJNVukQvtzorddYyI07UTuDJ-mFvSVZY5QBE0WpZGny4hCQgz6vc3LDis9SXDqwzbpGP_cQZK0xFEAYBY0i4TN8glJjc"
)

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "text": "Which scenario BEST reflects the difference between traditional software and AI systems?",
        "options": {
            "A": "A calculator computing sums based on fixed formulas",
            "B": "A fraud detection system learning patterns from transaction data",
            "C": "A spreadsheet applying predefined rules",
            "D": "A database retrieving stored records",
        },
        "correct": "B",
    },
    {
        "id": 2,
        "text": "A user asks an AI tool: “Give me accurate statistics on unemployment in Nigeria” and receives confident but incorrect numbers. What is the most accurate explanation?",
        "options": {
            "A": "The AI intentionally misled the user",
            "B": "The AI retrieved outdated government data",
            "C": "The AI generated a plausible response based on learned patterns",
            "D": "The AI accessed unreliable internet sources",
        },
        "correct": "C",
    },
    {
        "id": 3,
        "text": "A startup founder in Lagos wants AI to generate a market entry strategy. Which prompt is MOST effective?",
        "options": {
            "A": "Write a business strategy.",
            "B": "Act like a business expert and give strategy.",
            "C": "Create a detailed market entry strategy for a Lagos-based fintech targeting informal traders. Include risks, pricing in naira, and customer acquisition channels.",
            "D": "Give me ideas for business growth.",
        },
        "correct": "C",
    },
    {
        "id": 4,
        "text": "A Nigerian hospital wants to use AI to summarize patient records. What is the MOST responsible approach?",
        "options": {
            "A": "Upload full patient data to AI for faster processing",
            "B": "Use anonymized or redacted data before processing",
            "C": "Allow AI to directly make medical decisions",
            "D": "Share data freely since AI improves accuracy",
        },
        "correct": "B",
    },
    {
        "id": 5,
        "text": "A company uses historical hiring data to train an AI recruitment tool. Over time, it favors candidates from a specific region. What is the most likely cause?",
        "options": {
            "A": "The AI developed independent preferences",
            "B": "The dataset contained historical bias",
            "C": "The algorithm is malfunctioning",
            "D": "AI systems always prefer majority groups",
        },
        "correct": "B",
    },
    {
        "id": 6,
        "text": "A policymaker in Nigeria is evaluating AI deployment in public services. Which is the MOST critical governance principle?",
        "options": {
            "A": "Maximizing automation to reduce costs",
            "B": "Ensuring transparency, accountability, and human oversight",
            "C": "Replacing human workers entirely",
            "D": "Prioritizing speed over accuracy",
        },
        "correct": "B",
    },
    {
        "id": 7,
        "text": "Which scenario BEST represents an agentic AI system?",
        "options": {
            "A": "A chatbot answering customer questions",
            "B": "A system that autonomously plans, executes, and adjusts tasks to achieve goals",
            "C": "A static predictive model",
            "D": "A spreadsheet automation tool",
        },
        "correct": "B",
    },
    {
        "id": 8,
        "text": "Which scenario BEST represents embodied AI?",
        "options": {
            "A": "A language model generating essays",
            "B": "A robot navigating a warehouse and adjusting movements in real time",
            "C": "A recommendation algorithm",
            "D": "A chatbot responding to messages",
        },
        "correct": "B",
    },
    {
        "id": 9,
        "text": "Which statement BEST distinguishes AGI from current AI systems?",
        "options": {
            "A": "AGI can process larger datasets",
            "B": "AGI can autonomously transfer knowledge across domains without retraining",
            "C": "AGI is faster than current AI",
            "D": "AGI only exists in robotics",
        },
        "correct": "B",
    },
    {
        "id": 10,
        "text": "Which statement about Artificial Superintelligence (ASI) is MOST accurate?",
        "options": {
            "A": "ASI is simply a larger version of current AI",
            "B": "ASI would surpass human intelligence across all domains, raising alignment risks",
            "C": "ASI already exists in advanced AI tools",
            "D": "ASI refers only to physical robots",
        },
        "correct": "B",
    },
]


def _get_level(score):
    if score <= 3:
        return "Beginner"
    if score <= 6:
        return "Intermediate"
    if score <= 8:
        return "Advanced"
    return "AI Fluent"


def _get_result_message(score):
    if score <= 3:
        return "You’re getting started. A few practical habits will make AI feel much more usable and less intimidating."
    if score <= 6:
        return "Great job. You’ve built a solid grasp of the fundamentals and are ready to apply AI more intentionally."
    if score <= 8:
        return "Strong result. You already understand the tools and can sharpen them into a daily advantage."
    return "Excellent. You already show clear AI fluency and the judgment needed to use these tools well."


def _share_links(score):
    message = quote(f"I scored {score}/10 on the AI Fluency Quiz at ailiteracy.ng")
    return {
        "whatsapp": f"https://wa.me/?text={message}",
        "twitter": f"https://twitter.com/intent/tweet?text={message}",
        "linkedin": "https://www.linkedin.com/sharing/share-offsite/?url=https://ailiteracy.ng",
    }


def home(request):
    quiz_result = request.session.get("quiz_result")
    masterclass_success = request.session.pop("masterclass_success", None)
    form = MasterclassRegistrationForm()

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "quiz_submit":
            score = sum(
                1
                for question in QUIZ_QUESTIONS
                if request.POST.get(f"question_{question['id']}") == question["correct"]
            )
            QuizSubmission.objects.create(score=score)
            request.session["quiz_result"] = {
                "score": score,
                "level": _get_level(score),
                "message": _get_result_message(score),
            }
            return redirect(f"{reverse('pages:home')}#result")

        if action == "masterclass_submit":
            form = MasterclassRegistrationForm(request.POST)
            if form.is_valid():
                registration = form.save()
                request.session["masterclass_success"] = {
                    "name": registration.name,
                    "whatsapp_url": (
                        f"https://wa.me/{WHATSAPP_NUMBER}?text="
                        f"{quote('I just registered for the AI masterclass')}"
                    ),
                }
                return redirect(f"{reverse('pages:home')}#masterclass")

    quiz_result = request.session.get("quiz_result")
    if quiz_result:
        quiz_result["message"] = quiz_result.get("message") or _get_result_message(quiz_result["score"])
        quiz_result["share_links"] = _share_links(quiz_result["score"])

    context = {
        "quiz_questions": QUIZ_QUESTIONS,
        "quiz_question_total": len(QUIZ_QUESTIONS),
        "quiz_result": quiz_result,
        "masterclass_form": form,
        "masterclass_success": masterclass_success,
        "hero_image_url": HERO_IMAGE_URL,
        "contact": {
            "phone_display": CONTACT_PHONE_DISPLAY,
            "email": CONTACT_EMAIL,
            "whatsapp_url": f"https://wa.me/{WHATSAPP_NUMBER}",
            "sms_url": f"sms:{CONTACT_PHONE_DISPLAY}",
            "email_url": f"mailto:{CONTACT_EMAIL}",
        },
        "workbook_links": {
            "hardcopy": HYRAX_BOOKS_URL,
            "ecopy": HYRAX_EBOOK_URL,
            "shop_label": "Sold on hyrax.ng",
        },
    }
    return render(request, "pages/home.html", context)
