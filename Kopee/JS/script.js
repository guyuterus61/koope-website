/* ══════════════════════════════════════════════════════════
   KOPEE — SCRIPT.JS  (Phase 1 Bugfix)
   ✅ Fix 1: Firebase Auth Flash  → Auth Overlay
   ✅ Fix 2: Mobile Navbar        → Hamburger Drawer
   ✅ Fix 3: Page Transitions     → Fade out/in
   + Logout Confirmation Modal
══════════════════════════════════════════════════════════ */

// ─── FIREBASE INIT ──────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyD9ntDSRtMV8XdcSem7I2onoB1LIIuaQjk",
  authDomain:        "kopee-web.firebaseapp.com",
  projectId:         "kopee-web",
  storageBucket:     "kopee-web.firebasestorage.app",
  messagingSenderId: "691671488388",
  appId:             "1:691671488388:web:d05dca2671c576ff2aafd1"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ─── PAGE TRANSITION SETUP ──────────────────────────────────
// Semua link internal dengan class .page-link akan fade out dulu
document.addEventListener("DOMContentLoaded", () => {
  // Setelah animasi pageFadeIn selesai (400ms), hapus animation dari body.
  // WAJIB: selama body punya transform aktif dari animasi, semua
  // position:fixed di dalamnya (modal, overlay) jadi relatif ke body
  // bukan ke viewport. Efeknya modal muncul di tengah DOKUMEN bukan
  // tengah LAYAR — user harus scroll manual buat nemuin modal.
  setTimeout(() => {
    document.body.style.animation = "none";
    document.body.style.transform = "none";
  }, 420);
});

function navigateTo(url) {
  document.body.classList.add("page-leaving");
  setTimeout(() => {
    window.location.href = url;
  }, 350);
}

// Intercept semua <a> internal biar ada transition
document.addEventListener("click", (e) => {
  const link = e.target.closest("a.page-link");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http")) return;
  e.preventDefault();
  navigateTo(href);
});

// ─── AUTH OVERLAY (Fix: Firebase Flash) ─────────────────────
const authOverlay = document.getElementById("authOverlay");

function hideAuthOverlay() {
  if (!authOverlay) return;
  authOverlay.classList.add("auth-overlay--hiding");
  setTimeout(() => {
    authOverlay.remove();
    document.body.classList.remove("is-loading");
  }, 600);
}

// ─── MENU DATA ──────────────────────────────────────────────
const standardMenu = [
  { name: "Espresso Classico",   desc: "Single origin, roast penuh",        price: 28000,  emoji: "☕" },
  { name: "Cappuccino Dolce",    desc: "Susu full-cream, busa lembut",       price: 38000,  emoji: "🥛" },
  { name: "V60 Pour Over",       desc: "Manual brew, fruity & bright",       price: 42000,  emoji: "☕" },
  { name: "Cold Brew Classic",   desc: "Steeping 18 jam, silky smooth",      price: 36000,  emoji: "🧊" },
  { name: "Latte Hazelnut",      desc: "Espresso + susu + hazelnut syrup",   price: 40000,  emoji: "☕" },
  { name: "Americano",           desc: "Espresso encer, bold & clean",       price: 30000,  emoji: "☕" },
  { name: "Flat White",          desc: "Microfoam tipis, kopi intens",       price: 38000,  emoji: "☕" },
  { name: "Matcha Latte",        desc: "Ceremonial grade, creamy",           price: 42000,  emoji: "🍵" },
  { name: "Chocolate Noir",      desc: "Belgian dark chocolate, rich",       price: 38000,  emoji: "🍫" },
  { name: "Croissant Butter",    desc: "Laminasi 27 layer, gurih",           price: 32000,  emoji: "🥐" },
  { name: "Banana Bread",        desc: "Homemade, cinnamon walnut",          price: 28000,  emoji: "🍞" },
  { name: "Avocado Toast",       desc: "Rye bread, poached egg",             price: 45000,  emoji: "🥑" },
  { name: "Affogato",            desc: "Vanilla ice cream + espresso shot",  price: 42000,  emoji: "🍦" },
  { name: "Iced Caramel Latte",  desc: "Salted caramel, extra shot",         price: 44000,  emoji: "🥤" },
  { name: "Teh Tarik Signature", desc: "Ceylon tea, pulled with flair",      price: 28000,  emoji: "🍵" },
  { name: "Sparkling Lemon",     desc: "Soda, lemon segar, mint",            price: 28000,  emoji: "🍋" },
  { name: "Cheese Cake Slice",   desc: "New York style, baked harian",       price: 38000,  emoji: "🍰" },
  { name: "Overnight Oats",      desc: "Granola, madu, seasonal fruit",      price: 35000,  emoji: "🥣" },
  { name: "Sandwich Club",       desc: "Chicken, salad, mustard aioli",      price: 48000,  emoji: "🥪" },
  { name: "Macchiato Caramel",   desc: "Layered, vanilla base",              price: 36000,  emoji: "☕" },
];

