const fs=require('fs');
const original=require('./catalog.json');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>`$${Number(n).toLocaleString('en-US')}`;
const idNum=id=>Number(String(id).replace(/\D/g,''));

function parseOptions(price){
  return String(price).split(' · ').map((s,i)=>{
    const m=s.match(/\$([\d,]+)/);
    if(!m) return {label:'',price:0};
    return {
      label:s.replace(/\$[\d,]+/,'').trim(),
      price:Number(m[1].replace(/,/g,''))
    };
  });
}
function split(p,extra={}){
  const opts=parseOptions(p.price);
  return opts.map((o,i)=>({
    ...p,
    ...extra,
    baseId:p.id,
    id:opts.length>1?`${p.id}-${i+1}`:p.id,
    name:opts.length>1&&o.label?`${p.name} · ${o.label}`:p.name,
    presentation:o.label||'',
    price:money(o.price),
    options:[o]
  }));
}
function byBase(cat,id){return original[cat].items.find(x=>x.id===id)}
function range(cat,a,b){return original[cat].items.filter(x=>{const n=idNum(x.id);return n>=a&&n<=b})}
function flatten(items,extraFn){return items.flatMap(p=>split(p,extraFn?extraFn(p):{}))}

const sharingNames=/Aceitunas|Papas|Nachos/i;
const sharingBase=[...original.recomienda.items.slice(1),...original.comida.items.filter(p=>sharingNames.test(p.name))];
const hungerBase=[original.recomienda.items[0],...original.comida.items.filter(p=>!sharingNames.test(p.name))];
const foodGroup=p=>/Hamburguesa/.test(p.name)?'Hamburguesas':/Pizza|Peperoni/.test(p.name)?'Pizzas':/Cake/.test(p.name)?'Postres':'Platos';
const hunger=flatten(hungerBase,p=>({category:'comida',view:'Tengo hambre',group:foodGroup(p)}));
const sharing=flatten(sharingBase,p=>({category:'comida',view:'Para compartir',group:'Para compartir'}));
const food=[...hunger,...sharing];

function beerGroup(p){
  const n=idNum(p.id);
  if(n>=15&&n<=25) return 'Nacionales';
  if(n===31) return 'Artesanales mexicanas';
  if(n>=26&&n<=28) return 'Importadas';
  if((n>=29&&n<=30)||(n>=32&&n<=36)) return 'Special Beer';
  return 'Preparados';
}
const beers=flatten(original.cervezas.items,p=>({category:'cervezas',group:beerGroup(p)}));

const wicklowCocktails=new Set(['p89','p90','p95','p96','p103','p104','p105','p106','p114','p115','p116','p117','p118','p119','p120']);
const cocktails=flatten(original.cocteles.items,p=>({category:'cocteles',group:wicklowCocktails.has(p.id)?'Cócteles Wicklow':'Cócteles clásicos'}));

const spirits=flatten(original.destilados.items,p=>({category:'destilados',group:(p.description.split('·')[0]||'Otros').trim()}));

function aperitifGroup(p){
  const n=idNum(p.id);
  if(n<=72) return 'Aperitivos';
  if(n<=83) return 'Digestivos y licores';
  return 'Vinos y burbujas';
}
const aperitifs=flatten(original.aperitivos.items,p=>({category:'aperitivos',group:aperitifGroup(p)}));

function softGroup(p){
  const n=idNum(p.id);
  if(n<=123) return 'Aguas';
  if(n===124) return 'Energética';
  if(n<=131) return 'Refrescos';
  if(n<=136) return 'Sodas';
  if(n<=142) return 'Jugos';
  if(n<=147) return 'Preparados sin alcohol';
  return 'Café';
}
const soft=flatten(original.sinalcohol.items,p=>({category:'sinalcohol',group:softGroup(p)}));
const whisky=flatten(original.whisky.items,p=>({category:'whisky',group:p.group||'Whisky'}));
const recommends=flatten(original.recomienda.items,p=>({category:'recomienda',group:'Bonifacio recomienda'}));

