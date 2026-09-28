const fs=require('fs');
const required=['index.html','menu.html','comida.html','cervezas.html','whisky.html','cocteles.html','destilados.html','aperitivos.html','sinalcohol.html','recomienda.html','economia.html','catalog.js','app.js','style.css','refinement.css','assets/dog-real.webp'];
let ok=true;
for(const f of required){if(!fs.existsSync('dist/'+f)){console.error('MISSING',f);ok=false;}}
for(const f of ['buscar.html','compartir.html','pedido.html']){if(fs.existsSync('dist/'+f)){console.error('OBSOLETE STILL EXISTS',f);ok=false;}}
const html=required.filter(x=>x.endsWith('.html')).map(f=>fs.readFileSync('dist/'+f,'utf8')).join('\n');
if(/Lo quiero|MI PEDIDO|basket/i.test(html)){console.error('Ordering UI found');ok=false;}
if(/buscar\.html/.test(html)){console.error('Global search link found');ok=false;}
if(!/BUENA BEBIDA, BUENA COMIDA, MEJORES HISTORIAS/.test(html)){console.error('New tagline missing');ok=false;}
if(!/Estoy cuidando mi economía/.test(html)){console.error('Economy section missing');ok=false;}
if(!/Para compartir/.test(fs.readFileSync('dist/comida.html','utf8'))){console.error('Food sharing tab missing');ok=false;}
if(/data-search/.test(fs.readFileSync('dist/cervezas.html','utf8'))){console.error('Beer search should be removed');ok=false;}
if(!/data-search/.test(fs.readFileSync('dist/whisky.html','utf8'))){console.error('Whisky search missing');ok=false;}
if(!/XX Lager · 330 ml/.test(fs.readFileSync('dist/cervezas.html','utf8')) || !/XX Lager · 1 L/.test(fs.readFileSync('dist/cervezas.html','utf8'))){console.error('Beer presentations not split');ok=false;}
if(!ok) process.exit(1);
console.log('PASS: Wicklow V2 structure validated.');
