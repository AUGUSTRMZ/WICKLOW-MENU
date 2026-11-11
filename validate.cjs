// Validate deploy output, catalog preservation and offline dependencies.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=__dirname;
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'catalog.js'),'utf8'),sandbox);
const original=JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
assert.equal(JSON.stringify(sandbox.window.WICKLOW_CATALOG),JSON.stringify(original),'JS and JSON catalog must agree');
assert.equal(Object.keys(original).length,8);
let count=0;
for(const section of Object.values(original))for(const item of section.items){
 assert.ok(item.name&&item.price&&/\$\d/.test(item.price),'Every item needs its original name and price');count++;
}
for(const file of ['index.html','backstage.html','concepts.css','concepts.js','catalog.js'])assert.equal(fs.readFileSync(path.join(root,file),'utf8'),fs.readFileSync(path.join(root,'dist',file),'utf8'),file+' deploy differs');
const source=['index.html','concepts.css','concepts.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
for(const [,asset] of source.matchAll(/(?:assets\/)([\w.-]+\.(?:png|webp|jpg|ttf|otf))/g))assert.ok(fs.existsSync(path.join(root,'dist/assets',asset)),'Missing '+asset);
for(const [,asset] of source.matchAll(/img:'([^']+)'/g))assert.ok(fs.existsSync(path.join(root,'dist/assets',asset)),'Missing '+asset);
assert.ok(!/https?:\/\//.test(fs.readFileSync(path.join(root,'index.html'),'utf8')),'Entry must work offline');
assert.ok(source.includes('prefers-reduced-motion'));
assert.ok(source.includes('aria-live="polite"'));
assert.ok(source.includes('Ando jodido'));
console.log(`PASS: 8 categories, ${count} original records, assets, accessibility hooks and deploy parity.`);
