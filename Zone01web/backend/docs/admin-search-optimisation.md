# Admin Search Optimisation — Technical Record

**Branch:** `seo` (branched from `develop` at `0282e79`)
**Scope:** `Zone01web/backend` — Django admin changelist search
**Status:** complete, verified against PostgreSQL 16, committed as 17 single-file commits

---

## 1. Summary

The Django admin's changelist search was doing a **sequential scan on every
query** and **returning results in the wrong order**. Both problems are now
fixed. A selective search on 220,000 applicants went from **426 ms to 31 ms**
(~14x), and results are now ordered by relevance instead of by upload date.

Nothing about *which rows match* changed — the same set of rows is returned,
only reordered. There is one deliberate behaviour change beyond speed: the
search is now case-insensitive via PostgreSQL's `ILIKE` rather than `UPPER()`,
which is semantically equivalent but locale-aware.

---

## 2. The problem, in detail

### 2.1 Why every search scanned the whole table

Django compiles a `search_fields` entry into an `icontains` lookup. On
PostgreSQL, `DatabaseOperations.lookup_cast()` renders that as:

```sql
UPPER("applicants_applicant"."first_name"::text) LIKE UPPER('%odhiambo%')
```

Django prefers `UPPER()` deliberately — the source comment reads *"Use UPPER(x)
for case-insensitive lookups; it's faster"*, which is true for a b-tree prefix
scan, where the index can be matched against the upper-cased literal.

It is **not** true for a `pg_trgm` GIN index. `pg_trgm`'s GIN operator class
only accelerates three things, and only when applied to the bare column:

- `LIKE` / `ILIKE`
- regular expressions
- the `%` similarity operator

The moment the column is wrapped in `UPPER()`, none of those match the indexed
expression, so the planner has no choice but a sequential scan. This was
invisible in the code — the admin responded normally, just slowly, and got
slower in proportion to table size.

An index alone would not have fixed this. **Both** halves were required: the
index *and* a predicate the index can serve.

### 2.2 Why the best match was buried

The changelist applies `ORDER BY` **before** it runs the search. With no
explicit column sort from the user, it falls back to each model's default
ordering. For every model in this project that is "newest first"
(`ordering = ["-created_at"]`, `["-published_at", "-created_at"]`,
`["-start_at"]`). An editor searching for a specific applicant saw the most
recently uploaded rows first and the actual match further down.

Django's admin has no relevance ranking at all, so this had to be added.

---

## 3. What was built

### 3.1 `core/lookups.py` — make the predicate indexable

`TrigramIContains.as_sql()` (line 28) replaces Django's rendering with native
`ILIKE` on PostgreSQL:

```sql
"applicants_applicant"."first_name" ILIKE %odhiambo%
```

Two details make this safe rather than a blunt override:

- It calls `Lookup.process_lhs()` directly, bypassing `BuiltinLookup`'s
  `lookup_cast()`. That is the specific call that adds `UPPER()`; skipping it
  is what makes the column visible to the index.
- It only takes over when `connection.vendor == "postgresql"` **and** the right
  side is a literal value **and** there are no bilateral transforms. Anything
  unusual — a column-to-column comparison, a transform, a different database —
  defers to Django's own implementation, which stays correct but unindexed.

The lookup is registered from `CoreConfig.ready()` via `register()` (line 45),
so it is in place before any admin queryset is built.

### 3.2 `core/indexes.py` — the index type Django does not ship

Django provides `GinIndex`, which produces `USING gin (col)`. On a text column
that is invalid SQL — PostgreSQL has no default GIN operator class for
`varchar` — and Django's `Index` API has no way to specify one. There is no
built-in way to declare a `pg_trgm` GIN index from a model.

`GinTrigramIndex` (line 32) fills that gap by pairing `GinIndex` with the
`gin_trgm_ops` operator class, rendering:

```sql
CREATE INDEX applicant_first_name_trgm
  ON applicants_applicant USING gin (first_name gin_trgm_ops)
```

It is declared in `Meta.indexes` rather than in a hand-written migration, so
the migration state matches the model state and `makemigrations --check` stays
clean. `create_sql` / `remove_sql` (lines 52, 57) return a harmless no-op on
non-PostgreSQL backends, so `migrate` and the test suite still work on SQLite.

### 3.3 `core/operations.py` — enable the extension safely

`enable_trigram()` (line 27) issues `CREATE EXTENSION IF NOT EXISTS pg_trgm`
before the indexes are created. It is a `PostgresOnlySQL` (line 11), a
`RunSQL` subclass that silently no-ops off PostgreSQL while still recording the
same migration state everywhere. The reverse is a no-op because dropping the
extension would fail while any index still depends on it.

### 3.4 `core/search.py` — relevance ranking

`TrigramSearchMixin` (line 40) is mixed into the admin classes. It:

1. Lets Django filter exactly as before, so **the match set is untouched**.
2. Builds a single text expression by concatenating the scored columns
   (`_trigram_search_blob()`, line 80), `COALESCE`d so NULLs cannot poison it.
3. Scores each search word with `SIMILARITY()` and takes the **best** score
   across words (`_best_score()`, line 89).
