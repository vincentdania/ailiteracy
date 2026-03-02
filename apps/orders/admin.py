from django.contrib import admin

from .models import AccessGrant, Cart, CartItem, Order, OrderItem, PaymentTransaction


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("user", "updated_at")
    inlines = [CartItemInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class PaymentTransactionInline(admin.TabularInline):
    model = PaymentTransaction
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "total_amount", "currency", "created_at", "paid_at")
    list_filter = ("status", "currency")
    search_fields = ("id", "user__email", "email", "paystack_reference")
    inlines = [OrderItemInline, PaymentTransactionInline]


@admin.register(AccessGrant)
class AccessGrantAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "order", "source_product", "granted_at")
    list_filter = ("product__product_type",)
    search_fields = ("user__email", "product__title")


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ("reference", "order", "amount", "currency", "status", "updated_at")
    list_filter = ("status", "currency")
    search_fields = ("reference", "order__id", "order__user__email")
