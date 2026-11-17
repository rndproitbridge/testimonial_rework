/* Data boundary: spreadsheet content is text, never executable markup. */
(function (root) {
  'use strict';
  const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean = value => String(value || '').trim().replace(/\*\*/g, '').replace(/\s*[\u2013\u2014]\s*/g, ', ');
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function safeURL(value) {
    const text = String(value || '').trim();
    if (/^assets\/[a-zA-Z0-9_./-]+$/.test(text) && !text.includes('..')) return text;
    try { const url = new URL(text); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch (_) { return ''; }
  }
  function parseCSV(input) {
    const text = String(input || '').replace(/^\uFEFF/, '');
    let rows = [], row = [], field = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        if (quoted && text[i + 1] === '"') { field += '"'; i++; }
        else if (quoted || !field) quoted = !quoted;
        else field += ch;
      } else if (ch === ',' && !quoted) { row.push(field); field = ''; }
      else if ((ch === '\n' || ch === '\r') && !quoted) {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(field); if (row.some(v => v.trim())) rows.push(row); row = []; field = '';
      } else field += ch;
    }
    if (quoted) throw new Error('Incomplete quoted CSV field');
    row.push(field); if (row.some(v => v.trim())) rows.push(row);
    if (!rows.length) throw new Error('Empty story data');
    const headers = rows.shift().map(norm);
    if (!['publish', 'type', 'name'].every(h => headers.includes(h))) throw new Error('Unexpected story columns');
    return rows.map(values => Object.fromEntries(headers.map((key, index) => [key, clean(values[index])])));
  }
  function background(value, config) {
    const key = norm(value);
    return config.BACKGROUNDS.find(group => group.id === value || group.aliases.some(alias => norm(alias) === key))?.id || 'unspecified';
  }
  function roleGroup(role, config) {
    return config.ROLE_GROUPS.find(group => group.keywords && new RegExp(group.keywords, 'i').test(role))?.id || 'technology';
  }
  function normalize(csv, config) {
    const seen = new Set();
    return parseCSV(csv).filter(row => /^(yes|true|1)$/i.test(row.publish)).map((row, index) => {
      const type = row.type.toLowerCase() === 'quote' ? 'review' : row.type.toLowerCase();
      if (!['offer','review','video','voice','proof'].includes(type)) return null;
      const masked = /^(yes|true|1)$/i.test(row.masked);
      const key = masked ? 'private' + index : norm(row.learnerid || row.name) || type + index;
      const id = type + '-' + key;
      if (seen.has(id)) return null;
      seen.add(id);
      const local = masked ? {} : config.LOCAL_ASSETS[key] || {};
      const mediaURL = safeURL(row.media);
      const mediaId = mediaURL.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || '';
      const mapped = masked ? {} : config.MEDIA_FILES[mediaId] || {};
      let cat = background(row.category, config);
      if (['arunkumarp','arunkumarperiyasamy'].includes(key)) cat = 'nonit-switch';
      const outcome = row.outcometype || (/internship/i.test(row.role + ' ' + row.tags) ? 'Internship' : /apprentice/i.test(row.role + ' ' + row.tags) ? 'Apprenticeship' : /internal|ijp/i.test(row.note + ' ' + row.tags) ? 'Internal career move' : 'Career progression');
      return {
        id, key, type, masked, cat, outcome, name: masked ? 'Name withheld' : row.name || 'PROITBRIDGE learner',
        role: row.role, roleGroup: roleGroup(row.role, config), from: row.previousrole,
        company: masked ? '' : row.company, city: masked ? '' : row.city,
        program: row.program, modules: row.modules, text: row.text, headline: row.headline,
        note: row.note, stars: Math.min(5, Math.max(0, Number(row.stars) || 0)),
        lpa: masked ? '' : row.packagelpa, date: row.offerdate, source: row.source, mentor: masked ? '' : row.mentor,
        photo: masked ? '' : safeURL(local.photo || row.photo),
        proof: masked ? '' : safeURL(local.proof || (['offer','review','proof'].includes(type) ? mediaURL : '')),
        original: masked ? '' : mediaURL,
        media: masked ? '' : safeURL(mapped.src || local.media || mediaURL),
        poster: masked ? '' : safeURL(mapped.poster || row.poster), duration: row.duration,
        featured: /^(yes|true|1)$/i.test(row.featured)
      };
    }).filter(Boolean);
  }
  function metrics(records, config) {
    const offers = records.filter(row => row.type === 'offer');
    return {
      offers: offers.length,
      employers: [...new Set(offers.map(row => row.company).filter(Boolean))],
      reviews: records.filter(row => row.type === 'review').length,
      videos: records.filter(row => row.type === 'video').length,
      groups: config.ROLE_GROUPS.map(group => ({...group, count: offers.filter(row => row.roleGroup === group.id).length}))
    };
  }
  function impact(records, config) {
    const counts = metrics(records, config), settings = config.IMPACT || {};
    const verified = settings.mode === 'verified' && settings.approved === true && String(settings.period || '').trim() && ['trained','placed','tracks','stories'].every(key => String(settings[key] || '').trim());
    if (settings.mode === 'sample' || verified) return {
      mode: verified ? 'verified' : 'sample',
      items: [[settings.trained,'Learners trained'],[settings.placed,'Learners placed'],[settings.tracks,'Learning tracks'],[settings.stories,'Success stories shared']],
      context: verified ? 'Organization-wide figures · ' + settings.period : ''
    };
    return {mode:'collection', items:[[counts.offers,'Career stories shared'],[counts.employers.length,'Named employers'],[counts.reviews,'Written learner reviews'],[counts.videos,'Video experiences']], context:'Calculated from the published records available on this page. These are story-collection counts, not organization-wide training or placement totals.'};
  }
  root.SSCore = {norm, clean, escape, safeURL, parseCSV, background, roleGroup, normalize, metrics, impact};
})(window);
