from django import forms


class CheckoutForm(forms.Form):
    CURRENCY_CHOICES = (("NGN", "Pay in naira"), ("USD", "Pay in US dollars"))

    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "class": "w-full rounded-xl border border-slate-300 px-4 py-2",
                "placeholder": "you@example.com",
            }
        )
    )
    currency = forms.ChoiceField(choices=CURRENCY_CHOICES, widget=forms.RadioSelect)
