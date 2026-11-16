/* PROITBRIDGE Success Stories · authoritative page settings.
   Sample impact totals are visible only as clearly labelled design-review figures.
   Set mode to 'verified' with approved figures + reporting period before publication,
   or mode to 'collection' to show only calculated counts from the published stories. */
window.SS_CONFIG = {
  STORIES_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTSD2WZNdSTqlX_WkddjtnVRGB7hQRCsuIU8IhjbCw7Fz1GUweae1whpyOvuS4xJWjB7Mx_v334pM7/pub?gid=278594384&single=true&output=csv',
  STATS_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTSD2WZNdSTqlX_WkddjtnVRGB7hQRCsuIU8IhjbCw7Fz1GUweae1whpyOvuS4xJWjB7Mx_v334pM7/pub?gid=2002935939&single=true&output=csv',
  REFRESH_MINUTES: 5,
  LINKS: {
    programs: 'https://www.proitbridge.com/pricing/',
    enquiry: 'https://www.proitbridge.com/contact-us-2/'
  },
  IMPACT: {
    mode: 'sample',
    trained: '1,200+', placed: '300+', tracks: '4', stories: '50+',
    period: '', approved: false
  },
  BACKGROUNDS: [
    { id: 'student', label: 'College Student', aliases: ['college student','college','student','final year','pre final year'] },
    { id: 'fresher', label: 'Fresher', aliases: ['fresher','freshers','graduate','recent graduate'] },
    { id: 'it-pro', label: 'IT Professional', aliases: ['it upskill','it upskill & promotion','it professional','it','it → ai switch','it → ai role switch','it-switch','it-upskill','promotion','ijp','leadership','role switch'] },
    { id: 'nonit-switch', label: 'Non-IT to IT', aliases: ['nonit-switch','non-it','nonit','non it','non-it → ai','non-it → ai switch','non-it to it','non-it to it switch','non-it professional','domain switch'] },
    { id: 'career-gap', label: 'Career Gap', aliases: ['career gap','career break','career gapper','restart','gap'] }
  ],
  ROLE_GROUPS: [
    { id: 'data-science', label: 'Data Science', description: 'Data Scientist and related roles', keywords: 'data scien' },
    { id: 'ai', label: 'AI & Machine Learning', description: 'AI engineering, consulting and applied AI roles', keywords: '\\bai\\b|agentic|machine learning|\\bml\\b|\\bnlp\\b' },
    { id: 'analytics', label: 'Data Analytics', description: 'Analytics, data operations and data apprenticeships', keywords: 'analyst|analytics|data operations|hr data' },
    { id: 'technology', label: 'Technology & Leadership', description: 'Software development, technical and leadership roles', keywords: '' }
  ],
  FEATURED: ['parimalrajb','santosh','kavimalar'],
  HERO: ['parimalrajb','kavimalar'],
  STORY_COPY: {
    parimalrajb: { headline: 'From business development to data science.', intro: 'Parimalraj moved from business development into a Data Scientist role at Amvion Labs. His Advanced Data Science & AI learning covered Python, SQL and the foundations of applied AI.' },
    santosh: { headline: 'A new direction. Within the same company.', intro: 'For Santosh, the next step was within the same company: a move from QA into an AI Engineer role through an internal job posting.' },
    kavimalar: { headline: 'An analytics journey. A new chapter in France.', intro: 'Kavimalar studied Python, statistics, SQL and Power BI in the Advanced Full Data Analytics program. Her next chapter was an HR Data Apprenticeship at iMobility in France.' }
  },
  LOCAL_ASSETS: {
    parimalrajb: { photo: 'assets/parimalraj-b.jpg', proof: 'assets/proof/parimalraj-amvion.webp' },
    kavimalar: { photo: 'assets/kavimalar.jpg', proof: 'assets/proof/kavimalar-france.webp' },
    renukav: { proof: 'assets/proof/renuka-fujitsu.webp' },
    kumarjk: { proof: 'assets/proof/kumar-mphasis.webp' },
    strephin: { proof: 'assets/proof/strephin-bpo-to-ai.webp' },
    santosh: { proof: 'assets/proof/santosh-ijp.webp' },
    ramalakshmi: { proof: 'assets/proof/ramalakshmi-arcadia.webp' },
    ragavendrans: { proof: 'assets/proof/ragavendran-infosys.webp' },
    pradeeph: { proof: 'assets/proof/pradeeph-celestial.webp' },
    jeevanantham: { proof: 'assets/proof/jeevanantham-cognizant.webp' },
    sivabalang: { proof: 'assets/proof/sivabalan-rohnium.webp' },
    vijaysubramanial: { proof: 'assets/proof/vijay-nielseniq.webp' },
    mageshkumar: { proof: 'assets/reviews/magesh-kumar.webp' },
    ariarasan: { proof: 'assets/reviews/ari-arasan.webp' },
    arunkumarperiyasamy: { proof: 'assets/reviews/arunkumar-periyasamy.webp' },
    nilaravichandran: { proof: 'assets/reviews/nila-ravichandran.webp' },
    subashg: { proof: 'assets/reviews/subash-g.webp' },
    sakthij: { proof: 'assets/reviews/sakthi-j.webp' },
    tamilarasan: { proof: 'assets/reviews/tamil-arasan.webp' },
    sreeramp: { photo: 'assets/sreeram-p.jpg', media: 'assets/sreeram-voice.m4a' }
  },
  MEDIA_FILES: {
    '1VfWq7oNqtMpOVnRhwDMVuvmGwRQNNg5F': { src: 'assets/arunkumar-feedback.mp4', poster: 'assets/poster-arunkumar.jpg' },
    '1KC7cypzZWvrAmdywKX65sWw5peJKsRPa': { src: 'assets/learner-feedback.mp4', poster: 'assets/poster-feedback.jpg' },
    '1XHxylt23V96j60sB8wNS_wEMo9b_RkH8': { src: 'assets/sreeram-voice.m4a' }
  }
};
