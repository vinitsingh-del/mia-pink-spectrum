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
const art = (crop,label,className='product-art') => `<span class="${className}"><svg viewBox="${crop.join(' ')}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><image href="assets/reference-artwork.jpg" width="1024" height="1536"/></svg></span>`;
const card = p => `<article class="product-card"><button class="product-main" data-product="${p.id}" aria-label="View ${p.name}, ${currency(p.price)}">${art(p.crop,p.name)}<span class="product-text"><span class="product-name">${p.name}</span><span class="product-price">${currency(p.price)}</span></span><span class="round-arrow">${icon('chevron')}</span></button></article>`;
const festivalCategories=[
 {id:'necklaces',name:'Necklaces',image:'assets/necklaces.webp',products:[]},
 {id:'earrings',name:'Earrings',image:'assets/earrings.webp',products:['floral','halo']},
 {id:'rings',name:'Rings',image:'assets/rings.webp',products:['petal','layered']},
 {id:'bangles',name:'Bangles',image:'assets/bangles.webp',products:['bloom']},
 {id:'pendants',name:'Pendants',image:'assets/pendants.webp',products:['twilight','twist']}
];
// Reuse only photographic windows from the approved gift-box mockup.
// Captions, tabs, arrows and scrolling remain native accessible UI.
const guideRelationships=[
 {title:'For Her',copy:'Celebrate her light',category:'earrings',crop:[49,316,247,374]},
 {title:'For Mom',copy:'Forever grateful',category:'bangles',crop:[311,316,242,374]},
 {title:'For Sister',copy:'Partners in joy',category:'rings',crop:[571,316,244,374]},
 {title:'For Wife',copy:'A brighter tomorrow',category:'pendants',crop:[833,316,242,374]},
 {title:'For Friends',copy:'Because she’s family',category:'necklaces',crop:[1094,316,242,374]}
];
const guideBudgets=[
 {title:'Under ₹25,000',copy:'Little gestures of love',min:0,max:25000,crop:guideRelationships[0].crop},
 {title:'₹25,000–₹35,000',copy:'Something truly special',min:25000,max:35000,crop:guideRelationships[2].crop},
 {title:'₹35,000–₹50,000',copy:'A celebration to remember',min:35000,max:50000,crop:guideRelationships[3].crop},
 {title:'₹50,000 & above',copy:'For life’s big moments',min:50000,max:Infinity,crop:guideRelationships[1].crop},
 {title:'All Gifts',copy:'Find their next favourite',min:0,max:Infinity,crop:guideRelationships[4].crop}
];
const guidePhoto=(g)=>`<span class="guide-photo"><svg viewBox="${g.crop.join(' ')}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${g.title} — jewellery in a festive gift box"><image href="assets/gifting-guide-artwork.png" width="1774" height="887"/></svg></span>`;
let guideMode='relationship';
const guideGrid=document.querySelector('#guide-grid');
function renderGuide(mode){
 if(!['relationship','budget'].includes(mode))return;
 guideMode=mode;const items=mode==='relationship'?guideRelationships:guideBudgets;
 guideGrid.setAttribute('data-mode',mode);
 guideGrid.innerHTML=items.map((g,i)=>`<article class="guide-card"><button class="guide-card-button" data-guide-item="${i}" aria-label="${g.title}: ${g.copy}">${guidePhoto(g)}<span class="guide-caption"><span class="guide-name">${g.title}</span><span class="guide-description">${g.copy}</span><span class="guide-arrow">${icon('arrow')}</span></span></button></article>`).join('');
 for(const name of ['relationship','budget']){const tab=document.querySelector('#guide-'+name+'-tab');tab.setAttribute('aria-selected',String(name===mode));tab.setAttribute('tabindex',name===mode?'0':'-1')}
 document.querySelector('#guide-panel').setAttribute('aria-labelledby','guide-'+mode+'-tab');
 document.querySelector('#guide-progress').innerHTML=items.slice(0,4).map((g,i)=>`<button data-guide-page="${i}" aria-label="Show gifting cards ${i+1} and ${i+2}" aria-pressed="${i===0}"></button>`).join('');
 guideGrid.scrollLeft=0;
}
function showGuideItem(index){
 const items=guideMode==='relationship'?guideRelationships:guideBudgets,g=items[Number(index)];if(!g)return;
 if(guideMode==='budget'){collection(g.title,products.filter(p=>p.price>=g.min&&p.price<g.max));return}
 showCategory(g.category);document.querySelector('#dialog-title').textContent=g.title;
}
function syncGuideProgress(){
 const available=guideGrid.scrollWidth-guideGrid.clientWidth;
 const page=available>0?Math.round(3*guideGrid.scrollLeft/available):0;
 document.querySelectorAll('[data-guide-page]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.guidePage)===page)));
}
guideGrid.addEventListener('scroll',syncGuideProgress,{passive:true});
document.querySelector('.guide-tabs').addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();const next=e.key==='Home'?'relationship':e.key==='End'?'budget':guideMode==='relationship'?'budget':'relationship';renderGuide(next);document.querySelector('#guide-'+next+'-tab').focus();
});
renderGuide('relationship');
document.querySelector('#more-grid').innerHTML=products.slice(4).map(card).join('');
document.querySelector('#look-products').innerHTML=products.slice(0,3).map(card).join('');

