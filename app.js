'use strict';
// Artwork-only windows from the supplied reference. All text, cards and controls
// are HTML; the page itself is not a screenshot or an image-map recreation.
const products = [
 {id:'floral',name:'Floral Spark Studs',price:24500,crop:[32,548,170,135],mood:'Gold'},
 {id:'twilight',name:'Twilight Drop Pendant',price:36900,crop:[217,541,171,140],mood:'Magenta'},
 {id:'petal',name:'Petal Glow Ring',price:28600,crop:[400,548,170,133],mood:'Blush'},
 {id:'bloom',name:'Bloom Bangle',price:52000,crop:[583,548,166,133],mood:'Gold'},
 {id:'layered',name:'Layered Spark Ring',price:31200,crop:[33,1208,171,86],mood:'Gold'},
 {id:'halo',name:'Halo Glow Earrings',price:26800,crop:[216,1208,170,86],mood:'Blush'},
 {id:'twist',name:'Twist Luxe Pendant',price:39500,crop:[397,1207,170,87],mood:'Magenta'},
 {id:'charm',name:'Petal Charm Bracelet',price:33700,crop:[577,1209,171,85],mood:'Gold'}
];
const gifts = [
 {name:'Magenta Moments',copy:'Bold picks for bright beginnings.',crop:[799,954,77,80],mood:'Magenta'},
 {name:'Golden Blessings',copy:'Classic sparkle for timeless ties.',crop:[799,1052,77,79],mood:'Gold'},
 {name:'Blush Celebrations',copy:'Soft tones for special bonds.',crop:[799,1149,78,80],mood:'Blush'}
];
const currency = value => '₹'+value.toLocaleString('en-IN');
const icon = name => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const croProductImages={'Floral Spark Studs':'studs','Twilight Drop Pendant':'pendant','Petal Glow Ring':'ring','Bloom Bangle':'bangle','Layered Spark Ring':'ring','Halo Glow Earrings':'drops','Twist Luxe Pendant':'pendant','Petal Charm Bracelet':'bracelet'};
const art = (crop,label,className='product-art') => croProductImages[label]?`<span class="${className}"><img src="assets/cro-${croProductImages[label]}.webp" alt="${label}" width="640" height="640" loading="lazy" style="width:100%;height:100%;object-fit:cover"></span>`: `<span class="${className}"><svg viewBox="${crop.join(' ')}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><image href="assets/reference-artwork.jpg" width="1024" height="1536"/></svg></span>`;
const card = p => `<article class="product-card"><button class="product-main" data-product="${p.id}" aria-label="View ${p.name}, ${currency(p.price)}">${art(p.crop,p.name)}<span class="product-text"><span class="product-name">${p.name}</span><span class="product-price">${currency(p.price)}</span></span><span class="round-arrow">${icon('chevron')}</span></button></article>`;
const festivalCategories=[
 {id:'necklaces',name:'Necklaces',image:'assets/necklaces.webp',products:[]},
 {id:'earrings',name:'Earrings',image:'assets/earrings.webp',products:['floral','halo']},
 {id:'rings',name:'Rings',image:'assets/rings.webp',products:['petal','layered']},
 {id:'bangles',name:'Bangles',image:'assets/bangles.webp',products:['bloom']},
 {id:'pendants',name:'Pendants',image:'assets/pendants.webp',products:['twilight','twist']}
];
// New standalone artwork; recipient and budget selections combine.
const guideRelationships=[
 {title:'For Her',image:'studs',ids:['floral','halo']},
 {title:'For Mom',image:'pendant',ids:['floral','twilight','bloom']},
 {title:'For Sister',image:'ring',ids:['petal','floral']},
 {title:'For Wife',image:'bangle',ids:['bloom','twilight','petal']},
 {title:'For Friends',image:'drops',ids:['halo','floral','charm']}
];
const guideBudgets=[{title:'Under ₹10,000',min:0,max:10000},{title:'₹10,000 – ₹20,000',min:10000,max:20000},{title:'₹20,000 – ₹30,000',min:20000,max:30000}];
let guideMode='relationship',guideRecipient=1,guideBudget=2;
const guideGrid=document.querySelector('#guide-grid');
function renderGuide(mode=guideMode){
 guideMode=mode;
 document.querySelector('#cro-recipients').innerHTML=guideRelationships.map((g,i)=>`<button data-recipient="${i}" aria-pressed="${i===guideRecipient}">${g.title}${i===guideRecipient?' ×':''}</button>`).join('');
 document.querySelector('#cro-budgets').innerHTML=guideBudgets.map((g,i)=>`<button data-budget="${i}" aria-pressed="${i===guideBudget}">${g.title}</button>`).join('');
 guideGrid.innerHTML=guideRelationships.map((g,i)=>`<button class="cro-gift-card ${i===guideRecipient?'is-selected':''}" data-recipient="${i}" aria-pressed="${i===guideRecipient}"><img src="assets/cro-${g.image}.webp" alt="${g.title} — illustrative jewellery" width="640" height="640" loading="lazy"><span>${g.title} ${icon('arrow')}</span></button>`).join('');
 document.querySelector('#guide-subtitle').textContent=`Thoughtful picks ${guideRecipient<0?'for every bond':guideRelationships[guideRecipient].title.replace('For','for')}, within your budget.`;
 for(const name of ['relationship','budget']){const tab=document.querySelector('#guide-'+name+'-tab');tab.setAttribute('aria-selected',String(name===mode));tab.tabIndex=name===mode?0:-1;}
 document.querySelector('#guide-panel').setAttribute('aria-labelledby','guide-'+mode+'-tab');
 document.querySelector('.cro-guide-controls').classList.toggle('budget-first',mode==='budget');
}
function showMatchingGifts(){
 const g=guideRelationships[guideRecipient],b=guideBudgets[guideBudget];
 const items=products.filter(p=>(!g||g.ids.includes(p.id))&&(!b||(p.price>=b.min&&p.price<b.max)));
 if(items.length)collection('Matching gifts'+(g?' · '+g.title:''),items);
 else openDialog('Find your gift',`<p>No preview pieces match these filters. Try another budget or explore the full Mia gifting collection.</p><div class="dialog-actions"><a class="cro-button" href="https://www.miabytanishq.com/en_IN/mia-gifting">Explore gifts on Mia ${icon('arrow')}</a></div>`);
}
document.querySelector('#gifting-guide').addEventListener('click',e=>{
 const r=e.target.closest('[data-recipient]'),b=e.target.closest('[data-budget]');
 if(r){const i=Number(r.dataset.recipient);guideRecipient=i===guideRecipient?-1:i;renderGuide();}
 if(b){const i=Number(b.dataset.budget);guideBudget=i===guideBudget?-1:i;renderGuide();}
});
document.querySelector('#cro-matching').addEventListener('click',showMatchingGifts);
document.querySelector('.guide-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();renderGuide(guideMode==='relationship'?'budget':'relationship');document.querySelector('#guide-'+guideMode+'-tab').focus();}});
renderGuide();
document.querySelector('#more-grid').innerHTML=products.slice(4).map(card).join('');
document.querySelector('#look-products').innerHTML=products.slice(0,3).map(card).join('');

const dialog=document.querySelector('#shopping-dialog'),content=document.querySelector('#dialog-content');
const byId=id=>products.find(p=>p.id===id);
function loadState(){try{const s=JSON.parse(localStorage.getItem('mia-pink-spectrum-v2')||'{}');return {wish:Array.isArray(s.wish)?s.wish.filter(byId):[],bag:Array.isArray(s.bag)?s.bag.filter(byId):[],bagVariants:s.bagVariants&&typeof s.bagVariants==='object'?s.bagVariants:{}}}catch{return {wish:[],bag:[],bagVariants:{}}}}
const state=loadState();
const bundleAssets={floral:'assets/cro-studs.webp',twilight:'assets/cro-pendant.webp',petal:'assets/cro-ring.webp',twist:'assets/cro-pendant.webp',charm:'assets/cro-bracelet.webp'};
const bundleSets=[
 {id:'glow',name:'Festive Glow Duo',products:['floral','twilight']},
 {id:'petal',name:'Petal Spark Duo',products:['floral','petal']},
 {id:'golden',name:'Golden Finish Duo',products:['twist','charm']}
];
let activeBundle='glow',bundleRingSize='';
const bundleSizes=['8','9','10','11','12','13','14','15','16','17','18','19','20'];
const bundleTotal=set=>set.products.reduce((sum,id)=>sum+byId(id).price,0);
const selectedPieces={glow:new Set(['floral','twilight']),petal:new Set(['floral','petal']),golden:new Set(['twist','charm'])};
const pieceLabels={floral:'Studs',twilight:'Pendant',petal:'Ring',twist:'Pendant',charm:'Bracelet'};
function renderBundles(){
 const descriptions=['Classic sparkle for your celebrations.','Delicate details, endless charm.','Elegant pieces for a lasting glow.'];
 document.querySelector('#bundles-grid').innerHTML=bundleSets.map((set,i)=>`<article class="cro-set-card ${set.id===activeBundle?'is-active':''}" id="bundle-${set.id}" data-bundle="${set.id}"><h3>${set.name}</h3><p>${descriptions[i]}</p><div class="cro-pieces">${set.products.map(id=>`<label class="cro-piece"><img src="${bundleAssets[id]}" alt="${byId(id).name} — illustrative artwork" width="640" height="640" loading="lazy"><span><input type="checkbox" data-piece="${id}" data-set="${set.id}" ${selectedPieces[set.id].has(id)?'checked':''}><span>${pieceLabels[id]}<strong>${currency(byId(id).price)}</strong></span></span></label>`).join('')}</div><div class="cro-size-note">${set.id==='petal'?'<button data-bundle-size="petal">Ring size required ⓘ</button>':''}</div><div class="cro-set-total"><span>Set total</span><strong>${currency([...selectedPieces[set.id]].reduce((v,id)=>v+byId(id).price,0))}</strong></div><button class="cro-button" data-bundle-view="${set.id}">Choose this set ${icon('arrow')}</button><button class="cro-single" data-single="${set.id}">Buy one piece ${icon('arrow')}</button></article>`).join('');
}
document.querySelector('#bundles-grid').addEventListener('change',e=>{
 if(!e.target.matches('[data-piece]'))return;
 const selected=selectedPieces[e.target.dataset.set];
 if(e.target.checked)selected.add(e.target.dataset.piece);else selected.delete(e.target.dataset.piece);
 const article=e.target.closest('.cro-set-card');
 article.querySelector('.cro-set-total strong').textContent=currency([...selected].reduce((v,id)=>v+byId(id).price,0));
});
document.querySelector('#bundles-grid').addEventListener('click',e=>{const b=e.target.closest('[data-single]');if(b){const set=bundleSets.find(s=>s.id===b.dataset.single);collection('Choose one piece',set.products.map(byId));}});
function selectBundle(id){
 if(!bundleSets.some(set=>set.id===id))return;
 activeBundle=id;
 bundleSets.forEach(set=>{
  document.querySelector('#bundle-tab-'+set.id).setAttribute('aria-pressed',String(set.id===id));
  document.querySelector('#bundle-'+set.id).classList.toggle('is-active',set.id===id);
 });
}
function showBundle(id,focusSize=false){
 const original=bundleSets.find(s=>s.id===id);if(!original)return;
 const set={...original,products:[...selectedPieces[id]]};if(!set.products.length){toast('Select at least one piece.');return;}
 const ring=set.products.includes('petal');
 openDialog(set.name,`<div class="bundle-review-items">${set.products.map(pid=>`<article class="bundle-review-item"><img src="${bundleAssets[pid]}" alt="${byId(pid).name}" width="1024" height="1024"><h3>${byId(pid).name}</h3><p>${currency(byId(pid).price)}</p></article>`).join('')}</div>${ring?`<label class="bundle-ring-field" for="bundle-ring-size">Choose ring size<select id="bundle-ring-size"><option value="">Select size</option>${bundleSizes.map(size=>`<option value="${size}" ${bundleRingSize===size?'selected':''}>${size}</option>`).join('')}</select></label><p class="bundle-size-error" id="bundle-size-error" role="status"></p>`:''}<p class="detail-price">Selected total ${currency(bundleTotal(set))}</p><div class="dialog-actions"><button data-bundle-add="${id}">Add selected to preview bag</button></div><p class="dialog-note">Design preview using the supplied product prices. Ring sizes are illustrative options; live availability and checkout are not connected.</p>`);
 if(focusSize&&ring)document.querySelector('#bundle-ring-size').focus();
}
function addBundle(id){
 const original=bundleSets.find(s=>s.id===id);if(!original)return;const set={...original,products:[...selectedPieces[id]]};if(!set.products.length)return;
 let size='';
 if(set.products.includes('petal')){
  const field=document.querySelector('#bundle-ring-size');size=field.value;
  if(!bundleSizes.includes(size)){document.querySelector('#bundle-size-error').textContent='Please choose a ring size.';field.focus();return;}
  bundleRingSize=size;
 }
 set.products.forEach(pid=>{const index=state.bag.length;state.bag.push(pid);if(pid==='petal')state.bagVariants[index]=size;});
 persist();showBag();toast('Selected pieces added to your preview bag.');
}
function removeBagItem(id,index=state.bag.indexOf(id)){
 if(!Number.isInteger(index)||index<0||state.bag[index]!==id)return;
 state.bag.splice(index,1);
 state.bagVariants=Object.fromEntries(Object.entries(state.bagVariants).filter(([key])=>Number(key)!==index).map(([key,value])=>[Number(key)>index?Number(key)-1:Number(key),value]));
}
document.querySelector('.bundle-tabs').addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();const i=bundleSets.findIndex(set=>set.id===activeBundle);
 const next=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;
 selectBundle(bundleSets[next].id);document.querySelector('#bundle-tab-'+activeBundle).focus();
});
renderBundles();
function persist(){try{localStorage.setItem('mia-pink-spectrum-v2',JSON.stringify(state))}catch{}updateCounts()}
function updateCounts(){for(const [key,id] of [['wish','wish-count'],['bag','bag-count']]){const el=document.getElementById(id);el.textContent=state[key].length;el.hidden=!state[key].length}}
function openDialog(title,body){document.querySelector('#dialog-title').textContent=title;content.innerHTML=body;if(!dialog.open)dialog.showModal()}
let toastTimer;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500)}
function detail(id){const p=byId(id);if(!p)return;openDialog(p.name,`${art(p.crop,p.name,'detail-art')}<p class="detail-price">${currency(p.price)}</p><div class="dialog-actions"><button data-add="${id}">Add to bag</button><button data-save="${id}">${state.wish.includes(id)?'Remove from wishlist':'Save to wishlist'}</button></div><p class="dialog-note">Design preview. Product names, prices and offers reproduce the supplied mockup; these are not a verified live Mia catalogue. Bag and wishlist are stored on this device. No payment is taken.</p>`)}
function list(items,kind){return `<div class="dialog-list">${items.map((p,i)=>`<div class="dialog-item">${kind==='bag'&&bundleAssets[p.id]?`<span class="product-art"><img src="${bundleAssets[p.id]}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain"></span>`:art(p.crop,p.name)}<div><h3>${p.name}</h3><p>${currency(p.price)}</p>${kind==='bag'&&bundleSizes.includes(state.bagVariants[i])?`<p>Ring size: ${state.bagVariants[i]}</p>`:''}<button data-product="${p.id}">View details</button></div>${kind?`<button data-remove="${p.id}" data-kind="${kind}" data-index="${i}" aria-label="Remove ${p.name}">×</button>`:''}</div>`).join('')}</div>`}
function collection(title,items){openDialog(title,list(items))}
function showBag(){const items=state.bag.map(byId);openDialog('Your bag',items.length?list(items,'bag')+`<p class="detail-price">Total ${currency(items.reduce((a,p)=>a+p.price,0))}</p><p class="dialog-note">Preview bag only. Checkout is not connected; no order or payment will be placed.</p>`:'<p>Your bag is empty. Select a piece to see its details and add it here.</p><div class="dialog-actions"><button data-action="all">Explore jewellery</button></div>')}
function showWishlist(){const items=state.wish.map(byId);openDialog('Your wishlist',items.length?list(items,'wish'):'<p>Your saved pieces will appear here.</p><div class="dialog-actions"><button data-action="all">Explore jewellery</button></div>')}
function showCategory(id){const category=festivalCategories.find(c=>c.id===id);if(!category)return;openDialog(category.name,`<div class="category-preview"><img src="${category.image}" alt="${category.name} — The Festival Edit"></div>`+(category.products.length?list(category.products.map(byId)):'<p class="dialog-note">A preview of our necklace edit. Product details and prices are not yet available for this collection.</p>'))}
function action(name){switch(name){
case 'menu':openDialog('Explore Mia','<nav class="menu-links"><a href="#more">New In</a><a href="#gifts">Gifts</a><a href="#featured">Collections</a><a href="#offers">Festive Edit</a><a href="#" data-action="stores">Stores</a></nav>');break;
case 'all':collection('Lightscapes by Mia',products);break;
case 'latest-gold':collection('Gold Jewellery',products.filter(p=>['floral','twilight','bloom'].includes(p.id)));break;
case 'latest-diamond':collection('Diamond Jewellery',products);break;
case 'look':collection('Complete the Look',products.filter(p=>['floral','twilight','bloom','charm','petal'].includes(p.id)));break;
case 'festival':openDialog('The Festival Edit',`<div class="category-menu">${festivalCategories.map(c=>`<button data-category="${c.id}"><img src="${c.image}" alt="${c.name}"><span>${c.name} →</span></button>`).join('')}</div>`);break;
case 'gifts':collection('Gifts for every celebration',products);break;
case 'wishlist':showWishlist();break;
case 'bag':showBag();break;
case 'search':openDialog('Find your sparkle','<label class="sr-only" for="jewellery-search">Search jewellery</label><input class="search-field" id="jewellery-search" type="search" placeholder="Search rings, earrings, pendants…"><div id="search-results">'+list(products)+'</div>');document.querySelector('#jewellery-search').focus();break;
case 'offer':openDialog('Festive Offer','<p class="detail-price">Up to 80% Off* · Flat 15% Off*</p><p class="dialog-note">Offer wording is reproduced from your design reference. Terms, eligibility and actual availability have not been supplied or verified. This preview does not apply a live discount.</p><div class="dialog-actions"><button data-action="all">Browse the edit</button></div>');break;
case 'stores':openDialog('Visit a Mia store','<p>Explore the collection and find your next favourite.</p><p class="dialog-note">This design preview is not connected to Mia’s store appointment system. No appointment will be made here.</p>');break;
case 'giftcard':openDialog('Mia Gift Card','<p>Share happiness with a gift card that celebrates her.</p><p class="dialog-note">Gift card purchasing is not connected in this design preview.</p>');break;
case 'account':openDialog('Your Mia account','<p class="dialog-note">Account sign-in is not connected in this design preview. Your wishlist and preview bag are saved on this device without an account.</p><div class="dialog-actions"><button data-action="wishlist">Open wishlist</button><button data-action="bag">Open bag</button></div>');break;
}}
document.addEventListener('click',e=>{
 const close=e.target.closest('.close-dialog');if(close){dialog.close();return}
 const bundleTab=e.target.closest('[data-bundle-tab]');if(bundleTab){selectBundle(bundleTab.dataset.bundleTab);return}
 const bundleView=e.target.closest('[data-bundle-view]');if(bundleView){showBundle(bundleView.dataset.bundleView);return}
 const bundleSize=e.target.closest('[data-bundle-size]');if(bundleSize){showBundle(bundleSize.dataset.bundleSize,true);return}
 const bundleAdd=e.target.closest('[data-bundle-add]');if(bundleAdd){addBundle(bundleAdd.dataset.bundleAdd);return}
 const guideTab=e.target.closest('[data-guide-mode]');if(guideTab){renderGuide(guideTab.dataset.guideMode);return}
 const lookPiece=e.target.closest('[data-look-piece]');if(lookPiece){document.querySelectorAll('[data-look-piece]').forEach(dot=>{const selected=dot.dataset.lookPiece===lookPiece.dataset.lookPiece;dot.classList.toggle('active',selected);dot.setAttribute('aria-pressed',String(selected))});detail(lookPiece.dataset.lookPiece);return}
 const p=e.target.closest('[data-product]');if(p){detail(p.dataset.product);return}
 const add=e.target.closest('[data-add]');if(add){state.bag.push(add.dataset.add);persist();toast('Added to your preview bag.');return}
 const save=e.target.closest('[data-save]');if(save){const id=save.dataset.save;state.wish=state.wish.includes(id)?state.wish.filter(x=>x!==id):[...state.wish,id];persist();detail(id);return}
 const remove=e.target.closest('[data-remove]');if(remove){const key=remove.dataset.kind,index=state[key].indexOf(remove.dataset.remove);if(key==='bag')removeBagItem(remove.dataset.remove,remove.dataset.index===undefined?undefined:Number(remove.dataset.index));else if(index>=0)state[key].splice(index,1);persist();key==='bag'?showBag():showWishlist();return}
 const category=e.target.closest('[data-category]');if(category){showCategory(category.dataset.category);return}
 const gift=e.target.closest('[data-gift]');if(gift){collection(gifts.find(g=>g.mood===gift.dataset.gift).name,products.filter(p=>p.mood===gift.dataset.gift));return}
 const a=e.target.closest('[data-action]');if(a){e.preventDefault();action(a.dataset.action);return}
 const info=e.target.closest('[data-info]');if(info){openDialog(info.dataset.info,'<p class="dialog-note">This link is part of the supplied design. A verified destination or service has not been connected to this preview.</p>');return}
 const anchor=e.target.closest('a[href^="#"]');if(anchor&&dialog.open)dialog.close();
 const link=e.target.closest('[data-link-mood]');if(link)collection('Gold Jewellery',products.filter(p=>p.mood==='Gold'));
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('input',e=>{if(e.target.id==='jewellery-search'){const q=e.target.value.toLowerCase().trim();const matches=products.filter(p=>p.name.toLowerCase().includes(q));document.querySelector('#search-results').innerHTML=matches.length?list(matches):'<p>No matching pieces. Try “ring”, “earrings” or “pendant”.</p>'}});
document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();openDialog('Join Our Journey','<p class="dialog-note">Newsletter signup is not connected in this preview. Your email has not been submitted or subscribed.</p>')});
const mobile=matchMedia('(max-width: 700px)');function footerMode(){document.querySelectorAll('.footer-group').forEach(d=>d.open=!mobile.matches)}mobile.addEventListener('change',footerMode);footerMode();updateCounts();

