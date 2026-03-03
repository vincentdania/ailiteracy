from .models import Quiz


def quiz_prompt(request):
    if request.path.startswith("/quiz/"):
        return {"show_quiz_prompt": False}

    quiz = Quiz.objects.filter(is_active=True).order_by("-id").first()
    if not quiz:
        return {"show_quiz_prompt": False}

    return {
        "show_quiz_prompt": True,
        "active_quiz": quiz,
    }
