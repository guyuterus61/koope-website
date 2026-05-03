// ─── LOGIN.JS — Kopee (Redesign) ────────────────────────────
// Firebase Auth + KopeeToast + Page Transition
// + Password Toggle + Live Validation

// ─── PAGE TRANSITION ─────────────────────────────────────────
function navigateTo(url) {
    document.body.classList.add("page-leaving");
    setTimeout(() => { window.location.href = url; }, 350);
  }
  setTimeout(() => {
    document.body.style.animation = "none";
    document.body.style.transform = "none";
  }, 420);
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a.page-link");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;
    e.preventDefault();
    navigateTo(href);
  });
  
  // ─── DOM REFS ────────────────────────────────────────────────
  const loginForm      = document.getElementById("login-form");
  const emailInput     = document.getElementById("email-log");
  const passInput      = document.getElementById("pass-log");
  const emailValid     = document.getElementById("emailValid");
  const emailError     = document.getElementById("emailError");
  const passError      = document.getElementById("passError");
  const passToggle     = document.getElementById("passToggle");
  const passToggleIcon = document.getElementById("passToggleIcon");
  const btnLabel       = document.getElementById("btnLabel");
  const btnSpinner     = document.getElementById("btnSpinner");
  const btnArrow       = document.getElementById("btnArrow");
  const submitBtn      = document.getElementById("log-btn");
  
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  
  // ─── LIVE VALIDATION ─────────────────────────────────────────
  emailInput?.addEventListener("input", () => {
    const val   = emailInput.value.trim();
    const valid = EMAIL_RE.test(val);
    emailInput.classList.toggle("is-valid",   val.length > 0 && valid);
    emailInput.classList.toggle("is-invalid", val.length > 0 && !valid);
    if (emailValid) {
      emailValid.textContent = (val.length > 0 && valid) ? "✓" : "";
      emailValid.style.color = "#4caf50";
    }
    if (val.length > 0 && !valid) showFieldError(emailError, "Format email tidak valid");
    else clearFieldError(emailError, emailInput);
  });
  
  passInput?.addEventListener("input", () => {
    const len = passInput.value.length;
    if (len > 0 && len < 6) {
      showFieldError(passError, "Password minimal 6 karakter");
      passInput.classList.add("is-invalid");
      passInput.classList.remove("is-valid");
    } else if (len >= 6) {
      clearFieldError(passError, passInput);
      passInput.classList.add("is-valid");
      passInput.classList.remove("is-invalid");
    } else {
      clearFieldError(passError, passInput);
    }
  });
  
  // ─── PASSWORD TOGGLE ─────────────────────────────────────────
  passToggle?.addEventListener("click", () => {
    const show = passInput.type === "password";
    passInput.type = show ? "text" : "password";
    if (passToggleIcon) passToggleIcon.className = show ? "fas fa-eye-slash" : "fas fa-eye";
  });
  
  // ─── HELPERS ─────────────────────────────────────────────────
  function showFieldError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
  }
  function clearFieldError(el, input) {
    if (!el) return;
    el.classList.add("hidden");
    el.textContent = "";
    input?.classList.remove("is-invalid");
  }
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (btnLabel)  btnLabel.textContent = isLoading ? "Signing in..." : "Sign In";
    if (btnSpinner) btnSpinner.classList.toggle("hidden", !isLoading);
    if (btnArrow)   btnArrow.classList.toggle("hidden", isLoading);
  }
  
  // ─── FIREBASE ERROR MAP ──────────────────────────────────────
  const ERROR_MAP = {
    "auth/user-not-found":         "Email ini belum terdaftar. Yuk daftar dulu!",
    "auth/wrong-password":         "Password salah. Coba lagi atau reset password.",
    "auth/invalid-email":          "Format email tidak valid.",
    "auth/user-disabled":          "Akun ini telah dinonaktifkan.",
    "auth/too-many-requests":      "Terlalu banyak percobaan. Tunggu beberapa menit.",
    "auth/network-request-failed": "Koneksi bermasalah. Cek internet lo.",
    "auth/invalid-credential":     "Email atau password salah. Coba lagi ya.",
  };
  
  // ─── SUBMIT ──────────────────────────────────────────────────
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email    = emailInput.value.trim();
    const password = passInput.value;
  
    if (!EMAIL_RE.test(email)) {
      showFieldError(emailError, "Masukkan email yang valid");
      emailInput.classList.add("is-invalid");
      return;
    }
    if (password.length < 6) {
      showFieldError(passError, "Password minimal 6 karakter");
      passInput.classList.add("is-invalid");
      return;
    }
  
    setLoading(true);
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          KopeeToast.success(
            "Selamat datang di Koope VIP. Menikmati pengalaman eksklusif Anda.",
            "Login Berhasil! ☕", 2500
          );
          setTimeout(() => navigateTo("index.html"), 1800);
        } else {
          KopeeToast.warning(
            "Cek inbox atau folder spam, lalu klik link verifikasi dulu ya.",
            "Verifikasi Email Dulu!"
          );
          auth.signOut().then(() => setLoading(false));
        }
      })
      .catch((error) => {
        KopeeToast.error(ERROR_MAP[error.code] || "Terjadi kesalahan: " + error.message, "Login Gagal");
        setLoading(false);
      });
  });