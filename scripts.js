// scripts.js - v3 SPA with fixed nav
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
function genId(prefix) { return (prefix || 'r') + Math.random().toString(36).slice(2, 9); }

function loadShop() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RANKS)); return DEFAULT_RANKS.slice(); }
  try { return JSON.parse(raw); } catch { localStorage.removeItem(STORAGE_KEY); return DEFAULT_RANKS.slice(); }
}
function saveShop(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function getPayment() { return localStorage.getItem(PAYMENT_KEY) === 'real' ? 'real' : 'credits'; }
function setPayment(m) { localStorage.setItem(PAYMENT_KEY, m); var cp = el('#currentPayment'); if(cp) cp.textContent = m === 'real' ? 'Real Money' : 'Credits'; }
function getReceiver() { return localStorage.getItem(RECEIVER_KEY) || 'Not set'; }
function setReceiver(name) { localStorage.setItem(RECEIVER_KEY, name); var r = el('#receiverUser'); if(r) r.textContent = name; }

// === NAVIGATION ===
function showSection(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
  window.scrollTo({ top:0, behavior:'smooth' });
}

function setupNav() {
  var navLinks = document.querySelectorAll('nav a[data-section]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      var target = link.getAttribute('data-section');
      if(target) showSection(target);
    });
  });

  el('#navToggle').addEventListener('click', ()=> el('.nav').classList.toggle('open'));
  el('#brand').addEventListener('click
