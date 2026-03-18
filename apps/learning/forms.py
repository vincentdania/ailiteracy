from django import forms


class MicrocourseStartForm(forms.Form):
    name = forms.CharField(max_length=160, required=False)
    email = forms.EmailField(required=False)

    def __init__(self, *args, **kwargs):
        self.require_identity = kwargs.pop("require_identity", False)
        super().__init__(*args, **kwargs)
        css = (
            "w-full rounded-2xl border border-transparent bg-slate-100/90 px-5 py-4 text-base text-slate-900 "
            "placeholder:text-slate-400 shadow-none transition-all duration-200 focus:border-emerald-400 "
            "focus:bg-white focus:ring-4 focus:ring-primary/20"
        )
        self.fields["name"].widget.attrs.update(
            {
                "class": css,
                "placeholder": "Full name",
                "autocomplete": "name",
            }
        )
        self.fields["email"].widget.attrs.update(
            {
                "class": css,
                "placeholder": "Email address",
                "autocomplete": "email",
            }
        )
        if self.require_identity:
            self.fields["name"].required = True
            self.fields["email"].required = True
