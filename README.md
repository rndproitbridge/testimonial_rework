# PROITBRIDGE Success Stories

The manager-feedback redesign is in this folder: `C:\Users\wasiq\Downloads\ProITBridge\Tech\testimonial-main`.

Open **index.html** in a browser to review the working source page. It works from disk using the saved stories. A hosted copy also refreshes from the existing published Google Sheet, with a saved-data fallback. Nothing was deployed as part of this redesign.

## Page structure

1. Introduce PROITBRIDGE and the learning areas, with real learner portraits.
2. Show organization impact figures, clearly marked as illustrative during this review.
3. Break down the actual career stories by role and starting background.
4. Explain the five-step journey from direction to opportunities.
5. Tell three featured learner journeys, followed by a filterable career-story library.
6. Explain practical learning, projects, guidance and career preparation.
7. Present written reviews before optional videos and a voice note.
8. Link to the existing program and enquiry pages.

## Review figures

`site-config.js` currently sets `IMPACT.mode: 'sample'`:

- 1,200+ learners trained
- 300+ learners placed
- 4 learning tracks
- 50+ success stories

These figures were selected for design review at the user's request. They are **not verified business results**. The page labels them visibly. The actual published collection currently contains **13 career stories, 7 written reviews and 2 videos**; formats are counted separately and are not a unique-learner total.

Before publication, either set `IMPACT.mode` to `collection` to use calculated collection counts, or supply approved totals, set `approved: true`, add a reporting period, and use `mode: 'verified'`. A production build rejects sample figures or incomplete verified settings. Review HTML includes a noindex tag; a production build removes that tag from the generated output only.

## Canonical source and build

| File | Purpose |
|---|---|
| `index.html` | Semantic page structure and permanent copy |
| `assets/success-stories.css` | Responsive layout, typography, component styles and motion |
| `assets/story-data.js` | CSV parsing, masking, categorization and counts |
| `assets/success-stories.js` | Rendering, filters, dialogs, media and live refresh |
| `site-config.js` | Impact settings, editorial selections, asset mappings and real CTA URLs |
| `data/snapshot.js` | Saved published data for first render and offline use |
| `tools/build-single.mjs` | Generates consistent HTML and copies its required media |
| `tools/validate.mjs` | Non-browser data and DOM interaction checks |
| `DESIGN-NOTES.md` | Manager-feedback mapping, references and animation decisions |

With Node.js installed:

```powershell
node tools/update-snapshot.mjs
node tools/build-single.mjs
node tools/validate.mjs
```

The build uses the saved snapshot. Refresh it first when you want a new offline data copy. It writes identical HTML to `dist/index.html`, `dist/success-stories.html` and `godaddy-upload/SuccessStory/index.html`, and copies the required images/audio/video beside it. **Upload the HTML with its assets folder**, not the HTML alone. CSS, settings, data and application scripts are embedded in generated HTML; fonts may still load from Google Fonts, with system fallbacks.

After approved impact settings are in place:

```powershell
node tools/build-single.mjs --production
```

The `dist/build-manifest.json` lists the exact required files. Existing unused assets were preserved to avoid destructive cleanup; a review ZIP contains only the manifest files. The old root files and previously divergent builds are preserved in `backup/before-manager-redesign-20261116/`.

## Maintaining stories

The existing published `Stories` CSV remains the content source. `Publish = Yes` makes a row eligible. Supported types are Offer, Review, Quote, Video, Voice and Proof. Quote rows are presented with written reviews. Recruiter/referral Proof rows are not counted as placements or displayed as completed learner outcomes.

Use `Previous role`, `Program`, `Modules`, `Role`, `Company`, `City`, `Text`, `Note`, `Mentor`, `Offer date` and `Package (LPA)` for factual detail. Missing fields stay missing; the page does not invent an earlier role, training program or quote. Stars appear only when supplied. Full review means the complete text provided in the sheet; some source text already contains ellipses. Original screenshots and source links provide context.

Background aliases are normalized to College Student, Fresher, IT Professional, Non-IT to IT or Career Gap. Unknown backgrounds stay unassigned. Career groups are derived from the new role title, not from the background. The current role breakdown is Data Science 2, AI & Machine Learning 5, Data Analytics 3, Technology & Leadership 3.

Use `Masked = Yes` to suppress identifying fields and media in the interface. The published sheet is itself public, so remove sensitive values there as well. `Learner ID`, when supplied, stabilizes record identity within each content format. The counts intentionally do not claim deduplication across formats.

The three editorial story selections are in `FEATURED`; the hero selections are in `HERO`. Update `STORY_COPY` when a featured person's outcome changes. A removed or masked record is also removed from its dynamic hero/feature placement after refresh. No sample learners or fabricated testimonials are injected.

Local photo/proof mappings are in `LOCAL_ASSETS`. Video/audio mappings in `MEDIA_FILES` use `{src, poster}` objects keyed by the original Drive file ID. Supply an actual image file for Photo/Poster when adding new media; a Drive viewing page is not a direct image. Existing local assets are already mapped. Local MP4, Drive and YouTube video playback are supported; other providers remain accessible through the original-source link.

The app refreshes about every five minutes while the page is visible. Updates wait while a dialog or active media playback is in use. Failed requests keep saved data. `?check` shows the active data source, record count and impact mode. Old background hashes such as `#fresher`, `#it-pro`, `#nonit-switch`, `#it-switch` and `#gap` still open the corresponding library filter.

## Interaction and validation

Motion consists of a brief photo entrance, gentle one-time section movement, a connecting journey line, hover feedback, filter transitions and a reading-progress indicator. There is no autoplay video or animated number counting. The OS reduced-motion preference and the footer's Reduce motion control disable decorative motion. All videos require a user action; audio uses `preload="none"`.

The current automated checks cover data parsing, category counts, masking, sample-label rules, offline fallback, filters, dialogs, media creation/cleanup, menu state, review expansion, reduced motion, anchors and packaging. See `.preview/validation/report.json`.

**Validation limitation:** no browser surface was available in this session. Desktop/mobile visual appearance, real media playback, native dialog focus trapping and browser keyboard behavior still need a real-browser review. DOM tests do not establish those properties.
