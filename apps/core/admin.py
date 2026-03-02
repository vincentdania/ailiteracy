from django.contrib import admin

from .models import Mentor, PremiumResource, Project, ReferralProgram, Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "is_featured", "created_at")
    list_filter = ("is_featured",)
    search_fields = ("name", "role", "quote")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_published", "order", "created_at")
    list_filter = ("is_published",)
    search_fields = ("title", "summary", "description", "impact", "stack")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("order",)


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "title", "is_active", "order", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "title", "bio", "quote")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("order",)


@admin.register(ReferralProgram)
class ReferralProgramAdmin(admin.ModelAdmin):
    list_display = ("title", "commission", "is_active", "order", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description", "commission")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("order",)


@admin.register(PremiumResource)
class PremiumResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_published", "order", "created_at")
    list_filter = ("is_published", "category")
    search_fields = ("title", "category", "summary", "description")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("order",)
