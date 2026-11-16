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

The resulting palette uses deep navy `#071f44`, blue `#007dbb`, cyan `#00a9df`, pale sky backgrounds and warm white. Plus Jakarta Sans headings pair with DM Sans body text. Actual portraits and original learner records carry the human detail. Employer names are text references to learner outcomes, not partner logos or endorsements.

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
| Hero photos | Brief 700 ms entrance with a small stagger |
| Section headings and story cards | One-time 22 px movement over 650 ms; text remains readable |
| Journey | An 800 ms connecting-line entrance |
| Filter results | A 180 ms transition after a selection |
| Dialog | A short 180 ms entrance; native close/Escape behavior and media cleanup |
| Reading progress | Tracks ordinary scrolling without altering scroll behavior |
| Hover controls | Small directional feedback, no continuous animation |

No looping decorative animation, forced splash screen, autoplay audio/video or count-up statistics. Reduced motion is supported through both the system preference and a persistent footer control. Layouts include desktop, tablet and mobile rules; actual browser visual QA remains outstanding because browser access was unavailable.

## Review and publication

The previous files are archived in `backup/before-manager-redesign-20261116/`. The new source and generated entry points share one implementation. A clean review ZIP contains only required site assets. No remote deployment was performed.

Before a public release, replace the illustrative organization totals with approved figures and a reporting period, or use the calculated collection mode. A production build checks that setting. The existing student records should receive the normal content-owner review, particularly dates, packages and any featured-story editorial changes.
