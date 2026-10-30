"""Django admin configuration for site content.

Each model gets a compact, image-aware admin so editors can add and delete
partners, staff, news, impact updates and frontend pages without touching code.
The editorial stream models (:class:`~content.models.Category` and
:class:`~content.models.Article`) use :class:`core.search.TrigramSearchMixin` so
their searches run against the GIN/trigram indexes on the model.
"""

from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import format_html
from django.utils.translation import ngettext

from content.forms import PiscineDateBulkAddForm
from content.models import (
    Article,
    Category,
    CommunityPost,
    CommunityStream,
    FaqCategory,
    FaqItem,
    ImpactUpdate,
    NewsUpdate,
    Page,
    PageSection,
    Partner,
    PiscineDate,
    Project,
    ProjectImage,
    Report,
    SiteLink,
    StaffMember,
)
from core.search import TrigramSearchMixin


class ImagePreviewMixin:
    """Show a small thumbnail for the model's image field in the list view."""

    image_field = "image"
    preview_height = 48

    @admin.display(description="Preview")
    def preview(self, obj):
        image = getattr(obj, self.image_field, None)
        if not image:
            return "-"
        try:
            url = image.url
        except ValueError:
            return "-"
        return format_html(
            '<img src="{}" style="height:{}px;width:auto;border-radius:4px;object-fit:cover;" />',
            url,
            self.preview_height,
        )


class EditLinkMixin:
    """Add explicit Edit and Delete buttons to admin changelists."""

    @admin.display(description="Edit")
    def edit_link(self, obj):
        url = reverse(
            f"admin:{obj._meta.app_label}_{obj._meta.model_name}_change",
            args=[obj.pk],
        )
        return format_html('<a class="button" href="{}">Edit</a>', url)

    @admin.display(description="Delete")
    def delete_link(self, obj):
        url = reverse(
            f"admin:{obj._meta.app_label}_{obj._meta.model_name}_delete",
            args=[obj.pk],
        )
        return format_html(
            '<a class="button" '
            'style="background:#ba2121;border-color:#ba2121;color:#fff;" '
            'href="{}">Delete</a>',
            url,
        )


class ImageReplaceHelpMixin:
    """Put the replace/clear instructions directly under image pickers."""

    image_field_names = ("image", "cover_image")
    image_help_text = (
        "To replace the selected image, click the search / Choose File button; the X removes it."
    )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        formfield = super().formfield_for_dbfield(db_field, request, **kwargs)
        if db_field.name in self.image_field_names and formfield:
            formfield.help_text = self.image_help_text
        return formfield


@admin.register(Partner)
class PartnerAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    image_field = "logo"
    list_display = ("preview", "name", "order", "created_at")
    list_editable = ("order",)
    # Only the columns that carry a trigram index: see
    # core.tests.SearchIndexCoverageTests for why the free-text blobs are left out.
    search_fields = ("name",)
    trigram_search_fields = ("name",)
    readonly_fields = ("created_at",)
    ordering = ("order", "name")


@admin.register(StaffMember)
class StaffMemberAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    image_field = "photo"
    list_display = ("preview", "name", "role", "order", "created_at")
    list_editable = ("order",)
    search_fields = ("name", "role")
    trigram_search_fields = ("name", "role")
    readonly_fields = ("created_at",)
    ordering = ("order", "name")


@admin.register(NewsUpdate)
class NewsUpdateAdmin(
    ImageReplaceHelpMixin, EditLinkMixin, ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin
):
    list_display = (
        "preview",
        "title",
        "is_featured",
        "is_published",
        "published_at",
        "order",
        "edit_link",
        "delete_link",
    )
    list_display_links = ("title",)
    list_editable = ("is_featured", "is_published", "order")
    list_filter = ("is_published", "is_featured")
    actions = ("delete_selected",)
    search_fields = ("title",)
    trigram_search_fields = ("title",)
    readonly_fields = ("created_at",)
    date_hierarchy = "published_at"
    save_on_top = True
    fieldsets = (
        (
            "News story",
            {
                "fields": ("title", "image", "information"),
                "description": (
                    "Published news appears automatically in the featured "
                    "banner on /community. Use “Featured” to include it in the "
                    "rotation. To replace the image, click the search / Choose "
                    "File icon; the X removes it."
                ),
            },
        ),
        (
            "Publishing",
            {"fields": ("published_at", "is_featured", "is_published", "order")},
        ),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )


@admin.register(ImpactUpdate)
class ImpactUpdateAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    list_display = ("preview", "title", "report_link", "is_published", "order", "created_at")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title",)
    trigram_search_fields = ("title",)
    readonly_fields = ("created_at",)
    ordering = ("order", "id")

    @admin.display(description="Report")
    def report_link(self, obj):
        if not obj.report:
            return "-"
        try:
            url = obj.report.url
        except ValueError:
            return "-"
        return format_html(
            '<a href="{}" target="_blank" rel="noopener">Download</a>',
            url,
        )


