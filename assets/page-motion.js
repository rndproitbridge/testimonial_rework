/* Motion 14.14.0. Progressive enhancement: the complete page is readable without it. */
(function () {
  'use strict';
  const M=window.Motion;
  const supported=Boolean(M && typeof Element!=='undefined' && Element.prototype.animate && window.IntersectionObserver);
  const ease=[0.22,1,0.36,1];
  const active=new Map(), originals=new Map(), observed=new WeakSet(), gestures=new WeakSet();
  const observers=new Map(), gestureStops=new Map();
  let reduced=true, started=false, heroDone=false, scrollStops=[];
  const all=(selector,parent=document)=>Array.from(parent.querySelectorAll(selector));
  const fine=()=>window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function remember(element,keys) {
    let values=originals.get(element);if(!values){values={};originals.set(element,values);}
    keys.forEach(key=>{if(!(key in values))values[key]=element.style[key]||'';});
  }
  function restore(element) {
    const values=originals.get(element);if(values)Object.entries(values).forEach(([key,value])=>{element.style[key]=value;});
  }
  function run(element,frames,options={}) {
    if(!supported||reduced||!element)return null;
    active.get(element)?.complete();
    remember(element,Object.keys(frames));
    try {
      const control=M.animate(element,frames,{duration:0.7,ease,...options});active.set(element,control);
      control.then(()=>{if(active.get(element)===control)active.delete(element);});
      return control;
    } catch(error) {restore(element);return null;}
  }
  function enter(element,index=0,kind='standard') {
    if(reduced)return;
    const distance=window.innerWidth<701?20:36;
    const transform=kind==='metric' ? [`perspective(700px) translateY(${distance}px) rotateX(12deg)`,'perspective(700px) translateY(0px) rotateX(0deg)'] : [`translate3d(0,${distance}px,0)`,'translate3d(0,0,0)'];
    run(element,{opacity:[0.15,1],transform},{duration:kind==='metric'?0.85:0.72,delay:Math.min(index,4)*0.075});
  }
  function watch(selector,kind='standard',stagger=false) {
    all(selector).forEach((element,index)=>{
      if(observed.has(element))return;observed.add(element);
      const stop=M.inView(element,()=>{observers.delete(element);enter(element,stagger?index%5:0,kind);},{amount:0.12,margin:'0px 0px -35px 0px'});
      observers.set(element,stop);
    });
  }
  function hero() {
    if(heroDone||reduced||window.scrollY>120)return;heroDone=true;
    all('.hero-line > span').forEach((line,index)=>run(line,{transform:['translate3d(0,110%,0)','translate3d(0,0,0)'],opacity:[0.2,1]},{duration:1.05,delay:0.09+index*0.12}));
    all('.hero-copy > .eyebrow,.hero-description,.hero-secondary,.hero-copy .button-row,.hero-footnote').forEach((element,index)=>run(element,{opacity:[0.2,1],transform:['translateY(18px)','translateY(0px)']},{delay:index?0.24+index*0.07:0,duration:0.8}));
    all('.hero-story').forEach((card,index)=>{
      const angle=index===0?-5:6;
      run(card,{opacity:[0.1,1],transform:[`translate3d(0,55px,0) rotate(${angle+(index?5:-5)}deg) scale(.94)`,`translate3d(0,0,0) rotate(${angle}deg) scale(1)`]},{type:'spring',visualDuration:0.95,bounce:0.16,delay:0.2+index*0.18});
    });
    run(document.querySelector('.journey-stamp'),{opacity:[0,1],transform:['translateY(15px) rotate(0deg) scale(.92)','translateY(0px) rotate(5deg) scale(1)']},{type:'spring',visualDuration:0.8,bounce:0.2,delay:0.65});
    const path=document.querySelector('.hero-path-draw');
    if(path) {try {const control=M.animate(path,{pathLength:[0,1]},{duration:1.7,delay:0.3,ease});active.set(path,control);control.then(()=>active.delete(path));}catch(_){} }
  }
  function cleanScroll() {scrollStops.forEach(stop=>stop());scrollStops=[];}
  function bindScroll() {
    cleanScroll();if(reduced||!supported)return;
    const journey=document.querySelector('.journey-steps');
    if(journey){scrollStops.push(M.scroll(progress=>{
      journey.style.setProperty('--journey-progress',String(progress));
      all('li',journey).forEach((step,index)=>step.classList.toggle('is-reached',progress>index/5));
    },{target:journey,offset:['start 85%','end 50%']}));}
    // Decorative layers only: reading order and body copy never move with scroll.
    if(window.innerWidth>980&&fine()) {
      [['.visual-grid','.hero',55],['.next-orbit','.next-section',-70]].forEach(([selector,target,distance])=>{
        const element=document.querySelector(selector),section=document.querySelector(target);if(!element||!section)return;
        remember(element,['transform']);
        const control=M.animate(element,{transform:['translate3d(0,0px,0)',`translate3d(0,${distance}px,0)`]},{ease:'linear'});
        const stop=M.scroll(control,{target:section,offset:['start end','end start']});
        scrollStops.push(()=>{stop();control.stop();restore(element);});
      });
    }
  }
  function hover(element,frames,rest) {
    if(gestures.has(element))return;gestures.add(element);
    const stop=M.hover(element,()=>{
      if(reduced||!fine())return;
      run(element,frames,{type:'spring',visualDuration:0.28,bounce:0.12});
      return ()=>run(element,rest,{type:'spring',visualDuration:0.4,bounce:0.16});
    });gestureStops.set(element,stop);
  }
  function bindGestures() {
    all('.button').forEach(button=>{
      if(gestures.has(button))return;
      hover(button,{transform:'translateY(-3px) scale(1.015)'},{transform:'translateY(0px) scale(1)'});
      button.addEventListener('pointerdown',()=>{if(!reduced)run(button,{transform:'translateY(0px) scale(.97)'},{duration:0.12});});
      ['pointerup','pointercancel','blur'].forEach(event=>button.addEventListener(event,()=>run(button,{transform:'translateY(0px) scale(1)'},{type:'spring',visualDuration:0.3,bounce:0.12})));
    });
    all('.career-card,.review-card').forEach(card=>hover(card,{transform:'translateY(-5px)'},{transform:'translateY(0px)'}));
    all('.video-cover').forEach(cover=>{
      if(gestures.has(cover))return;gestures.add(cover);
      const stop=M.hover(cover,()=>{
        if(reduced||!fine())return;
        run(cover.querySelector('img'),{transform:'scale(1.045)'},{duration:0.65});
        run(cover.querySelector('.play-disc'),{transform:'scale(1.1)'},{type:'spring',visualDuration:0.35,bounce:0.16});
        return ()=>{run(cover.querySelector('img'),{transform:'scale(1)'},{duration:0.65});run(cover.querySelector('.play-disc'),{transform:'scale(1)'},{duration:0.3});};
      });gestureStops.set(cover,stop);
    });
  }
  function refresh() {
    if(!supported)return;
    // Release old records after a live-data rerender.
    originals.forEach((_,element)=>{if(!element.isConnected){active.get(element)?.stop();active.delete(element);originals.delete(element);}});
    observers.forEach((stop,element)=>{if(!element.isConnected){stop();observers.delete(element);}});
    gestureStops.forEach((stop,element)=>{if(!element.isConnected){stop();gestureStops.delete(element);}});
    if(!started){started=true;document.documentElement.classList.add('motion-enhanced');bindScroll();hero();}
    watch('.section-heading h2,.support-heading h2,.next-card h2');
    watch('.metric','metric',true);
    watch('.outcome-row,.background-counts button','standard',true);
    watch('.journey-steps li','standard',true);
    watch('.feature-story');
    watch('.support-items article','standard',true);
    watch('.review-card,.video-card','standard',true);
    watch('.next-card > .eyebrow,.next-card > p:not(.eyebrow),.next-card .button-row');
    bindGestures();
  }
  function results(container) {
    if(!supported||reduced||!container||container.closest('details:not([open])'))return;
    all(':scope > *',container).forEach((element,index)=>enter(element,Math.min(index,4)));
    bindGestures();
  }
  function setReduced(value) {
    reduced=Boolean(value);
    if(reduced){
      cleanScroll();active.forEach(control=>control.stop());active.clear();originals.forEach((_,element)=>restore(element));
      const journey=document.querySelector('.journey-steps');if(journey)journey.style.setProperty('--journey-progress','1');
      all('.hero-path-draw').forEach(path=>{path.style.strokeDasharray='none';path.style.strokeDashoffset='0';});
    } else if(started) {bindScroll();refresh();}
  }
  function dialog(element) {run(element,{opacity:[0,1],transform:['translateY(24px) scale(.975)','translateY(0px) scale(1)']},{type:'spring',visualDuration:0.42,bounce:0.08});}
  function closeDialog(element,done) {
    const control=run(element,{opacity:0,transform:'translateY(12px) scale(.985)'},{duration:0.16,ease:[0.4,0,1,1]});
    if(!control){done();return;}
    // The fallback also settles a close if a motion preference changes mid-animation.
    let settled=false;
    const finish=()=>{if(settled)return;settled=true;done();restore(element);};
    control.then(finish);setTimeout(finish,200);
  }
  function menu(element,open) {if(open){run(element,{opacity:[0.2,1],transform:['translateY(-10px)','translateY(0px)']},{duration:0.28});all('a',element).forEach((link,index)=>run(link,{opacity:[0,1],transform:['translateY(-6px)','translateY(0px)']},{duration:0.3,delay:index*0.035}));}}
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(started)bindScroll();},160);});
  window.addEventListener('pagehide',()=>{cleanScroll();active.forEach(control=>control.stop());active.clear();originals.forEach((_,element)=>restore(element));});
  window.addEventListener('pageshow',event=>{if(event.persisted&&!reduced)bindScroll();});
  document.getElementById('storyLibrary')?.addEventListener('toggle',event=>{if(event.target.open)results(document.getElementById('careerGrid'));});
  window.SSAnimations={refresh,results,setReduced,dialog,closeDialog,menu,supported};
})();
