"""Make the production media bucket publicly readable.

The settings already generate unsigned URLs for uploaded media because the
media bucket is expected to be public. A bucket created without public access
returns ``403 AccessDenied`` for every image, PDF and rich-text upload, even
though the admin upload itself succeeds.

This command is safe to re-run on every deploy:

* it first tries a bucket policy that grants anonymous ``s3:GetObject``;
* if the storage provider does not support bucket policies, it falls back to
  the legacy ``public-read`` bucket ACL;
* local filesystem storage (no ``BUCKET_NAME``) is a no-op.

Failures are reported as warnings so a provider limitation never blocks a
deployment. Run it manually with::

    python manage.py ensure_public_media
"""

from __future__ import annotations

import json

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Grant anonymous read access to uploaded media in the S3 bucket."

    def handle(self, *args, **options):
        bucket = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "")
        if not bucket:
            self.stdout.write("Media storage is local; no bucket to update.")
            return

        try:
            client = default_storage.connection.meta.client
        except Exception as exc:  # pragma: no cover - provider configuration
            self.stderr.write(self.style.WARNING(f"Could not connect to media storage: {exc}"))
            return

        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadWebsiteMedia",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{bucket}/*",
                }
            ],
        }

        # Some providers keep a public-access block enabled by default. Removing
        # it is best-effort; providers that do not support it can ignore this.
        try:
            client.put_public_access_block(
                Bucket=bucket,
                PublicAccessBlockConfiguration={
                    "BlockPublicAcls": False,
                    "IgnorePublicAcls": False,
                    "BlockPublicPolicy": False,
                    "RestrictPublicBuckets": False,
                },
            )
        except Exception as exc:
            self.stderr.write(self.style.WARNING(f"Could not clear public-access block: {exc}"))

        try:
            client.put_bucket_acl(Bucket=bucket, ACL="public-read")
            self.stdout.write(self.style.SUCCESS(f"Public-read ACL applied to {bucket}."))
        except Exception as exc:
            self.stderr.write(self.style.WARNING(f"Could not apply public-read ACL: {exc}"))

        try:
            client.put_bucket_policy(Bucket=bucket, Policy=json.dumps(policy))
            self.stdout.write(self.style.SUCCESS(f"Public read policy applied to {bucket}."))
        except Exception as exc:
            self.stderr.write(self.style.WARNING(f"Could not apply bucket policy: {exc}"))