// Match the actual Pooja section height without changing or scaling that section.
const poojaHeightSource=document.querySelector('#gifts');
const latestCollections=document.querySelector('#latest-collections');
const miaPromises=document.querySelector('#mia-promises');
const diwaliBundles=document.querySelector('#diwali-bundles');
function syncLatestCollectionsHeight(){
 const height=poojaHeightSource.offsetHeight;
 if(height>0){
  latestCollections.style.setProperty('--collections-height',height+'px');
  miaPromises.style.setProperty('--promises-height',(height*.8)+'px');
  diwaliBundles.style.setProperty('--bundles-height',height+'px');
 }
}
syncLatestCollectionsHeight();
if(typeof ResizeObserver==='function'){
 const collectionsSizeObserver=new ResizeObserver(syncLatestCollectionsHeight);
 collectionsSizeObserver.observe(poojaHeightSource);
}

// Jewellery anchors use source-image pixels, not percentages of the cropped panel.
// Keep the campaign, image crop and label sizes unchanged at every breakpoint.
const lookPhoto=document.querySelector('.look-photo');
const lookModel=lookPhoto.querySelector('.look-model');
const lookAnchors=[
 ['earrings',506,300],
 ['necklace',543,484],
 ['bangles',538,773],
 ['bracelet',666,791],
 ['rings',731,887]
];
function alignLookPointers(){
 if(!lookModel.naturalWidth||!lookModel.naturalHeight)return;
 const imageBox=lookModel.getBoundingClientRect();
 if(!imageBox.width||!imageBox.height)return;
 const scale=Math.max(imageBox.width/lookModel.naturalWidth,imageBox.height/lookModel.naturalHeight);
 const position=getComputedStyle(lookModel).objectPosition.split(' ').map(value=>parseFloat(value)/100);
 const imageLeft=imageBox.left+(imageBox.width-lookModel.naturalWidth*scale)*position[0];
 const imageTop=imageBox.top+(imageBox.height-lookModel.naturalHeight*scale)*position[1];
 lookPhoto.querySelectorAll('.look-leaders,.look-mobile-leaders').forEach(svg=>{
  const box=svg.getBoundingClientRect();
  if(!box.width||!box.height)return;
  const leaders=[];
  lookAnchors.forEach(([piece,x,y])=>{
   const label=lookPhoto.querySelector('.look-'+piece).getBoundingClientRect();
   if(!label.width||!label.height)return;
   const targetX=imageLeft+x*scale,targetY=imageTop+y*scale;
   const labelOnLeft=label.left+label.width/2<targetX;
   const startX=((labelOnLeft?label.right:label.left)-box.left)/box.width*100;
   const startY=(label.top+label.height/2-box.top)/box.height*100;
   const endX=(targetX-box.left)/box.width*100;
   const endY=(targetY-box.top)/box.height*100;
   const elbowX=startX+(endX-startX)*.35;
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');
   path.setAttribute('d',`M${startX} ${startY}H${elbowX}L${endX} ${endY}`);
   path.setAttribute('fill','none');
   const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
   dot.setAttribute('cx',endX);dot.setAttribute('cy',endY);dot.setAttribute('r','.55');
   dot.setAttribute('fill','#f5c574');dot.setAttribute('stroke','#fff2cc');dot.setAttribute('stroke-width','.15');
   leaders.push(path,dot);
  });
  svg.replaceChildren(...leaders);
 });
}
lookModel.addEventListener('load',alignLookPointers);
window.addEventListener('resize',alignLookPointers);
if(typeof ResizeObserver==='function'){
 const lookSizeObserver=new ResizeObserver(alignLookPointers);
 lookSizeObserver.observe(lookPhoto);
 lookPhoto.querySelectorAll('.look-hotspot').forEach(label=>lookSizeObserver.observe(label));
}
if(document.fonts)document.fonts.ready.then(alignLookPointers);
alignLookPointers();
