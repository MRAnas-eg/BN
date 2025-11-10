// scripts.js - compiled version for v3 (single-file SPA)
var DEFAULT_RANKS = [
    { id: 'r1', name: 'Member', price: '$2', perks: ['Custom chat color', 'Small tag'] },
    { id: 'r2', name: 'VIP', price: '$5', perks: ['Priority queue', 'Extra cosmetics'] },
    { id: 'r3', name: 'MVP', price: '$12', perks: ['Pets', 'Extra homes'] },
    { id: 'r4', name: 'Legend', price: '$25', perks: ['Unique effects', 'Exclusive role'] },
];
var STORAGE_KEY = 'bn_shop_v3_items';
var PAYMENT_KEY = 'bn_shop_v3_payment';
var RECEIVER_KEY = 'bn_shop_v3_receiver';
var ADMIN_PASS = 'roundowner10@';
function el(sel) { return document.querySelector(sel); }
function genId(prefix) { if (prefix === void 0) { prefix = 'r'; } return prefix + Math.random().toString(36).slice(2, 9); }
function loadShop() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RANKS));
        return DEFAULT_RANKS.slice();
    }
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        localStorage.removeItem(STORAGE_KEY);
        return DEFAULT_RANKS.slice();
    }
}
function saveShop(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function getPayment() { return localStorage.getItem(PAYMENT_KEY) === 'real' ? 'real' : 'credits'; }
function setPayment(m) { localStorage.setItem(PAYMENT_KEY, m); var cp = el('#currentPayment'); if (cp) cp.textContent = m === 'real' ? 'Real Money' : 'Credits'; }
function getReceiver() { return localStorage.getItem(RECEIVER_KEY) || 'Not set'; }
function setReceiver(name) { localStorage.setItem(RECEIVER_KEY, name); var r = el('#receiverUser'); if (r) r.textContent = name; }
function showSection(id) {
    document.querySelectorAll('.page').forEach(function (p) { return p.classList.remove('active'); });
    var elc = document.getElementById(id);
    if (elc)
        elc.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderShop() {
    var container = el('#shopCards');
    var items = loadShop();
    container.innerHTML = '';
    if (items.length === 0) {
        container.innerHTML = '<div class="muted">No items in shop.</div>';
        return;
    }
    var payment = getPayment();
    items.forEach(function (it) {
        var card = document.createElement('div');
        card.className = 'card';
        var buyLabel = payment === 'real' ? 'Buy (Real Money)' : 'Buy with Credits';
        card.innerHTML = "<h4>" + it.name + " <span style="float:right;font-weight:600">" + it.price + "</span></h4>
      <p>" + it.perks.join(' · ') + "</p>
      <div class="buy-row"><button class="btn" data-info="" + it.id + "">Info</button>
      <button class="btn primary" data-buy="" + it.id + "">" + buyLabel + "</button></div>";
        container.appendChild(card);
    });
    setPayment(getPayment());
    var ru = el('#receiverUser');
    if (ru)
        ru.textContent = getReceiver();
}
function openOwner() {
    var modal = el('#ownerModal');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    el('#ownerPass').value = '';
    el('#ownerMsg').textContent = '';
    el('#ownerLogin').style.display = 'block';
    el('#ownerPanel').style.display = 'none';
}
function closeOwner() {
    var modal = el('#ownerModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}
function setupOwner() {
    el('#openOwner').addEventListener('click', function (e) { e.preventDefault(); openOwner(); });
    el('#ownerOpenBtn').addEventListener('click', openOwner);
    el('#closeOwner').addEventListener('click', closeOwner);
    el('#ownerCancel').addEventListener('click', closeOwner);
    el('#ownerLoginBtn').addEventListener('click', function (e) {
        e.preventDefault();
        var pass = el('#ownerPass').value;
        var msg = el('#ownerMsg');
        if (pass === ADMIN_PASS) {
            el('#ownerLogin').style.display = 'none';
            el('#ownerPanel').style.display = 'block';
            populateAdmin();
            el('#receiverInput').value = getReceiver();
            el('#paymentMode').value = getPayment();
        }
        else {
            msg.textContent = 'Incorrect password.';
        }
    });
    el('#paymentMode').addEventListener('change', function () {
        var v = el('#paymentMode').value === 'real' ? 'real' : 'credits';
        setPayment(v);
        renderShop();
    });
    el('#receiverInput').addEventListener('change', function () {
        setReceiver(el('#receiverInput').value.trim() || 'Not set');
    });
    el('#adminForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(el('#adminForm'));
        var name = (fd.get('name') || '').toString().trim();
        var price = (fd.get('price') || '').toString().trim();
        var perks = (fd.get('perks') || '').toString().split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        if (!name)
            return;
        var items = loadShop();
        items.push({ id: genId(), name: name, price: price, perks: perks });
        saveShop(items);
        populateAdmin();
        renderShop();
        el('#adminForm').reset();
    });
    el('#adminClear').addEventListener('click', function () { el('input[name="name"]').value = ''; el('input[name="price"]').value = ''; el('input[name="perks"]').value = ''; });
}
function populateAdmin() {
    var list = el('#adminList');
    var items = loadShop();
    list.innerHTML = '';
    if (items.length === 0) {
        list.innerHTML = '<div class="muted">(no items)</div>';
        return;
    }
    items.forEach(function (it) {
        var row = document.createElement('div');
        row.className = 'admin-item';
        row.innerHTML = "<div><strong>" + it.name + "</strong> — " + it.price + "<div class="muted" style="font-size:12px">" + it.perks.join(', ') + "</div></div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn" data-edit="" + it.id + "">Edit</button>
        <button class="btn" data-delete="" + it.id + "">Delete</button>
      </div>";
        list.appendChild(row);
    });
    list.querySelectorAll('button').forEach(function (b) {
        var edit = b.getAttribute('data-edit');
        var del = b.getAttribute('data-delete');
        if (edit) {
            b.addEventListener('click', function () {
                var items = loadShop();
                var item = items.find(function (x) { return x.id === edit; });
                if (!item)
                    return;
                el('input[name="name"]').value = item.name;
                el('input[name="price"]').value = item.price;
                el('input[name="perks"]').value = item.perks.join(', ');
                var filtered = items.filter(function (x) { return x.id !== edit; });
                saveShop(filtered);
                populateAdmin();
                renderShop();
            });
        }
        if (del) {
            b.addEventListener('click', function () {
                var items = loadShop();
                var filtered = items.filter(function (x) { return x.id !== del; });
                saveShop(filtered);
                populateAdmin();
                renderShop();
            });
        }
    });
}
function setupNav() {
    document.querySelectorAll('.nav a[data-section]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var s = (a.getAttribute('data-section') || 'home');
            showSection(s);
        });
    });
    document.querySelectorAll('a[data-section]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var s = (a.getAttribute('data-section') || 'home');
            showSection(s);
        });
    });
    el('#navToggle').addEventListener('click', function () { el('.nav').classList.toggle('open'); });
    el('#brand').addEventListener('click', function () { return showSection('home'); });
    el('#playNow').addEventListener('click', function () { return alert('Launch Minecraft and join the IP!'); });
}
function setupShopActions() {
    document.addEventListener('click', function (e) {
        var target = e.target;
        var buy = target.getAttribute('data-buy');
        var info = target.getAttribute('data-info');
        if (info) {
            var items = loadShop();
            var it = items.find(function (x) { return x.id === info; });
            if (it)
                alert(it.name + " perks:\n- " + it.perks.join('\n- '));
        }
        if (buy) {
            var items = loadShop();
            var it = items.find(function (x) { return x.id === buy; });
            if (!it)
                return;
            var payment = getPayment();
            if (payment === 'real')
                alert("To purchase " + it.name + " (" + it.price + ") — use PayPal/Discord. This demo does not process payments.");
            else
                alert("To purchase " + it.name + " with credits — contact staff on Discord. Receiver: " + getReceiver());
        }
    });
}
function setupDevForm() {
    var form = el('#devForm');
    var msg = el('#devMsg');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var data = { name: fd.get('name') ? fd.get('name').toString() : '', role: fd.get('role') ? fd.get('role').toString() : '', experience: fd.get('experience') ? fd.get('experience').toString() : '', at: new Date().toISOString() };
        msg.textContent = 'Application submitted — staff will contact you on Discord if selected. (Demo)';
        console.log('Dev application', data);
    });
    el('#downloadJson').addEventListener('click', function () {
        var fd = new FormData(form);
        var data = { name: fd.get('name') ? fd.get('name').toString() : '', role: fd.get('role') ? fd.get('role').toString() : '', experience: fd.get('experience') ? fd.get('experience').toString() : '', savedAt: new Date().toISOString() };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'bn-dev-application.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}
function init() {
    renderShop();
    setupNav();
    setupOwner();
    setupShopActions();
    setupDevForm();
    el('#currentPayment').textContent = getPayment() === 'real' ? 'Real Money' : 'Credits';
    el('#receiverUser').textContent = getReceiver();
    var year = document.createElement('div');
    year.className = 'footer';
    year.textContent = "© " + new Date().getFullYear() + " Block Network — BN.";
    document.body.appendChild(year);
}
document.addEventListener('DOMContentLoaded', init);
