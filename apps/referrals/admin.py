from django.contrib import admin

from .models import Referral


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ("code", "referrer", "referee", "status", "created_at", "rewarded_at")
    list_filter = ("status", "created_at", "rewarded_at")
    search_fields = ("code", "referrer__email", "referee__email")
    readonly_fields = ("code", "created_at", "rewarded_at")
