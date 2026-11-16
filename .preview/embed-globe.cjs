const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const imagePath = path.join(root, 'assets', 'proitbridge-globe-hq.jpg');
const html = fs.readFileSync(htmlPath, 'utf8');
const dataUrl = 'data:image/jpeg;base64,' + fs.readFileSync(imagePath).toString('base64');
const pattern = /<img class="intro-globe"(?: src="[^"]*")? alt="">/;

if (!pattern.test(html)) throw new Error('Intro globe image element was not found.');
fs.writeFileSync(htmlPath, html.replace(pattern, `<img class="intro-globe" src="${dataUrl}" alt="">`));
