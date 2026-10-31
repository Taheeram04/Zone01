from django.apps import AppConfig
from django.db.models.signals import post_delete, post_save


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "content"
    label = "site_content"
    verbose_name = "Content"

    def ready(self):
        """Invalidate the WhatsApp matcher when FAQ rows change.

        The matcher caches its index for two minutes. Without this, edits made
        in the admin (the FAQ answers the assistant is told to use) would keep
        answering from stale data until the cache expired.
        """
        from content.models import FaqCategory, FaqItem
        from whatsapp_bot.retrieval import clear_cache

        def _invalidate(sender, **kwargs):
            clear_cache()

        for sender in (FaqItem, FaqCategory):
            post_save.connect(
                _invalidate,
                sender=sender,
                dispatch_uid=f"whatsapp_faq_cache_save_{sender.__name__}",
            )
            post_delete.connect(
                _invalidate,
                sender=sender,
                dispatch_uid=f"whatsapp_faq_cache_delete_{sender.__name__}",
            )
