# Merge the site-link migrations into the page/article branches on develop.

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("site_content", "0004_seed_site_links"),
        ("site_content", "0005_merge_20261007_0635"),
    ]

    operations = []
