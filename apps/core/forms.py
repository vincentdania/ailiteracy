from django import forms


class StyledForm(forms.Form):
    input_class = (
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm "
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            classes = field.widget.attrs.get("class", "")
            field.widget.attrs["class"] = f"{classes} {self.input_class}".strip()


class MentorshipBookingForm(StyledForm):
    FOCUS_CHOICES = [
        ("prompt-engineering", "Prompt Engineering"),
        ("business-automation", "AI for Business Automation"),
        ("data-science", "Data Science & Analytics"),
        ("career-advice", "AI Career Guidance"),
    ]

    full_name = forms.CharField(max_length=120)
    email = forms.EmailField()
    focus_area = forms.ChoiceField(choices=FOCUS_CHOICES)
    preferred_date = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    preferred_time = forms.TimeField(widget=forms.TimeInput(attrs={"type": "time"}))
    notes = forms.CharField(required=False, widget=forms.Textarea(attrs={"rows": 4}))


class ProjectSubmissionForm(StyledForm):
    CATEGORY_CHOICES = [
        ("education", "Education"),
        ("finance", "Finance"),
        ("health", "Health"),
        ("agriculture", "Agriculture"),
        ("productivity", "Productivity"),
    ]

    title = forms.CharField(max_length=180)
    category = forms.ChoiceField(choices=CATEGORY_CHOICES)
    summary = forms.CharField(widget=forms.Textarea(attrs={"rows": 4}))
    project_url = forms.URLField(required=False)
    repo_url = forms.URLField(required=False)


class ReferralApplicationForm(StyledForm):
    full_name = forms.CharField(max_length=120)
    email = forms.EmailField()
    expertise = forms.CharField(max_length=160)
    motivation = forms.CharField(widget=forms.Textarea(attrs={"rows": 4}))
