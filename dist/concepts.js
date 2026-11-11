'use strict';
// Content remains independent of the interface. Never mutate the source catalog.
const catalog = window.WICKLOW_CATALOG || {};
const categories = [
  {key:'recomienda',title:"Las de Boni",tag:'Él sabe cosas.',sub:'Los favoritos de la casa. Sin discusión.',img:'bonifacio-recomienda.webp'},
  {key:'comida',title:"Échale al buche",tag:'Primero se come.',sub:'Para la barriga y para la banda.',img:'bonifacio-comida.webp'},
  {key:'cervezas',title:"Cheve",tag:'Fría. Como debe ser.',sub:'Buenas historias empiezan aquí.',img:'bonifacio-cervezas.webp'},
  {key:'whisky',title:"Oro líquido",tag:'Whisky & whiskey.',sub:'Sin prisas. Con mucho carácter.',img:'bonifacio-whisky.webp'},
  {key:'cocteles',title:"Mezclas del pecado",tag:'Cócteles de la casa.',sub:'Buenas mezclas. Mejores anécdotas.',img:'bonifacio-cocteles.webp'},
  {key:'destilados',title:"Al grano",tag:'Destilados.',sub:'Tequila, mezcal, ron y compañía.',img:'bonifacio-destilados.webp'},
  {key:'aperitivos',title:"Pa' ir calentando",tag:'Aperitivos & digestivos.',sub:'El principio de una buena sobremesa.',img:'bonifacio-aperitivos.webp'},
  {key:'sinalcohol',title:"Sin pecado",tag:'Sin alcohol.',sub:'Todo el ambiente. A tu manera.',img:'bonifacio-sinalcohol.webp'}
];
const categoryNames = categories.map(category => category.title);
const app = document.querySelector('#app-view');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const money = value => Number((String(value).match(/\$([\d,]+(?:\.\d+)?)/)||[])[1]?.replaceAll(',',''));
let currentKey = '';
let filters = {search:'',group:'',order:'original',budget:'100'};
let observer;
// Follow the device's accessibility preference without exposing a pause control.
function motionDisabled(){return reducedMotion.matches;}
function updateMotion(){document.body.classList.toggle('motion-off',motionDisabled());}
reducedMotion.addEventListener('change',updateMotion);
updateMotion();
const tickerPhrases = [
  'IRISH SOUL', 'CERVEZA FRÍA', 'ROCK FUERTE', 'BUENA COMIDA',
  'CERO SOLEMNIDAD', 'COME. BEBE. REPITE.', 'EL MENÚ NO MUERDE',
  'BONIFACIO SABE COSAS', 'LA DIETA EMPIEZA EL LUNES',
  'AQUÍ SE VIENE A CONTAR HISTORIAS', 'NOS VEMOS EN LA PENÚLTIMA',
  'BUENA COMIDA. MALA INFLUENCIA.'
];
const tickerGroup = () => `<div class="ticker-group">${tickerPhrases.map(text=>`<span>${text}<b aria-hidden="true">✳</b></span>`).join('')}</div>`;
// Separate only explicit presentations. Original labels, prices and descriptions stay intact.
function expandItems(items,key){
  return items.flatMap(item=>{
    const parts = item.price.split(' · ');
    if(parts.length<2) return [{...item,sourceCategory:key,value:money(item.price)}];
    const variants = parts.map(part=>{
      const price = part.match(/\$[\d,]+(?:\.\d+)?/);
      if(!price) return null;
      const size = part.replace(price[0],'').trim();
      return size ? {...item,name:item.name+' · '+size,price:price[0],sourceCategory:key,value:money(price[0])} : null;
    });
    return variants.every(Boolean)?variants:[{...item,sourceCategory:key,value:money(item.price)}];
  });
}
function getItems(key){
  if(key!=='economia') return expandItems(catalog[key]?.items||[],key);
  const seen=new Set();
  return categories.flatMap(c=>expandItems(catalog[c.key]?.items||[],c.key)).filter(item=>{
    const id=item.name+'|'+item.price;
    if(seen.has(id))return false;
    seen.add(id);return Number.isFinite(item.value);
  });
}
const home = () => `<main id="main" tabindex="-1">
<section class="hero"><div class="hero-top"><p class="eyebrow">QUERÉTARO · IRISH PUB · BUENAS HISTORIAS</p><p class="corner">COME.<br>BEBE.<br><b>REPITE.</b></p></div>
<div class="hero-content"><h1 aria-label="Mucha sed. Poca vergüenza."><span><b>MUCHA <em>sed.</em></b></span><span><b>POCA</b></span><span><b class="outline">VERGÜENZA.</b></span></h1>
<div class="hero-art"><span class="tape" aria-hidden="true"></span><figure><img src="assets/bonifacio-brindis.webp" width="576" height="1024" alt="Bonifacio brinda por las buenas historias" fetchpriority="high"><figcaption>EL ANFITRIÓN OFICIAL.</figcaption></figure><div class="seal">BUENA<br>COMIDA.<br>MALA<br>INFLUENCIA.</div></div>
<div class="hero-bottom"><p>Aquí se viene a comer bien.<br>A brindar mejor.<br>Lo demás se cuenta mañana.</p></div></div>
<div class="hero-foot"><span>THE WICKLOW BACKSTAGE MENU</span><span>DESLIZA. EL MENÚ NO MUERDE. ↓</span></div></section>
<div class="ticker" aria-hidden="true"><div class="ticker-track">${tickerGroup()}${tickerGroup()}</div></div>
<section id="carta" class="carta" tabindex="-1"><div class="section-heading"><div><p class="eyebrow">01—08 / LA CARTA</p><h2>Elige tu<br><em>buena</em> mala idea.</h2></div><p>Ocho formas de empezar.<br>Un montón de historias que contar.</p></div>
<div class="category-grid">${categories.map((c,i)=>`<a class="category-card" href="#cat=${c.key}" data-category="${c.key}" aria-label="${escapeHTML(c.title)}: ${escapeHTML(c.tag)}"><img src="assets/${c.img}" alt="" width="1024" height="1024" loading="lazy"><div class="card-top"><span class="card-number">${String(i+1).padStart(2,'0')}</span><span class="card-arrow" aria-hidden="true">↗</span></div><div class="card-copy"><small>${escapeHTML(c.tag)}</small><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.sub)}</p></div></a>`).join('')}</div>
<a class="economy" href="#cat=economia" data-category="economia"><span aria-hidden="true">✳</span><div><h3>Ando jodido</h3><p>Tu presupuesto también está invitado.</p></div><span class="arrow" aria-hidden="true">↗</span></a></section>
<section class="closer"><div><p class="eyebrow">EL ESPÍRITU DE LA CASA</p><h2>Las mejores historias<br>no se planean.</h2><p>Se sientan a la mesa. Piden algo rico.<br>Y se quedan un ratito más.</p></div><span class="star" aria-hidden="true">✳</span></section></main>`;
function detail(key){
  const c=categories.find(c=>c.key===key)||{title:'Ando jodido',tag:'Ando jodido',sub:'Elige cuánto quieres gastar por producto.',img:'bonifacio-recomienda.webp'};
  const items=getItems(key);
  const groups=[...new Set(items.map(i=>i.group).filter(Boolean))];
  return `<main id="main" class="detail" tabindex="-1"><a href="#carta" class="back" data-home>← VOLVER A LA CARTA</a><section class="detail-hero"><div><p class="eyebrow">${escapeHTML(c.tag)}</p><h1>${escapeHTML(c.title)}</h1><p>${escapeHTML(c.sub)}</p></div><img src="assets/${c.img}" alt="Bonifacio presenta esta sección" width="1024" height="1024"></section>
<nav class="category-tabs" aria-label="Cambiar categoría">${categories.map((cat,i)=>`<a href="#cat=${cat.key}" data-category="${cat.key}" ${cat.key===key?'aria-current="page"':''}>${categoryNames[i]}</a>`).join('')}</nav>
<div class="catalog-controls">
${['whisky','destilados'].includes(key)?'<label class="search-label">BUSCAR EN ESTA SECCIÓN<input id="search" type="search" autocomplete="off" placeholder="Nombre o región…"></label>':''}
${groups.length?`<label>REGIÓN O ESTILO<select id="group"><option value="">Todos los estilos</option>${groups.map(g=>`<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join('')}</select></label>`:''}
${key==='comida'?'<label>¿QUÉ PLAN?<select id="food"><option value="">Todo para comer</option><option value="compartir">Para compartir</option><option value="hambre">Tengo hambre</option></select></label>':''}
${key==='economia'?'<label>HASTA CUÁNTO POR PRODUCTO<select id="budget"><option value="100">$100 MXN</option><option value="150">$150 MXN</option><option value="200">$200 MXN</option><option value="300">$300 MXN</option></select></label>':''}
<label>ORDENAR<select id="order"><option value="original">Selección de la casa</option><option value="asc">Menor precio primero</option><option value="desc">Mayor precio primero</option><option value="az">Nombre: A–Z</option></select></label></div>
<p class="results-count" role="status" aria-live="polite" id="results-count"></p><div class="products" id="products"></div>
<div class="detail-end"><p>PRECIOS EN MXN · Consulta disponibilidad con tu mesero.</p><a href="#carta" data-home>OTRA BUENA IDEA ↗</a></div></main>`;
}
function renderProducts(){
  let items=getItems(currentKey);
  if(filters.search) items=items.filter(i=>normalize(i.name+' '+i.description+' '+i.group).includes(normalize(filters.search)));
  if(filters.group)items=items.filter(i=>i.group===filters.group);
  if(currentKey==='economia')items=items.filter(i=>i.value<=Number(filters.budget));
  if(currentKey==='comida'&&filters.food){
    const share = i=>/papas|nachos|pizza|peperoni|aceitunas/i.test(i.name);
    items=items.filter(i=>filters.food==='compartir'?share(i):!share(i));
  }
  if(filters.order==='asc')items.sort((a,b)=>a.value-b.value);
  if(filters.order==='desc')items.sort((a,b)=>b.value-a.value);
  if(filters.order==='az')items.sort((a,b)=>a.name.localeCompare(b.name,'es'));
  document.querySelector('#results-count').textContent=`${items.length} ${items.length===1?'OPCIÓN':'OPCIONES'} · PRECIOS EN MXN`;
  document.querySelector('#products').innerHTML=items.length?items.map(i=>`<article class="product"><div>${i.group?`<span class="product-group">${escapeHTML(i.group)}</span>`:''}<h3>${escapeHTML(i.name)}</h3>${i.description?`<p>${escapeHTML(i.description)}</p>`:''}</div><span class="price">${escapeHTML(i.price)}</span></article>`).join(''):'<div class="empty"><h3>Por aquí no salió nada.</h3><p>Prueba con otro nombre o cambia los filtros.</p><button type="button" class="reset" id="reset">Ver toda la sección</button></div>';
  document.querySelector('#reset')?.addEventListener('click',()=>{filters={search:'',group:'',order:'original',budget:'100',food:''};document.querySelectorAll('.catalog-controls input').forEach(el=>el.value='');document.querySelectorAll('.catalog-controls select').forEach(el=>el.selectedIndex=0);renderProducts();});
}
function routeKey(){
  try {return location.hash.startsWith('#cat=')?decodeURIComponent(location.hash.slice(5)):(new URLSearchParams(location.search).get('cat')||'');}catch{return '';}
}
function render(focus=false){
  observer?.disconnect();
  currentKey=routeKey();
  if(currentKey!=='economia'&&!categories.some(c=>c.key===currentKey))currentKey='';
  filters={search:'',group:'',order:'original',budget:'100',food:''};
  app.innerHTML=currentKey?detail(currentKey):home();
  document.title=currentKey?`${categories.find(c=>c.key===currentKey)?.title||'Ando jodido'} | Wicklow Irish Pub`:'Wicklow Irish Pub — Come. Bebe. Repite.';
  if(currentKey){renderProducts();['search','group','order','budget','food'].forEach(id=>document.getElementById(id)?.addEventListener(id==='search'?'input':'change',event=>{filters[id]=event.target.value;renderProducts();}));}
  else setupHomeMotion();
  if(focus)document.querySelector('#main').focus({preventScroll:true});
}
function navigate(key,anchor=''){
  const url=new URL(location.href);url.searchParams.delete('cat');url.hash=key?'cat='+key:anchor;
  if(!key && !currentKey && anchor==='carta'){
    if(location.protocol!=='file:')history.pushState({},'',url);
    else location.hash='carta';
    lastRoute=location.search+location.hash;
    const carta=document.querySelector('#carta');
    carta?.focus({preventScroll:true});
    carta?.scrollIntoView({behavior:motionDisabled()?'instant':'smooth'});
    return;
  }
  // Hash routes also work when index.html is opened directly from disk.
  if(location.protocol==='file:'){location.hash=url.hash;return;}
  history.pushState({},'',url);
  lastRoute=location.search+location.hash;
  const update=()=>{render(true);if(anchor)document.getElementById(anchor)?.scrollIntoView({behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});};
  if(document.startViewTransition&&!motionDisabled())document.startViewTransition(update);else update();
}
function setupHomeMotion(){
  if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.category-card,.section-heading,.closer').forEach(el=>observer.observe(el));}
  const art=document.querySelector('.hero-art');
  if(art&&matchMedia('(hover: hover) and (pointer: fine)').matches){
    art.addEventListener('pointermove',event=>{if(motionDisabled())return;const rect=art.getBoundingClientRect();art.style.setProperty('--mx',((event.clientX-rect.left)/rect.width-.5)*16+'px');art.style.setProperty('--my',((event.clientY-rect.top)/rect.height-.5)*16+'px');});
    art.addEventListener('pointerleave',()=>{art.style.setProperty('--mx','0px');art.style.setProperty('--my','0px');});
  }
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[data-category],a[data-home]');
  if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();navigate(link.dataset.category||'',link.getAttribute('href')==='#carta'?'carta':'');
});
let lastRoute=location.search+location.hash;
function onLocation(){const next=location.search+location.hash;if(next===lastRoute)return;lastRoute=next;if(!location.hash.startsWith('#cat=')&&!currentKey&&location.hash==='#carta')return;render(true);if(location.hash==='#carta')document.querySelector('#carta')?.scrollIntoView();else window.scrollTo(0,0);}
window.addEventListener('popstate',onLocation);window.addEventListener('hashchange',onLocation);
render();
if(location.hash==='#carta')requestAnimationFrame(()=>document.querySelector('#carta')?.scrollIntoView());
