from django.urls import path

from . import api, views

app_name = "orders"

urlpatterns = [
    path("cart/", views.cart, name="cart"),
    path("cart/add/<int:product_id>/", views.add_to_cart, name="add_to_cart"),
    path("cart/remove/<int:item_id>/", views.remove_from_cart, name="remove_from_cart"),
    path("checkout/", views.checkout, name="checkout"),
    path("checkout/success/", views.checkout_success, name="checkout_success"),
    path("paystack/callback/", views.paystack_callback, name="paystack_callback"),
    path("paystack/webhook/", views.paystack_webhook, name="paystack_webhook"),
    path("api/payments/verify/", api.PaystackVerifyAPIView.as_view(), name="api_payment_verify"),
]
