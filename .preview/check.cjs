const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const root = path.resolve(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let browser, socket, server;
(async () => {
  server = http.createServer((req, res) => {
    const target = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    try { const data = fs.readFileSync(target); res.setHeader('Content-Type', target.endsWith('.html') ? 'text/html; charset=utf-8' : target.endsWith('.js') ? 'text/javascript' : 'application/octet-stream'); res.end(data); } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const profile = fs.mkdtempSync(path.join(require('os').tmpdir(), 'learner-ui-'));
  browser = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  browser.on('error', e => console.error(e.message));
  let port;
  for (let i=0;i<80;i++) { try { port = fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]; break; } catch {} await sleep(250); }
  if (!port) throw Error('Chrome did not expose a debugging port');
  const pages = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  socket = new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise(r => socket.addEventListener('open', r, {once:true}));
  let id=0; const pending=new Map(), errors=[];
  socket.addEventListener('message', e => { const m=JSON.parse(e.data); if(m.id) {const p=pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); } else if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ': ' + (m.params.exceptionDetails.exception?.description || '')); });
  const send=(method,params={})=>new Promise((resolve,reject)=>{console.log('CDP',method);const timer=setTimeout(()=>reject(Error('Timeout: '+method)),15000);const done=resolve;resolve=v=>{clearTimeout(timer);done(v);};const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});
  const evaluate=async expression => (await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  // Use the saved learner dataset for repeatable layout checks.
  await send('Network.setBlockedURLs',{urls:['*docs.google.com*','*drive.google.com*','*vimeo.com*']});
  await send('Page.navigate',{url:'http://127.0.0.1:' + server.address().port});
  await sleep(1500);
  for(const width of [360,390,768,1024,1440]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    await evaluate('window.scrollTo({top:0,behavior:"instant"})'); await sleep(180);
    const result=await evaluate(`JSON.stringify((()=>{const q=s=>document.querySelector(s), r=s=>q(s).getBoundingClientRect();return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,headingBottom:r('.hero-copy').bottom,videoTop:r('.hero-media').top,reviewCards:document.querySelectorAll('.rq-wrap .rq:not([aria-hidden])').length,reviewColumns:getComputedStyle(q('.rq-track')).animationName,heroOrder:getComputedStyle(q('.hero .wrap')).gridTemplateAreas,frame:!!q('.hero-branded'),overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width && r.right>innerWidth+2 && !e.closest('.rl-track,.pills,.lb,.mq');}).slice(0,8).map(e=>e.className)}})())`);
    console.log(result);
    if([390,1440].includes(width)) {
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'hero-'+width+'.png'),Buffer.from(shot.data,'base64'));
      await evaluate('document.querySelector("#testimonials").scrollIntoView({behavior:"instant"})');await sleep(150);
      const review=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'reviews-'+width+'.png'),Buffer.from(review.data,'base64'));
      await evaluate('document.querySelector(".induction-card").scrollIntoView({behavior:"instant",block:"start"})');await sleep(150);
      const formShot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'induction-'+width+'.png'),Buffer.from(formShot.data,'base64'));
    }
  }
  console.log('Interaction checks:',await evaluate(`JSON.stringify((()=>{document.querySelector('[data-cat="nonit-switch"]').click();const filtered=document.querySelector('#offersTitle').textContent;document.querySelector('.story-btn').click();const opened=document.querySelector('#lb').classList.contains('open')&&document.querySelector('main').inert;document.querySelector('#lbX').click();return {filtered,modalOpened:opened,modalClosed:!document.querySelector('main').inert,heroLearner:document.querySelector('.hero-branded .bf-bot').textContent};})())`));
  console.log('Robot interaction:',await evaluate(`JSON.stringify((()=>{document.querySelector('#robotWave').click();const greeting=document.querySelector('#robotGreeting').textContent;document.querySelector('#robotMotion').click();return {robots:document.querySelectorAll('.bot-art').length,greeting,paused:document.documentElement.classList.contains('robot-paused'),button:document.querySelector('#robotMotion').getAttribute('aria-pressed')};})())`));
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  console.log('Reduced motion:',await evaluate(`JSON.stringify({animation:getComputedStyle(document.querySelector('.bot-float')).animationName,button:document.querySelector('#robotMotion').textContent})`));
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  console.log('Review scroll:',await evaluate(`JSON.stringify((()=>{document.querySelector('[data-cat="all"]').click();const track=document.querySelector('.rq-track'),b=document.querySelector('[data-review-motion]');const animation=getComputedStyle(track).animationName;b.click();const paused=getComputedStyle(track).animationPlayState;document.querySelector('.rq-open').click();const opened=document.querySelector('#lb').classList.contains('open');document.querySelector('#lbX').click();return {rows:document.querySelectorAll('.rq-row').length,animation,paused,reviewOpens:opened}})())`));
  console.log('Induction form:',await evaluate(`JSON.stringify((()=>{const f=document.querySelector('#inductionForm'),n=f.elements.name,p=f.elements.phone;const emptyValid=f.checkValidity();n.value='Design Preview';n.dispatchEvent(new Event('input',{bubbles:true}));p.value='invalid';p.dispatchEvent(new Event('input',{bubbles:true}));const invalidPhone=f.checkValidity();p.value='+1 202 555 0100';p.dispatchEvent(new Event('input',{bubbles:true}));const valid=f.checkValidity();f.requestSubmit();return {emptyValid,invalidPhone,valid,preview:document.querySelector('#inductionStatus').textContent,quizRemoved:!document.querySelector('#finder'),formWidth:f.getBoundingClientRect().width};})())`));
  for (const width of [390,1440]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    await sleep(100);
    console.log('Career pagination:',await evaluate(`JSON.stringify((()=>{document.querySelector('[data-cat="all"]').click();const count=()=>document.querySelectorAll('#grid .pcard').length;const initial=count();document.querySelector('#more button').click();const expanded=count();document.querySelector('[data-cat="all"]').click();return {width:innerWidth,initial,expanded,reset:count(),button:document.querySelector('#more button').textContent.trim()}})())`));
  }
  console.log('Runtime errors:',JSON.stringify(errors));
  await send('Browser.close');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{socket?.close();browser?.kill();server?.close();});
