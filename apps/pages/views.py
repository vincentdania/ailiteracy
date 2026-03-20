from io import BytesIO
import random
from decimal import Decimal, ROUND_HALF_UP
from urllib.parse import quote, quote_plus
from uuid import UUID

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from .forms import MasterclassRegistrationForm
from .models import QuizSubmission

WHATSAPP_NUMBER = "2348029115964"
CONTACT_PHONE_DISPLAY = "08029115964"
CONTACT_EMAIL = "learn@ailiteracy.ng"
HYRAX_BOOKS_URL = "https://hyrax.ng/product/ai-confidence-in-21-days-workbook"
HYRAX_EBOOK_URL = "https://hyrax.ng/digital-product/ai-confidence-in-21-days-e-book"
HERO_IMAGE_URL = (
    "https://lh3.googleusercontent.com/aida-public/"
    "AB6AXuDFmkU_II7ZWcKJO6v_erO7MBd1bTLf3Z_9gGOl7_9bVMmOWBcq3WGdAk7iDbbMjkYC6ZLFxSQWDTziO2IdgZjkGIsE9MtoS7LGCLVbbM0S2FskulcaaKPNBJRckw7PHXaZ9_a1nhoY0F9WsbF3fhiLxQ72jjM__9VcYSVI_1YFxaNBhykoJNVukQvtzorddYyI07UTuDJ-mFvSVZY5QBE0WpZGny4hCQgz6vc3LDis9SXDqwzbpGP_cQZK0xFEAYBY0i4TN8glJjc"
)

QUIZ_TOTAL_POINTS = 14
QUIZ_SCORE_CAP = Decimal("10.0")
CONFIDENCE_OPTIONS = [
    {"id": "low", "label": "Low"},
    {"id": "medium", "label": "Medium"},
    {"id": "high", "label": "High"},
]
VALID_CONFIDENCES = {item["id"] for item in CONFIDENCE_OPTIONS}
CONFIDENCE_RANKS = {"low": 1, "medium": 2, "high": 3}
CORRECT_CONFIDENCE_MULTIPLIERS = {
    "low": Decimal("1.0"),
    "medium": Decimal("1.0"),
    "high": Decimal("1.2"),
}
WRONG_CONFIDENCE_SCORES = {
    "low": Decimal("0"),
    "medium": Decimal("-0.25"),
    "high": Decimal("-0.75"),
}

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "text": "Which statement best describes how modern AI systems generate responses?",
        "weight": 1,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "They retrieve stored answers from structured databases"},
            {"id": "B", "text": "They search online sources to construct real-time answers"},
            {"id": "C", "text": "They predict likely word sequences from learned patterns"},
            {"id": "D", "text": "They apply logical reasoning rules to derive conclusions"},
        ],
        "correct": ["C"],
    },
    {
        "id": 2,
        "text": "Which statement best reflects the reliability of AI-generated outputs?",
        "weight": 1,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "They are reliable when phrased in clear and simple language"},
            {"id": "B", "text": "They are accurate when generated using advanced models"},
            {"id": "C", "text": "They may include errors despite sounding confident and complete"},
            {"id": "D", "text": "They remain correct if the question is properly structured"},
        ],
        "correct": ["C"],
    },
    {
        "id": 3,
        "text": "A business owner asks AI to write a business plan and gets a generic result. What is the best improvement?",
        "weight": 1,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "Ask the system to produce a more detailed response"},
            {"id": "B", "text": "Use a different tool with stronger performance"},
            {"id": "C", "text": "Provide context, constraints, and a defined target audience"},
            {"id": "D", "text": "Increase the length of the instruction significantly"},
        ],
        "correct": ["C"],
    },
    {
        "id": 4,
        "text": "An AI hiring system favors candidates from a specific region. What is the most likely explanation?",
        "weight": 1,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "The system has identified stronger candidates from that region"},
            {"id": "B", "text": "The model has learned patterns from biased historical data"},
            {"id": "C", "text": "The algorithm is prioritizing efficiency over fairness"},
            {"id": "D", "text": "The training process failed to include diverse examples"},
        ],
        "correct": ["B"],
    },
    {
        "id": 5,
        "text": "An AI-generated report includes statistics without sources. What is the most appropriate next step?",
        "weight": 1,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "Ask the system to confirm the figures it provided"},
            {"id": "B", "text": "Compare the response with another AI-generated output"},
            {"id": "C", "text": "Validate the figures using independent external sources"},
            {"id": "D", "text": "Accept the information if it appears internally consistent"},
        ],
        "correct": ["C"],
    },
    {
        "id": 6,
        "text": "A hospital wants to use AI to summarize patient records. What is the most responsible approach?",
        "weight": 1,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "Provide full records to ensure more accurate summaries"},
            {"id": "B", "text": "Remove sensitive details before processing the data"},
            {"id": "C", "text": "Allow the system to handle summaries without review"},
            {"id": "D", "text": "Restrict usage to only non-clinical administrative tasks"},
        ],
        "correct": ["B"],
    },
    {
        "id": 7,
        "text": "A user asks an AI system to verify its own answer for accuracy. What is the most accurate evaluation?",
        "weight": 2,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "This improves accuracy by forcing internal consistency"},
            {"id": "B", "text": "This works when the model has advanced reasoning ability"},
            {"id": "C", "text": "This remains unreliable because the system lacks true verification"},
            {"id": "D", "text": "This ensures the response is supported by internal data"},
        ],
        "correct": ["C"],
    },
    {
        "id": 8,
        "text": "A fintech company plans to automate loan approvals using AI. What is the most appropriate implementation?",
        "weight": 2,
        "required_count": 1,
        "options": [
            {"id": "A", "text": "Allow the system to process and approve all applications directly"},
            {"id": "B", "text": "Use system outputs while retaining human review for decisions"},
            {"id": "C", "text": "Reject applications automatically below defined thresholds"},
            {"id": "D", "text": "Limit system use to customer communication processes"},
        ],
        "correct": ["B"],
    },
    {
        "id": 9,
        "text": "Q9 (MULTI-SELECT — choose TWO): Which two actions most effectively improve the reliability of AI outputs?",
        "weight": 2,
        "required_count": 2,
        "options": [
            {"id": "A", "text": "Request the system to restate and confirm its answer"},
            {"id": "B", "text": "Provide clear instructions and defined constraints"},
            {"id": "C", "text": "Cross-check outputs using independent external sources"},
            {"id": "D", "text": "Increase the length and detail of the input prompt"},
        ],
        "correct": ["B", "C"],
    },
    {
        "id": 10,
        "text": "Q10 (MULTI-SELECT — choose TWO): Which two statements accurately describe how modern AI systems function?",
        "weight": 2,
        "required_count": 2,
        "options": [
            {"id": "A", "text": "They interpret meaning using human-like understanding"},
            {"id": "B", "text": "They generate outputs based on statistical relationships"},
            {"id": "C", "text": "They simulate reasoning without possessing true awareness"},
            {"id": "D", "text": "They rely on real-time access to verified information"},
        ],
        "correct": ["B", "C"],
    },
]


