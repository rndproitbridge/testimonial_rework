# Success Stories redesign — review notes

## The intended experience

The opening answers “What is PROITBRIDGE?” before asking visitors to consume testimonials. It introduces practical Data Analytics, Data Science and AI learning, then moves from the overall impact to the people and learning behind it. Someone scrolling without playing a video can understand the offer, the kinds of outcomes, the learning process and the support available.

## How the manager's feedback changed the page

| Feedback | Implemented response |
|---|---|
| Explain the organization immediately | A plain-language introduction, program areas and real learner portraits in the opening |
| Show trained and placed totals | A prominent impact section; temporary figures are explicitly labelled illustrative |
| Explain placement categories | Role counts plus starting-background counts, with links to the matching records |
| Make it feel like a story | Introduction → impact → outcomes → learning journey → personal stories → support → voices → next step |
| Make the page valuable while scrolling | Visible written summaries, before/learning/outcome details and support explanations |
| Video is a deeper option | Written reviews precede video; video players load only after a click |
| Improve the basic visual design | Large editorial headings, authentic portraits, asymmetric photo composition, outcome rows, a connected journey and varied section treatments |
| Add thoughtful animation | Short entrances, one-time section movement, a connecting line, hover feedback and gentle filter changes |

The eight required content areas from the revised Word document are represented. Learner-specific gaps in the source data remain visible as omissions: an unstated earlier job is not replaced with a guessed one, and a missing quote is not manufactured. The five-step journey explains the general process without promising employment.

## References and brand direction

Reviewed on 16 November 2026:

- [PROITBRIDGE main website](https://www.proitbridge.com/): organization positioning, training and career-support context.
- [Program and mentorship plans](https://www.proitbridge.com/pricing/): program hierarchy, structured support, navy/blue brand treatment and the destination for the program CTA.
- [Course induction website](https://courseinduction.proitbridge.com/): confident typography and a navy/cyan visual vocabulary.
- [Agentic AI induction website](https://agenticaiinduction.proitbridge.com/): Plus Jakarta Sans and the blue/cyan/navy family used to inform this page's visual direction.
- [Official enquiry page](https://www.proitbridge.com/contact-us-2/): the destination for enquiry CTAs.

The resulting palette uses deep navy `#071f44`, blue `#007dbb`, cyan `#00a9df`, pale sky backgrounds and warm white. Following the user's brand-consistency refinement, **Sora is used for both headings and body text**. The [PROITBRIDGE pricing page](https://www.proitbridge.com/pricing/) explicitly loads Sora and uses it as its display family. The homepage still uses DM Sans, so the public sites are not uniform. This page follows the requested Sora direction and bundles the open-source variable font locally. Actual portraits and original learner records carry the human detail. Employer names are text references to learner outcomes, not partner logos or endorsements.

The induction sites offer different sessions and prices. The success-stories page therefore uses general program and enquiry links rather than borrowing a session price or promotion. Public founder experience figures were not repurposed as organization-wide learner totals.

## Content choices

Featured journeys:

- **Parimalraj B:** Business Development Associate → Data Scientist at Amvion Labs. The supplied learning modules provide the middle of the story.
- **Santosh:** QA → AI Engineer through an internal move. His recorded feedback names RAG and Word2Vec; no unspecified program title is invented.
- **Kavimalar:** Advanced analytics learning → HR Data Apprenticeship at iMobility, France. It is labelled an apprenticeship, not a full-time placement.

Current collection: 13 career stories, 10 distinct named employers, 7 written reviews, 2 videos and 1 voice note. Two recruiter/referral proof records remain outside career outcome counts. Counts are by content format and are not a total of distinct learners.

Role groups: Data Science 2; AI & Machine Learning 5; Data Analytics 3; Technology & Leadership 3. Starting backgrounds in those career records: IT Professional 8; Fresher 1; Non-IT to IT 1; unspecified 3. Background labels follow the recorded categories, even where a previous role adds nuance.

Review figures requested by the user: 1,200+ trained; 300+ placed; 4 learning tracks; 50+ stories. These are illustrative, with a visible label and an explanatory sentence. No other learners, employers, salaries or testimonials were invented.

## Motion and accessibility

| Element | Behavior |
|---|---|
| Hero headline | Three masked lines enter in sequence over about one second |
| Hero photos | Spring entrances, offset in time, settling into the editorial photo composition |
| Hero path | A 1.7 second SVG line draw connecting the visual composition |
| Impact figures and outcomes | Staggered reveals; figures themselves do not count up |
| Section headings and story cards | One-time viewport entrances, with shorter movement on mobile |
| Journey | Scroll-linked progress line and highlighted step markers |
| Decorative backgrounds | Limited desktop parallax; body text stays fixed within the layout |
| Filter results | Short staggered entrances; collapsed content is not animated |
| Dialog | A spring entrance and 160 ms exit, preserving native focus behavior and media cleanup |
| Reading progress | Tracks ordinary scrolling without altering scroll behavior |
| Hover / press controls | Spring button feedback, gently lifted cards and video play-button response |

The implementation uses the pinned, locally bundled **Motion 14.14.0** library. The requested [React animation guide](https://motion.dev/docs/react-animation) informed the use of coordinated transitions, springs and independent transforms. The existing static site uses Motion's documented [JavaScript API](https://motion.dev/docs/quick-start), [viewport triggers](https://motion.dev/docs/inview), and [scroll linking](https://motion.dev/docs/scroll).

No looping decorative animation, forced splash screen, autoplay audio/video or count-up statistics. Reduced motion is supported through the system preference , including stopping active JavaScript effects and restoring resting styles. Layouts include desktop, tablet and mobile rules. Touch layouts do not run desktop parallax. Actual browser visual QA remains outstanding because browser access was unavailable.

## Review and publication

The previous files are archived in `backup/before-manager-redesign-20261116/`. The new source and generated entry points share one implementation. A clean review ZIP contains only required site assets. No remote deployment was performed.

Before a public release, replace the illustrative organization totals with approved figures and a reporting period, or use the calculated collection mode. A production build checks that setting. The existing student records should receive the normal content-owner review, particularly dates, packages and any featured-story editorial changes.

## Larger typography and Full HD layout

The content container now grows to 1600 px at 1920 px viewport width, leaving 160 px margins. The desktop hero uses viewport-aware minimum height, larger portraits and a heading up to 96 px. Main supporting copy is 18–20 px. Tablet layouts adapt at 1100 and 900 px; phone layouts at 700 and 380 px. Small-screen body copy remains 16–18 px. No fixed page height or global zoom is used. Actual multi-device visual QA remains outstanding because browser access is unavailable.

## Employer logo strip
Five company-sourced logos replace the text strip: Mphasis, Amvion Labs, Cognizant, Celestial Systems and Rohnium India. Source URLs are in assets/employers/SOURCES.json. Equal duplicate tracks scroll continuously left to right. Hover and keyboard focus stop playback. The hovered logo enlarges gently by 10%; there is no pause button. System reduced motion displays a static, horizontally accessible collection. Other employers remain in learner records; unconfirmed logo identities are not guessed.

## Content cleanup
Removed illustrative organization totals, decorative text labels, repeated slogans and redundant supporting copy. Impact mode is now collection, calculated from the published learner records. Actual stories, quotes, role/background filters, learning steps, support information and CTAs remain. This supersedes the earlier sample-figure review notes.
