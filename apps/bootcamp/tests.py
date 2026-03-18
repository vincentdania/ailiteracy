from django.test import TestCase

from .forms import BootcampInterestForm


class BootcampInterestFormTests(TestCase):
    def test_form_requires_consent(self):
        form = BootcampInterestForm(
            data={
                "name": "Ada O.",
                "email": "ada@example.com",
                "phone": "+2348012345678",
                "location": "Abuja",
                "attendance_type": "ONLINE",
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
                "location": "Abuja",
                "attendance_type": "IN_PERSON",
                "consent": True,
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn("phone", form.errors)

    def test_form_requires_location(self):
        form = BootcampInterestForm(
            data={
                "name": "Ada O.",
                "email": "ada@example.com",
                "phone": "+2348012345678",
                "location": "",
                "attendance_type": "ONLINE",
                "consent": True,
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn("location", form.errors)

    def test_form_accepts_valid_payload(self):
        form = BootcampInterestForm(
            data={
                "name": "Ada O.",
                "email": "ada@example.com",
                "phone": "+2348012345678",
                "location": "Lagos",
                "attendance_type": "BOOTCAMP",
                "consent": True,
            }
        )
        self.assertTrue(form.is_valid(), msg=form.errors.as_json())
