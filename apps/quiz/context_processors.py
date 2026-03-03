from .models import Quiz, Result


def quiz_prompt(request):
    if request.path.startswith("/quiz/"):
        return {"show_quiz_prompt": False}
    if request.session.get("quiz_prompt_skipped"):
        return {"show_quiz_prompt": False}

    quiz = Quiz.objects.filter(is_active=True).order_by("-id").first()
    if not quiz:
        return {"show_quiz_prompt": False}

    if request.user.is_authenticated:
        completed = Result.objects.filter(attempt__quiz=quiz, attempt__user=request.user).exists()
        if completed:
            return {"show_quiz_prompt": False}

    session_key = request.session.session_key
    if session_key:
        completed_session = Result.objects.filter(
            attempt__quiz=quiz,
            attempt__session_key=session_key,
            attempt__user__isnull=True,
        ).exists()
        if completed_session:
            return {"show_quiz_prompt": False}

    return {
        "show_quiz_prompt": True,
        "active_quiz": quiz,
    }
