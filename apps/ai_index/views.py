from django.shortcuts import render

from .services import aggregate_insights


def insights(request):
    payload = aggregate_insights()
    return render(
        request,
        "ai_index/insights.html",
        {
            "total_participants": payload["total"],
            "average_ali": payload["average"],
            "distribution": payload["distribution"],
        },
    )
