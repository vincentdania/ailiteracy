from django import forms


class AILiteracyIdentityForm(forms.Form):
    name = forms.CharField(max_length=160)
    email = forms.EmailField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        css = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
        self.fields["name"].widget.attrs.update({"class": css, "placeholder": "Full name"})
        self.fields["email"].widget.attrs.update({"class": css, "placeholder": "Email"})