const categories=[
 {id:'comida',title:'Tengo hambre',sub:'Platos · Hamburguesas · Pizzas · Para compartir',intro:'Comida de pub. Sin discursos largos.',items:food,photo:0},
 {id:'cervezas',title:'Dame una cerveza',sub:'Nacionales · Mexicanas · Importadas · Special Beer',intro:'Primero elige la familia. Después, la cerveza.',items:beers,photo:2},
 {id:'whisky',title:'Hoy vamos en serio',sub:'Whisky & Whiskey · Bourbon · Mundo',intro:'Una colección para tomarse el tiempo.',items:whisky,photo:3},
 {id:'cocteles',title:'Quiero algo peligroso',sub:'Cócteles Wicklow · Clásicos',intro:'Recetas serias para gente que no vino a serlo.',items:cocktails,photo:4},
 {id:'destilados',title:'Sin rodeos',sub:'Tequila · Mezcal · Ron · Gin · Vodka',intro:'Elige tu destilado y ve directo al punto.',items:spirits,photo:5},
 {id:'aperitivos',title:'Antes o después',sub:'Aperitivos · Digestivos · Vinos',intro:'Para abrir el apetito o estirar la sobremesa.',items:aperitifs,photo:6},
 {id:'sinalcohol',title:'Hoy me porto bien',sub:'Refrescos · Sodas · Jugos · Café',intro:'Sin alcohol. Con suficientes opciones.',items:soft,photo:7},
 {id:'economia',title:'Estoy cuidando mi economía',sub:'Promociones · Oportunidades',intro:'Promociones y oportunidades vigentes de Wicklow.',items:[],photo:1}
];
const all=[...food,...beers,...whisky,...cocktails,...spirits,...aperitifs,...soft,...recommends];
fs.writeFileSync('dist/catalog.js','window.WICKLOW='+JSON.stringify({categories:categories.map(({items,...c})=>({...c,count:items.length})),items:all})+';');