4. Prepends `-trigram_rank` to whatever ordering the changelist had already
   chosen (`get_search_results()`, line 105).

**On step 4 — a subtlety worth knowing.** The obvious implementation is to
override `get_ordering()` to return `["-trigram_rank"]`. That does not work:
the changelist resolves `ORDER BY` *before* it calls `get_search_results()`, so
ordering by the annotation at that point raises `Cannot resolve keyword
'trigram_rank' into field`. The ranking therefore has to be injected from
inside `get_search_results()`, prepended to the ordering already in effect.

**On step 3 — a performance detail.** Taking the max of N scores is written as
a `CASE` chain over per-term annotation *aliases* rather than nesting
`SIMILARITY()` calls inside each `CASE` of the next. Nesting doubles the
expression size per term (2^n); alias references keep the generated SQL linear.
Long text blobs made this difference visible in the query plans.

### 3.5 Index layout — 22 single-column indexes

| Model | Indexed columns |
|---|---|
| `Applicant` | `first_name`, `last_name`, `email`, `phone`, `county`, `current_occupation`, `motivation` |
| `Article` | `title`, `summary`, `body`, `slug` |
| `Category` | `name`, `slug`, `description` |
| `Event` | `title`, `summary`, `description`, `location_name`, `slug` |
| `EventRegistration` | `full_name`, `email`, `phone` |

**Why one index per column, and not one multi-column index.** The admin ORs
the search term across *every* search field. A multi-column GIN index can only
serve a query that constrains **all** of its columns, so a predicate like
`title ILIKE 'x' OR summary ILIKE 'x'` cannot use it — the multi-column index
would be dead weight. Single-column indexes combine freely: PostgreSQL runs one
bitmap scan per column and merges them with `BitmapOr`, which is exactly the
shape of this query.

`category__name` and `event__title` are searched but not indexed on the
searching model — the join reaches a column that *is* indexed on the related
model, so the index is still used through the join.

### 3.6 Admin tuning

Beyond search itself:

- `show_full_result_count = False` — skips an extra `COUNT(*)` over the whole
  table on every changelist load.
- `list_select_related` on `Article` and `EventRegistration` — removes the
  per-row queries behind the category / event columns in `list_display`.
- `autocomplete_fields` for the applicant picker on events — searches
  applicants through the now-indexed path instead of loading every row into a
  `<select>`.
- `search_help_text` telling editors that results are ranked.

### 3.7 `django.contrib.postgres` in `INSTALLED_APPS`

Registers the PostgreSQL lookups, so `icontains` can be paired with others
(`search`, `unaccent`) later without another settings change.

---

## 4. Measured results

PostgreSQL 16, 220,000 applicant rows, `ANALYZE` run, term `surname199999`
(1 matching row). Timings from `EXPLAIN (ANALYZE, TIMING OFF)`.

| | Plan | Execution time |
|---|---|---|
| Before | `Parallel Seq Scan` | **426.4 ms** |
| After | `Bitmap Heap Scan` ← `BitmapOr` ← 7 × `Bitmap Index Scan` | **30.7 ms** |

Planning time was ~0.9 ms in both cases. The per-column scans are visible in
the plan, e.g. `Bitmap Index Scan on applicant_last_name_trgm ... actual
rows=112`, which is the only index that matched — the other six returned
nothing, as expected.

---

## 5. Behaviour reference

| Situation | Result |
|---|---|
| PostgreSQL, term with a 3+ char word | Indexed filter, ranked by similarity |
| Term shorter than 3 characters | Works, but unindexed sequential scan |
| Explicit column sort (`?o=…`) | Sort wins; ranking is skipped entirely |
| Admin declares `ordering` | Ranking skipped (admin's own ordering is intentional) |
| Non-PostgreSQL database | Unchanged Django behaviour, unindexed |
| Admin not using the mixin | Unchanged Django behaviour |
| Quoted phrase (`"exact phrase"`) | Django's own handling, unchanged |

Ranking is a **reorder only**. `test_match_set_is_unchanged_by_ranking`
asserts the result set is identical to a hand-built equivalent of Django's
filter.

---

## 6. Tests

Added to `core/tests.py` (16 tests total: on PostgreSQL 15 run and pass, with
one skipped because it asserts the non-PostgreSQL fallback; on SQLite 11 run
and pass, with 5 skipped as PostgreSQL-specific).

- `SearchIndexCoverageTests` — walks every admin registered with the mixin and
  fails if any `search_fields` column lacks a trigram index. This is the
  important one: the admin ORs across all search fields, so a single unindexed
  column silently reintroduces the full table scan, and nothing else would
  catch it.
- `IContainsLookupTests` — asserts the SQL contains `ILIKE` and not `UPPER`,
  and that the parameter is still `%am%`.
- `TrigramTermTests` — sub-trigram-length words are not scored; the term count
  is capped.
- `TrigramRankingTests` — closest match first; match set unchanged; explicit
  sort wins; short terms are not ranked; nothing happens off PostgreSQL.

Also green: `ruff check`, `ruff format --check`, `manage.py check`,
`manage.py makemigrations --check --dry-run` (no drift), and the full suite on
the SQLite fallback path.

---

## 7. Deploying this

```bash
git checkout seo
make migrate        # enables pg_trgm, then creates 22 indexes
```

Points to be aware of:

- **`CREATE EXTENSION` privileges.** `pg_trgm` must be installable by the
  migration's database user. On managed providers this is normally allowed for
  the owning role. If it is not, run `CREATE EXTENSION pg_trgm` once as an
  administrator; the migration uses `IF NOT EXISTS` and will then be a no-op.
- **Index build time.** The migration builds 22 indexes in one transaction. On
  a large `applicants_applicant` table this is fast (a few seconds at 220k
  rows), but on a much larger table consider building them with
  `CREATE INDEX CONCURRENTLY` outside the migration and marking the
  operations as applied.
- **Write cost.** Each GIN trigram index adds work on `INSERT`/`UPDATE` of the
  indexed columns. Irrelevant for `Article`/`Category`/`Event`; worth
  watching for `Applicant`, which is the one high-write table here. The largest
  is `applicant_motivation_trgm` (free-text).
- **Reversing.** `migrate` backwards drops the indexes. The extension is left
  in place, which is intentional and safe.

---

## 8. Adding a searchable field later

Three steps, and **steps 1 and 2 must stay in step**:

1. Add the column to the admin's `search_fields` (and to
   `trigram_search_fields` if it should be scored).
