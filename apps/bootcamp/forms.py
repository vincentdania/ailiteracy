import re

from django import forms

from .models import BootcampInterest


PHONE_PATTERN = re.compile(r"^[0-9+()\-\s]{7,20}$")


class BootcampInterestForm(forms.ModelForm):
    consent = forms.BooleanField(required=True)

    class Meta:
        model = BootcampInterest
        fields = ["name", "email", "phone", "attendance_type", "occupation"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            css = "w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            field.widget.attrs.setdefault("class", css)
        self.fields["attendance_type"].widget = forms.Select(
            choices=BootcampInterest.AttendanceType.choices,
            attrs={"class": "w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"},
        )
        self.fields["occupation"].required = False

    def clean_phone(self):
        phone = (self.cleaned_data.get("phone") or "").strip()
        if not PHONE_PATTERN.match(phone):
            raise forms.ValidationError("Enter a valid phone number.")
        return phone
