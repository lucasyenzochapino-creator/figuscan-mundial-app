// Uso: node tools/inyectar_v48_en_index.mjs
// Inserta los archivos V48 en index.html y cambia ?v=47 a ?v=48.
import fs from 'fs';
import path from 'path';

const indexPath = path.resolve(process.cwd(), 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('No encontré index.html en la raíz del proyecto.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(/v=47/g, 'v=48');
html = html.replace(/figuscan-v47/gi, 'figuscan-v48');

if (!html.includes('figuscan-v48-camera.css')) {
  html = html.replace(
    /<\/head>/i,
    '  <link rel="stylesheet" href="./figuscan-v48-camera.css?v=48" />\n</head>'
  );
}

if (!html.includes('figuscan-v48-camera.js')) {
  const scripts = '  <script src="./figuscan-v48-refresh.js?v=48"></script>\n  <script src="./figuscan-v48-camera.js?v=48"></script>\n';

  if (html.match(/<script[^>]+app\.js[^>]*><\/script>/i)) {
    html = html.replace(/<script[^>]+app\.js[^>]*><\/script>/i, (m) => scripts + m);
  } else {
    html = html.replace(/<\/body>/i, scripts + '</body>');
  }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Listo: index.html actualizado a V48.');
