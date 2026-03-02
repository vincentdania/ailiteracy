from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "product_type", "price", "is_active", "is_featured")
    list_filter = ("product_type", "is_active", "is_featured")
    search_fields = ("title", "slug", "short_description")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("bundle_items",)
