from django.test import TestCase

from .forms import BootcampInterestForm


class BootcampInterestFormTests(TestCase):
    def test_form_requires_consent(self):
        form = BootcampInterestForm(
            data={
                "name": "Ada O.",
                "email": "ada@example.com",
                "phone": "+2348012345678",
                "attendance_type": "ONLINE",
                "occupation": "Developer",
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn("consent", form.errors)

    def test_form_validates_phone(self):
        form = BootcampInterestForm(
            data={
                "name": "Ada O.",
                "email": "ada@example.com",
                "phone": "invalid-phone",
                "attendance_type": "IN_PERSON",
                "occupation": "",
                "consent": True,
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn("phone", form.errors)

    def test_form_accepts_valid_payload(self):
        form = BootcampInterestForm(
            data={
                "name": "Ada O.",
                "email": "ada@example.com",
                "phone": "+2348012345678",
                "attendance_type": "IN_PERSON",
                "occupation": "Analyst",
                "consent": True,
            }
        )
        self.assertTrue(form.is_valid(), msg=form.errors.as_json())