2. Add a `GinTrigramIndex` for that column to the model's `Meta.indexes`.
3. `make makemigrations && make migrate`.

```python
# models.py
GinTrigramIndex(fields=["portfolio_url"], name="applicant_portfolio_trgm"),

# admin.py
search_fields = (..., "portfolio_url")
```

`SearchIndexCoverageTests` fails the build if they drift apart, so the failure
mode is a red build rather than a silent performance regression.

Two reasons not to widen `search_fields` casually: every added column needs
another index (write cost), and a column with no index makes the whole query
scan. Some deliberately excluded columns are listed in the admin comments.

---

## 9. Known limitations

- **Terms under 3 characters cannot use the index.** `pg_trgm` needs a full
  trigram. A 2-character search such as `?q=od` is a sequential scan. This is a
  property of the extension, not of this setup.
- **Very common terms still scan, correctly.** Searching a term that matches
  ~20% of rows, PostgreSQL will choose a sequential scan because it genuinely
  is cheaper. That is the planner working properly, not a failure of the
  indexes — selectivity, not correctness, decides.
- **Ranking is similarity, not a full search engine.** It scores how close a
  row's text is to the search words. It does not stem, weight fields, or handle
  synonyms.
- **No fuzzy recall was added.** Recall is unchanged: a term that does not
  appear as a substring still returns nothing. Adding fuzzy *recall* (matching
  near-misses via a `similarity() >= threshold` filter) was deliberately left
  out, because that predicate is not served by a GIN index and would reintroduce
  a scan, and because it would silently change which rows match.
- **`Zone01web/frontend/admin-dashboard.html` was not touched.** It is a
  static design mockup with no JavaScript; its search input is inert
  decoration and is not connected to the Django admin. The `seo` branch covers
  that directory (it is the same repository), but it contains no changes.

---

## 10. Commit map

17 commits, one file each, ordered so each builds on the previous.

| # | Commit | File | Purpose |
|---|---|---|---|
| 1 | `1e300e4` | `core/indexes.py` | `GinTrigramIndex` |
| 2 | `cf392eb` | `core/operations.py` | `enable_trigram()` |
| 3 | `8176fdf` | `core/lookups.py` | `ILIKE` rendering |
| 4 | `b51e437` | `core/apps.py` | lookup registration |
| 5 | `1dbda91` | `core/search.py` | `TrigramSearchMixin` |
| 6 | `6fddc52` | `config/settings.py` | `django.contrib.postgres` |
| 7 | `387338a` | `applicants/models.py` | trigram indexes |
| 8 | `8858347` | `applicants/migrations/0002_…py` | index migration |
| 9 | `f2dd408` | `applicants/admin.py` | wider, ranked search |
| 10 | `496a907` | `content/models.py` | trigram indexes |
| 11 | `b98bcf4` | `content/migrations/0002_…py` | index migration |
| 12 | `f8be388` | `content/admin.py` | wider, ranked search |
| 13 | `a6b9561` | `events/models.py` | trigram indexes |
| 14 | `5b5f4a4` | `events/migrations/0002_…py` | index migration |
| 15 | `36e47b5` | `events/admin.py` | wider, ranked search, autocomplete |
| 16 | `0434c61` | `core/tests.py` | tests |
| 17 | `353dafd` | `README.md` | user-facing docs |

Intermediate commits are not independently runnable — for example, commit 7
imports `GinTrigramIndex`, so `applicants` is only importable from commit 7
onward. That is inherent to a one-file-per-commit split; the branch tip is
fully green. For a bisect-friendly history, squash each app's model and
migration into one commit.

The branch is local. `git push -u origin seo` when it is ready for review.
