(() => {
 'use strict';
 const data=window.WICKLOW;
 if(!data?.items) return;
 const byId=new Map(data.items.map(p=>[p.id,p]));
 const search=document.querySelector('[data-search]');
 const group=document.querySelector('[data-group-filter]');
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

 function animateVisibleProduct(el,index=0){
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
  el.classList.remove('filter-pop');
  void el.offsetWidth;
  el.style.setProperty('--filter-delay',Math.min(index,8)*28+'ms');
  el.classList.add('filter-pop');
 }

 function filter(){
  const term=normalize(search?.value.trim());
  const selected=group?.value||'';
  let count=0;
  document.querySelectorAll('[data-product]').forEach(el=>{
   const p=byId.get(el.dataset.product);
   if(!p) return;
   const haystack=normalize([p.name,p.description,p.group,p.price].filter(Boolean).join(' '));
   const show=(!selected||p.group===selected)&&haystack.includes(term);
   el.hidden=!show;
   if(show){animateVisibleProduct(el,count);count++;}
  });
  const c=document.querySelector('[data-result-count]');
  if(c)c.textContent=`${count} ${count===1?'opción':'opciones'}`;
  const empty=document.querySelector('[data-empty]');
  if(empty)empty.hidden=!!count;
 }
 search?.addEventListener('input',filter);
 group?.addEventListener('change',filter);

 if(group?.options && group.options.length>1 && group.options.length<=7){
  const chips=document.createElement('div');
  chips.className='filter-chips';
  chips.setAttribute('aria-label','Tipos de producto');
  Array.from(group.options).forEach(option=>{
   const button=document.createElement('button');
   button.type='button';
   button.textContent=option.text;
   button.setAttribute('aria-pressed',String(group.value===option.value));
   button.addEventListener('click',()=>{
    group.value=option.value;
    filter();
    chips.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   });
   chips.append(button);
  });
  group.closest('.group-select').hidden=true;
  group.closest('.controls').append(chips);
 }

 // Entrada progresiva: ligera, rápida y segura si no existe IntersectionObserver.
 if(window.IntersectionObserver && !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){
  const observer=new window.IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting) return;
   entry.target.classList.add('arrived');
   observer.unobserve(entry.target);
  }),{threshold:.08,rootMargin:'0px 0px -5%'});
  document.querySelectorAll('.category-card,.bonifacio,.product,.section-heading,.controls').forEach((el,i)=>{
   el.classList.add('reveal');
   el.style.setProperty('--reveal-delay',Math.min(i%8,7)*38+'ms');
   observer.observe(el);
  });
 }

 // La cabecera gana profundidad al desplazarse sin cambiar la identidad visual.
 const topbar=document.querySelector('.topbar');
 if(topbar){
  let ticking=false;
  const paint=()=>{topbar.classList.toggle('is-scrolled',(window.scrollY||0)>18);ticking=false;};
  window.addEventListener?.('scroll',()=>{if(!ticking){(window.requestAnimationFrame||setTimeout)(paint);ticking=true;}},{passive:true});
  paint();
 }

 // Microparallax exclusivamente en dispositivos con mouse/trackpad.
 if(window.matchMedia?.('(hover:hover) and (pointer:fine)')?.matches && !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){
  document.querySelectorAll('.product').forEach(card=>{
   card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.setProperty('--px',(x*5).toFixed(2)+'px');
    card.style.setProperty('--py',(y*3).toFixed(2)+'px');
   });
   card.addEventListener('pointerleave',()=>{card.style.removeProperty('--px');card.style.removeProperty('--py');});
  });
 }
})();
