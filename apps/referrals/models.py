import uuid

from django.conf import settings
from django.db import models
from django.db.models import Q


def generate_referral_code():
    return uuid.uuid4().hex[:12]


class Referral(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        REWARDED = "rewarded", "Rewarded"

    code = models.CharField(max_length=20, unique=True, default=generate_referral_code, editable=False)
    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referrals_made",
    )
    referee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="referrals_received",
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    rewarded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["referee"],
                condition=Q(referee__isnull=False),
                name="unique_referral_attribution_per_referee",
            ),
        ]

    def __str__(self):
        return f"{self.code}: {self.referrer} -> {self.referee or 'pending'}"
