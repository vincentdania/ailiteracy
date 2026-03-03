from django import forms


class MicrocourseStartForm(forms.Form):
    name = forms.CharField(max_length=160, required=False)
    email = forms.EmailField(required=False)

    def __init__(self, *args, **kwargs):
        self.require_identity = kwargs.pop("require_identity", False)
        super().__init__(*args, **kwargs)
        css = "w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
        self.fields["name"].widget.attrs.update({"class": css, "placeholder": "Full name"})
        self.fields["email"].widget.attrs.update({"class": css, "placeholder": "Email"})
        if self.require_identity:
            self.fields["name"].required = True
            self.fields["email"].required = True
