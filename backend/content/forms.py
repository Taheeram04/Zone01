"""Admin forms for content models.

The piscine bulk-add form lets editors schedule a whole year of piscines in one
step: either repeat a start date on a fixed interval, or paste a list of dates
(optionally with a label per date). It is used by
:class:`content.admin.PiscineDateAdmin`.
"""

import datetime

from django import forms
from django.utils.dateparse import parse_date

from content.models import PiscineDate

# Guardrail so a typo in the interval/count can never create thousands of rows.
MAX_BULK_DATES = 400

# A pasted line may separate the date from its label with any of these.
LABEL_SEPARATORS = ("|", ",", "\t", ";")


class PiscineDateBulkAddForm(forms.Form):
    """Create several :class:`~content.models.PiscineDate` rows at once.

    Two modes are supported:

    ``recurring``
        Generate dates from ``start_date`` every ``interval_weeks`` weeks,
        either ``count`` times or until ``end_date`` (inclusive).
    ``list``
        Parse one date per line. A line may carry a label after a ``|``, ``,``,
        tab or ``;``, e.g. ``2027-02-08 | Cohort 8``.
    """

    MODE_RECURRING = "recurring"
    MODE_LIST = "list"
    MODE_CHOICES = (
        (MODE_RECURRING, "Repeat a schedule"),
        (MODE_LIST, "Paste a list of dates"),
    )

    mode = forms.ChoiceField(
        choices=MODE_CHOICES,
        initial=MODE_RECURRING,
        widget=forms.RadioSelect,
        label="How do you want to add the dates?",
    )
    start_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={"type": "date"}),
        label="First piscine date",
        help_text="The first day of the first piscine (09:00 EAT).",
    )
    interval_weeks = forms.IntegerField(
        required=False,
        min_value=1,
        max_value=52,
        initial=4,
        label="Repeat every (weeks)",
        help_text="Piscines usually run in 4-week cycles.",
    )
    count = forms.IntegerField(
        required=False,
        min_value=1,
        max_value=MAX_BULK_DATES,
        initial=13,
        label="Number of piscines",
        help_text="13 four-week cycles cover roughly one year.",
    )
    end_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={"type": "date"}),
        label="Or repeat until",
        help_text="Optional. When set, this replaces the number above.",
    )
    dates = forms.CharField(
        required=False,
        widget=forms.Textarea(
            attrs={
                "rows": 8,
                "placeholder": "2027-01-11\n2027-02-08 | Cohort 8\n11/03/2027",
            }
        ),
        label="Dates",
        help_text=(
            "One date per line, e.g. 2027-01-11 or 11/01/2027. "
            "Add an optional label after a | or comma."
        ),
    )
    label = forms.CharField(
        required=False,
        max_length=120,
        label="Label (optional)",
        help_text=(
            "Applied to generated dates. Use {n} for the number, "
            "e.g. Cohort {n}. Leave blank to use the date only."
        ),
    )
    message = forms.CharField(
        required=False,
        max_length=255,
        label="Banner message (optional)",
        help_text=(
            "Applied to every date added here. The soonest upcoming date's "
            "message is what visitors see."
        ),
    )
    is_active = forms.BooleanField(
        required=False,
        initial=True,
        label="Show these dates on the website",
        help_text="Uncheck to save the dates without activating them.",
    )
    skip_existing = forms.BooleanField(
        required=False,
        initial=True,
        label="Skip dates that already exist",
        help_text="Recommended, so re-running a schedule never duplicates a date.",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populated by clean(); the admin view reads it through save().
        self.dates_to_create = []

    def clean(self):
        cleaned = super().clean()
        # Field-level errors already make the form invalid; don't also add a
        # misleading "no dates were found" error on top of them.
        if self.errors:
            return cleaned
        mode = cleaned.get("mode")

        if mode == self.MODE_LIST:
            pairs = self._parse_date_list(cleaned.get("dates", ""))
        elif mode == self.MODE_RECURRING:
            pairs = self._build_recurring_schedule(cleaned)
        else:
            pairs = []

        if not pairs:
            raise forms.ValidationError(
                "No dates were found. Enter a start date or paste at least one date."
            )

        self.dates_to_create = pairs
        return cleaned

    def _build_recurring_schedule(self, cleaned):
        """Return ``(date, label)`` pairs for the recurring mode."""
        start = cleaned.get("start_date")
        if start is None:
            self.add_error("start_date", "Choose the first piscine date.")
            return []

        interval = cleaned.get("interval_weeks") or 0
        if interval < 1:
            self.add_error("interval_weeks", "The interval must be at least one week.")
            return []

        end = cleaned.get("end_date")
        count = cleaned.get("count") or 0

        if end is not None:
            if end < start:
                self.add_error("end_date", "The end date must be on or after the start date.")
                return []
            # Inclusive range: keep stepping while the date is within the end date.
            dates = []
            current = start
            step = datetime.timedelta(weeks=interval)
            while current <= end and len(dates) < MAX_BULK_DATES:
                dates.append(current)
                current += step
            if len(dates) >= MAX_BULK_DATES and current <= end:
                self.add_error(
                    "end_date",
                    f"That range would create more than {MAX_BULK_DATES} dates. "
                    "Increase the interval or shorten the range.",
                )
                return []
        else:
            if count < 1:
                self.add_error("count", "Enter how many piscines to schedule.")
                return []
            step = datetime.timedelta(weeks=interval)
            dates = [start + step * index for index in range(count)]

        label = cleaned.get("label", "").strip()
        return [(date, self._format_label(label, index)) for index, date in enumerate(dates, 1)]

    def _parse_date_list(self, raw):
        """Parse one date per line, optionally followed by a label."""
        pairs = []
        seen = set()

        for line_number, line in enumerate(raw.splitlines(), 1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue

            date_part, label = self._split_date_line(line)
            parsed = self._parse_date(date_part)
            if parsed is None:
                self.add_error(
                    "dates",
                    f'Line {line_number}: "{date_part}" is not a valid date. '
                    "Use YYYY-MM-DD or DD/MM/YYYY.",
                )
                continue

            if parsed in seen:
                # A duplicated date in the pasted list is almost always a
                # copy/paste slip; keep the first occurrence.
                continue
            seen.add(parsed)
            pairs.append((parsed, label))

        if len(pairs) > MAX_BULK_DATES:
            self.add_error(
                "dates",
                f"Add at most {MAX_BULK_DATES} dates at a time.",
            )
            return []

        return pairs

    @staticmethod
    def _split_date_line(line):
        for separator in LABEL_SEPARATORS:
            if separator in line:
                date_part, label = line.split(separator, 1)
                return date_part.strip(), label.strip()
        return line, ""

    @staticmethod
    def _parse_date(value):
        """Accept ISO dates and the common day-first formats used in Kenya."""
        parsed = parse_date(value)
        if parsed is not None:
            return parsed
        for date_format in ("%d/%m/%Y", "%d-%m-%Y", "%d %b %Y", "%d %B %Y"):
            try:
                return datetime.datetime.strptime(value, date_format).date()
            except ValueError:
                continue
        return None

    @staticmethod
    def _format_label(template, index):
        """Expand ``{n}`` in the optional label template."""
        if not template:
            return ""
        try:
            return template.format(n=index)
        except (KeyError, IndexError, ValueError):
            # A stray brace should not block the whole import; keep the text.
            return template

    def save(self):
        """Create the dates, returning ``(created, skipped)`` counts."""
        if not self.is_valid():
            raise ValueError("Call is_valid() before save().")

        skip_existing = self.cleaned_data.get("skip_existing", True)
        active = self.cleaned_data.get("is_active", True)
        message = self.cleaned_data.get("message", "").strip()

        existing = set()
        if skip_existing:
            existing = set(
                PiscineDate.objects.filter(
                    date__in=[date for date, _ in self.dates_to_create]
                ).values_list("date", flat=True)
            )

        created = 0
        skipped = 0
        for date, label in self.dates_to_create:
            if skip_existing and date in existing:
                skipped += 1
                continue
            PiscineDate.objects.create(
                date=date,
                label=label,
                message=message,
                is_active=active,
            )
            existing.add(date)
            created += 1

        return created, skipped
