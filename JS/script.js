/* ══════════════════════════════════════════════════════════
   KOPEE — SCRIPT.JS  (Merged)
   ✅ Firebase Auth Flash  → Auth Overlay
   ✅ Mobile Navbar        → Hamburger Drawer
   ✅ Page Transitions     → Fade out/in
   ✅ Logout Modal
   ✅ Search & Filter Bar  (dari desain baru)
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

// ─── PAGE TRANSITION ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.style.animation  = "none";
    document.body.style.transform  = "none";
  }, 420);
});

function navigateTo(url) {
  document.body.classList.add("page-leaving");
  setTimeout(() => { window.location.href = url; }, 350);
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a.page-link");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http")) return;
  e.preventDefault();
  navigateTo(href);
});

// ─── AUTH OVERLAY ────────────────────────────────────────────
const authOverlay = document.getElementById("authOverlay");

function hideAuthOverlay() {
  if (!authOverlay) return;
  authOverlay.classList.add("auth-overlay--hiding");
  setTimeout(() => {
    authOverlay.remove();
    document.body.classList.remove("is-loading");
  }, 600);
}

// ─── MENU DATA ───────────────────────────────────────────────
// Kategori ditambah buat filter: kopi / non-kopi / makanan / vip
const standardMenu = [
  { name: "Espresso Classico",   desc: "Single origin, roast penuh",        price: 28000, emoji: "☕", cat: "kopi" },
  { name: "Cappuccino Dolce",    desc: "Susu full-cream, busa lembut",       price: 38000, emoji: "🥛", cat: "kopi" },
  { name: "V60 Pour Over",       desc: "Manual brew, fruity & bright",       price: 42000, emoji: "☕", cat: "kopi" },
  { name: "Cold Brew Classic",   desc: "Steeping 18 jam, silky smooth",      price: 36000, emoji: "🧊", cat: "kopi" },
  { name: "Latte Hazelnut",      desc: "Espresso + susu + hazelnut syrup",   price: 40000, emoji: "☕", cat: "kopi" },
  { name: "Americano",           desc: "Espresso encer, bold & clean",       price: 30000, emoji: "☕", cat: "kopi" },
  { name: "Flat White",          desc: "Microfoam tipis, kopi intens",       price: 38000, emoji: "☕", cat: "kopi" },
  { name: "Affogato",            desc: "Vanilla ice cream + espresso shot",  price: 42000, emoji: "🍦", cat: "kopi" },
  { name: "Iced Caramel Latte",  desc: "Salted caramel, extra shot",         price: 44000, emoji: "🥤", cat: "kopi" },
  { name: "Macchiato Caramel",   desc: "Layered, vanilla base",              price: 36000, emoji: "☕", cat: "kopi" },
  { name: "Matcha Latte",        desc: "Ceremonial grade, creamy",           price: 42000, emoji: "🍵", cat: "non-kopi" },
  { name: "Chocolate Noir",      desc: "Belgian dark chocolate, rich",       price: 38000, emoji: "🍫", cat: "non-kopi" },
  { name: "Teh Tarik Signature", desc: "Ceylon tea, pulled with flair",      price: 28000, emoji: "🍵", cat: "non-kopi" },
  { name: "Sparkling Lemon",     desc: "Soda, lemon segar, mint",            price: 28000, emoji: "🍋", cat: "non-kopi" },
  { name: "Croissant Butter",    desc: "Laminasi 27 layer, gurih",           price: 32000, emoji: "🥐", cat: "makanan" },
  { name: "Banana Bread",        desc: "Homemade, cinnamon walnut",          price: 28000, emoji: "🍞", cat: "makanan" },
  { name: "Avocado Toast",       desc: "Rye bread, poached egg",             price: 45000, emoji: "🥑", cat: "makanan" },
  { name: "Cheese Cake Slice",   desc: "New York style, baked harian",       price: 38000, emoji: "🍰", cat: "makanan" },
  { name: "Overnight Oats",      desc: "Granola, madu, seasonal fruit",      price: 35000, emoji: "🥣", cat: "makanan" },
  { name: "Sandwich Club",       desc: "Chicken, salad, mustard aioli",      price: 48000, emoji: "🥪", cat: "makanan" },
];

const exclusiveMenu = [
  { name: "Black Diamond Espresso",  desc: "Single-origin Ethiopia Yirgacheffe geisha",  price: 85000,  emoji: "💎", cat: "vip" },
  { name: "VIP Truffle Latte",       desc: "White truffle infusion, premium milk",        price: 95000,  emoji: "☕", cat: "vip" },
  { name: "Kopi Luwak Reserve",      desc: "Arabika luwak liar, disajikan French press",  price: 150000, emoji: "☕", cat: "vip" },
  { name: "Gold Matcha Ceremony",    desc: "Matcha + edible gold flakes",                 price: 88000,  emoji: "✨", cat: "vip" },
  { name: "Aged Cold Brew",          desc: "Aged oak barrel 30 hari, whisky notes",       price: 75000,  emoji: "🍺", cat: "vip" },
  { name: "Saffron Cortado",         desc: "Espresso + steamed milk + saffron Iran",      price: 92000,  emoji: "🌸", cat: "vip" },
  { name: "Wagyu Beef Bruschetta",   desc: "Wagyu slice, truffle oil, sourdough",         price: 125000, emoji: "🥩", cat: "vip" },
  { name: "Lobster Croissant",       desc: "Lobster bisque filling, brioche flaky",       price: 145000, emoji: "🦞", cat: "vip" },
  { name: "Tiramisu VIP",            desc: "Mascarpone impor, espresso dari bar",         price: 68000,  emoji: "🍰", cat: "vip" },
  { name: "Ferrero Fondant",         desc: "Warm chocolate lava, hazelnut core",          price: 72000,  emoji: "🍫", cat: "vip" },
  { name: "Yuzu Tonic Fizz",         desc: "Yuzu import, elderflower, premium tonic",    price: 65000,  emoji: "🍹", cat: "vip" },
  { name: "Rose Gold Latte",         desc: "Rose water + gold shimmer + oat milk",       price: 78000,  emoji: "🌹", cat: "vip" },
  { name: "Smoked Salmon Bagel",     desc: "Norwegian salmon, cream cheese, capers",     price: 115000, emoji: "🥯", cat: "vip" },
  { name: "Honey Lavender Cold",     desc: "Lavender syrup, raw honey, cold brew",       price: 68000,  emoji: "🫙", cat: "vip" },
  { name: "Kopee Signature Platter", desc: "Chef's selection 5 item pairing premium",    price: 195000, emoji: "🍽️", cat: "vip" },
];

// ─── SEARCH & FILTER STATE ───────────────────────────────────
let currentFilter  = "all";
let searchQuery    = "";
let allMenuItems   = [];

// ─── HELPERS ─────────────────────────────────────────────────
function toRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ─── BUILD CARD ──────────────────────────────────────────────
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

// ─── RENDER MENU (dengan filter + search) ────────────────────
function renderMenu() {
  const grid     = document.getElementById("menuGrid");
  const noResult = document.getElementById("noResults");
  grid.innerHTML = "";

  let items = [...allMenuItems];

  // Filter kategori
  if (currentFilter !== "all") {
    items = items.filter(item => item.cat === currentFilter);
  }

  // Search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    items = items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.cat.toLowerCase().includes(q)
    );
  }

  if (items.length === 0) {
    noResult.classList.remove("hidden");
    return;
  }

  noResult.classList.add("hidden");
  items.forEach((item, i) => {
    const isVip = item.cat === "vip";
    const card  = buildCard(item, isVip);
    card.style.animationDelay = `${i * 0.035}s`;
    grid.appendChild(card);
  });
}

// ─── INIT MENU DATA ──────────────────────────────────────────
// ─── SKELETON LOADING ────────────────────────────────────────
function showSkeletons(count = 8) {
  const grid = document.getElementById("menuGrid");
  const noResult = document.getElementById("noResults");
  noResult.classList.add("hidden");
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "menu-card skeleton-card";
    sk.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
        <div class="skeleton-line skeleton-line--desc short"></div>
        <div class="skeleton-line skeleton-line--price"></div>
      </div>
    `;
    grid.appendChild(sk);
  }
}

function initMenu(isVipUser) {
  allMenuItems = isVipUser
    ? [...standardMenu, ...exclusiveMenu]
    : standardMenu;

  // Tampilkan/sembunyiin filter VIP pill
  document.querySelectorAll(".filter-pill[data-filter='vip']").forEach(el => {
    isVipUser ? el.classList.remove("hidden") : el.classList.add("hidden");
  });

  // Tampilkan skeleton dulu, baru render real cards setelah delay singkat
  // Skeleton count dari PerfDetector — auto-adjust sesuai tier device
  showSkeletons(PerfDetector.features.skeletonCount);
  setTimeout(() => renderMenu(), 600);
}

// ─── SEARCH INPUT ────────────────────────────────────────────
const searchInput = document.getElementById("menuSearch");
const searchClear = document.getElementById("searchClear");

searchInput?.addEventListener("input", debounce((e) => {
  searchQuery = e.target.value;
  searchClear.classList.toggle("hidden", searchQuery === "");
  renderMenu();
}, 280));

searchClear?.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery       = "";
  searchClear.classList.add("hidden");
  searchInput.focus();
  renderMenu();
});

// ─── FILTER PILLS ────────────────────────────────────────────
document.querySelectorAll(".filter-pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderMenu();
  });
});

// Reset filter button di no-results state
document.getElementById("resetFilter")?.addEventListener("click", () => {
  searchQuery        = "";
  currentFilter      = "all";
  searchInput.value  = "";
  searchClear.classList.add("hidden");
  document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
  document.querySelector(".filter-pill[data-filter='all']")?.classList.add("active");
  renderMenu();
});

// ─── UI TOGGLE (guest / VIP) ─────────────────────────────────
function showGuestUI() {
  document.querySelectorAll(".guest-only").forEach(el => el.classList.remove("hidden"));
  document.querySelectorAll(".vip-only").forEach(el => el.classList.add("hidden"));
  initMenu(false);
}

function showVipUI(user) {
  document.querySelectorAll(".guest-only").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".vip-only").forEach(el => el.classList.remove("hidden"));

  const initial = user.email ? user.email[0].toUpperCase() : "V";
  document.getElementById("profileInitial").textContent = initial;
  document.getElementById("dropdownEmail").textContent  = user.email || "—";

  const name = user.displayName || user.email?.split("@")[0] || "Member";
  document.getElementById("vipGreeting").textContent = name;

  initMenu(true);
}

// ─── PROFILE DROPDOWN ────────────────────────────────────────
const profileCircle   = document.getElementById("profileCircle");
const profileDropdown = document.getElementById("profileDropdown");

profileCircle?.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("hidden");
});
document.addEventListener("click", () => profileDropdown?.classList.add("hidden"));
profileDropdown?.addEventListener("click", (e) => e.stopPropagation());

// ─── LOGOUT MODAL ────────────────────────────────────────────
const logoutModal  = document.getElementById("logoutModal");
const modalCancel  = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");

function showLogoutModal() {
  profileDropdown?.classList.add("hidden");
  closeMobileDrawer();
  logoutModal.classList.remove("hidden");
  requestAnimationFrame(() => logoutModal.classList.add("modal-visible"));
}

function hideLogoutModal() {
  logoutModal.classList.remove("modal-visible");
  setTimeout(() => logoutModal.classList.add("hidden"), 300);
}

function doLogout() {
  auth.signOut().then(hideLogoutModal).catch(console.error);
}

document.getElementById("logoutBtn")?.addEventListener("click", showLogoutModal);
document.getElementById("mobileLogoutBtn")?.addEventListener("click", showLogoutModal);
modalCancel?.addEventListener("click", hideLogoutModal);
modalConfirm?.addEventListener("click", doLogout);
logoutModal?.addEventListener("click", (e) => { if (e.target === logoutModal) hideLogoutModal(); });

// ─── HAMBURGER DRAWER ────────────────────────────────────────
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
  mobileNavDrawer.classList.contains("drawer-open") ? closeMobileDrawer() : openMobileDrawer();
});
mobileNavBackdrop?.addEventListener("click", closeMobileDrawer);
mobileNavDrawer?.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", closeMobileDrawer);
});

// ─── NAVBAR SCROLL SHADOW ────────────────────────────────────
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 30) {
    nav.style.background = "rgba(30,14,4,0.98)";
    nav.style.boxShadow  = "0 4px 30px rgba(0,0,0,0.4)";
  } else {
    nav.style.background = "rgba(45,27,14,0.92)";
    nav.style.boxShadow  = "none";
  }
}, { passive: true });

// ─── AUTH STATE ──────────────────────────────────────────────
auth.onAuthStateChanged((user) => {
  if (user) { showVipUI(user); } else { showGuestUI(); }
  hideAuthOverlay();
});

// ══════════════════════════════════════════════════════════
// FASE 3 — VISUAL UPGRADE
// ✅ Scroll Animations  (IntersectionObserver)
// ✅ Hero Parallax
// ══════════════════════════════════════════════════════════

// ─── SCROLL ANIMATIONS ───────────────────────────────────────
// Observe semua elemen dengan class .reveal
// JS inject class ini ke: section-header, discount-card
// Menu cards punya animasi sendiri via cardReveal CSS

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("revealed");
    revealObserver.unobserve(entry.target); // fire once
  });
}, {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px"
});

function initScrollAnimations() {
  // Skip kalau user minta reduced motion
  if (!PerfDetector.features.scrollAnim) {
    // Langsung tampilin semua elemen tanpa animasi
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("revealed"));
    return;
  }

  // Section headers
  document.querySelectorAll(".section-header").forEach((el, i) => {
    el.classList.add("reveal", "reveal--up");
    el.style.transitionDelay = "0s";
    revealObserver.observe(el);
  });

  // Discount cards — stagger
  document.querySelectorAll(".discount-card").forEach((el, i) => {
    el.classList.add("reveal", "reveal--up");
    el.style.transitionDelay = `${i * 0.12}s`;
    revealObserver.observe(el);
  });

  // Search bar wrap
  const searchBar = document.getElementById("searchBarWrap");
  if (searchBar) {
    searchBar.classList.add("reveal", "reveal--down");
    revealObserver.observe(searchBar);
  }

  // Footer
  const footer = document.querySelector(".footer");
  if (footer) {
    footer.classList.add("reveal", "reveal--up");
    revealObserver.observe(footer);
  }
}

// Re-observe discount cards setelah VIP UI muncul
// (discount section awalnya hidden, IntersectionObserver skip hidden elements)
const discountObserver = new MutationObserver(() => {
  document.querySelectorAll(".discount-card:not(.reveal)").forEach((el, i) => {
    el.classList.add("reveal", "reveal--up");
    el.style.transitionDelay = `${i * 0.12}s`;
    revealObserver.observe(el);
  });
});

const discountSection = document.getElementById("discount");
if (discountSection) {
  discountObserver.observe(discountSection, { attributes: true, attributeFilter: ["class"] });
}

// ─── HERO PARALLAX ───────────────────────────────────────────
function initParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Skip parallax di mobile (performa)
  if (window.innerWidth < 768) return;

  // Gunakan PerfDetector — auto skip kalau tier low
  if (!PerfDetector.features.parallax) {
    console.log("Parallax dimatiin oleh Performance Detector (tier:", PerfDetector.tier + ")");
    return;
  }

  // Inject pseudo-layer buat parallax — GPU composited layer
  // Lebih ringan dari backgroundPositionY yang trigger CPU repaint
  const parallaxBg = document.createElement("div");
  parallaxBg.id = "parallax-bg";
  parallaxBg.style.cssText = `
    position: absolute; inset: -30% 0;
    background: inherit;
    background-size: cover;
    background-position: center;
    z-index: 0;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    pointer-events: none;
  `;
  // Force GPU layer promotion sekarang, bukan nunggu scroll pertama
  // Ini yang bikin delay hilang — layer udah siap di VRAM sebelum user scroll
  requestAnimationFrame(() => {
    parallaxBg.style.transform = "translate3d(0, 0.1px, 0)";
    requestAnimationFrame(() => {
      parallaxBg.style.transform = "translate3d(0, 0, 0)";
    });
  });
  // Copy background dari hero ke layer
  const heroStyle = getComputedStyle(hero);
  parallaxBg.style.backgroundImage = heroStyle.backgroundImage;
  parallaxBg.style.backgroundSize  = "cover";
  hero.insertBefore(parallaxBg, hero.firstChild);

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH   = hero.offsetHeight;

      if (scrollY <= heroH) {
        // GPU: translate3d jauh lebih ringan dari backgroundPositionY
        const bgOffset      = scrollY * 0.25;
        const contentOffset = scrollY * 0.04;

        parallaxBg.style.transform = `translate3d(0, ${bgOffset}px, 0)`;

        const heroInner = hero.querySelector(".hero-inner");
        if (heroInner) {
          heroInner.style.transform = `translate3d(0, ${contentOffset}px, 0)`;
        }
      }

      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ─── MENU CARD SCROLL REVEAL ─────────────────────────────────
// Karena menu cards di-inject dinamis, kita observe menuGrid
// dan re-attach observer setiap kali cards baru muncul

const menuGridObserver = new MutationObserver(() => {
  document.querySelectorAll(".menu-card:not(.skeleton-card):not(.scroll-observed)").forEach((card, i) => {
    card.classList.add("scroll-observed");
    card.classList.add("reveal", "reveal--up");
    card.style.transitionDelay = `${Math.min(i * 0.04, 0.4)}s`;
    revealObserver.observe(card);
  });
});

const menuGrid = document.getElementById("menuGrid");
if (menuGrid) {
  menuGridObserver.observe(menuGrid, { childList: true });
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
  initParallax();
});

// ══════════════════════════════════════════════════════════
// FASE 4 — POLISH
// ✅ Custom Cursor (desktop only)
// ✅ Back to Top Button
// ══════════════════════════════════════════════════════════

// ─── CUSTOM CURSOR ───────────────────────────────────────────
// Nonaktif di: touch device, mobile screen, atau device yang
// ga support hover (HP/tablet)
function initCustomCursor() {
  const isTouchDevice = (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 1024
  );
  if (isTouchDevice) return; // skip di HP/tablet

  // Inject cursor elements
  const cursorDot  = document.createElement("div");
  const cursorRing = document.createElement("div");
  cursorDot.id     = "cursor-dot";
  cursorRing.id    = "cursor-ring";
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  // Sembunyiin default cursor
  document.body.classList.add("custom-cursor-active");

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  // Update posisi dot - pakai RAF throttle biar ga spike CPU
  let cursorRafId = null;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursorRafId) {
      cursorRafId = requestAnimationFrame(() => {
        // GPU: translate3d bukan translate
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        cursorDot.classList.add("cursor-visible");
        cursorRing.classList.add("cursor-visible");
        cursorRafId = null;
      });
    }
  }, { passive: true });

  // Ring ngikutin dengan lag (trailing effect) - GPU translate3d
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    // translate3d paksa GPU compositing layer
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state — ring membesar di interactive elements
  const interactiveSelectors = [
    "a", "button", ".menu-card", ".filter-pill",
    ".profile-circle", ".hamburger", ".btn-submit",
    ".btn-primary", ".btn-secondary", ".btn-login",
    "#searchClear", ".pass-toggle", ".back-to-top"
  ].join(", ");

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursorDot.classList.add("cursor-hover");
      cursorRing.classList.add("cursor-hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursorDot.classList.remove("cursor-hover");
      cursorRing.classList.remove("cursor-hover");
    }
  });

  // Click ripple — dot mengecil sebentar
  document.addEventListener("mousedown", () => {
    cursorDot.classList.add("cursor-click");
    cursorRing.classList.add("cursor-click");
  });
  document.addEventListener("mouseup", () => {
    cursorDot.classList.remove("cursor-click");
    cursorRing.classList.remove("cursor-click");
  });

  // Sembunyiin saat cursor keluar window
  document.addEventListener("mouseleave", () => {
    cursorDot.classList.remove("cursor-visible");
    cursorRing.classList.remove("cursor-visible");
  });
  document.addEventListener("mouseenter", () => {
    cursorDot.classList.add("cursor-visible");
    cursorRing.classList.add("cursor-visible");
  });
}

// ─── BACK TO TOP BUTTON ──────────────────────────────────────
function initBackToTop() {
  // Inject button
  const btn = document.createElement("button");
  btn.id          = "backToTop";
  btn.className   = "back-to-top";
  btn.setAttribute("aria-label", "Kembali ke atas");
  btn.innerHTML   = `<i class="fas fa-arrow-up"></i>`;
  document.body.appendChild(btn);

  // Tampil setelah scroll 400px
  window.addEventListener("scroll", () => {
    btn.classList.toggle("back-to-top--visible", window.scrollY > 400);
  }, { passive: true });

  // Smooth scroll ke atas
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── PAUSE ANIMATIONS WHEN TAB HIDDEN ───────────────────────
// Matiin RAF loops waktu user pindah tab — hemat CPU signifikan
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Tab ga aktif — stop cursor ring loop
    if (typeof rafId !== "undefined" && rafId) {
      cancelAnimationFrame(rafId);
    }
  } else {
    // Tab aktif lagi — restart ring loop kalau cursor aktif
    const ring = document.getElementById("cursor-ring");
    if (ring) {
      // Re-init via small trick: trigger mousemove
      const ev = new MouseEvent("mousemove", { clientX: window.innerWidth/2, clientY: window.innerHeight/2 });
      document.dispatchEvent(ev);
    }
  }
});

// ══════════════════════════════════════════════════════════
// ADAPTIVE PERFORMANCE DETECTOR
// Deteksi kondisi device real-time, auto-matiin fitur berat
// Pure Browser APIs — no key, no library, no signup
// ══════════════════════════════════════════════════════════

const PerfDetector = (() => {

  // ─── DETEKSI ───────────────────────────────────────────
  const ram         = navigator.deviceMemory || 4;        // GB, default 4
  const cores       = navigator.hardwareConcurrency || 2; // CPU cores
  const connection  = navigator.connection || {};
  const netType     = connection.effectiveType || "4g";   // 4g/3g/2g/slow-2g
  const saveData    = connection.saveData || false;        // user aktifin "hemat data"
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── SCORING ───────────────────────────────────────────
  // Hitung "performance score" dari semua faktor
  // Makin tinggi = device makin kuat
  let score = 0;
  if (ram >= 8)  score += 3;
  else if (ram >= 4) score += 2;
  else if (ram >= 2) score += 1;

  if (cores >= 8)  score += 3;
  else if (cores >= 4) score += 2;
  else if (cores >= 2) score += 1;

  if (netType === "4g") score += 2;
  else if (netType === "3g") score += 1;

  // Faktor pengurang
  if (saveData)       score -= 2;
  if (reducedMotion)  score -= 10; // user minta reduce motion = matiin semua

  // ─── TIER ──────────────────────────────────────────────
  // high   (score ≥ 6): semua fitur aktif
  // medium (score 3-5): animasi dikurangin
  // low    (score < 3): animasi minimal
  const tier = score >= 6 ? "high" : score >= 3 ? "medium" : "low";

  // ─── FEATURE FLAGS ─────────────────────────────────────
  const features = {
    parallax:       tier === "high",
    customCursor:   tier !== "low",
    scrollAnim:     !reducedMotion,
    skeletonCount:  tier === "high" ? 8 : tier === "medium" ? 6 : 4,
    animDuration:   tier === "high" ? 1 : tier === "medium" ? 0.7 : 0.4,
  };

  // ─── LOG (dev info) ────────────────────────────────────
  console.log(`%c☕ Koope Performance Detector`, "color:#c9a96e; font-weight:bold");
  console.log(`RAM: ${ram}GB | Cores: ${cores} | Net: ${netType} | SaveData: ${saveData} | ReducedMotion: ${reducedMotion}`);
  console.log(`Score: ${score} → Tier: ${tier.toUpperCase()}`);
  console.log("Features:", features);

  // ─── APPLY CSS TIER ────────────────────────────────────
  // Tambahin class ke body buat CSS bisa ikut adapt
  document.documentElement.setAttribute("data-perf", tier);

  // Kalau reduced motion, tambahin class khusus
  if (reducedMotion) document.documentElement.classList.add("reduced-motion");

  // Listen perubahan koneksi real-time
  connection.addEventListener?.("change", () => {
    const newType = connection.effectiveType;
    console.log(`%c☕ Koneksi berubah: ${newType}`, "color:#c9a96e");
    // Reload fitur kalau koneksi drop ke 2g
    if (newType === "2g" || newType === "slow-2g") {
      document.documentElement.setAttribute("data-perf", "low");
    }
  });

  return { tier, features, ram, cores, netType, reducedMotion };
})();

// ─── TERAPIN KE SEMUA FITUR ──────────────────────────────────

// Set CSS animation duration variable sesuai tier
if (PerfDetector.tier !== "high") {
  const dur = PerfDetector.features.animDuration + "s";
  document.documentElement.style.setProperty("--anim-duration", dur);
}

// ─── INIT FASE 4 ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Custom cursor hanya kalau tier medium/high
  if (PerfDetector.features.customCursor) {
    initCustomCursor();
  }
  initBackToTop();
});