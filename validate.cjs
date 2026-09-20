const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('dist/catalog.js','utf8'),ctx);
const data=ctx.window.WICKLOW;
const original=Object.values(require('./catalog.json')).flatMap(c=>c.items);

assert.equal(data.items.length,318);
assert.equal(new Set(data.items.map(p=>p.id)).size,318);
for(const old of original){
 const p=data.items.find(p=>p.id===old.id);
 assert(p);
 assert.equal(p.name,old.name);
 assert.equal(p.price,old.price);
 assert.equal(p.description,old.description);
}

let refs=0;
for(const file of fs.readdirSync('dist').filter(f=>f.endsWith('.html'))){
 const h=fs.readFileSync('dist/'+file,'utf8');
 assert(!/\+ Lo quiero|data-add=|data-basket|Mi pedido|href="pedido\.html"/.test(h),file+' still contains ordering UI');
 for(const m of h.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(m[1].startsWith('data:'))continue;
  assert(fs.existsSync(path.join('dist',m[1])),file+' missing '+m[1]);
  refs++;
 }
}
assert(!fs.existsSync('dist/pedido.html'),'pedido.html should not exist in digital-menu mode');
for(const cssFile of ['dist/style.css','dist/refinement.css']){
 for(const m of fs.readFileSync(cssFile,'utf8').matchAll(/url\('([^']+)'\)/g))assert(fs.existsSync(path.join('dist',m[1])),cssFile+' missing '+m[1]);
}

const beer=fs.readFileSync('dist/cervezas.html','utf8');
assert(/class="price-stack"/.test(beer),'multi-price products should render a price stack');
assert(/330 ml<\/small><strong>\$70<\/strong>/.test(beer),'330 ml beer variant missing');
assert(/1 L<\/small><strong>\$165<\/strong>/.test(beer),'1 L beer variant missing');

// Smoke-test app.js in a minimal browser-like environment.
const dummy={
 hidden:false,value:'',dataset:{},style:{setProperty(){},removeProperty(){}},
 classList:{add(){},remove(){},toggle(){}},
 addEventListener(){},append(){},closest(){return null;},
 querySelectorAll(){return[];},getBoundingClientRect(){return{left:0,top:0,width:1,height:1}}
};
const document={querySelector(){return null},querySelectorAll(){return[]}};
const browser={
 window:{WICKLOW:data,addEventListener(){},matchMedia(){return{matches:false}},scrollY:0},
 document,setTimeout,clearTimeout
};
vm.runInNewContext(fs.readFileSync('dist/app.js','utf8'),browser);

console.log('PASS: 318 products unchanged; '+refs+' HTML references valid; no ordering UI; multi-price menu layout verified; app.js smoke test passed.');
