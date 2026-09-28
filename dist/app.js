(() => {
 'use strict';
 const data=window.WICKLOW;
 const byId=new Map((data?.items||[]).map(p=>[p.id,p]));
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

 function animateVisibleProduct(el,index=0){
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
  el.classList.remove('filter-pop');
  void el.offsetWidth;
  el.style.setProperty('--filter-delay',Math.min(index,8)*28+'ms');
  el.classList.add('filter-pop');
 }
 function filter(){
  const search=document.querySelector('[data-search]');
  const group=document.querySelector('[data-group-filter]');
  const term=normalize(search?.value.trim());
  const selected=group?.value||'';
  let count=0;
  document.querySelectorAll('[data-product]').forEach(el=>{
   const p=byId.get(el.dataset.product);
   if(!p) return;
   const haystack=normalize([p.name,p.description,p.group,p.price].filter(Boolean).join(' '));
   const show=(!selected||p.group===selected)&&(!term||haystack.includes(term));
   el.hidden=!show;
   if(show){animateVisibleProduct(el,count);count++;}
  });
  const c=document.querySelector('[data-result-count]');
  if(c)c.textContent=`${count} ${count===1?'opción':'opciones'}`;
  const empty=document.querySelector('[data-empty]');
  if(empty)empty.hidden=!!count;
 }
 const search=document.querySelector('[data-search]');
 const group=document.querySelector('[data-group-filter]');
 search?.addEventListener('input',filter);
 group?.addEventListener('change',filter);

 if(group?.options && group.options.length>1 && group.options.length<=8){
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
 if(search||group) filter();

 document.querySelectorAll('[data-view-tabs]').forEach(tabs=>{
  const buttons=[...tabs.querySelectorAll('[data-view-target]')];
  const blocks=[...document.querySelectorAll('[data-view-block]')];
  buttons.forEach(button=>button.addEventListener('click',()=>{
   const value=button.dataset.viewTarget;
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   blocks.forEach(block=>block.hidden=block.dataset.viewBlock!==value);
   window.requestAnimationFrame(()=>window.scrollTo({top:Math.max(0,tabs.offsetTop-110),behavior:'smooth'}));
  }));
 });

 if(window.IntersectionObserver && !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches){
  const observer=new window.IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting) return;
   entry.target.classList.add('arrived');
   observer.unobserve(entry.target);
  }),{threshold:.06,rootMargin:'0px 0px -4%'});
  document.querySelectorAll('.category-card,.bonifacio,.product,.section-heading,.controls,.menu-group,.promo-placeholder').forEach((el,i)=>{
   el.classList.add('reveal');
   el.style.setProperty('--reveal-delay',Math.min(i%8,7)*35+'ms');
   observer.observe(el);
  });
 }

 const topbar=document.querySelector('.topbar');
 if(topbar){
  let ticking=false;
  const paint=()=>{topbar.classList.toggle('is-scrolled',(window.scrollY||0)>18);ticking=false;};
  window.addEventListener?.('scroll',()=>{if(!ticking){requestAnimationFrame(paint);ticking=true;}},{passive:true});
  paint();
 }

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