def _decimal_score(value):
    return min(
        Decimal(str(value)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP),
        QUIZ_SCORE_CAP,
    )


def _score_label(value):
    return format(_decimal_score(value), ".1f")


def _build_quiz_questions(selected_answers=None, selected_confidences=None):
    selected_answers = selected_answers or {}
    selected_confidences = selected_confidences or {}
    rendered_questions = []
    for question in QUIZ_QUESTIONS:
        rendered_questions.append(
            {
                **question,
                "options": random.sample(question["options"], k=len(question["options"])),
                "selected_answers": selected_answers.get(question["id"], []),
                "selected_confidence": selected_confidences.get(question["id"], ""),
                "selection_label": "Select one" if question["required_count"] == 1 else "Select two",
                "confidence_options": CONFIDENCE_OPTIONS,
            }
        )
    return rendered_questions


def _selected_answers_from_post(request):
    selected_answers = {}
    for question in QUIZ_QUESTIONS:
        valid_option_ids = {option["id"] for option in question["options"]}
        selected = []
        for raw_value in request.POST.getlist(f"question_{question['id']}_answer"):
            if raw_value in valid_option_ids and raw_value not in selected:
                selected.append(raw_value)
        selected_answers[question["id"]] = selected
    return selected_answers


def _selected_confidences_from_post(request):
    selected_confidences = {}
    for question in QUIZ_QUESTIONS:
        confidence = request.POST.get(f"question_{question['id']}_confidence", "")
        selected_confidences[question["id"]] = confidence if confidence in VALID_CONFIDENCES else ""
    return selected_confidences


def _validate_quiz_submission(selected_answers, selected_confidences):
    return [
        question["id"]
        for question in QUIZ_QUESTIONS
        if len(selected_answers.get(question["id"], [])) != question["required_count"]
        or selected_confidences.get(question["id"], "") not in VALID_CONFIDENCES
    ]


