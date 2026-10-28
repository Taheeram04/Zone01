"""Serializers for the Applicant intake API."""

from rest_framework import serializers

from applicants.models import Applicant


class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = ["name", "email", "phone", "choice", "motivation"]
        extra_kwargs = {
            "name": {"required": True},
            "email": {"required": True},
            "choice": {"required": True},
            "motivation": {"required": True},
        }

    def validate_email(self, value):
        if Applicant.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An application with this email already exists.")
        return value
