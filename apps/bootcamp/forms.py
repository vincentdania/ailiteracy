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
        default_css = "w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
        for name, field in self.fields.items():
            if name == "consent":
                continue
            field.widget.attrs.setdefault("class", default_css)
        self.fields["attendance_type"].widget = forms.Select(
            choices=BootcampInterest.AttendanceType.choices,
            attrs={"class": default_css},
        )
        self.fields["occupation"].required = False
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
