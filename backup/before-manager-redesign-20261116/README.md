# PROITBRIDGE Learner Stories: how it works

The page (`index.html`) reads its stories from a **Google Sheet**.
Add a row to the sheet and the website shows it within about 5 minutes. You don't edit any code and don't need to re-upload anything.

```
Google Sheet ("Stories" tab, published as CSV)
        │  read on every page visit
        ▼
index.html ──► shows the saved copy (data/snapshot.js) instantly,
               then swaps in the live sheet as soon as it loads.
               If Google can't be reached, the saved copy stays.
```

---

## One-time setup (about 20 minutes)

### 1. Create the sheet
1. Create a **new, separate** Google Sheet, e.g. "PROITBRIDGE Website Stories".
   Don't use the private placement sheet: that one has phone numbers and emails.
2. **File → Import → Upload** `sheet-template/Stories.csv` → "Replace current sheet".
   **Untick "Convert text to numbers, dates, and formulas"** so dates stay exactly `2026-09-03`. (A US-format sheet would turn 3 Sep into `9/3/2026`, which reads as 9 March.) Rename the tab to **Stories**.
3. **File → Import → Upload** `sheet-template/Stats.csv` → "Insert new sheet", same untick. Rename the tab to **Stats**. (The current page doesn't show stats, but the tab can stay.)
4. **Add the dropdowns:** go to **Extensions → Apps Script**, paste all of `sheet-template/setup.gs`, Save, pick `setupSheet` and click **Run**, then allow access.

### 2. Publish the tabs
1. **File → Share → Publish to web**.
2. Pick the **Stories** tab and **Comma-separated values (.csv)**, then click **Publish**. Copy the link.
   Keep **"Automatically republish when changes are made"** ticked. If it's off, sheet edits never reach the site.
3. Paste the link into `site-config.js` as `STORIES_CSV` (and the Stats link as `STATS_CSV`).
> ⚠️ Everything in a published tab is public. Only put what you'd show on the website in this sheet.

### 3. Sign-up buttons
`LINKS.induction` (your ₹89 page) or `WHATSAPP` (digits only, e.g. `919876543210`) in `site-config.js`.
While both are empty, **no sign-up button is shown anywhere**, so visitors never meet a button that goes nowhere. Fill one in when the sign-up page is ready, and "Know more" buttons appear in the header, the final section and a bar at the bottom of phone screens.

### 4. Self-hosted video files (for autoplay)
Browsers block Google Drive files from playing inside the page's own video player. So the featured video's muted autoplay, sound button and play/pause need the video file on your own website:
1. Put the `.mp4` (or `.m4a` for voice notes) in `assets/`.
2. In `site-config.js` → `MEDIA_FILES`, map the Drive file ID (the long code in the Drive link) to that file:
   ```js
   MEDIA_FILES: { '1VfWq7oNqtMpOVnRhwDMVuvmGwRQNNg5F': 'assets/arunkumar-feedback.mp4' }
   ```
3. Upload the file with the page (see step 5).

Videos without a file here still work: they play in Google Drive's own player when tapped, but they can't autoplay as the featured video.

### 5. Put it online
- **cPanel (current host):** never upload the plain `index.html` on its own: without `site-config.js` and `data/` beside it, the page shows no stories. Instead:
  1. Run `node tools/build-single.mjs`. It writes `dist/index.html`, one self-contained file with the settings and a fresh copy of the sheet built in. It also lists the files to upload and warns if sample stories are switched on.
  2. Upload **`dist/index.html`** into the page's folder (e.g. `public_html/SuccessStory/`).
  3. Upload the files listed under `MEDIA_FILES` into an **`assets/`** folder inside that same folder (e.g. `public_html/SuccessStory/assets/arunkumar-feedback.mp4`).
  4. **Rebuild and re-upload after every change to `index.html` or `site-config.js`.** New sheet rows still appear on their own.
- **Review build vs live build:** while `SHOW_DEMO` is `true`, the build includes labelled sample stories. **Upload a sample build only to a review folder** (e.g. `public_html/SuccessStory-review/`), never over the live page. Before going live, set `SHOW_DEMO: false`, build again, then upload.
- **Netlify / GitHub Pages:** upload the whole folder (`index.html`, `site-config.js`, `data/`, `assets/`).

---

## Daily use: adding a story

Add a row to the **Stories** tab and set **Publish = Yes**. That's it.

| Column | What to put | Example |
|---|---|---|
| **Publish** | `Yes` shows the row on the site, `No` hides it (drafts, pending consent) | Yes |
| **Type** | `Offer` (placement), `Review` (Google review), `Video`, `Voice`, `Quote` (written testimonial), `Proof` (recruiter / referral message) | Offer |
| **Category** | One of the 5 backgrounds: `Fresher`, `College Student`, `IT Professional`, `Non-IT to IT Switch`, `Career Gap`. The old values still work: `IT Upskill` and `IT → AI Switch` show under IT Professional, `Non-IT → AI` under Non-IT to IT Switch. **Leave empty if you don't know**: the story then shows under "More from our learners", never under a guessed background. | Career Gap |
| **Tags** | Comma-separated. "Internship", "Apprenticeship" or "Internal move" in the role or tags sets the outcome label. | Internship |
| **Featured** | `Yes` shows the story first in its background. | Yes |
| **Name** | As the learner wants it shown | Renuka V |
| **Masked** | `Yes` hides the name, company, city, package, photo, batch and mentor on the site. **Also leave those cells empty in this sheet**, because the sheet itself is public. | Yes |
| **Photo** | Headshot: an image file in `assets/`, a Google Drive link, or any direct image link | assets/kavimalar.jpg |
| **Batch / Mentor** | The mentor shows in the full story | Rakshitha V R |
| **Program / Modules** | "What they learned". Modules comma-separated. | Python, SQL, ML |
| **Previous role** | "Before". Without it, the background's general line shows (e.g. "IT professional"). | QA |
| **Role / Company / City** | "Now": the new job | Technical Lead / Fujitsu / Chennai |
| **Package (LPA)** | Number only. Fill it **only if the learner agreed to show it**. | 33 |
| **Headline** | The short line on a video card | A fresher's journey, in his own words. |
| **Offer date** | `YYYY-MM-DD` (shown in the full story) | 2026-08-24 |
| **Text** | Review / testimonial words, or the learner's own words on an Offer ("In their words"). Keep the learner's original wording. If you shorten it, use `…` and the page marks it "Excerpt". Never start a cell with `=`. | …**the NLP module alone had 15 projects**… |
| **Stars** | 1–5, only from the original review | 5 |
| **Source** | Google, WhatsApp, LinkedIn, Mentors' channel, Offer letter… It sets the proof label ("Shared by mentor", "Offer letter", "Shared by learner", "LinkedIn post"). | Mentors' channel |
| **Media** | The proof screenshot (Offer), the review screenshot (Review), the video (Video) or the audio (Voice). Any public link or a file in `assets/`. | https://drive.google.com/file/d/…/view |
| **Poster / Duration** | Video thumbnail (YouTube and Drive are automatic) and length | 03:38 |
| **Note** | One extra line in the full story | |

**Optional new columns** (add them anywhere in the header row; the page reads them by name):

| Column | What it does |
|---|---|
| **Learner ID** | The same ID on all rows of one person (e.g. `arunkumar-p` on his video, review and offer). Links them: his video shows in his full story, and he's never counted twice. Without it, the page matches first name + first letter of the second word. |
| **Outcome type** | Overrides the label: `Job offer`, `Internship`, `Apprenticeship`, `Internal move`… |
| **Proof type** | Overrides the proof label: `Offer letter`, `Placement screenshot`, `Shared by learner`, `Shared by mentor`. Use the honest one: nothing is labelled "Verified". |

**Media links.** Make sure the link is public (for Drive: Share → **Anyone with the link**).
| You paste | The website shows |
|---|---|
| Image file or direct image link (Drive, Dropbox, imgur…) | The image (proof viewer with zoom) |
| Google Drive video | Plays in the page's player if listed in `MEDIA_FILES`, otherwise in Drive's player |
| YouTube, Vimeo, Loom, Facebook video | Plays in their player in the video viewer (add a **Poster** for Vimeo) |
| `.mp4` / `.m4a` / `.mp3` file or link | The page's own video / audio player |
| Anything else | Opens in a new tab |

`?check` tells you if a link can't work.

---

## Page layout

1. **Hero:** "Real learners. Real stories." and **one featured learner video**, picked at random from the real videos on each visit. It starts muted (where the browser allows), with a "Tap for sound" button, play/pause and a progress bar. It never restarts when a background is chosen, pauses when scrolled away or when another video plays, and never jumps to another video. With "reduce motion" switched on, it waits for a tap.
2. **"Find stories from learners like you":** the 5 backgrounds as cards (one row on desktop, a swipeable row on phones). Fresher is selected first. Choosing one updates everything below without reloading the page. A compact bar with the 5 backgrounds stays at the top while reading.
3. **"Hear from our learners":** the background's videos (2–3 per row on desktop, one at a time on phones). A tap opens the video viewer.
4. **"See where our learners are today":** placement stories as Before → What they learned → Now, with the package (when shared), the outcome type and **"View placement proof"** (zoomable screenshot with an honest label). **"View full story"** opens the detailed journey, which includes the learner's own words and their video when one is linked.
5. **"What our learners say about the training":** reviews, testimonials and voice notes for that background. Long reviews fold with "Read more", shortened ones say "Excerpt", and "View original review" opens the screenshot.
6. **"Explore more learner stories":** one story from each other background, then **"More from our learners"** for stories without a background (shown once, here).
7. **Final section:** a short note and "Choose another background". The "Know more" button appears only when a sign-up link is set.

No Google rating is calculated from the reviews on the page, and no placement counts or salary targets are shown.

## Sample stories (design review)

While `SHOW_DEMO: true` (in `site-config.js`), a background with fewer than **2 videos, 3 placements or 2 reviews** is filled with sample stories from `data/demo-data.js`.
- Every sample has `isDemo: true` and a visible **"Sample story"** label. They use placeholder names ("Sample learner A"), "Company name" and no salaries. No real person or company is used.
- Real rows always come first. As soon as a background has enough real stories, its samples disappear on their own.
- **To retire them:** add real rows to the sheet, then set `SHOW_DEMO: false` and rebuild. With it off, a background with no stories shows a short "No stories from this background yet" note.
- Never copy sample rows into the Google Sheet.

## Checking for mistakes

Open the site with **`?check`** on the end, e.g. `https://your-site/?check`. A panel shows where the data came from, how many stories are in each background, and every row with a problem (unknown Type or Category, missing Role, a bad date, an image that doesn't load) with its **row number**.

## Shareable links

Each background has its own link that opens straight to it:
`#fresher`, `#student`, `#it-pro`, `#nonit-switch`, `#career-gap`.
Old links (`#it-switch`, `#it-upskill`, `#nonit`, `#gap`) still work.

## Tracking

If Google Analytics (`gtag`) or the Meta Pixel (`fbq`) is on the page, these events are sent automatically:
`category_select`, `featured_play`, `featured_sound_on`, `video_play`, `voice_play`, `proof_open`, `story_open`, `cta_click`.
Add your GA/Pixel snippet inside `<head>` in `index.html`.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `site-config.js` | Sheet link, sign-up links, `SHOW_DEMO`, `MEDIA_FILES`, the 5 backgrounds |
| `data/snapshot.js` | Saved copy of the sheet. Refresh it with `node tools/update-snapshot.mjs`. |
| `data/demo-data.js` | Sample stories for the design review (not real learners) |
| `tools/build-single.mjs` | Builds `dist/index.html` for cPanel |
| `backup/` | The page, settings and cPanel build from before the redesign (to roll back, copy `backup/dist-index-before-redesign.html` to the server as `index.html`) |
| `sheet-template/` | Starting CSVs for the sheet, plus the dropdown helper script |
| `assets/` | Images, videos and audio |