def _calculate_quiz_score(selected_answers, selected_confidences):
    adjusted_points = Decimal("0")
    confidence_total = 0
    metrics = {
        "penalty_points": Decimal("0"),
        "high_penalty_count": 0,
        "low_confidence_correct_count": 0,
        "high_confidence_correct_count": 0,
    }

    for question in QUIZ_QUESTIONS:
        selected = selected_answers.get(question["id"], [])
        confidence = selected_confidences.get(question["id"], "low")
        confidence_total += CONFIDENCE_RANKS.get(confidence, 0)
        is_correct = len(selected) == question["required_count"] and set(selected) == set(question["correct"])

        if is_correct:
            adjusted = Decimal(str(question["weight"])) * CORRECT_CONFIDENCE_MULTIPLIERS[confidence]
            adjusted_points += adjusted
            if confidence == "low":
                metrics["low_confidence_correct_count"] += 1
            if confidence == "high":
                metrics["high_confidence_correct_count"] += 1
        else:
            adjusted = WRONG_CONFIDENCE_SCORES[confidence]
            adjusted_points += adjusted
            if adjusted < 0:
                metrics["penalty_points"] += -adjusted
            if confidence == "high":
                metrics["high_penalty_count"] += 1

    metrics["avg_confidence"] = (Decimal(confidence_total) / Decimal(len(QUIZ_QUESTIONS))).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )
    final_score = (adjusted_points / Decimal(QUIZ_TOTAL_POINTS)) * Decimal("10")
    return adjusted_points, _decimal_score(final_score), metrics


def _get_level(score):
    score = _decimal_score(score)
    if score <= 3:
        return "Beginner"
    if score <= 6:
        return "Intermediate"
    if score <= 8:
        return "Advanced"
    return "AI Fluent"


def _get_result_message(score):
    score = _decimal_score(score)
    if score <= 3:
        return "You’re getting started. A few practical habits will make AI feel much more usable and less intimidating."
    if score <= 6:
        return "Great job. You’ve built a solid grasp of the fundamentals and are ready to apply AI more intentionally."
    if score <= 8:
        return "Strong result. You already understand the tools and can sharpen them into a daily advantage."
    return "Excellent. You already show clear AI fluency and the judgment needed to use these tools well."


def _get_confidence_insight(score, metrics=None):
    score = _decimal_score(score)
    metrics = metrics or {}

    if metrics.get("high_penalty_count", 0) > 0:
        return "Your confidence exceeded your accuracy. Improve verification."
    if metrics.get("low_confidence_correct_count", 0) >= 2 and score >= Decimal("5.0"):
        return "You performed well but underestimated your knowledge."
    if metrics.get("high_confidence_correct_count", 0) >= 2 and score >= Decimal("7.0"):
        return "You show strong and confident AI fluency."
    return "Calibrating confidence alongside accuracy will sharpen your AI judgment."


def _share_urls(request, share_id):
    if not share_id:
        return {
            "share_url": request.build_absolute_uri(reverse("pages:home")),
            "share_image_url": "",
        }

    if not isinstance(share_id, UUID):
        try:
            share_id = UUID(str(share_id))
        except (TypeError, ValueError):
            return {
                "share_url": request.build_absolute_uri(reverse("pages:home")),
                "share_image_url": "",
            }

    share_url = request.build_absolute_uri(reverse("pages:share", kwargs={"share_id": share_id}))
    share_image_url = request.build_absolute_uri(reverse("pages:share_image", kwargs={"share_id": share_id}))
    return {
        "share_url": share_url,
        "share_image_url": share_image_url,
    }


def _share_links(score, share_url):
    score_label = _score_label(score)
    whatsapp_text = quote_plus(f"I scored {score_label}/10 on this AI test {share_url}")
    x_text = quote_plus(f"I scored {score_label}/10 on this AI test")
    encoded_share_url = quote_plus(share_url)
    return {
        "whatsapp": f"https://wa.me/?text={whatsapp_text}",
        "twitter": f"https://twitter.com/intent/tweet?text={x_text}&url={encoded_share_url}",
        "linkedin": f"https://www.linkedin.com/sharing/share-offsite/?url={encoded_share_url}",
        "facebook": f"https://www.facebook.com/sharer/sharer.php?u={encoded_share_url}",
    }


