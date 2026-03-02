from django import forms


class CheckoutForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "class": "w-full rounded-xl border border-slate-300 px-4 py-2",
                "placeholder": "you@example.com",
            }
        )
    )
