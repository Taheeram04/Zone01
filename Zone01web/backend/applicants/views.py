"""DRF views for the Applicant intake API."""

import logging

from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from applicants.serializers import ApplicantSerializer

logger = logging.getLogger(__name__)


class ApplicationSubmitView(APIView):
    """Accepts POST requests from the React application form."""

    def post(self, request):
        serializer = ApplicantSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            applicant = serializer.save()
        except IntegrityError:
            # The validator already checks duplicates, but two simultaneous
            # submissions can still race; keep the response consistent.
            return Response(
                {
                    "success": False,
                    "errors": {"email": ["An application with this email already exists."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:  # pragma: no cover - defensive
            logger.exception("Failed to create applicant")
            return Response(
                {
                    "success": False,
                    "error": "Unable to submit your application. Please try again.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {
                "success": True,
                "message": "Application submitted successfully.",
                "id": applicant.id,
            },
            status=status.HTTP_201_CREATED,
        )
