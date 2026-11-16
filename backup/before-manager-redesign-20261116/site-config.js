/* =========================================================================
   PROITBRIDGE · Success Stories: site settings
   This is the only file you normally edit (besides the Google Sheet).
   ========================================================================= */
window.SS_CONFIG = {

  /* 1) GOOGLE SHEET LINKS
     In the sheet: File → Share → Publish to web → pick the "Stories" tab →
     "Comma-separated values (.csv)" → Publish → paste the link here.
     Do the same for the "Stats" tab. Leave '' to use the saved snapshot only. */
  STORIES_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTSD2WZNdSTqlX_WkddjtnVRGB7hQRCsuIU8IhjbCw7Fz1GUweae1whpyOvuS4xJWjB7Mx_v334pM7/pub?gid=278594384&single=true&output=csv',
  STATS_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTSD2WZNdSTqlX_WkddjtnVRGB7hQRCsuIU8IhjbCw7Fz1GUweae1whpyOvuS4xJWjB7Mx_v334pM7/pub?gid=2002935939&single=true&output=csv',

  /* Re-check the sheet every N minutes while the page is open (0 = only on load). */
  REFRESH_MINUTES: 5,

  /* 2) BUTTON LINKS: your Induction (₹89) page.
     Empty = no sign-up buttons are shown (the page never shows a button that goes nowhere). */
  LINKS: {
    induction: '',
    category: ''
  },

  /* 3) WHATSAPP: digits only with country code, e.g. '919876543210'.
     Empty = WhatsApp buttons are hidden. */
  WHATSAPP: '',

  /* 4) SAMPLE STORIES (design phase only)
     true  = categories with too few real stories are filled with clearly labelled
             "Sample story" cards from data/demo-data.js, so the layout can be reviewed.
     false = only real stories from the Google Sheet are shown. SET TO false BEFORE GOING LIVE. */
  SHOW_DEMO: true,

  /* 5) SELF-HOSTED VIDEO / AUDIO FILES
     Browsers block Google Drive files from playing inside a normal video player, so muted autoplay,
     the sound button and play/pause need the file on your own website. Map the Drive file ID
     (the long code in the Drive link) to the file in the assets/ folder, and upload assets/ next to the page.
     Videos without a file here still play, in Google Drive's own player, when the visitor taps them. */
  MEDIA_FILES: {
    '1VfWq7oNqtMpOVnRhwDMVuvmGwRQNNg5F': 'assets/arunkumar-feedback.mp4',   // ArunKumar P. · 3:38
    '1KC7cypzZWvrAmdywKX65sWw5peJKsRPa': 'assets/learner-feedback.mp4',     // learner feedback · 2:17
    '1XHxylt23V96j60sB8wNS_wEMo9b_RkH8': 'assets/sreeram-voice.m4a'         // Sreeram P. voice note · 2:24
  },

  /* 6) DISPLAY */
  NEW_DAYS: 45,     // offers newer than this get a "New" badge

  /* 7) CATEGORIES: the 5 learner backgrounds, in the order they appear on the page.
     "aliases" are the words the team may type in the sheet's Category column; they all map here.
     (The old six categories still work: "IT Upskill" and "IT → AI Switch" both go to IT Professional.)
     "joinedAs" is the "Before" line when a story has no Previous role. */
  CATEGORIES: [
    { id:'fresher', name:'Fresher', short:'Fresher', icon:'cap', joinedAs:'Fresher',
      desc:'Looking for a first job after graduation',
      aliases:['freshers','graduate','recent graduate','first job'] },

    { id:'student', name:'College Student', short:'College Student', icon:'book', joinedAs:'College student',
      desc:'Studying while still in college',
      aliases:['student','college','college students','final year','pre final year'] },

    { id:'it-pro', name:'IT Professional', short:'IT Professional', icon:'laptop', joinedAs:'IT professional',
      desc:'Working in IT and learning new skills',
      aliases:['it','it professional','it professionals','it working professional','it upskill','it upskill & promotion','upskill','promotion','ijp','leadership',
               'it → ai switch','it -> ai switch','it to ai','it → ai role switch','role switch','role switcher','role switchers','it-switch','it-upskill'] },

    { id:'nonit-switch', name:'Non-IT to IT Switch', short:'Non-IT to IT', icon:'switch', joinedAs:'Non-IT professional',
      desc:'Coming from a job outside IT',
      aliases:['non-it','nonit','non it','non-it → ai','non-it → ai switch','non-it to it','non-it to it switch','non-it professional','domain switch','domain switcher','career switch'] },

    { id:'career-gap', name:'Career Gap', short:'Career Gap', icon:'restart', joinedAs:'On a career break',
      desc:'Returning to work after a break',
      aliases:['gap','career gapper','career gappers','restart','career break'] }
  ]
};
