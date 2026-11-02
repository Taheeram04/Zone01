"""Attach the bundled report PDFs to the seeded CMS report rows.

The PDFs in ``content/report_files`` are small, web-friendly versions of the
published reports. Running this command once uploads them to the configured
media storage (S3/Tigris in production) and links each one to its Report row so
the Impact page can show a working download button.

Safe to re-run: reports that already have a file are skipped.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from filer.models import File

from content.models import Report

REPORT_FILES = {
    "Q3 2026 Report": "q3-2026.pdf",
    "Q2 2026 Report": "q2-2026.pdf",
    "Q1 2026 Report": "q1-2026.pdf",
    "2025 Annual Report": "annual-2025.pdf",
    "Q3 2025 Report": "q3-2025.pdf",
    "Q2 2025 Report": "q2-2025.pdf",
    "Q1 2025 Report": "q1-2025.pdf",
}

REPORT_DIR = Path(__file__).resolve().parents[2] / "report_files"


class Command(BaseCommand):
    help = "Upload the bundled report PDFs and attach them to the CMS report rows."

    def handle(self, *args, **options):
        attached = 0
        for title, filename in REPORT_FILES.items():
            report = Report.objects.filter(title=title).first()
            if not report:
                self.stderr.write(f"Report row not found: {title}")
                continue
            if report.report_id:
                continue

            path = REPORT_DIR / filename
            if not path.exists():
                self.stderr.write(f"Missing PDF: {path}")
                continue

            data = path.read_bytes()
            filer_file = File.objects.create(
                file=ContentFile(data, name=filename),
                original_filename=filename,
                name=f"{title} (PDF)",
                is_public=True,
                mime_type="application/pdf",
                _file_size=len(data),
                sha1=hashlib.sha1(data).hexdigest(),
            )
            report.report = filer_file
            report.save(update_fields=["report"])
            attached += 1

        self.stdout.write(self.style.SUCCESS(f"Attached {attached} report PDF(s)."))
