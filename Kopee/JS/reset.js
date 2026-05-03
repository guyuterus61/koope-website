/* ══════════════════════════════════════════════════════════
   KOPEE — RESET.JS
   Firebase Password Reset Logic · Secure & Modular
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
  
  // Guard: cegah re-init jika script di-load lebih dari sekali
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const auth = firebase.auth();
  
  // ─── DOM REFS ───────────────────────────────────────────────
  const form       = document.getElementById("resetForm");
  const emailInput = document.getElementById("emailInput");
  const sendBtn    = document.getElementById("sendBtn");
  const btnLabel   = document.getElementById("btnLabel");
  const btnSpinner = document.getElementById("btnSpinner");
  const btnArrow   = document.getElementById("btnArrow");
  const toast      = document.getElementById("toast");
  const toastIcon  = document.getElementById("toastIcon");
  const toastMsg   = document.getElementById("toastMsg");
  const fieldError = document.getElementById("fieldError");
  const validIcon  = document.getElementById("validIcon");
  
  // ─── RATE LIMIT (anti spam) ─────────────────────────────────
  const RATE_LIMIT_MS  = 60_000; // 60 detik
  const RATE_LIMIT_KEY = "kopee_reset_last";
  
  function isRateLimited() {
    const last = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) || "0", 10);
    return Date.now() - last < RATE_LIMIT_MS;
  }
  function setRateLimit() {
    sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  }
  function getRemainingCooldown() {
    const last = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) || "0", 10);
    return Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000);
  }
  
  // ─── EMAIL VALIDATION ───────────────────────────────────────
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  
  function validateEmail(value) {
    return EMAIL_REGEX.test(value.trim());
  }
  
  // ─── UI HELPERS ─────────────────────────────────────────────
  
  /** Tampilkan toast sukses atau error */
  function showToast(type, message) {
    toast.className      = `inline-toast ${type}`;
    toastIcon.textContent = type === "success" ? "✓" : "✕";
    toastMsg.textContent  = message;
    toast.classList.remove("hidden");
  
    // Auto hide setelah 6 detik (sukses saja)
    if (type === "success") {
      setTimeout(() => toast.classList.add("hidden"), 6000);
    }
  }
  
  function hideToast() {
    toast.classList.add("hidden");
  }
  
  /** Set loading state pada button */
  function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    sendBtn.setAttribute("aria-disabled", String(isLoading));
  
    if (isLoading) {
      btnLabel.textContent = "Sending...";
      btnSpinner.classList.remove("hidden");
      btnArrow.classList.add("hidden");
    } else {
      btnLabel.textContent = "Send Reset Link";
      btnSpinner.classList.add("hidden");
      btnArrow.classList.remove("hidden");
    }
  }
  
  /** Tampilkan field error */
  function showFieldError(msg) {
    fieldError.textContent = msg;
    fieldError.classList.remove("hidden");
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid");
    validIcon.textContent = "";
  }
  
  /** Bersihkan field error */
  function clearFieldError() {
    fieldError.classList.add("hidden");
    fieldError.textContent = "";
    emailInput.classList.remove("is-invalid");
  }
  
  // ─── INPUT HANDLER ──────────────────────────────────────────
  emailInput.addEventListener("input", () => {
    const val   = emailInput.value.trim();
    const valid = validateEmail(val);
  
    clearFieldError();
    hideToast();
  
    if (val.length === 0) {
      // Empty → reset semua state
      emailInput.classList.remove("is-valid", "is-invalid");
      validIcon.textContent = "";
      sendBtn.disabled      = true;
      sendBtn.setAttribute("aria-disabled", "true");
    } else if (valid) {
      emailInput.classList.add("is-valid");
      emailInput.classList.remove("is-invalid");
      validIcon.textContent = "✓";
      validIcon.style.color = "#6fcf97";
      sendBtn.disabled      = false;
      sendBtn.setAttribute("aria-disabled", "false");
    } else {
      emailInput.classList.remove("is-valid");
      validIcon.textContent = "";
      sendBtn.disabled      = true;
      sendBtn.setAttribute("aria-disabled", "true");
    }
  });
  
  // ─── FIREBASE ERROR MAPPER ──────────────────────────────────
  function mapFirebaseError(code) {
    const map = {
      "auth/user-not-found":     "Email tidak terdaftar di sistem kami.",
      "auth/invalid-email":      "Format email tidak valid.",
      "auth/too-many-requests":  "Terlalu banyak percobaan. Coba lagi dalam beberapa menit.",
      "auth/network-request-failed": "Koneksi jaringan bermasalah. Periksa internet Anda.",
      "auth/missing-email":      "Email tidak boleh kosong.",
    };
    return map[code] || "Terjadi kesalahan. Silakan coba lagi.";
  }
  
  // ─── FORM SUBMIT ────────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideToast();
    clearFieldError();
  
    const email = emailInput.value.trim().toLowerCase();
  
    // ── Client-side validation ──
    if (!email) {
      showFieldError("Email tidak boleh kosong.");
      return;
    }
    if (!validateEmail(email)) {
      showFieldError("Masukkan format email yang valid.");
      return;
    }
  
    // ── Rate limit check ──
    if (isRateLimited()) {
      showToast("error", `Harap tunggu ${getRemainingCooldown()} detik sebelum mencoba lagi.`);
      return;
    }
  
    // ── Set loading ──
    setLoading(true);
  
    try {
      // Firebase actionCodeSettings — opsional, untuk custom redirect
      const actionCodeSettings = {
        url: window.location.origin + "/login.html",
        handleCodeInApp: false,
      };
  
      await auth.sendPasswordResetEmail(email, actionCodeSettings);
  
      // ── Sukses ──
      setRateLimit();
      showToast(
        "success",
        "Link reset berhasil dikirim! Silakan cek inbox (atau folder spam) Anda."
      );
  
      // Reset form setelah sukses
      emailInput.value = "";
      emailInput.classList.remove("is-valid");
      validIcon.textContent = "";
      sendBtn.disabled = true;
      sendBtn.setAttribute("aria-disabled", "true");
  
    } catch (err) {
      // ── Error ──
      const msg = mapFirebaseError(err.code);
  
      // Jangan reveal "email not found" secara eksplisit (security best practice)
      // → tampilkan pesan generik untuk user-not-found
      if (err.code === "auth/user-not-found") {
        // Tetap tampilkan "sukses" palsu untuk mencegah email enumeration attack
        showToast(
          "success",
          "Jika email terdaftar, link reset akan dikirimkan. Periksa inbox Anda."
        );
      } else {
        showToast("error", msg);
      }
  
    } finally {
      setLoading(false);
    }
  });