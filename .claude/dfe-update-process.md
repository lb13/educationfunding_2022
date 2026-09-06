# DfE FE Update — Processing Guide

This document describes how to keep the site current when new DfE Further Education Update editions are published (typically weekly during term time, fortnightly in summer).

---

## 1. Check what we already have

```bash
cat educationfunding_2022/data/newsfeed.json | python3 -c \
  "import json,sys; [print(d['edition']) for d in json.load(sys.stdin)]"
```

Note the most recent edition date.

---

## 2. Fetch new editions from gov.uk

Publication index: https://www.gov.uk/government/publications/dfe-update

Use a research agent (or WebFetch) to:
- Fetch the index page and list all editions newer than the last one we have
- For **each new edition**, fetch the full page and extract every item:
  - Headline (strip the `Action:` / `Information:` / `Reminder:` / `Feedback:` category prefix — the category is implied by the anchor)
  - Full URL **including the `#anchor` fragment** — do NOT guess anchors, fetch the page and read the real IDs
  - Note: gov.uk anchor format is `{category}-{slugified-heading}`, but watch for quirks (pluralised `reminders-`, missing hyphens in concatenated words, trailing spaces producing double-hyphens)

---

## 3. Update `newsfeed.json`

File: `educationfunding_2022/data/newsfeed.json`

Rules:
- Newest edition goes at the **top** of the array
- The **most recent edition** gets `"ticker": true`; all older editions get `"ticker": false`
- Strip category prefixes from `headline` (keep the text only)
- Optionally add `ticker_headline` on actionable items in the ticker edition — shorter phrasing for the scrolling bar (aim for ≤60 chars); omit for feedback/survey items
- Do **not** include `ticker_headline` on non-ticker editions (it's ignored)
- Preserve existing editions exactly; only prepend new ones

---

## 4. Identify resources to add

Every outbound link within a DfE Update edition is worth evaluating independently — not just the primary publication a section headline refers to. A section may link several useful documents in passing, any of which could be missing from the index.

**How to sweep for links:**
For each edition page, fetch the full HTML and extract **all** outbound `href` values that point to `gov.uk`, `education.gov.uk`, or other authoritative sources. For each link, check whether we already have a resource for it (search `content/resources/` by URL or keyword). If not, evaluate it:

**Add a resource when the link points to:**
- A guidance document (funding rules, handbooks, technical guides)
- A tool or service with a stable URL (portals, data collection systems)
- A published dataset or reference file
- Updated/new year-specific versions of existing guidance

**Skip when the link points to:**
- The DfE Update page itself or its anchors
- Feedback surveys or consultation forms with no lasting value
- External non-gov sites (e.g. AoC, NCFE) unless they are primary reference sources
- Something we already have indexed at the same or equivalent URL
- Pure news/announcements with no standalone publication artefact

---

## 5. Create resource `.md` files

Location: `educationfunding_2022/content/resources/`

Filename: slugified title, e.g. `apprenticeship-funding-rules-2026-to-2027.md`

Format (frontmatter only, no body):
```yaml
---
Tags: [tag1, tag2, tag3]
Title: "Exact title as on gov.uk"
Description: "One sentence describing what the document covers."
Link: https://www.gov.uk/government/publications/...
---
```

Tag vocabulary (pick 2–5 relevant):
`asf`, `adult skills fund`, `16-19`, `apprenticeships`, `funding rules`, `ilr`, `t-levels`, `esfa`, `colleges`, `further education`, `qualifications`, `subcontracting`, `financial management`, `free meals`, `digital skills`, `workforce`, `post-16`, `allocations`

Rules:
- `Title` should match the gov.uk page title exactly
- `Link` must be verified — fetch the page before committing to confirm it resolves to a real publication, not a 404 or redirect loop
- Do NOT use DfE Update anchor URLs as the `Link` — find the actual publication URL
- Check for an existing resource with the same or very similar URL before creating a new file

---

## 6. Commit and push

```bash
git add educationfunding_2022/data/newsfeed.json \
        educationfunding_2022/content/resources/
git commit -m "newsfeed: add [editions] DfE FE Update + [n] new resources"
git push -u origin <branch>
```

Commit message should list the edition dates and count of resource files added.

---

## Data file reference

| File | Purpose |
|---|---|
| `educationfunding_2022/data/newsfeed.json` | Ticker + expandable headlines panel source |
| `educationfunding_2022/layouts/index.html` | Renders the ticker and news panel from `newsfeed.json` |
| `educationfunding_2022/content/resources/*.md` | Individual resource cards shown on `/resources/` |

---

## Ticker display logic (reference)

The Hugo template loops over `newsfeed.json`, collects items from editions where `ticker: true`, and renders them as scrolling links. The `ticker_headline` field (if present) is used in the scrolling bar; `headline` is the fallback and is always used in the expandable panel.

Only **one edition** should have `ticker: true` at a time — the most recent.
