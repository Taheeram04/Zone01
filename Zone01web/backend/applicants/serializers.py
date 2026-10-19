"""Serializers for the Applicant intake API."""

from rest_framework import serializers

from applicants.models import Applicant


class ApplicantSerializer(serializers.ModelSerializer):
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
            "consented_at",
        ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "motivation": {"required": True},
        }

    def validate_email(self, value):
        if Applicant.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An application with this email already exists.")
        return value

    def create(self, validated_data):
        from django.utils import timezone

        applicant = Applicant.objects.create(**validated_data, status=Applicant.Status.SUBMITTED)
        applicant.submitted_at = timezone.now()
        applicant.save(update_fields=["submitted_at"])
        return applicant
