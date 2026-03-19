from django import forms

from .models import MasterclassRegistration


class MasterclassRegistrationForm(forms.ModelForm):
    class Meta:
        model = MasterclassRegistration
        fields = ["name", "email", "phone", "location", "mode"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        input_css = (
            "w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base "
            "text-slate-900 shadow-sm outline-none transition focus:ring-2 "
            "focus:ring-emerald-500"
        )
        select_css = (
            "w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base "
            "text-slate-900 shadow-sm outline-none transition focus:ring-2 "
            "focus:ring-emerald-500"
        )

        self.fields["name"].widget.attrs.update(
            {"class": input_css, "placeholder": "Your full name", "autocomplete": "name"}
        )
        self.fields["email"].widget.attrs.update(
            {"class": input_css, "placeholder": "name@example.com", "autocomplete": "email"}
        )
        self.fields["phone"].widget.attrs.update(
            {"class": input_css, "placeholder": "+234...", "autocomplete": "tel"}
        )
        self.fields["location"].choices = [
            ("", "Select location"),
            (MasterclassRegistration.Location.ABUJA, "Abuja"),
            (MasterclassRegistration.Location.ONLINE, "Online"),
        ]
        self.fields["location"].widget.attrs.update({"class": select_css})
        self.fields["mode"].widget.attrs.update({"class": select_css})