def _load_share_font(size, bold=False):
    from PIL import ImageFont

    preferred_fonts = [
        "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for font_path in preferred_fonts:
        try:
            return ImageFont.truetype(font_path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def _draw_centered_text(draw, text, font, fill, canvas_width, top):
    left, upper, right, lower = draw.textbbox((0, 0), text, font=font)
    width = right - left
    height = lower - upper
    x = (canvas_width - width) / 2
    draw.text((x, top), text, font=font, fill=fill)
    return top + height


def _build_share_image_response(submission):
    from PIL import Image, ImageDraw

    width = 1200
    height = 630
    image = Image.new("RGB", (width, height), "#071224")
    draw = ImageDraw.Draw(image)

    start = (7, 18, 36)
    end = (11, 109, 84)
    for y in range(height):
        blend = y / max(height - 1, 1)
        color = tuple(int(start[i] + (end[i] - start[i]) * blend) for i in range(3))
        draw.line([(0, y), (width, y)], fill=color)

    draw.ellipse((80, 70, 320, 310), fill=(98, 252, 201, 38))
    draw.ellipse((930, 60, 1130, 260), fill=(255, 255, 255, 22))
    draw.rounded_rectangle((110, 115, 1090, 515), radius=38, fill=(10, 27, 48), outline=(98, 252, 201))

    title_font = _load_share_font(46, bold=True)
    score_font = _load_share_font(118, bold=True)
    level_font = _load_share_font(42, bold=True)
    footer_font = _load_share_font(32, bold=False)

    y = 165
    y = _draw_centered_text(draw, "AI Fluency Score", title_font, "#CFFFEF", width, y)
    y = _draw_centered_text(draw, f"{_score_label(submission.score)} / 10", score_font, "#FFFFFF", width, y + 28)
    y = _draw_centered_text(draw, _get_level(submission.score), level_font, "#62FCC9", width, y + 26)
    _draw_centered_text(draw, "Test yours at ailiteracy.ng", footer_font, "#D7E0E5", width, y + 48)

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return HttpResponse(buffer.getvalue(), content_type="image/png")


def share_score(request, share_id):
    submission = get_object_or_404(QuizSubmission, share_id=share_id)
    share_urls = _share_urls(request, submission.share_id)
    context = {
        "submission": submission,
        "score_label": _score_label(submission.score),
        "level": _get_level(submission.score),
        "share_url": share_urls["share_url"],
        "share_image_url": share_urls["share_image_url"],
        "home_url": request.build_absolute_uri(reverse("pages:home")),
    }
    return render(request, "pages/share_score.html", context)


def share_score_image(request, share_id):
    submission = get_object_or_404(QuizSubmission, share_id=share_id)
    return _build_share_image_response(submission)


def home(request):
    quiz_result = request.session.get("quiz_result")
    masterclass_success = request.session.pop("masterclass_success", None)
    form = MasterclassRegistrationForm()
    selected_answers = {}
    selected_confidences = {}
    quiz_notice = None

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "quiz_submit":
            selected_answers = _selected_answers_from_post(request)
            selected_confidences = _selected_confidences_from_post(request)
            invalid_question_ids = _validate_quiz_submission(selected_answers, selected_confidences)
            if invalid_question_ids:
                quiz_notice = "Please select the required answer(s) and a confidence level for every question before submitting your result."
            else:
                adjusted_points, final_score, metrics = _calculate_quiz_score(selected_answers, selected_confidences)
                submission = QuizSubmission.objects.create(score=final_score)
                request.session["quiz_result"] = {
                    "score": float(final_score),
                    "adjusted_points": float(adjusted_points),
                    "total_points": QUIZ_TOTAL_POINTS,
                    "penalty_points": float(metrics["penalty_points"]),
                    "avg_confidence": float(metrics["avg_confidence"]),
                    "share_id": str(submission.share_id),
                    "level": _get_level(final_score),
                    "message": _get_result_message(final_score),
                    "insight": _get_confidence_insight(final_score, metrics),
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
        quiz_result["score"] = float(_decimal_score(quiz_result["score"]))
        quiz_result["message"] = quiz_result.get("message") or _get_result_message(quiz_result["score"])
        quiz_result["insight"] = quiz_result.get("insight") or _get_confidence_insight(quiz_result["score"])
        share_urls = _share_urls(request, quiz_result.get("share_id")) if quiz_result.get("share_id") else {
            "share_url": request.build_absolute_uri(reverse("pages:home")),
            "share_image_url": "",
        }
        quiz_result["share_url"] = share_urls["share_url"]
        quiz_result["share_image_url"] = share_urls["share_image_url"]
        quiz_result["share_links"] = _share_links(quiz_result["score"], quiz_result["share_url"])

    context = {
        "quiz_questions": _build_quiz_questions(
            selected_answers=selected_answers,
            selected_confidences=selected_confidences,
        ),
        "quiz_question_total": len(QUIZ_QUESTIONS),
        "quiz_result": quiz_result,
        "quiz_notice": quiz_notice,
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