const arrow='<span aria-hidden="true">↗</span>';
const mark='<span class="wicklow-mark"><img src="assets/wicklow-logo.jpg" alt="Wicklow Irish Pub"></span>';
const header=(back,home=false)=>`<header class="topbar">${back?`<a class="icon-button" href="${back}" aria-label="Volver">←</a>`:'<span class="brand-star" aria-hidden="true">♣</span>'}<a class="brand" href="index.html" aria-label="Wicklow, bienvenida">${mark}</a>${home?'<span class="brand-star" aria-hidden="true">♣</span>':'<span class="header-spacer" aria-hidden="true"></span>'}</header>`;
const footer=`<footer><p>COME · BRINDA · PIDE LA PENÚLTIMA</p><span>Wicklow Irish Pub® · Precios en MXN</span><small>Menú de consulta. Consumo de alcohol solamente con alimentos. Evita el exceso.</small></footer>`;
const head=title=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0c1e17"><title>${esc(title)} · Wicklow Irish Pub</title><meta name="description" content="Carta digital de Wicklow Irish Pub: comida, cerveza, coctelería, destilados y whisky."><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23143d2b'/%3E%3Ctext x='16' y='24' text-anchor='middle' font-size='25' font-family='serif' fill='%23eedfc4'%3EW%3C/text%3E%3C/svg%3E"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="refinement.css?v=6"><script defer src="catalog.js"></script><script defer src="app.js"></script></head>`;
const save=(file,title,body,cls='')=>fs.writeFileSync('dist/'+file,head(title)+`<body class="${cls}"><div class="pub">${body}${footer}</div></body></html>`);

const tile=(c,i)=>`<a class="category-card" href="${c.id}.html" style="--delay:${i%2*80}ms"><div class="photo-window"><div class="category-photo photo-${c.photo}" role="img" aria-label="${esc(c.title)}"></div><span class="category-number">${String(i+1).padStart(2,'0')}</span></div><div class="category-label"><div><h2>${esc(c.title)}</h2><p>${esc(c.sub)}</p></div>${arrow}</div><span class="category-bottom">${c.items.length?`${c.items.length} opciones`:'PROMOCIONES'} <span>${c.items.length?'ELIGE TU ANTOJO':'CONSULTA AQUÍ'}</span></span></a>`;
const item=p=>`<article class="product" data-product="${esc(p.id)}" data-group="${esc(p.group||'')}"><span class="product-accent" aria-hidden="true"></span><div class="product-copy"><span class="dish-type">${esc(p.group||'Wicklow')}</span><h3>${esc(p.name)}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}</div><div class="product-action"><strong class="price">${esc(p.price)}</strong></div></article>`;
const groupBlock=(title,items,id='')=>`<section class="menu-group"${id?` id="${esc(id)}"`:''}><div class="group-heading"><span>${String(items.length).padStart(2,'0')} opciones</span><h2>${esc(title)}</h2></div><div class="products">${items.map(item).join('')}</div></section>`;
const jumpNav=(groups,prefix='group')=>`<nav class="section-jump" aria-label="Ir a una sección">${groups.map((g,i)=>`<a href="#${prefix}-${i}">${esc(g)}</a>`).join('')}</nav>`;
const controls=(groups,{search=false}={})=>`<div class="controls">${search?'<label class="searchbox"><span aria-hidden="true">⌕</span><input type="search" data-search placeholder="Buscar whisky…" aria-label="Buscar whisky"></label>':''}${groups?.length?`<label class="group-select"><span>Ver</span><select data-group-filter aria-label="Filtrar por tipo"><option value="">Todo</option>${groups.map(g=>`<option>${esc(g)}</option>`).join('')}</select></label>`:''}<p class="result-count" data-result-count></p></div>`;
const sectionTop=(title,intro,photo,back='menu.html')=>`${header(back)}<main><div class="section-photo photo-${photo}" role="img" aria-label="${esc(title)}"></div><section class="section-heading"><a class="backlink" href="${back}">← Todas las categorías</a><h1>${esc(title)}</h1><p>${esc(intro)}</p></section>`;

save('index.html','Bienvenido',`${header(null,true)}<main class="welcome"><img class="welcome-dog welcome-dog-real" src="assets/dog-real.webp?v=6" alt="Perro aviador de Wicklow junto a una Guinness" fetchpriority="high"><div class="welcome-copy"><p class="overline">DONDE EL ROCK VIVE</p><h1>¿Qué se te<br>antoja?</h1><a class="enter" href="menu.html"><span>ENTRA.<small>BAJO TU RESPONSABILIDAD</small></span><span aria-hidden="true">→</span></a></div></main>`,'home');

save('menu.html','La carta',`${header('index.html')}<main class="menu-main"><section class="menu-heading"><p class="overline">BUENA BEBIDA, BUENA COMIDA, MEJORES HISTORIAS.</p><h1>¿Qué demonios<br>quieres hoy?</h1></section><a class="bonifacio bonifacio-top" href="recomienda.html"><span>¿NO TE DECIDES?<b>Bonifacio recomienda</b><small>Empieza por aquí.</small></span>→</a><div class="category-grid">${categories.map(tile).join('')}</div><p class="pub-quote">La vida es demasiado corta<br>para tomar cosas aburridas.</p><p class="photo-note">Imágenes ilustrativas.</p></main>`);

// Comida: dos caminos claros en una sola página.
const foodOrder=['Platos','Hamburguesas','Pizzas','Postres'];
const hungerBlocks=foodOrder.map(g=>groupBlock(g,hunger.filter(x=>x.group===g))).join('');
const shareBlock=groupBlock('Para compartir',sharing);
save('comida.html','Tengo hambre',`${sectionTop('Tengo hambre','Dos caminos: algo para ti o algo para la mesa.',0)}<div class="view-tabs" data-view-tabs><button type="button" aria-pressed="true" data-view-target="hambre">Tengo hambre</button><button type="button" aria-pressed="false" data-view-target="compartir">Para compartir</button></div><div data-view-block="hambre">${hungerBlocks}</div><div data-view-block="compartir" hidden>${shareBlock}</div></main>`);

// Cervezas: sin buscador; orden editorial por familias.
const beerGroups=['Nacionales','Artesanales mexicanas','Importadas','Special Beer','Preparados'];
const beerBlocks=beerGroups.map((g,i)=>groupBlock(g,beers.filter(x=>x.group===g),`beer-${i}`)).join('');
save('cervezas.html','Dame una cerveza',`${sectionTop('Dame una cerveza','Nacionales primero. Después mexicanas, importadas y las especiales.',2)}${jumpNav(beerGroups,'beer')}${beerBlocks}</main>`);

// Whisky: conserva buscador y filtro porque aquí sí aportan valor.
const whiskyGroups=[...new Set(whisky.map(x=>x.group))];
save('whisky.html','Hoy vamos en serio',`${sectionTop('Hoy vamos en serio','Busca una botella o filtra por familia.',3)}${controls(whiskyGroups,{search:true})}<section class="products" aria-label="Whisky">${whisky.map(item).join('')}</section><p class="no-results" data-empty hidden>No encontramos ese whisky.</p></main>`);

const cocktailGroups=['Cócteles Wicklow','Cócteles clásicos'];
const cocktailBlocks=cocktailGroups.map((g,i)=>groupBlock(g,cocktails.filter(x=>x.group===g),`cocktail-${i}`)).join('');
save('cocteles.html','Quiero algo peligroso',`${sectionTop('Quiero algo peligroso','La casa por un lado. Los clásicos por el otro.',4)}${jumpNav(cocktailGroups,'cocktail')}${cocktailBlocks}</main>`);

const spiritGroups=['Tequila','Mezcal','Ron','Gin','Vodka','Brandy','Cognac'].filter(g=>spirits.some(x=>x.group===g));
save('destilados.html','Sin rodeos',`${sectionTop('Sin rodeos','Elige el destilado para evitar una lista interminable.',5)}${controls(spiritGroups)}<section class="products" aria-label="Destilados">${spirits.map(item).join('')}</section><p class="no-results" data-empty hidden>No hay productos en este grupo.</p></main>`);

const aperitifGroups=['Aperitivos','Digestivos y licores','Vinos y burbujas'];
save('aperitivos.html','Antes o después',`${sectionTop('Antes o después','Aperitivos, digestivos y algo para alargar la sobremesa.',6)}${controls(aperitifGroups)}<section class="products" aria-label="Aperitivos y digestivos">${aperitifs.map(item).join('')}</section><p class="no-results" data-empty hidden>No hay productos en este grupo.</p></main>`);

const softGroups=['Aguas','Energética','Refrescos','Sodas','Jugos','Preparados sin alcohol','Café'];
save('sinalcohol.html','Hoy me porto bien',`${sectionTop('Hoy me porto bien','Refrescos, sodas, jugos y café. Sin buscador.',7)}${controls(softGroups)}<section class="products" aria-label="Sin alcohol">${soft.map(item).join('')}</section><p class="no-results" data-empty hidden>No hay productos en este grupo.</p></main>`);

save('recomienda.html','Bonifacio recomienda',`${header('menu.html')}<main><section class="section-heading recommendation-heading"><a class="backlink" href="menu.html">← Volver a la carta</a><p class="overline">PRIMERO BONIFACIO</p><h1>Bonifacio<br>recomienda</h1><p>Los imperdibles actuales. Aquí quedarán las recomendaciones de la casa.</p></section><section class="products">${recommends.map(item).join('')}</section></main>`);

save('economia.html','Estoy cuidando mi economía',`${header('menu.html')}<main><section class="section-heading economy-heading"><a class="backlink" href="menu.html">← Volver a la carta</a><p class="overline">BUENO PARA EL ANTOJO. MEJOR PARA LA CARTERA.</p><h1>Estoy cuidando<br>mi economía</h1><p>Este espacio queda destinado a promociones y oportunidades vigentes.</p></section><div class="promo-placeholder"><span>PROMOCIONES</span><h2>Las oportunidades de Wicklow van aquí.</h2><p>Cuando estén definidas, se publican en esta sección sin mezclar el resto de la carta.</p></div></main>`);

// Ya no existe una búsqueda global ni una página separada de "Para compartir".
for(const obsolete of ['dist/buscar.html','dist/compartir.html','dist/pedido.html']){try{fs.unlinkSync(obsolete)}catch{}}
console.log('Built Wicklow V2:',all.length,'menu entries after presentation split.');
