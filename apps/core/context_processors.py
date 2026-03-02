def layout(request):
    from apps.marketing.forms import SubscriberForm

    cart_item_count = 0
    if request.user.is_authenticated:
        cart = getattr(request.user, "cart", None)
        if cart:
            cart_item_count = sum(item.quantity for item in cart.items.all())

    return {
        "newsletter_form": SubscriberForm(),
        "cart_item_count": cart_item_count,
    }