const exclusiveMenu = [
  { name: "Black Diamond Espresso",  desc: "Single-origin Ethiopia Yirgacheffe geisha",  price: 85000,  emoji: "💎" },
  { name: "VIP Truffle Latte",       desc: "White truffle infusion, premium milk",        price: 95000,  emoji: "☕" },
  { name: "Kopi Luwak Reserve",      desc: "Arabika luwak liar, disajikan French press",  price: 150000, emoji: "☕" },
  { name: "Gold Matcha Ceremony",    desc: "Matcha + edible gold flakes",                 price: 88000,  emoji: "✨" },
  { name: "Aged Cold Brew",          desc: "Aged oak barrel 30 hari, whisky notes",       price: 75000,  emoji: "🍺" },
  { name: "Saffron Cortado",         desc: "Espresso + steamed milk + saffron Iran",      price: 92000,  emoji: "🌸" },
  { name: "Wagyu Beef Bruschetta",   desc: "Wagyu slice, truffle oil, sourdough",         price: 125000, emoji: "🥩" },
  { name: "Lobster Croissant",       desc: "Lobster bisque filling, brioche flaky",       price: 145000, emoji: "🦞" },
  { name: "Tiramisu VIP",            desc: "Mascarpone impor, espresso dari bar",          price: 68000,  emoji: "🍰" },
  { name: "Ferrero Fondant",         desc: "Warm chocolate lava, hazelnut core",          price: 72000,  emoji: "🍫" },
  { name: "Yuzu Tonic Fizz",         desc: "Yuzu import, elderflower, premium tonic",     price: 65000,  emoji: "🍹" },
  { name: "Rose Gold Latte",         desc: "Rose water + gold shimmer + oat milk",        price: 78000,  emoji: "🌹" },
  { name: "Smoked Salmon Bagel",     desc: "Norwegian salmon, cream cheese, capers",      price: 115000, emoji: "🥯" },
  { name: "Honey Lavender Cold",     desc: "Lavender syrup, raw honey, cold brew",        price: 68000,  emoji: "🫙" },
  { name: "Kopee Signature Platter", desc: "Chef's selection 5 item pairing premium",     price: 195000, emoji: "🍽️" },
];

// ─── HELPERS ────────────────────────────────────────────────
function toRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function buildCard(item, isVip = false) {
  const card = document.createElement("div");
  card.className = "menu-card" + (isVip ? " vip-card" : "");
  card.innerHTML = `
    <div class="card-img-wrap">
      <div class="card-thumb-fallback">${item.emoji}</div>
      ${isVip ? '<span class="vip-badge">✦ VIP</span>' : ""}
    </div>
    <div class="card-body">
      <p class="card-name">${item.name}</p>
      <p class="card-desc">${item.desc}</p>
      <p class="card-price">${toRupiah(item.price)}</p>
    </div>
  `;
  return card;
}

function renderMenu(isVipUser) {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  const allItems = isVipUser ? [...standardMenu, ...exclusiveMenu] : standardMenu;
  allItems.forEach((item, i) => {
    const isExclusive = isVipUser && i >= standardMenu.length;
    const card = buildCard(item, isExclusive);
    card.style.animationDelay = `${i * 0.04}s`;
    grid.appendChild(card);
  });
}

// ─── UI TOGGLE ──────────────────────────────────────────────
function showGuestUI() {
  document.querySelectorAll(".guest-only").forEach(el => el.classList.remove("hidden"));
  document.querySelectorAll(".vip-only").forEach(el => el.classList.add("hidden"));
  renderMenu(false);
}

