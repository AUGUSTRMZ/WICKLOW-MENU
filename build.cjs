// Wicklow — fuente de verdad: archivos de la raíz del repositorio.
// Render publica /dist y Live Server abre /index.html. Ambos son idénticos.
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dist = path.join(root, 'dist');
const files = ['index.html', 'backstage.html', 'concepts.css', 'concepts.js', 'catalog.js'];
const images = [
  'bonifacio-aperitivos.webp', 'bonifacio-brindis.webp', 'bonifacio-cervezas.webp',
  'bonifacio-cocteles.webp', 'bonifacio-comida.webp', 'bonifacio-destilados.webp',
  'bonifacio-recomienda.webp', 'bonifacio-sinalcohol.webp', 'bonifacio-whisky.webp'
];

for (const name of files) {
  if (!fs.existsSync(path.join(root, name))) throw new Error(`Archivo faltante: ${name}`);
}
for (const name of images) {
  if (!fs.existsSync(path.join(root, 'assets', name))) throw new Error(`Imagen faltante: assets/${name}`);
}

fs.mkdirSync(dist, { recursive: true });
// Borra solamente el contenido anterior de dist; no toca /index.html ni /assets.
for (const child of fs.readdirSync(dist)) {
  fs.rmSync(path.join(dist, child), { recursive: true, force: true });
}
for (const name of files) fs.copyFileSync(path.join(root, name), path.join(dist, name));
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
console.log('✔ Wicklow compilado. Vista local: index.html | Render Publish Directory: dist');
