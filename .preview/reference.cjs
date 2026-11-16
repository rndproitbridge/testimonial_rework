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

  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'https://www.proitbridge.com/'});
  await sleep(15000);
  console.log('Elementor tokens:',await evaluate(`JSON.stringify([...document.styleSheets].filter(x=>/post-(6|5085)\\.css/.test(x.href||'')).map(x=>{try{return {url:x.href,css:[...x.cssRules].map(r=>r.cssText).join('')}}catch{return {url:x.href}}}))`));
  console.log('Brand styles:',await evaluate(`JSON.stringify((()=>{const visible=e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height;return {title:document.title,fonts:[...new Set([...document.querySelectorAll('h1,h2,h3,p,a')].filter(visible).map(e=>getComputedStyle(e).fontFamily))],headings:[...document.querySelectorAll('h1,h2,h3')].filter(visible).slice(0,14).map(e=>{const c=getComputedStyle(e);return {text:e.textContent.slice(0,85),font:c.fontFamily,size:c.fontSize,weight:c.fontWeight,color:c.color}}),buttons:[...document.querySelectorAll('a.elementor-button')].filter(visible).slice(0,8).map(e=>{const c=getComputedStyle(e);return {text:e.textContent.trim(),bg:c.backgroundColor,border:c.borderRadius,color:c.color}}),colors:[...document.querySelectorAll('section,.e-con')].filter(visible).slice(0,25).map(e=>({bg:getComputedStyle(e).backgroundColor,image:getComputedStyle(e).backgroundImage})),styles:[...document.querySelectorAll('link[rel="stylesheet"]')].map(e=>e.href)}})())`));
  for(const [name,y] of [['top',0],['middle',1100],['lower',2400]]) {
    await evaluate('window.scrollTo({top:'+y+',behavior:"instant"})');await sleep(600);
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'reference-'+name+'.png'),Buffer.from(shot.data,'base64'));
  }
  await send('Browser.close');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{socket?.close();browser?.kill();server?.close();});
