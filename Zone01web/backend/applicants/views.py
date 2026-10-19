"""DRF views for the Applicant intake API."""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from applicants.serializers import ApplicantSerializer


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
        except Exception as exc:  # pragma: no cover - defensive
            return Response(
                {"success": False, "error": str(exc)},
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
