// ---- dataset: 20 products ----
  const PRODUCTS = [
    {id:1,name:'ZenPhone X12',price:17999,cat:'electronics',brand:'Zen',rating:4.5,img:'assets/OIP.webp'},
    {id:2,name:'ZenPad Pro',price:24999,cat:'electronics',brand:'Zen',rating:4.2,img:'assets/pad.webp'},
    {id:3,name:'Orbit Headphones',price:3999,cat:'electronics',brand:'Orbit',rating:4.6,img:'assets/headphone.jpg'},
    {id:4,name:'Luma Smartwatch',price:7999,cat:'electronics',brand:'Luma',rating:4.1,img:'assets/smartwatch.jpg'},
    {id:5,name:'Aurora Jacket',price:3599,cat:'fashion',brand:'Aurora',rating:4.0,img:'assets/jacket.webp'},
    {id:6,name:'Nimbus Sneakers',price:2999,cat:'fashion',brand:'Nimbus',rating:4.4,img:'assets/snakers.webp'},
    {id:7,name:'Everly Jeans',price:1999,cat:'fashion',brand:'Everly',rating:3.9,img:'assets/jenes.webp'},
    {id:8,name:'Comfy Chair',price:8999,cat:'home',brand:'HomeCo',rating:4.3,img:'assets/chair.jpg'},
    {id:9,name:'Glow Table Lamp',price:1299,cat:'home',brand:'Glow',rating:4.0,img:'assets/lamp.webp'},
    {id:10,name:'PureAir Purifier',price:11999,cat:'home',brand:'PureAir',rating:4.5,img:'assets/air purifier.webp'},
    {id:11,name:'Strike Cricket Bat',price:2499,cat:'sports',brand:'Strike',rating:4.2,img:'assets/bat.webp'},
    {id:12,name:'Velocity Tennis Racket',price:3999,cat:'sports',brand:'Velocity',rating:4.0,img:'assets/tennis racket.webp'},
    {id:13,name:'Flex Yoga Mat',price:999,cat:'sports',brand:'Flex',rating:4.6,img:'assets/yoga mat.webp'},
    {id:14,name:'ChefMaster Cookware',price:7499,cat:'home',brand:'ChefMaster',rating:4.4,img:'assets/cookware.webp'},
    {id:15,name:'PixelCam 4K',price:21999,cat:'electronics',brand:'Pixel',rating:4.7,img:'assets/dashcam.webp'},
    {id:16,name:'GlowKids Toy Set',price:699,cat:'kids',brand:'Glow',rating:4.1,img:'assets/toy set.webp'},
    {id:17,name:'Trail Backpack',price:1999,cat:'fashion',brand:'Trail',rating:4.2,img:'assets/bag.webp'},
    {id:18,name:'Hearty Blender',price:3499,cat:'home',brand:'Hearty',rating:4.0,img:'assets/Hearty Blender.webp'},
    {id:19,name:'Studio Microphone',price:5499,cat:'electronics',brand:'Studio',rating:4.3,img:'assets/Studio Microphone.webp'},
    {id:20,name:'EcoWater Bottle',price:499,cat:'home',brand:'Eco',rating:4.5,img:'assets/EcoWater Bottle.webp'}
  ];

  // state
  let state = {query:'',category:'all',brand:'all',minPrice:0,maxPrice:Infinity,sort:'relevance',page:1,perPage:9,cart:{}}

  // derived: categories & brands
  const CATS = ['all',...Array.from(new Set(PRODUCTS.map(p=>p.cat)))];
  const BRANDS = ['all',...Array.from(new Set(PRODUCTS.map(p=>p.brand)))];

  // dom refs
  const catChips = document.getElementById('catChips');
  const brandChips = document.getElementById('brandChips');
  const grid = document.getElementById('productGrid');
  const resultsCount = document.getElementById('resultsCount');
  const searchInput = document.getElementById('search');
  const cartCount = document.getElementById('cartCount');

  // init UI
  function init(){
    renderChips();
    renderBrands();
    applyFilters();
    attachUI();
    renderComments();
    updateCartUI();
  }

  function renderChips(){
    catChips.innerHTML='';
    CATS.forEach(c=>{
      const btn=document.createElement('button');btn.className='chip';btn.textContent=c;btn.onclick=()=>{state.category=c;state.page=1;applyFilters()};
      if(state.category===c)btn.classList.add('active');catChips.appendChild(btn);
    })
  }
  function renderBrands(){
    brandChips.innerHTML='';BRANDS.forEach(b=>{const btn=document.createElement('button');btn.className='chip';btn.textContent=b;btn.onclick=()=>{state.brand=b;state.page=1;applyFilters()};brandChips.appendChild(btn)})
  }

  function applyFilters(){
    const q = searchInput.value.trim().toLowerCase(); state.query=q;
    let list = PRODUCTS.filter(p=>{
      if(state.category!=='all' && p.cat!==state.category) return false;
      if(state.brand!=='all' && p.brand!==state.brand) return false;
      if(p.price < state.minPrice) return false;
      if(p.price > state.maxPrice) return false;
      if(q){ const hay = (p.name+' '+p.brand+' '+p.cat).toLowerCase(); if(!hay.includes(q)) return false }
      return true;
    });

    // sorting
    if(state.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    if(state.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    if(state.sort==='rating') list.sort((a,b)=>b.rating-b.rating*0.9999 || b.rating - a.rating);

    state._filtered = list;
    state._totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
    renderProducts();
  }

  function renderProducts(){
    grid.innerHTML='';
    const start = (state.page-1)*state.perPage; const slice = state._filtered.slice(start, start+state.perPage);
    resultsCount.textContent = state._filtered.length;
    slice.forEach(p=>{
      const el = document.createElement('article'); el.className='card fade-up';
      el.innerHTML = `
        <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
        <div class="meta">
          <div class="title">${p.name}</div>
          <div class="muted">${p.brand} • ${p.cat} • ${p.rating} ★</div>
          <div class="price">₹ ${p.price.toLocaleString('en-IN')}</div>
          <div class="actions">
            <button class="btn primary" data-id="${p.id}" onclick="addToCart(${p.id})">Add to cart</button>
            <button class="btn ghost" onclick="openQuickView(${p.id})">Quick view</button>
          </div>
        </div>
      `;
      grid.appendChild(el);
    })
    document.getElementById('pageInfo').textContent = `Page ${state.page} of ${state._totalPages}`;
  }

  // quick view
  function openQuickView(id){
    const p = PRODUCTS.find(x=>x.id===id);
    document.getElementById('modalLeft').innerHTML = `<div style="padding:8px"><img src="${p.img}" style="width:100%;border-radius:8px"/></div>`;
    document.getElementById('modalRight').innerHTML = `<div style="padding:8px"><h3>${p.name}</h3><p style="color:var(--muted)">${p.brand} • ${p.cat}</p><p style="font-weight:900;margin-top:10px">₹ ${p.price.toLocaleString('en-IN')}</p><p style="margin-top:12px">Rating: ${p.rating} ★</p><div style="margin-top:16px"><button class="btn primary" onclick="addToCart(${p.id});closeModal()">Add to cart</button> <button class="btn ghost" onclick="closeModal()">Close</button></div></div>`;
    document.getElementById('modal').classList.add('show');
  }
  function closeModal(){document.getElementById('modal').classList.remove('show')}

  // cart
  function addToCart(id){ state.cart[id] = (state.cart[id]||0)+1; updateCartUI(); flashCart(); }
  function updateCartUI(){ const total = Object.values(state.cart).reduce((s,n)=>s+n,0); cartCount.textContent = total; }
  function flashCart(){ const btn = document.getElementById('openCart'); btn.animate([{transform:'translateY(-6px)'},{transform:'none'}],{duration:350}); }

  // pagination
  document.getElementById('nextPage').addEventListener('click',()=>{ if(state.page < state._totalPages){ state.page++; renderProducts() } })
  document.getElementById('prevPage').addEventListener('click',()=>{ if(state.page>1){ state.page--; renderProducts() } })

  // ui bindings
  function attachUI(){
    document.getElementById('applyPrice').addEventListener('click',()=>{ const min = Number(document.getElementById('minPrice').value)||0; const max = Number(document.getElementById('maxPrice').value)||Infinity; state.minPrice=min; state.maxPrice=max; applyFilters(); })
    document.getElementById('clearFilters').addEventListener('click',()=>{ state={...state,category:'all',brand:'all',minPrice:0,maxPrice:Infinity}; document.getElementById('minPrice').value='';document.getElementById('maxPrice').value='';renderChips();applyFilters(); })
    document.getElementById('sort').addEventListener('change',(e)=>{ state.sort=e.target.value; applyFilters(); })
    document.getElementById('toggleFilters').addEventListener('click',()=>{ const f=document.getElementById('filters'); f.style.display = f.style.display==='none'?'block':'none' })
    document.getElementById('searchBtn').addEventListener('click',()=>{ state.page=1;applyFilters() })
    searchInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ state.page=1;applyFilters() } })

    // modal close
    document.getElementById('modal').addEventListener('click',(e)=>{ if(e.target.id==='modal') closeModal() })

    // contact form
    document.getElementById('contactForm').addEventListener('submit',(e)=>{ e.preventDefault(); alert('Thanks! We received your message.'); e.target.reset(); })

    // comments
    document.getElementById('commentForm').addEventListener('submit',(e)=>{ e.preventDefault(); const form = e.target; const data={user:form.user.value, rating:form.rating.value, comment:form.comment.value, ts:Date.now()}; COMMENTS.unshift(data); form.reset(); renderComments(); alert('Comment posted'); })

    // page init defaults
    state.page = 1; state.perPage = 9; applyFilters();
  }

  // comments (sample)
  let COMMENTS = [
    {user:'Aisha',rating:5,comment:'Great demo and UI — very responsive!',ts:Date.now()-86400000},
    {user:'Ravi',rating:4,comment:'Love the filters. Could add wishlist next.',ts:Date.now()-3600000}
  ];
  function renderComments(){ const list = document.getElementById('commentList'); list.innerHTML=''; COMMENTS.forEach(c=>{ const d=document.createElement('div'); d.className='comment'; d.innerHTML = `<strong>${c.user}</strong> • ${c.rating}★<div style="color:var(--muted);margin-top:6px">${c.comment}</div>`; list.appendChild(d) }) }

  // simple cart open (demo)
  document.getElementById('openCart').addEventListener('click',()=>{ const items = Object.keys(state.cart).map(id=>{ const p=PRODUCTS.find(x=>x.id==id); return `${p.name} × ${state.cart[id]} — ₹${(p.price*state.cart[id]).toLocaleString('en-IN')}` }).join('\n'); if(items.length===0) alert('Cart is empty'); else alert('Cart:\n'+items); })

  // init on load
  window.addEventListener('DOMContentLoaded',init)

  document.getElementById('toggleDark').addEventListener('click', function() {
    document.body.classList.toggle('dark');
    this.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