const dialog=document.querySelector('#shopping-dialog'),content=document.querySelector('#dialog-content');
const byId=id=>products.find(p=>p.id===id);
function loadState(){try{const s=JSON.parse(localStorage.getItem('mia-pink-spectrum-v2')||'{}');return {wish:Array.isArray(s.wish)?s.wish.filter(byId):[],bag:Array.isArray(s.bag)?s.bag.filter(byId):[],bagVariants:s.bagVariants&&typeof s.bagVariants==='object'?s.bagVariants:{}}}catch{return {wish:[],bag:[],bagVariants:{}}}}
const state=loadState();
const bundleAssets={floral:'assets/bundle-studs.png',twilight:'assets/bundle-drop.png',petal:'assets/bundle-ring.png',twist:'assets/bundle-twist.png',charm:'assets/bundle-bracelet.png'};
const bundleSets=[
 {id:'glow',name:'Festive Glow Duo',products:['floral','twilight']},
 {id:'petal',name:'Petal Spark Duo',products:['floral','petal']},
 {id:'golden',name:'Golden Finish Duo',products:['twist','charm']}
];
let activeBundle='glow',bundleRingSize='';
const bundleSizes=['8','9','10','11','12','13','14','15','16','17','18','19','20'];
const bundleTotal=set=>set.products.reduce((sum,id)=>sum+byId(id).price,0);
function renderBundles(){
 document.querySelector('#bundles-grid').innerHTML=bundleSets.map(set=>`<article class="bundle-card ${set.id===activeBundle?'is-active':''}" id="bundle-${set.id}" data-bundle="${set.id}" aria-labelledby="bundle-title-${set.id}"><div class="bundle-pair">${set.products.map((id,i)=>`${i?'<span class="bundle-plus" aria-hidden="true">+</span>':''}<figure class="bundle-piece"><span class="bundle-image"><img src="${bundleAssets[id]}" alt="${byId(id).name}" width="1024" height="1024" loading="lazy"></span><figcaption>${byId(id).name}</figcaption></figure>`).join('')}</div><span class="bundle-count">2 pieces</span><h3 id="bundle-title-${set.id}">${set.name}</h3><p class="bundle-includes">${set.products.map(id=>byId(id).name).join(' + ')}</p><div class="bundle-price"><span>Combined total</span><strong>${currency(bundleTotal(set))}</strong></div><button class="bundle-view" data-bundle-view="${set.id}" aria-label="View ${set.name}">VIEW SET ${icon('arrow')}</button><div class="bundle-size-row">${set.id==='petal'?'<button class="bundle-size-link" data-bundle-size="petal">Choose ring size</button>':''}</div></article>`).join('');
}
function selectBundle(id){
 if(!bundleSets.some(set=>set.id===id))return;
 activeBundle=id;
 bundleSets.forEach(set=>{
  document.querySelector('#bundle-tab-'+set.id).setAttribute('aria-pressed',String(set.id===id));
  document.querySelector('#bundle-'+set.id).classList.toggle('is-active',set.id===id);
 });
}
function showBundle(id,focusSize=false){
 const set=bundleSets.find(s=>s.id===id);if(!set)return;
 const ring=set.products.includes('petal');
 openDialog(set.name,`<div class="bundle-review-items">${set.products.map(pid=>`<article class="bundle-review-item"><img src="${bundleAssets[pid]}" alt="${byId(pid).name}" width="1024" height="1024"><h3>${byId(pid).name}</h3><p>${currency(byId(pid).price)}</p></article>`).join('')}</div>${ring?`<label class="bundle-ring-field" for="bundle-ring-size">Choose ring size<select id="bundle-ring-size"><option value="">Select size</option>${bundleSizes.map(size=>`<option value="${size}" ${bundleRingSize===size?'selected':''}>${size}</option>`).join('')}</select></label><p class="bundle-size-error" id="bundle-size-error" role="status"></p>`:''}<p class="detail-price">Combined total ${currency(bundleTotal(set))}</p><div class="dialog-actions"><button data-bundle-add="${id}">Add both to preview bag</button></div><p class="dialog-note">Design preview using the supplied product prices. Ring sizes are illustrative options; live availability and checkout are not connected.</p>`);
 if(focusSize&&ring)document.querySelector('#bundle-ring-size').focus();
}
function addBundle(id){
 const set=bundleSets.find(s=>s.id===id);if(!set)return;
 let size='';
 if(set.products.includes('petal')){
  const field=document.querySelector('#bundle-ring-size');size=field.value;
  if(!bundleSizes.includes(size)){document.querySelector('#bundle-size-error').textContent='Please choose a ring size.';field.focus();return;}
  bundleRingSize=size;
 }
 set.products.forEach(pid=>{const index=state.bag.length;state.bag.push(pid);if(pid==='petal')state.bagVariants[index]=size;});
 persist();showBag();toast('Both pieces added to your preview bag.');
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
 const guideItem=e.target.closest('[data-guide-item]');if(guideItem){showGuideItem(guideItem.dataset.guideItem);return}
 const guidePage=e.target.closest('[data-guide-page]');if(guidePage){const page=Number(guidePage.dataset.guidePage);guideGrid.scrollTo({left:page*(guideGrid.scrollWidth-guideGrid.clientWidth)/3,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return}
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