@admin.register(Report)
class ReportAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    """Upload the PDF reports shown in “Our latest reports” on /impact."""

    image_field = "cover"
    list_display = ("preview", "title", "year", "report_link", "published_at", "is_published", "order")
    list_display_links = ("title",)
    list_editable = ("is_published", "order")
    list_filter = ("is_published", "year", "published_at")
    search_fields = ("title",)
    trigram_search_fields = ("title",)
    readonly_fields = ("created_at",)
    ordering = ("order", "-published_at", "id")
    fieldsets = (
        (
            "Report",
            {
                "fields": ("title", "year", "cover", "report", "published_at"),
                "description": (
                    "Upload a cover image for the card and the PDF for the "
                    "download. Reports appear automatically after saving."
                ),
            },
        ),
        ("Publishing", {"fields": ("is_published", "order")}),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )

    @admin.display(description="File")
    def report_link(self, obj):
        if not obj.report:
            return "Placeholder"
        try:
            url = obj.report.url
        except ValueError:
            return "Missing file"
        return format_html(
            '<a href="{}" target="_blank" rel="noopener">Download</a>',
            url,
        )


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("order", "image", "caption")
    ordering = ("order", "id")


@admin.register(Project)
class ProjectAdmin(ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin):
    """Add, edit and delete learner projects and their picture galleries."""

    list_display = ("preview", "name", "cohort", "founders", "tech", "is_active", "order")
    list_display_links = ("name",)
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "cohort")
    search_fields = ("name", "founders", "cohort", "tech", "description")
    trigram_search_fields = ("name", "founders", "cohort", "tech", "description")
    search_help_text = (
        "Searches project name, founders, cohort, tech stack and description. "
        "Results are ordered by how closely they match."
    )
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at",)
    inlines = (ProjectImageInline,)
    ordering = ("order", "id")
    actions = ("delete_selected",)
    show_full_result_count = False
    save_on_top = True
    fieldsets = (
        ("Project", {"fields": ("name", "slug", "image")}),
        (
            "Details",
            {
                "fields": ("founders", "cohort", "description", "tech", "website_url"),
                "description": (
                    "Use commas for founders and technologies, e.g. "
                    '"Amina Otieno, Brian Ochieng" and "Django, React, PostgreSQL".'
                ),
            },
        ),
        ("Publishing", {"fields": ("is_active", "order")}),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )


