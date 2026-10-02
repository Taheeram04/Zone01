"""Validation for public application-form submissions."""

from django import forms

from applicants.models import Applicant


class ApplicationForm(forms.ModelForm):
    """Validates the public application form before it is stored.

    The ``consent`` checkbox is not a model field: it is required from the
    applicant and, when accepted, the API records ``consented_at``.
    """

    consent = forms.BooleanField(
        required=True,
        error_messages={"required": "Please accept the terms to submit your application."},
    )

    class Meta:
        model = Applicant
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "date_of_birth",
            "gender",
            "county",
            "education_level",
            "current_occupation",
            "motivation",
            "portfolio_url",
            "github_url",
            "linkedin_url",
            "referral_source",
        ]

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()
        if Applicant.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                "An application with this email address already exists.",
                code="duplicate",
            )
        return email

    def validate_unique(self):
        # Uniqueness is handled in clean_email with a friendlier message.
        return
