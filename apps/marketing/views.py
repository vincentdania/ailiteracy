from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.http import require_POST

from .forms import SubscriberForm


@require_POST
def subscribe(request):
    form = SubscriberForm(request.POST)
    if form.is_valid():
        subscriber, created = form.save(commit=False), True
        existing = type(subscriber).objects.filter(email=subscriber.email).first()
        if existing:
            if not existing.is_active:
                existing.is_active = True
                existing.save(update_fields=["is_active"])
            created = False
        else:
            subscriber.save()

        message = "Thanks for subscribing." if created else "You are already subscribed."
        if request.htmx:
            return HttpResponse(f"<p class='text-sm text-emerald-700'>{message}</p>")
        messages.success(request, message)
    else:
        if request.htmx:
            return HttpResponse("<p class='text-sm text-red-600'>Enter a valid email.</p>", status=400)
        messages.error(request, "Enter a valid email.")

    return redirect(request.META.get("HTTP_REFERER", "core:home"))
