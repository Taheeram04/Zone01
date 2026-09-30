from django.contrib import admin

from content.models import Article, Category
from core.search import TrigramSearchMixin


@admin.register(Category)
class CategoryAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    # Kept in sync with the GIN/trigram indexes on the model: an unindexed
    # column here would make the whole OR a sequential scan.
    search_fields = ("name", "slug", "description")
    trigram_search_fields = ("name", "slug", "description")
    list_per_page = 50


@admin.register(Article)
class ArticleAdmin(TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("title", "category", "author", "status", "published_at")
    list_filter = ("status", "category")
    # Every column here is trigram-indexed, either on this model or on the
    # category it joins to; adding an unindexed column would turn the whole
    # OR into a sequential scan.
    search_fields = ("title", "summary", "body", "slug", "category__name")
    trigram_search_fields = ("title", "summary", "body", "slug")
    search_help_text = (
        "Searches title, summary, body, slug and category. "
        "Results are ordered by how closely they match."
    )
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "published_at"
    list_select_related = ("category", "author")
    # Skip the extra COUNT(*) over the whole table on every changelist load.
    show_full_result_count = False
