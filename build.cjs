const fs=require('fs');
const original=require('./catalog.json');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sharing=original.comida.items.filter(p=>/Aceitunas|Papas|Nachos/i.test(p.name));
const categories=[
 {id:'comida',title:'Tengo hambre',sub:'Hamburguesas · Platos · Pizzas · Postres',intro:'El hambre no se negocia.',items:[original.recomienda.items[0],...original.comida.items.filter(p=>!sharing.includes(p))]},
 {id:'compartir',title:'Para compartir',sub:'Alitas · Boneless · Papas · Nachos',intro:'Para compartir. O para decir que ibas a compartir.',items:[...original.recomienda.items.slice(1),...sharing]},
 {id:'cervezas',title:'Dame una cerveza',sub:'Barril · Nacionales · Importadas',intro:'Empieza con una. Después negociamos.',items:original.cervezas.items},
 {id:'whisky',title:'Hoy vamos en serio',sub:'Whisky & Whiskey · Bourbon',intro:'No hace falta saber. Hace falta empezar.',items:original.whisky.items},
 {id:'cocteles',title:'Quiero algo peligroso',sub:'Coctelería Wicklow · Clásicos · De autor',intro:'Recetas serias para gente que no vino a serlo.',items:original.cocteles.items},
 {id:'destilados',title:'Sin rodeos',sub:'Tequila · Mezcal · Ron · Gin',intro:'45 ml. Pequeños en volumen, grandes en conversación.',items:original.destilados.items},
 {id:'aperitivos',title:'Antes o después',sub:'Aperitivos · Vinos · Licores',intro:'Para abrir el apetito o alargar la sobremesa.',items:original.aperitivos.items},
 {id:'sinalcohol',title:'Hoy me porto bien',sub:'Sin alcohol · Café · Sodas',intro:'Sin alcohol. Sin excusas para irte temprano.',items:original.sinalcohol.items}
];
for(const c of categories)for(const p of c.items){
 p.category=c.id;
 p.options=p.price.split(' · ').map((s,i)=>({
  id:i,
  label:s.replace(/\$[\d,]+/,'').trim()||'Porción',
  price:Number(s.match(/\$([\d,]+)/)[1].replace(/,/g,''))
 }));
 if(!p.group){
  p.group=c.id==='comida'?(/Hamburguesa/.test(p.name)?'Hamburguesas':/Pizza|Peperoni/.test(p.name)?'Pizzas':/Cake/.test(p.name)?'Postres':'Platos'):
   c.id==='compartir'?(/Wings|Boneless/.test(p.name)?'Alitas y boneless':'Entradas'):'';
 }
}
const all=categories.flatMap(c=>c.items);
fs.writeFileSync('dist/catalog.js','window.WICKLOW='+JSON.stringify({categories:categories.map(({items,...c})=>({...c,count:items.length})),items:all})+';');
const arrow='<span aria-hidden="true">↗</span>';
const mark='<span class="wicklow-mark"><img src="assets/wicklow-logo.jpg" alt="Wicklow Irish Pub"></span>';
const header=(back,home=false)=>`<header class="topbar">${back?`<a class="icon-button" href="${back}" aria-label="Volver">←</a>`:'<span class="brand-star" aria-hidden="true">♣</span>'}<a class="brand" href="index.html" aria-label="Wicklow, bienvenida">${mark}</a>${home?'<span class="brand-star" aria-hidden="true">♣</span>':'<a class="icon-button search-icon" href="buscar.html" aria-label="Buscar en toda la carta"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg></a>'}</header>`;
const footer=`<footer><p>COME · BRINDA · PIDE LA PENÚLTIMA</p><span>Wicklow Irish Pub® · Precios en MXN</span><small>Menú de consulta. Consumo de alcohol solamente con alimentos. Evita el exceso.</small></footer>`;
const head=(title)=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0c1e17"><title>${esc(title)} · Wicklow Irish Pub</title><meta name="description" content="La carta de Wicklow: comida, cervezas, coctelería y whisky. Elige lo que se te antoja."><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23143d2b'/%3E%3Ctext x='16' y='24' text-anchor='middle' font-size='25' font-family='serif' fill='%23eedfc4'%3EW%3C/text%3E%3C/svg%3E"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="refinement.css"><script defer src="catalog.js"></script><script defer src="app.js"></script></head>`;
const save=(file,title,body,cls='')=>fs.writeFileSync('dist/'+file,head(title)+`<body class="${cls}"><div class="pub">${body}${footer}</div></body></html>`);
const tile=(c,i)=>`<a class="category-card" href="${c.id}.html" style="--delay:${i%2*80}ms"><div class="photo-window"><div class="category-photo photo-${i}" role="img" aria-label="${esc(c.title)}"></div><span class="category-number">0${i+1}</span></div><div class="category-label"><div><h2>${esc(c.title)}</h2><p>${esc(c.sub)}</p></div>${arrow}</div><span class="category-bottom">${c.items.length} opciones <span>ELIGE TU ANTOJO</span></span></a>`;
const prices=p=>p.options.length===1
 ? `<strong class="price">${esc(p.price)}</strong>`
 : `<div class="price-stack" aria-label="Precios de ${esc(p.name)}">${p.options.map(o=>`<span class="price-option"><small>${esc(o.label)}</small><strong>$${o.price}</strong></span>`).join('')}</div>`;
const item=p=>`<article class="product" data-product="${p.id}" data-group="${esc(p.group)}"><span class="product-accent" aria-hidden="true"></span><div class="product-copy"><span class="dish-type">${esc(p.group || categories.find(c=>c.id===p.category)?.title || 'Wicklow recomienda')}</span><h3>${esc(p.name)}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}</div><div class="product-action">${prices(p)}</div></article>`;

save('index.html','Bienvenido',`${header(null,true)}<main class="welcome"><img class="welcome-dog" src="assets/dog-v2.webp" alt="Perrito aviador en caricatura brindando con una pinta" fetchpriority="high" width="1086" height="1448"><div class="welcome-copy"><p class="overline">DONDE EL ROCK VIVE</p><h1>¿Tienes<br>hambre?</h1><a class="enter" href="menu.html"><span>ENTRA.<small>BAJO TU RESPONSABILIDAD</small></span><span aria-hidden="true">→</span></a></div></main>`,'home');
save('menu.html','La carta',`${header('index.html')}<main class="menu-main"><section class="menu-heading"><p class="overline">BUENA COMIDA. MEJORES HISTORIAS.</p><h1>¿Qué demonios<br>quieres hoy?</h1></section><div class="category-grid">${categories.map(tile).join('')}</div><a class="bonifacio" href="recomienda.html"><span>¿NO TE DECIDES?<b>Bonifacio recomienda</b></span>→</a><p class="pub-quote">La vida es demasiado corta<br>para tomar cosas aburridas.</p><p class="photo-note">Imágenes ilustrativas.</p></main>`);
for(const [i,c] of categories.entries()){
 const groups=[...new Set(c.items.map(p=>p.group).filter(Boolean))];
 save(c.id+'.html',c.title,`${header('menu.html')}<main><div class="section-photo photo-${i}" role="img" aria-label="${esc(c.title)}"></div><section class="section-heading"><a class="backlink" href="menu.html">← Todas las categorías</a><h1>${esc(c.title)}</h1><p>${esc(c.intro)}</p></section><div class="controls"><label class="searchbox"><span aria-hidden="true">⌕</span><input type="search" data-search placeholder="Buscar aquí…" aria-label="Buscar en ${esc(c.title)}"></label>${groups.length?`<label class="group-select"><span>Ver</span><select data-group-filter aria-label="Filtrar por tipo"><option value="">Todo (${c.items.length})</option>${groups.map(g=>`<option>${esc(g)}</option>`).join('')}</select></label>`:''}<p class="result-count" data-result-count>${c.items.length} opciones</p></div><section class="products" aria-label="Productos">${c.items.map(item).join('')}</section><p class="no-results" data-empty hidden>No encontramos eso. Prueba con otro nombre.</p></main>`);
}
save('recomienda.html','Bonifacio recomienda',`${header('menu.html')}<main><section class="section-heading"><a class="backlink" href="menu.html">← Todas las categorías</a><h1>Bonifacio<br>recomienda</h1><p>Los imperdibles. Empieza por aquí.</p></section><section class="products">${original.recomienda.items.map(p=>item(all.find(x=>x.id===p.id))).join('')}</section></main>`);
save('buscar.html','Buscar',`${header('menu.html')}<main><section class="section-heading"><h1>¿Qué buscas?</h1><p>Busca en toda la carta.</p></section><div class="controls"><label class="searchbox"><span aria-hidden="true">⌕</span><input type="search" data-search autofocus placeholder="Cerveza, pizza, Jameson…" aria-label="Buscar en toda la carta"></label><p data-result-count class="result-count">${all.length} opciones</p></div><section class="products">${all.map(item).join('')}</section><p class="no-results" data-empty hidden>No encontramos eso. Prueba con otro nombre.</p></main>`);

// El menú actual es únicamente de consulta: no se genera carrito ni página de pedido.
try{fs.unlinkSync('dist/pedido.html');}catch{}
console.log('Built',categories.length,'category pages and',all.length,'preserved products. Digital-menu mode: no ordering UI.');
