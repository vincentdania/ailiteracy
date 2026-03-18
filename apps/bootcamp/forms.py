import re

from django import forms

from .models import BootcampInterest


PHONE_PATTERN = re.compile(r"^[0-9+()\-\s]{7,20}$")


class BootcampInterestForm(forms.ModelForm):
    consent = forms.BooleanField(required=True)

    class Meta:
        model = BootcampInterest
        fields = ["name", "email", "phone", "location", "attendance_type"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        default_css = (
            "w-full rounded-2xl border border-transparent bg-slate-100/90 px-5 py-4 text-base text-slate-900 "
            "placeholder:text-slate-400 shadow-none transition-all duration-200 focus:border-emerald-400 "
            "focus:bg-white focus:ring-4 focus:ring-primary/20"
        )
        for name, field in self.fields.items():
            if name == "consent":
                continue
            field.widget.attrs.setdefault("class", default_css)
        self.fields["location"].required = True
        self.fields["name"].widget.attrs.update(
            {
                "placeholder": "Enter your full name",
                "autocomplete": "name",
            }
        )
        self.fields["email"].widget.attrs.update(
            {
                "placeholder": "name@example.com",
                "autocomplete": "email",
            }
        )
        self.fields["phone"].widget.attrs.update(
            {
                "placeholder": "+234...",
                "autocomplete": "tel",
            }
        )
        self.fields["location"].widget.attrs.update(
            {
                "placeholder": "e.g. Abuja, Lagos, Port Harcourt",
                "autocomplete": "address-level2",
            }
        )
        self.fields["consent"].widget.attrs.update(
            {
                "class": "mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500",
            }
        )

    def clean_phone(self):
        phone = (self.cleaned_data.get("phone") or "").strip()
        if not PHONE_PATTERN.match(phone):
            raise forms.ValidationError("Enter a valid phone number.")
        return phone
