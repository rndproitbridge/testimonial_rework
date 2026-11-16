(function () {
  'use strict';
  const C = window.SS_CONFIG, D = window.SSCore, e = D.escape;
  const $ = id => document.getElementById(id);
  const state = {records:[], source:'Saved stories', moreReviews:false, opener:null, reduced:false, pending:null};
  const catLabel = id => C.BACKGROUNDS.find(cat => cat.id === id)?.label || 'Background not specified';
  const initial = name => name.split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join('').toUpperCase();
  const excerpt = (text, length = 300) => text.length > length ? text.slice(0,length).replace(/\s+\S*$/, '') + '…' : text;
  const fact = (label, value, full = false) => value ? `<div class="feature-fact${full ? ' full' : ''}"><span>${e(label)}</span><p>${e(value)}</p></div>` : '';
  const recordsOf = type => state.records.filter(row => row.type === type);
  function person(row) {
    return `<div class="feature-mini-person">${row.photo ? `<img src="${e(row.photo)}" width="48" height="48" alt="" loading="lazy">` : `<span class="initial-avatar" aria-hidden="true">${e(initial(row.name))}</span>`}<div><strong>${e(row.name)}</strong><p>${e(row.role || catLabel(row.cat))}</p></div></div>`;
  }
  function feature(row, index) {
    const copy = C.STORY_COPY[row.key] || {headline:row.headline || row.role, intro:row.company ? `${row.name} shares a career step at ${row.company}.` : row.note};
    const lead = index === 0 && row.photo;
    return `<article class="feature-story${lead ? ' is-lead' : ''}">${lead ? `<div class="feature-portrait"><img src="${e(row.photo)}" width="640" height="640" alt="${e(row.name)}" loading="lazy"><div class="portrait-name"><strong>${e(row.name)}</strong><span>${e(row.role)}${row.company ? ' · ' + e(row.company) : ''}</span></div></div>` : ''}<div class="feature-content"><div class="feature-meta"><span>JOURNEY ${String(index+1).padStart(2,'0')}</span><span class="outcome-type">${e(row.outcome)}</span></div><h3>${e(copy.headline)}</h3><p class="feature-description">${e(copy.intro)}</p><div class="feature-facts">${fact(row.from ? 'Starting point' : 'Learning track', row.from || row.program)}${fact('Next chapter', row.role + (row.company ? ' · ' + row.company : ''))}${fact(row.from ? 'Learning focus' : 'Skills studied', row.modules || (row.key === 'santosh' ? 'RAG, Word2Vec and related concepts, mentioned in his feedback.' : row.program), true)}</div>${row.text ? `<blockquote class="feature-quote">“${e(row.text)}”</blockquote>` : ''}${!lead ? person(row) : ''}<div class="feature-actions"><button class="text-link" type="button" data-story="${e(row.id)}">Read the shared story <span aria-hidden="true">↗</span></button><span>${row.proof ? 'Original shared record available' : 'Learner-shared experience'}</span></div></div></article>`;
  }
  function renderImpact() {
    const counts = D.metrics(state.records,C), impact = D.impact(state.records,C);
    $('sampleNotice').hidden = impact.mode !== 'sample';
    $('metricGrid').innerHTML = impact.items.map(([value,label],i) => `<div class="metric"><span class="metric-index">0${i+1}</span><strong class="metric-value">${e(value)}</strong><span class="metric-label">${e(label)}</span></div>`).join('');
    $('impactContext').textContent = impact.context;
    $('collectionNote').textContent = `On this page: ${counts.offers} career stories · ${counts.reviews} written reviews · ${counts.videos} video experiences. Each format is counted separately; these are not unique-learner totals.`;
    $('outcomeList').innerHTML = counts.groups.map((group,i) => `<button type="button" class="outcome-row" data-role="${e(group.id)}" aria-label="Explore ${group.count} ${e(group.label)} career stories"><span class="outcome-index">0${i+1}</span><span class="outcome-label"><strong>${e(group.label)}</strong><span class="outcome-description">${e(group.description)}</span></span><span class="outcome-count">${group.count}<small>${group.count === 1 ? 'story' : 'stories'}</small></span><span class="outcome-arrow" aria-hidden="true">↗</span></button>`).join('');
    $('employerNames').innerHTML = counts.employers.map(name => `<span>${e(name)}</span>`).join('');
    const backgrounds = [...C.BACKGROUNDS,{id:'unspecified',label:'Not specified'}];
    $('backgroundCounts').innerHTML = backgrounds.map(group => ({...group,count:recordsOf('offer').filter(row => row.cat === group.id).length})).filter(group => group.count).map(group => `<button type="button" data-background="${e(group.id)}"><strong>${group.count}</strong><span>${e(group.label)}</span><span aria-hidden="true">↗</span></button>`).join('');
  }
  function renderLibrary() {
    const background = $('backgroundFilter').value, role = $('roleFilter').value;
    const offers = recordsOf('offer');
    const selected = offers.filter(row => (background === 'all' || row.cat === background) && (role === 'all' || row.roleGroup === role));
    $('librarySummary').textContent = `Explore all ${offers.length} career stories`;
    $('filterStatus').textContent = `${selected.length} of ${offers.length} career stories${background !== 'all' ? ' · ' + catLabel(background) : ''}${role !== 'all' ? ' · ' + C.ROLE_GROUPS.find(group => group.id === role)?.label : ''}`;
    $('careerGrid').innerHTML = selected.length ? selected.map(row => `<article class="career-card"><span class="career-background">${e(catLabel(row.cat))}</span><h3>${e(row.name)}</h3><p class="career-role">${e(row.role)}</p><p class="career-company">${e(row.company || row.outcome)}</p>${row.from ? `<p class="career-from">Previously: ${e(row.from)}</p>` : ''}<button type="button" class="text-link" data-story="${e(row.id)}">Read story <span aria-hidden="true">↗</span></button></article>`).join('') : '<div class="empty-state"><h3>No published stories for this combination yet.</h3><p>Try another background or career path.</p><button type="button" class="text-link" data-reset>Show all stories ↗</button></div>';
    if(!state.reduced) $('careerGrid').animate?.([{opacity:0.7,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
  }
  function renderReviews() {
    const reviews = recordsOf('review');
    $('reviewGrid').innerHTML = reviews.slice(0, state.moreReviews ? reviews.length : 3).map(row => `<article class="review-card">${row.stars ? `<div class="review-stars" aria-label="${row.stars} out of 5 stars">${'★'.repeat(Math.floor(row.stars))}<span aria-hidden="true">${'☆'.repeat(5-Math.floor(row.stars))}</span></div>` : ''}<blockquote class="review-text">“${e(excerpt(row.text))}”</blockquote><div class="review-person"><span class="initial-avatar" aria-hidden="true">${e(initial(row.name))}</span><div><strong>${e(row.name)}</strong><span>${e(catLabel(row.cat))}</span></div></div><div class="review-actions"><span>${e(row.source || 'Learner')} review excerpt</span><button class="text-link" type="button" data-story="${e(row.id)}">Read full review <span aria-hidden="true">↗</span></button></div></article>`).join('');
    $('reviewMore').hidden = reviews.length <= 3;
    $('reviewMore').setAttribute('aria-expanded', String(state.moreReviews));
    $('reviewMore').textContent = state.moreReviews ? 'Show fewer reviews ↑' : `Read ${reviews.length - 3} more learner reviews ↓`;
  }
  function renderMedia() {
    $('videoGrid').innerHTML = recordsOf('video').map(row => `<article class="video-card"><button type="button" class="video-cover" data-video="${e(row.id)}" aria-label="Play ${e(row.name)} video${row.duration ? ', ' + e(row.duration) : ''}">${row.poster ? `<img src="${e(row.poster)}" alt="" width="1280" height="720" loading="lazy">` : ''}<span class="play-disc" aria-hidden="true">▶</span>${row.duration ? `<span class="duration">${e(row.duration)}</span>` : ''}</button><h4>${e(row.headline || row.name)}</h4><p>${e(row.name)}${row.cat !== 'unspecified' ? ' · ' + e(catLabel(row.cat)) : ''}</p><button type="button" class="text-link" data-video="${e(row.id)}">Watch the learner experience <span aria-hidden="true">↗</span></button></article>`).join('');
    $('voiceNotes').innerHTML = recordsOf('voice').filter(row => /\.(m4a|mp3|wav|ogg)(\?|$)/i.test(row.media)).map(row => `<article class="voice-card">${row.photo ? `<img src="${e(row.photo)}" width="64" height="64" alt="" loading="lazy">` : ''}<div><strong>${e(row.name)}</strong><p>A learner’s voice note${row.duration ? ' · ' + e(row.duration) : ''}</p></div><audio controls preload="none" aria-label="Voice note from ${e(row.name)}"><source src="${e(row.media)}" type="audio/mp4">Your browser cannot play this audio. <a href="${e(row.media)}">Open the voice note</a>.</audio></article>`).join('');
  }
  function render() {
    renderImpact();
    const offers = recordsOf('offer');
    const featured = C.FEATURED.map(key => offers.find(row => row.key === key)).filter(Boolean);
    $('featuredStories').innerHTML = featured.map(feature).join('') || '<p>More learner journeys will be shared here soon.</p>';
    // Honor withdrawals and masking in refreshed data, including the initial hero.
    document.querySelectorAll('.hero-story').forEach((card,index) => {
      const row = offers.find(item => item.key === C.HERO[index]);
      card.hidden = !row || row.masked;
      if (row) {
        const img = card.querySelector('img'); if (row.photo) img.src = row.photo;
        img.alt = row.name;
        card.querySelector('.hero-story-caption strong').textContent = row.role + '.';
        card.querySelector('.hero-story-caption p').textContent = row.name + (row.company ? ' · ' + row.company : '');
        card.querySelector('.hero-story-caption > span').textContent = row.from ? 'FROM ' + row.from.toUpperCase() : row.city ? 'A NEW CHAPTER IN ' + row.city.toUpperCase() : 'A LEARNER JOURNEY';
      }
    });
    renderLibrary(); renderReviews(); renderMedia(); setupReveals(); diagnostics();
  }
  function diagnostics(error = '') {
    if (!new URLSearchParams(location.search).has('check')) return;
    $('dataCheck').hidden = false;
    $('dataCheck').textContent = `Data: ${state.source}. ${state.records.length} published records. Impact mode: ${D.impact(state.records,C).mode}. ${error}`;
  }
  function stopMedia() {
    document.querySelectorAll('video,audio').forEach(media => { media.pause(); });
  }
  function openDialog(row, video = false) {
    state.opener = document.activeElement;
    stopMedia();
    $('dialogEyebrow').textContent = video ? 'LEARNER VIDEO' : row.type === 'review' ? 'LEARNER REVIEW' : 'LEARNER JOURNEY';
    let body = `<div class="dialog-body"><h2 id="dialogTitle">${e(row.name)}</h2><p class="dialog-sub">${e(video ? row.headline : row.type === 'review' ? catLabel(row.cat) : row.role)}${row.company ? ' · ' + e(row.company) : ''}</p>`;
    if (video) {
      let player = '';
      if (/\.(mp4|webm|mov)(\?|$)/i.test(row.media)) player = `<video controls playsinline preload="metadata"${row.poster ? ` poster="${e(row.poster)}"` : ''} aria-label="${e(row.name)} learner video"><source src="${e(row.media)}" type="video/mp4"></video>`;
      else {
        const url = new URL(row.media || 'https://invalid.invalid');
        let embed = '';
        if (url.hostname === 'drive.google.com') { const id = url.pathname.match(/\/d\/([\w-]+)/)?.[1]; if (id) embed = `https://drive.google.com/file/d/${id}/preview`; }
        if (['youtube.com','www.youtube.com','youtu.be'].includes(url.hostname)) { const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v'); if (/^[\w-]{11}$/.test(id || '')) embed = `https://www.youtube-nocookie.com/embed/${id}`; }
        if (embed) player = `<iframe src="${e(embed)}" title="${e(row.name)} learner video" allow="fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      }
      body += `<div class="dialog-media">${player || '<p>This video is available through the original source below.</p>'}</div><p class="dialog-caption">Playback is optional. Use the player controls to start, pause or adjust the volume.</p>`;
    } else {
      const details = [['Starting point',row.from],['Learning program',row.program],['Skills / modules',row.modules],['Career outcome',row.type === 'offer' ? row.role : ''],['Employer',row.company],['Location',row.city],['Mentor',row.mentor],['Package shared (LPA)',row.lpa ? String(Number(row.lpa) || row.lpa) : ''],['Offer date as shared',row.date],['Shared context',row.note]];
      body += `<dl class="dialog-facts">${details.filter(([,value])=>value).map(([label,value]) => `<div${label === 'Skills / modules' || label === 'Learning program' ? ' class="full"' : ''}><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`;
      if (row.text) body += `<blockquote class="dialog-quote">“${e(row.text)}”</blockquote>`;
      if (row.proof && /\.(webp|png|jpe?g)(\?|$)/i.test(row.proof)) body += `<p class="dialog-caption">The original shared ${row.type === 'review' ? 'review' : 'record'}</p><a class="dialog-proof-link" href="${e(row.proof)}" target="_blank" rel="noopener noreferrer" aria-label="Open shared record image in a new tab"><img class="dialog-proof" src="${e(row.proof)}" alt="Shared ${e(row.type === 'review' ? 'review' : 'career record')} from ${e(row.name)}" loading="lazy"></a>`;
      if (row.masked) body += '<p class="dialog-caption">Personal identifying details have been withheld at the learner’s request.</p>';
    }
    if (row.original) body += `<p><a class="text-link" href="${e(row.original)}" target="_blank" rel="noopener noreferrer">Open the original source <span aria-hidden="true">↗</span><span class="sr-only"> (new tab)</span></a></p>`;
    body += '</div>';
    $('dialogContent').innerHTML = body;
    if (!$('storyDialog').open) $('storyDialog').showModal();
    document.body.classList.add('dialog-open');
    $('storyDialog').scrollTop = 0;
    $('dialogClose').focus();
    $('dialogContent').querySelectorAll('img,video').forEach(media => media.addEventListener('error', () => {
      if (media.nextElementSibling?.classList.contains('dialog-error')) return;
      const notice = document.createElement('p'); notice.className='dialog-error'; notice.textContent='This media could not be loaded. Please use the original source link below.'; media.after(notice);
    }, {once:true}));
  }
  $('dialogClose').addEventListener('click', () => $('storyDialog').close());
  $('storyDialog').addEventListener('click', event => { if (event.target === $('storyDialog')) { const box=event.target.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.target.close(); } });
  $('storyDialog').addEventListener('close', () => { stopMedia(); document.body.classList.remove('dialog-open'); $('dialogContent').innerHTML=''; state.opener?.focus(); if (state.pending) { state.records=state.pending; state.pending=null; render(); } });
  document.addEventListener('play', event => { document.querySelectorAll('video,audio').forEach(media => { if(media !== event.target) media.pause(); }); }, true);
  function applyPending() { if(state.pending&&!$('storyDialog').open&&Array.from(document.querySelectorAll('audio,video')).every(media=>media.paused)){state.records=state.pending;state.pending=null;render();} }
  document.addEventListener('ended',applyPending,true);
  document.addEventListener('pause',applyPending,true);
  document.addEventListener('click', event => {
    const story = event.target.closest('[data-story],[data-video]');
    if (story) { const row=state.records.find(item=>item.id === (story.dataset.story || story.dataset.video)); if(row) openDialog(row,Boolean(story.dataset.video)); }
    const role = event.target.closest('[data-role]');
    if (role) { $('roleFilter').value=role.dataset.role; $('backgroundFilter').value='all'; $('storyLibrary').open=true; renderLibrary(); $('storyLibrary').scrollIntoView({behavior:state.reduced?'auto':'smooth',block:'start'}); $('roleFilter').focus({preventScroll:true}); }
    const background = event.target.closest('[data-background]');
    if (background) { $('backgroundFilter').value=background.dataset.background; $('roleFilter').value='all'; $('storyLibrary').open=true; renderLibrary(); $('storyLibrary').scrollIntoView({behavior:state.reduced?'auto':'smooth',block:'start'}); $('backgroundFilter').focus({preventScroll:true}); }
    if(event.target.closest('[data-reset]')) { $('roleFilter').value='all'; $('backgroundFilter').value='all'; renderLibrary(); $('backgroundFilter').focus(); }
  });
  $('backgroundFilter').innerHTML += C.BACKGROUNDS.map(group=>`<option value="${e(group.id)}">${e(group.label)}</option>`).join('') + '<option value="unspecified">Background not specified</option>';
  $('roleFilter').innerHTML += C.ROLE_GROUPS.map(group=>`<option value="${e(group.id)}">${e(group.label)}</option>`).join('');
  ['backgroundFilter','roleFilter'].forEach(id=>$(id).addEventListener('change',renderLibrary));
  $('reviewMore').addEventListener('click',()=>{state.moreReviews=!state.moreReviews; renderReviews(); if(!state.moreReviews) $('reviewGrid').scrollIntoView({behavior:state.reduced?'auto':'smooth',block:'start'});});
  function menu(open) { $('mobileNav').hidden=!open; $('menuToggle').setAttribute('aria-expanded',String(open)); $('menuToggle').setAttribute('aria-label',open?'Close navigation':'Open navigation'); }
  $('menuToggle').addEventListener('click',()=>menu($('mobileNav').hidden));
  $('mobileNav').addEventListener('click',event=>{if(event.target.closest('a'))menu(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('mobileNav').hidden){menu(false);$('menuToggle').focus();}});
  window.addEventListener('resize',()=>{if(window.innerWidth>980)menu(false);});
  const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  let preferred=false; try {preferred=localStorage.getItem('ss-reduce-motion')==='true';} catch (_) {}
  function applyMotion() { state.reduced=preferred||motionQuery.matches; document.documentElement.classList.toggle('reduced-motion',state.reduced); $('motionToggle').setAttribute('aria-pressed',String(state.reduced)); $('motionToggle').textContent=state.reduced?'Reduced motion on ◐':'Reduce motion ◐'; }
  $('motionToggle').addEventListener('click',()=>{preferred=!preferred;try{localStorage.setItem('ss-reduce-motion',String(preferred));}catch(_){} applyMotion(); if(motionQuery.matches)$('motionToggle').textContent='Reduced motion · system setting';});
  motionQuery.addEventListener?.('change',applyMotion); applyMotion();
  let revealObserver;
  function setupReveals() {
    if (!('IntersectionObserver' in window)) return;
    if (!revealObserver) revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');revealObserver.unobserve(entry.target);}});},{threshold:0.1});
    document.querySelectorAll('.section-heading,.feature-story,.support-items article,.journey-steps').forEach(el=>{if(!el.classList.contains('reveal-ready')){el.classList.add('reveal-ready');revealObserver.observe(el);}});
  }
  let ticking=false;
  function progress() { const span=document.documentElement.scrollHeight-window.innerHeight; $('readingProgress').style.transform=`scaleX(${span>0?Math.min(1,Math.max(0,window.scrollY/span)):0})`; $('siteHeader').classList.toggle('scrolled',window.scrollY>20); ticking=false; }
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(progress);}},{passive:true}); progress();
  if ('IntersectionObserver' in window) { const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('.desktop-nav a').forEach(link=>{const active=link.getAttribute('href')==='#'+entry.target.id; if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}),{rootMargin:'-20% 0px -50% 0px'}); ['impact','journey','stories','voices'].forEach(id=>navObserver.observe($(id))); }
  document.querySelectorAll('[data-link]').forEach(link=>{const url=D.safeURL(C.LINKS[link.dataset.link]);if(url)link.href=url;});
  $('year').textContent=String(new Date().getFullYear());
  try { state.records=D.normalize(window.SS_SNAPSHOT.stories,C); } catch(error) { diagnostics(error.message); }
  render();
  function legacyBackgroundLink() {
    const key=(location.hash||'').slice(1);
    const aliases={'it-switch':'it-pro','it-upskill':'it-pro',nonit:'nonit-switch',gap:'career-gap'};
    const background=aliases[key]||key;
    if(C.BACKGROUNDS.some(group=>group.id===background)) { $('storyLibrary').open=true;$('backgroundFilter').value=background;$('roleFilter').value='all';renderLibrary();$('storyLibrary').scrollIntoView({behavior:'auto',block:'start'}); }
  }
  legacyBackgroundLink();window.addEventListener('hashchange',legacyBackgroundLink);
  // Saved records keep the page useful offline. Only replace them after a valid response.
  async function refresh() {
    if (!/^https?:$/.test(location.protocol) || document.hidden) return;
    const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),10000);
    try {
      const response=await fetch(C.STORIES_CSV,{signal:controller.signal,cache:'no-store'});
      if(!response.ok)throw new Error('Story feed temporarily unavailable');
      const csv=await response.text();
      const next=D.normalize(csv,C);
      state.source='Live published stories';
      if(JSON.stringify(next)!==JSON.stringify(state.records)) {
        if($('storyDialog').open||Array.from(document.querySelectorAll('audio,video')).some(media=>!media.paused))state.pending=next;
        else {state.records=next;render();}
      }
      diagnostics();
    } catch(error) { diagnostics('Using saved stories; live refresh unavailable.'); }
    finally {clearTimeout(timer);}
  }
  refresh();
  setInterval(refresh,Math.max(1,C.REFRESH_MINUTES||5)*60000);
})();
