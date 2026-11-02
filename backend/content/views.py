"""Admin-side upload endpoint for the community rich-text editor.

The CKEditor toolbar on ``CommunityPost.body`` can upload images and documents
straight from the editor's "Upload" tab. Files are stored through Django's
default storage (filesystem locally, S3 when configured) and the editor gets
back the public URL.
"""

import os
import uuid

from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.utils.text import get_valid_filename
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
DOCUMENT_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".csv",
}


def _error(message, status=400):
    """Return the JSON shape CKEditor expects for a failed upload."""
    return JsonResponse(
        {"uploaded": 0, "error": {"message": message}},
        status=status,
    )


# CKEditor's XHR upload does not send Django's CSRF header, so this endpoint is
# CSRF-exempt. It is restricted to authenticated staff and to a small allow-list
# of image/document extensions, and every file is stored under ``community/``.
@csrf_exempt
@require_POST
def community_upload(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return _error("You do not have permission to upload files.", status=403)

    upload = request.FILES.get("upload")
    if not upload:
        return _error("No file was received.")

    if upload.size > MAX_UPLOAD_BYTES:
        return _error("The file is larger than the 10 MB limit.")

    kind = request.GET.get("type", "image")
    allowed = IMAGE_EXTENSIONS if kind == "image" else IMAGE_EXTENSIONS | DOCUMENT_EXTENSIONS

    extension = os.path.splitext(upload.name)[1].lower()
    if extension not in allowed:
        labels = "images" if kind == "image" else "images or documents"
        return _error(f"Only {labels} can be uploaded here.")

    original_name = get_valid_filename(os.path.basename(upload.name)) or f"upload{extension}"
    stored_name = default_storage.save(
        f"community/{uuid.uuid4().hex[:8]}-{original_name}",
        upload,
    )

    return JsonResponse(
        {
            "uploaded": 1,
            "fileName": original_name,
            "url": default_storage.url(stored_name),
        }
    )
