#!/usr/bin/env node
/* One canonical source. Inline scripts/styles, with local media beside the HTML. */
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../',import.meta.url));
const read = path => readFile(resolve(root,path),'utf8');
const safeScript = text => text.replace(/<\/script/gi,'<\\/script').replace(/<!--/g,'<\\!--');
export async function build({production=false}={}) {
  const scripts=['site-config.js','data/snapshot.js','assets/story-data.js','assets/vendor/motion-14.14.0.js','assets/page-motion.js','assets/success-stories.js'];
  const sources=await Promise.all(scripts.map(read));
  const context={window:{},URL};
  vm.runInNewContext(sources.slice(0,3).join('\n'),context);
  const {SS_CONFIG:config,SSCore:core,SS_SNAPSHOT:snapshot}=context.window;
  const records=core.normalize(snapshot.stories,config);
  const impact=core.impact(records,config);
  if(production && (impact.mode==='sample' || config.IMPACT.mode==='verified' && impact.mode!=='verified')) {
    throw new Error('Review figures are enabled. Use approved verified impact totals with a reporting period, or set IMPACT.mode to collection before a production build.');
  }
  let html=await read('index.html');
  const css=(await read('assets/success-stories.css')).replace(/url\(['"]?fonts\//g,'url("assets/fonts/');
  if(!html.includes('<link rel="stylesheet" href="assets/success-stories.css">'))throw new Error('Missing stylesheet marker');
  html=html.replace('<link rel="stylesheet" href="assets/success-stories.css">',()=>'<style>\n'+css+'\n</style>');
  for(const script of scripts) {
    const marker=`<script src="${script}" defer></script>`;
    if(!html.includes(marker))throw new Error('Missing source script: '+script);
    html=html.replace(marker,'');
  }
  // Inline scripts do not honor defer: append after the complete document body.
  html=html.replace('</body>',()=>scripts.map((script,index)=>`<script>\n/* ${script} */\n${safeScript(sources[index])}\n</script>`).join('\n')+'\n</body>');
  if(production)html=html.replace(/\s*<meta name="robots"[^>]*data-review-only(?:="")?>/,'');
  const media=new Set([...html.matchAll(/(?:src|href)="(assets\/[^"?#]+)"/g)].map(match=>match[1]));
  ['assets/fonts/OFL.txt','assets/vendor/MOTION-LICENSE.txt','assets/vendor/SOURCES.txt'].forEach(path=>media.add(path));
  for(const logo of Object.values(config.EMPLOYER_LOGOS||{}))media.add(logo.src);
  media.add('assets/employers/SOURCES.json');
  for(const group of Object.values(config.LOCAL_ASSETS)) for(const path of Object.values(group))if(path.startsWith('assets/'))media.add(path);
  for(const group of Object.values(config.MEDIA_FILES)) for(const path of Object.values(group))if(path.startsWith('assets/'))media.add(path);
  for(const path of media) {if(path.includes('..'))throw new Error('Invalid media path'); await readFile(resolve(root,path));}
  const backup='backup/before-manager-redesign-20261116';
  await mkdir(resolve(root,backup),{recursive:true});
  for(const [existing,archive] of [['dist/index.html','dist-index.html'],['dist/success-stories.html','dist-success-stories.html'],['godaddy-upload/SuccessStory/index.html','godaddy-index.html']]) {
    try {await copyFile(resolve(root,existing),resolve(root,backup,archive),1);}catch(error){if(!['EEXIST','ENOENT'].includes(error.code))throw error;}
  }
  for(const output of ['dist','godaddy-upload/SuccessStory']) {
    await mkdir(resolve(root,output),{recursive:true});
    await writeFile(resolve(root,output,'index.html'),html);
    for(const path of media) {const destination=resolve(root,output,path);await mkdir(dirname(destination),{recursive:true});await copyFile(resolve(root,path),destination);}
  }
  await writeFile(resolve(root,'dist/success-stories.html'),html);
  await copyFile(resolve(root,'vercel.json'),resolve(root,'dist/vercel.json'));
  const manifest={mode:production?'production':'design-review',impactMode:impact.mode,generated:new Date().toISOString(),snapshot:snapshot.generated,records:records.length,careerStories:records.filter(row=>row.type==='offer').length,files:['index.html',...media]};
  await writeFile(resolve(root,'dist/build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  await writeFile(resolve(root,'godaddy-upload/SuccessStory/build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  return manifest;
}
if(typeof process!=='undefined' && process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
  console.log(await build({production:process.argv.includes('--production')}));
}
