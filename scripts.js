const DEFAULT_RANKS = [
  { id:'r1', name:'Member', price:'$2', perks:['Custom chat color','Small tag'] },
  { id:'r2', name:'VIP', price:'$5', perks:['Priority queue','Extra cosmetics'] },
  { id:'r3', name:'MVP', price:'$12', perks:['Pets','Extra homes'] },
  { id:'r4', name:'Legend', price:'$25', perks:['Unique effects','Exclusive role'] },
];
const STORAGE_KEY = 'bn_shop_v3_items';
const PAYMENT_KEY = 'bn_shop_v3_payment';
const RECEIVER_KEY = 'bn_shop_v3_receiver';
const ADMIN_PASS = 'roundowner10@';

function el(sel){ return document.querySelector(sel); }

function genId(){ return 'r'+Math.random().toString(36).slice(2,9); }

function loadShop(){
  let raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){ localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RANKS)); return [...DEFAULT_RANKS];}
  try { return JSON.parse(raw);} catch(e){ localStorage.removeItem(STORAGE_KEY); return [...DEFAULT_RANKS];}
}

function saveShop(items){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items));}

function getPayment(){ return localStorage.getItem(PAYMENT_KEY) === 'real' ? 'real':'credits';}
function setPayment(m){ localStorage.setItem(PAYMENT_KEY,m); el('#currentPayment').textContent = m==='real'?'Real Money':'Credits';}

function getReceiver(){ return localStorage.getItem(RECEIVER_KEY)||'Not set';}
function setReceiver(name){ localStorage.setItem(RECEIVER_KEY,name); el('#receiverUser').textContent=name;}

function showSection(id){ document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); el('#'+id)?.classList.add('active'); window.scrollTo({top:0, behavior:'smooth'});}

function renderShop(){
  const container = el('#shopCards');
  const items = loadShop(); container.innerHTML='';
  if(items.length===0){ container.innerHTML='<div>No items in shop.</div>'; return;}
  const payment = getPayment();
  items.forEach(it=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h4>${it.name} <span style="float:right;font-weight:600">${it.price}</span></h4><p>${it.perks.join(' · ')}</p><div class="buy-row"><button data-info='${it.id}' class='btn'>Info</button> <button data-buy='${it.id}' class='btn primary'>${payment==='real'?'Buy (Real Money)':'Buy with Credits'}</button></div>`;
    container.appendChild(card);
  });
}

function openOwner(){ el('#ownerModal').style.display='flex'; el('#ownerPass').value=''; el('#ownerMsg')?.textContent=''; el('#ownerLogin').style.display='block'; el('#ownerPanel').style.display='none';}
function closeOwner(){ el('#ownerModal').style.display='none';}

function setupOwner(){
  el('#openOwner').addEventListener('click', e=>{e.preventDefault(); openOwner();});
  el('#closeOwner').addEventListener('click',closeOwner);
  el('#ownerLoginBtn').addEventListener('click',()=>{
    if(el('#ownerPass').value===ADMIN_PASS){
      el('#ownerLogin').style.display='none'; el('#ownerPanel').style.display='block'; populateAdmin();
      el('#receiverInput').value=getReceiver(); el('#paymentMode').value=getPayment();
    } else { el('#ownerMsg').textContent='Incorrect password.';}
  });
  el('#paymentMode').addEventListener('change',()=>{ setPayment(el('#paymentMode').value); renderShop();});
  el('#receiverInput').addEventListener('change',()=>{ setReceiver(el('#receiverInput').value.trim()||'Not set');});
  el('#adminForm').addEventListener('submit',e=>{
    e.preventDefault();
    const fd = new FormData(el('#adminForm'));
    const name=(fd.get('name')||'').toString().trim();
    const price=(fd.get('price')||'').toString().trim();
    const perks=(fd.get('perks')||'').toString().split(',').map(s=>s.trim()).filter(Boolean);
    if(!name) return;
    const items = loadShop(); items.push({id:genId(), name, price, perks}); saveShop(items); populateAdmin(); renderShop(); el('#adminForm').reset();
  });
  el('#adminClear').addEventListener('click',()=>{ el('input[name="name"]').value=''; el('input[name="price"]').value=''; el('input[name="perks"]').value='';});
}

function populateAdmin(){
  const list = el('#adminList'); const items = loadShop(); list.innerHTML='';
  items.forEach(it=>{
    const row = document.createElement('div'); row.className='admin-item';
    row.innerHTML=`<div><strong>${it.name}</strong> — ${it.price}<div>${it.perks.join(', ')}</div></div><div><button data-edit='${it.id}'>Edit</button> <button data-delete='${it.id}'>Delete</button></div>`;
    list.appendChild(row);
  });
  list.querySelectorAll('button').forEach(b=>{
    const edit=b.getAttribute('data-edit'); const del=b.getAttribute('data-delete');
    if(edit) b.addEventListener('click',()=>{
      const items=loadShop(); const item=items.find(x=>x.id===edit); if(!item) return;
      el('input[name="name"]').value=item.name; el('input[name="price"]').value=item.price; el('input[name="perks"]').value=item.perks.join(',');
      saveShop(items.filter(x=>x.id!==edit)); populateAdmin(); renderShop();
    });
    if(del) b.addEventListener('click',()=>{ saveShop(loadShop().filter(x=>x.id!==del)); populateAdmin(); renderShop(); });
  });
}

function setupNav(){
  document.querySelectorAll('.nav a[data-section]').forEach(a=>{
    a.addEventListener('click', e=>{ e.preventDefault(); showSection(a.getAttribute('data-section')); });
  });
  el('#navToggle').addEventListener('click',()=>{ el('.nav').classList.toggle('open');});
  el('#brand').addEventListener('click',()=>showSection('home'));
  el('#playNow').addEventListener('click',()=>alert('Launch Minecraft and join the IP!'));
}

function setupShopActions(){
  document.addEventListener('click',e=>{
    const buy=e.target.getAttribute('data-buy'); const info=e.target.getAttribute('data-info');
    if(info){ const it=loadShop().find(x=>x.id===info); if(it) alert(it.name+' perks:\n- '+it.perks.join('\n- '));}
    if(buy){ const it=loadShop().find(x=>x.id===buy); if(!it) return;
      if(getPayment()==='real') alert(`To purchase ${it.name} (${it.price}) — use PayPal/Discord.`);
      else alert(`To purchase ${it.name} with credits — contact staff. Receiver: ${getReceiver()}`);
    }
  });
}

function setupDevForm(){
  const form=el('#devForm'); const msg=el('#devMsg');
  form.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(form); msg.textContent='Application submitted — staff will contact you.'; });
  el('#downloadJson').addEventListener('click',()=>{
    const fd=new FormData(form); const data={ name:fd.get('name'), role:fd.get('role'), experience:fd.get('experience'), savedAt:new Date().toISOString() };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='bn-dev-application.json'; a.click(); URL.revokeObjectURL(url);
  });
}

function init(){ renderShop(); setupNav(); setupOwner(); setupShopActions(); setupDevForm(); setPayment(getPayment()); setReceiver(getReceiver()); }
document.addEventListener('DOMContentLoaded',init);
