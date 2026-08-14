from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect

from .models import Referral
from .services import REFERRAL_SESSION_KEY, attach_referral


def accept_referral(request, code):
    referral = get_object_or_404(Referral, code=code, status=Referral.Status.PENDING)
    if request.user.is_authenticated:
        attached = attach_referral(request.user, code)
        if attached:
            messages.success(request, "Referral saved. Enrol in the challenge to unlock the bonus for both of you.")
        elif referral.referrer_id == request.user.id:
            messages.info(request, "This is your personal referral link. Share it with a colleague.")
    else:
        request.session[REFERRAL_SESSION_KEY] = code
        messages.info(request, "Create an account to save this invitation and unlock the referral bonus.")
    return redirect("pages:home")