function showVipUI(user) {
  document.querySelectorAll(".guest-only").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".vip-only").forEach(el => el.classList.remove("hidden"));
  const initial = user.email ? user.email[0].toUpperCase() : "V";
  document.getElementById("profileInitial").textContent = initial;
  document.getElementById("dropdownEmail").textContent = user.email || "—";
  const name = user.displayName || user.email?.split("@")[0] || "Member";
  document.getElementById("vipGreeting").textContent = name;
  renderMenu(true);
}

// ─── PROFILE DROPDOWN ────────────────────────────────────────
const profileCircle   = document.getElementById("profileCircle");
const profileDropdown = document.getElementById("profileDropdown");

profileCircle?.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  profileDropdown?.classList.add("hidden");
});

profileDropdown?.addEventListener("click", (e) => e.stopPropagation());

// ─── LOGOUT MODAL ────────────────────────────────────────────
const logoutModal   = document.getElementById("logoutModal");
const modalCancel   = document.getElementById("modalCancel");
const modalConfirm  = document.getElementById("modalConfirm");

function showLogoutModal() {
  profileDropdown?.classList.add("hidden");
  closeMobileDrawer();
  logoutModal.classList.remove("hidden");
  // Trigger animation
  requestAnimationFrame(() => {
    logoutModal.classList.add("modal-visible");
  });
}

function hideLogoutModal() {
  logoutModal.classList.remove("modal-visible");
  setTimeout(() => logoutModal.classList.add("hidden"), 300);
}

function doLogout() {
  auth.signOut().then(() => {
    hideLogoutModal();
  }).catch(console.error);
}

// Desktop logout button → modal
document.getElementById("logoutBtn")?.addEventListener("click", showLogoutModal);

// Mobile logout button → modal
document.getElementById("mobileLogoutBtn")?.addEventListener("click", showLogoutModal);

modalCancel?.addEventListener("click", hideLogoutModal);
modalConfirm?.addEventListener("click", doLogout);

// Klik backdrop modal → tutup
logoutModal?.addEventListener("click", (e) => {
  if (e.target === logoutModal) hideLogoutModal();
});

// ─── HAMBURGER MENU (Fix: Mobile Navbar) ─────────────────────
const hamburger         = document.getElementById("hamburger");
const mobileNavDrawer   = document.getElementById("mobileNavDrawer");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");

function openMobileDrawer() {
  mobileNavDrawer.classList.remove("hidden");
  mobileNavBackdrop.classList.remove("hidden");
  requestAnimationFrame(() => {
    mobileNavDrawer.classList.add("drawer-open");
    mobileNavBackdrop.classList.add("backdrop-visible");
  });
  hamburger.classList.add("hamburger--open");
  hamburger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileDrawer() {
  mobileNavDrawer.classList.remove("drawer-open");
  mobileNavBackdrop.classList.remove("backdrop-visible");
  hamburger.classList.remove("hamburger--open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  setTimeout(() => {
    mobileNavDrawer.classList.add("hidden");
    mobileNavBackdrop.classList.add("hidden");
  }, 350);
}

hamburger?.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileNavDrawer.classList.contains("drawer-open")
    ? closeMobileDrawer()
    : openMobileDrawer();
});

mobileNavBackdrop?.addEventListener("click", closeMobileDrawer);

// Tutup drawer kalau klik link di dalamnya
mobileNavDrawer?.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", closeMobileDrawer);
});

// ─── NAVBAR SCROLL SHADOW ────────────────────────────────────
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 30) {
    nav.style.background = "rgba(10, 5, 2, 0.97)";
    nav.style.boxShadow  = "0 4px 30px rgba(0,0,0,0.5)";
  } else {
    nav.style.background = "rgba(18, 9, 3, 0.85)";
    nav.style.boxShadow  = "none";
  }
}, { passive: true });

// ─── AUTH STATE OBSERVER ─────────────────────────────────────
auth.onAuthStateChanged((user) => {
  if (user) {
    showVipUI(user);
  } else {
    showGuestUI();
  }
  // Sembunyikan overlay setelah auth state clear
  hideAuthOverlay();
});