@admin.register(CommunityPost)
class CommunityPostAdmin(
    ImageReplaceHelpMixin, EditLinkMixin, ImagePreviewMixin, TrigramSearchMixin, admin.ModelAdmin
):
    """Manage every News / Event / Blog / Podcast card from one list."""

    image_field = "cover_image"
    list_display = (
        "preview",
        "title",
        "kind",
        "platform",
        "is_featured",
        "is_published",
        "published_at",
        "order",
        "edit_link",
        "delete_link",
    )
    list_display_links = ("title",)
    list_editable = ("is_featured", "is_published", "order")
    list_filter = ("kind", "platform", "is_published", "is_featured")
    actions = ("delete_selected",)
    date_hierarchy = "published_at"
    search_fields = ("title", "summary", "body", "slug")
    trigram_search_fields = ("title", "summary", "body", "slug")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    ordering = ("kind", "-is_featured", "-published_at", "order")
    show_full_result_count = False
    save_on_top = True
    fieldsets = (
        (
            "Post type",
            {
                "fields": ("kind",),
                "description": (
                    "Choose News to publish a community news item. New published "
                    "news automatically feeds the featured banner on /community."
                ),
            },
        ),
        (
            "Headline & teaser",
            {
                "fields": ("title", "slug", "summary"),
                "description": (
                    "The featured banner uses the title and summary of the newest "
                    "published news post (or the one marked as featured)."
                ),
            },
        ),
        (
            "Story",
            {
                "fields": ("body",),
                "description": (
                    "Rich text: fonts, font sizes, bold, italic, underline, "
                    "colours, alignment, lists, links, tables and more. To "
                    "replace an image inside the story, double-click it and "
                    "choose a new file in the Image dialog."
                ),
            },
        ),
        (
            "Media & links",
            {
                "fields": ("cover_image", "video_url", "external_url", "platform"),
                "description": (
                    "Upload a cover image from your computer (or pick one from "
                    "the media library). To replace it, click the search / "
                    "Choose File icon; the X removes it. Then add any video or "
                    "social links."
                ),
            },
        ),
        (
            "Publishing",
            {
                "fields": (
                    "event_date",
                    "published_at",
                    "is_published",
                    "is_featured",
                    "order",
                ),
                "description": (
                    "Featured posts from any stream rotate in the banner above "
                    "the Community Hub. Lower order values appear first."
                ),
            },
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )


@admin.register(CommunityStream)
class CommunityStreamAdmin(admin.ModelAdmin):
    """Turn each Community Hub row (News / Events / Blog / Podcast) on or off."""

    list_display = ("label", "kind", "is_active", "order")
    list_display_links = ("kind",)
    list_editable = ("label", "is_active", "order")
    list_filter = ("is_active",)
    ordering = ("order", "id")
    list_per_page = 20


@admin.register(SiteLink)
class SiteLinkAdmin(admin.ModelAdmin):
    list_display = ("label", "url", "order", "is_active", "open_in_new_tab", "show_chevron")
    list_editable = ("order", "is_active")
    list_filter = ("is_active", "open_in_new_tab")
    search_fields = ("label", "url")
    readonly_fields = ("created_at",)
    ordering = ("order", "id")


@admin.register(PiscineDate)
class PiscineDateAdmin(admin.ModelAdmin):
    """One page for the piscine schedule and its notification.

    Each row is a piscine: its date, label, banner message and active flag.
    Editors add one row at a time, or use "Add multiple dates" to generate a
    recurring schedule (e.g. a whole year of four-week cycles) or paste a list.
    The website always uses the soonest upcoming active row, so the countdown
    advances automatically once a piscine begins. Unchecking every upcoming row
    turns the banner off.
    """

    list_display = ("date", "label", "message", "is_active", "upcoming", "updated_at")
    list_editable = ("label", "message", "is_active")
    list_filter = ("is_active",)
    date_hierarchy = "date"
    ordering = ("date", "id")
    readonly_fields = ("created_at", "updated_at")
    search_fields = ("label", "message")
    change_list_template = "admin/content/piscinedate/change_list.html"
    actions = ("activate_piscines", "deactivate_piscines")

    @admin.display(boolean=True, description="Upcoming")
    def upcoming(self, obj):
        return obj.is_upcoming

    @admin.action(description="Show selected piscines on the website")
    def activate_piscines(self, request, queryset):
        updated = queryset.update(is_active=True, updated_at=timezone.now())
        self.message_user(
            request,
            ngettext(
                "%(count)d piscine activated.",
                "%(count)d piscines activated.",
                updated,
            )
            % {"count": updated},
            messages.SUCCESS,
        )

    @admin.action(description="Hide selected piscines from the website")
    def deactivate_piscines(self, request, queryset):
        updated = queryset.update(is_active=False, updated_at=timezone.now())
        self.message_user(
            request,
            ngettext(
                "%(count)d piscine hidden.",
                "%(count)d piscines hidden.",
                updated,
            )
            % {"count": updated},
            messages.SUCCESS,
        )

    def get_urls(self):
        # Registered before the standard admin URLs so "bulk-add/" is not
        # mistaken for an object id by the catch-all change view.
        custom_urls = [
            path(
                "bulk-add/",
                self.admin_site.admin_view(self.bulk_add_view),
                name="site_content_piscinedate_bulk_add",
            ),
        ]
        return custom_urls + super().get_urls()

    def bulk_add_view(self, request):
        """Add several piscine dates in one form submission."""
        if not self.has_add_permission(request):
            raise PermissionDenied

        form = PiscineDateBulkAddForm(request.POST or None)
        if request.method == "POST" and form.is_valid():
            created, skipped = form.save()
            self.message_user(
                request,
                ngettext(
                    "%(count)d piscine date added.",
                    "%(count)d piscine dates added.",
                    created,
                )
                % {"count": created},
                messages.SUCCESS,
            )
            if skipped:
                self.message_user(
                    request,
                    ngettext(
                        "%(count)d existing date was skipped.",
                        "%(count)d existing dates were skipped.",
                        skipped,
                    )
                    % {"count": skipped},
                    messages.WARNING,
                )
            return HttpResponseRedirect(reverse("admin:site_content_piscinedate_changelist"))

        context = {
            **self.admin_site.each_context(request),
            "title": "Add multiple piscine dates",
            "opts": self.model._meta,
            "form": form,
            "add": True,
        }
        return render(request, "admin/content/piscinedate/bulk_add.html", context)


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


class PageSectionInline(admin.StackedInline):
    """Edit a page's ordered sections right on the page form."""

    model = PageSection
    extra = 1
    fields = (
        "order",
        "heading",
        "subheading",
        "body",
        "image",
        "cta_label",
        "cta_url",
    )
    ordering = ("order", "id")
    show_change_link = True


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_published", "section_count", "order", "updated_at")
    list_editable = ("is_published", "order")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "subtitle", "meta_description")
    readonly_fields = ("updated_at",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = (PageSectionInline,)
    ordering = ("order", "title")

    @admin.display(description="Sections")
    def section_count(self, obj):
        return obj.sections.count()


class FaqItemInline(admin.StackedInline):
    """Edit a category's questions right on the category form."""

    model = FaqItem
    extra = 1
    fields = ("order", "question", "answer", "keywords", "is_active")
    ordering = ("order", "id")
    show_change_link = True


@admin.register(FaqCategory)
class FaqCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "item_count", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("title", "slug", "blurb")
    prepopulated_fields = {"slug": ("title",)}
    inlines = (FaqItemInline,)
    ordering = ("order", "id")

    @admin.display(description="Questions")
    def item_count(self, obj):
        return obj.items.count()


@admin.register(FaqItem)
class FaqItemAdmin(admin.ModelAdmin):
    list_display = ("question", "category", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "category")
    search_fields = ("question", "answer", "keywords")
    list_select_related = ("category",)
    ordering = ("order", "id")
