/* Motion integration contracts using a controlled adapter, not a browser renderer. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>readFile(resolve(root,name),'utf8');
export async function validateMotion(){
  const {parseHTML}=await import(pathToFileURL(resolve(root,'.preview/validation/linkedom.mjs')).href);
  const html=await read('index.html'), code=await read('assets/page-motion.js'),css=await read('assets/success-stories.css');
  const checks=[];const check=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
  const vendor={queueMicrotask};vm.runInNewContext(await read('assets/vendor/motion-14.14.0.js'),vendor);
  check('Pinned Motion runtime exposes all required functions',['animate','inView','hover','scroll'].every(name=>typeof vendor.Motion[name]==='function'));
  check('All headings and body copy use Sora',css.includes("--heading:'Sora'")&&css.includes("--body:'Sora'")&&!css.includes('Plus Jakarta'));
  check('Brand font is local and preloaded',html.includes('rel="preload" href="assets/fonts/sora-brand.woff2"')&&!html.includes('fonts.googleapis'));
  check('Font is a valid WOFF2 container',(await readFile(resolve(root,'assets/fonts/sora-brand.woff2'))).subarray(0,4).toString()==='wOF2');
  check('Built CSS resolves the local font path',(await read('dist/index.html')).includes('url("assets/fonts/sora-brand.woff2")'));
  const {window,document}=parseHTML(html);
  const calls=[], views=new Map(),hoverHandlers=new Map(),scrollBindings=[];
  const settle=async()=>{calls.filter(call=>!call.stopped).forEach(call=>call.control.complete());await Promise.resolve();};
  window.Element.prototype.animate=function(){};
  window.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
  window.matchMedia=query=>({matches:query.includes('hover'),addEventListener(){}});
  window.innerWidth=1280;window.scrollY=0;window.innerHeight=900;
  window.Motion={
    animate(element,frames,options){
      const call={element,frames,options,stopped:false,completed:false};let resolveDone;
      const finished=new Promise(resolve=>{resolveDone=resolve;});
      const control={then:fn=>finished.then(fn),stop(){call.stopped=true;},complete(){
        if(call.completed)return;call.completed=true;
        for(const [key,value] of Object.entries(frames))element.style[key]=Array.isArray(value)?value[value.length-1]:value;
        resolveDone();
      }};call.control=control;calls.push(call);return control;
    },
    inView(element,callback){views.set(element,callback);return ()=>views.delete(element);},
    hover(element,callback){hoverHandlers.set(element,callback);return ()=>hoverHandlers.delete(element);},
    scroll(subject,options){const binding={subject,options,stopped:false};scrollBindings.push(binding);if(typeof subject==='function')subject(0.4);return ()=>{binding.stopped=true;};}
  };
  const context={window,document,Element:window.Element,setTimeout,clearTimeout};
  vm.runInNewContext(code,context);const A=window.SSAnimations;
  A.setReduced(false);A.refresh();
  check('Motion enhancement activates only with supported APIs',A.supported&&document.documentElement.classList.contains('motion-enhanced'));
  const titleCalls=calls.filter(call=>call.element.matches('.hero-line > span'));
  check('Three headline lines enter in sequence',titleCalls.length===3&&titleCalls[0].options.delay<titleCalls[1].options.delay&&titleCalls[1].options.delay<titleCalls[2].options.delay);
  check('Photo entrances use spring transitions',calls.filter(call=>call.element.matches('.hero-story')&&call.options.type==='spring').length===2);
  check('The decorative path is drawn once',calls.some(call=>call.element.matches('.hero-path-draw')&&call.frames.pathLength?.[1]===1));
  check('Reading sections and journey steps register viewport reveals',[...views.keys()].some(element=>element.matches('.section-heading h2'))&&[...views.keys()].filter(element=>element.matches('.journey-steps li')).length===5);
  check('Journey line follows scroll progress',document.querySelector('.journey-steps').style.getPropertyValue('--journey-progress')==='0.4');
  check('Desktop parallax affects decorative layers only',scrollBindings.filter(binding=>typeof binding.subject!=='function').length===2);
  await settle();
  const button=document.querySelector('.button');const leave=hoverHandlers.get(button)();
  check('Button hover uses a spring',calls.at(-1).element===button&&calls.at(-1).options.type==='spring');
  leave();await settle();
  const library=document.getElementById('storyLibrary'),grid=document.getElementById('careerGrid');
  grid.innerHTML='<article class="career-card">One</article><article class="career-card">Two</article>';
  const beforeHidden=calls.length;A.results(grid);
  check('Collapsed story library does not waste animation work',calls.length===beforeHidden);
  library.setAttribute('open','');A.results(grid);
  check('Filter results animate with a stagger',calls.slice(beforeHidden).length===2&&calls.at(-1).options.delay>calls.at(-2).options.delay);
  A.setReduced(true);
  check('Reduced motion stops every scroll binding',scrollBindings.every(binding=>binding.stopped));
  check('Reduced motion restores readable headline styles',document.querySelector('.hero-line > span').style.transform==='');
  check('Reduced motion stops running result animations',calls.slice(beforeHidden).every(call=>call.stopped));
  const reducedCount=calls.length;A.results(grid);A.dialog(document.getElementById('storyDialog'));A.menu(document.getElementById('mobileNav'),true);
  check('No decorative animations start while reduced motion is on',calls.length===reducedCount);
  let closed=false;A.closeDialog(document.getElementById('storyDialog'),()=>{closed=true;});
  check('Reduced-motion dialog closes immediately',closed);
  A.setReduced(false);A.refresh();
  const countBeforeRepeat=calls.filter(call=>call.element.matches('.hero-line > span')).length;
  A.refresh();check('Data refresh does not replay the hero',calls.filter(call=>call.element.matches('.hero-line > span')).length===countBeforeRepeat);
  let animatedClose=false;A.dialog(document.getElementById('storyDialog'));A.closeDialog(document.getElementById('storyDialog'),()=>{animatedClose=true;});
  await settle();check('Animated close completes its functional callback',animatedClose);
  const previousViews=views.size;
  const oldCard=document.createElement('article');oldCard.className='review-card';document.getElementById('reviewGrid').append(oldCard);A.refresh();oldCard.remove();A.refresh();
  check('Live refresh releases removed-card observers and gestures',!views.has(oldCard)&&!hoverHandlers.has(oldCard)&&views.size===previousViews);
  window.dispatchEvent(new window.Event('pagehide'));check('Page lifecycle cleanup releases scroll effects',scrollBindings.every(binding=>binding.stopped));
  A.setReduced(true);
  const oldMotion=window.Motion;window.Motion=undefined;vm.runInNewContext(code,context);
  check('Missing runtime keeps the page functional without enhancements',window.SSAnimations.supported===false);window.Motion=oldMotion;
  const report={passed:checks.length,checks,limitations:['Motion control flow checked using a controlled DOM adapter. Real-browser rendering, spring appearance, scroll smoothness and pointer behavior require visual review.']};
  await writeFile(resolve(root,'.preview/validation/motion-report.json'),JSON.stringify(report,null,2)+'\n');return report;
}
if(typeof process!=='undefined'&&process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)console.log(await validateMotion());
