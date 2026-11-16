/* =========================================================================
   SAMPLE STORIES: for the design review only. NOT real learners.
   ─────────────────────────────────────────────────────────────────────────
   • Shown only while SHOW_DEMO is true in site-config.js, and only to fill a
     category that has fewer real stories than needed to show the layout
     (2 videos, 3 placements, 2 reviews per category).
   • Every record has isDemo: true and the page labels it "Sample story".
   • Names, companies and texts are placeholders on purpose. No real person,
     photo, company or salary is used. Never copy these rows into the Google Sheet.
   • To retire them: add real rows to the sheet (they replace samples
     automatically), then set SHOW_DEMO: false in site-config.js.
   ========================================================================= */
window.SS_DEMO = (function () {
  var PROGRAMS = {
    da: 'Advanced Data Analyst',
    ds: 'Advanced Data Science & AI',
    ai: 'Agentic AI + GenAI'
  };
  var VIDEO_TEXT = 'Sample video.';
  var REVIEW_TEXT = 'Sample review. A real learner review will go here.';

  // one block per category: the "before" lines and roles are generic placeholders
  var CATS = {
    'fresher':      { before: ['B.Sc graduate', 'B.E graduate', 'BCA graduate'], roles: ['Data Analyst (sample)', 'Junior Data Scientist (sample)', 'AI Engineer Trainee (sample)'], prog: ['da', 'ds', 'ai'] },
    'student':      { before: ['Final year B.Tech student', 'Pre-final year B.Sc student', 'Final year BCA student'], roles: ['Data Analyst Intern (sample)', 'AI Intern (sample)', 'Junior Data Analyst (sample)'], prog: ['da', 'ai', 'ds'], types: ['Internship', 'Internship', 'Job offer'] },
    'it-pro':       { before: ['Software tester, 4 years', 'Support engineer, 6 years', 'Java developer, 5 years'], roles: ['AI Engineer (sample)', 'Data Scientist (sample)', 'GenAI Developer (sample)'], prog: ['ai', 'ds', 'ai'] },
    'nonit-switch': { before: ['Mechanical engineer, 3 years', 'Bank officer, 5 years', 'Sales executive, 4 years'], roles: ['Data Analyst (sample)', 'AI Analyst (sample)', 'Business Analyst (sample)'], prog: ['da', 'ai', 'da'] },
    'career-gap':   { before: ['3-year career break', '5-year break after IT job', '2-year break after studies'], roles: ['Data Analyst (sample)', 'AI Engineer (sample)', 'Junior Data Scientist (sample)'], prog: ['da', 'ai', 'ds'] }
  };
  var LETTERS = 'ABCDEFG';
  var out = [], row = 9001;

  Object.keys(CATS).forEach(function (cat) {
    var c = CATS[cat];
    // 2 sample videos
    for (var v = 0; v < 2; v++) out.push({
      isDemo: true, type: 'video', cat: cat, row: row++,
      name: 'Sample learner ' + LETTERS[v],
      headline: VIDEO_TEXT, duration: v ? '01:45' : '02:30'
    });
    // 3 sample placement stories (no real company, no salary)
    for (var p = 0; p < 3; p++) out.push({
      isDemo: true, type: 'offer', cat: cat, row: row++,
      name: 'Sample learner ' + LETTERS[p + 2],
      from: c.before[p], program: PROGRAMS[c.prog[p]],
      modules: ['Python', 'SQL', p === 2 ? 'GenAI projects' : 'Statistics'],
      role: c.roles[p], company: 'Company name', outcomeType: (c.types || [])[p] || 'Job offer',
      text: 'Sample text.'
    });
    // 2 sample training reviews
    for (var r = 0; r < 2; r++) out.push({
      isDemo: true, type: 'review', cat: cat, row: row++,
      name: 'Sample learner ' + LETTERS[r + 5],
      text: REVIEW_TEXT, source: 'Sample'
    });
  });
  return { records: out };
})();
