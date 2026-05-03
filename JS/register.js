// ─── REGISTER.JS — Kopee (Redesign) ─────────────────────────
// Firebase Auth + KopeeToast + Page Transition
// + Password Toggle + Strength Bar + Live Validation

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
  const regForm         = document.getElementById("reg-form");
  const emailInput      = document.getElementById("email-reg");
  const passInput       = document.getElementById("pass-reg");
  const confirmInput    = document.getElementById("pass-reg-confirm");
  const emailValid      = document.getElementById("emailValid");
  const emailError      = document.getElementById("emailError");
  const passError       = document.getElementById("passError");
  const confirmError    = document.getElementById("confirmError");
  const passToggle      = document.getElementById("passToggle");
  const passToggleIcon  = document.getElementById("passToggleIcon");
  const confirmToggle   = document.getElementById("confirmToggle");
  const confirmToggleIcon = document.getElementById("confirmToggleIcon");
  const strengthFill    = document.getElementById("strengthFill");
  const strengthLabel   = document.getElementById("strengthLabel");
  const btnLabel        = document.getElementById("btnLabel");
  const btnSpinner      = document.getElementById("btnSpinner");
  const btnArrow        = document.getElementById("btnArrow");
  const submitBtn       = document.getElementById("reg-btn");
  
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  
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
    if (btnLabel)   btnLabel.textContent = isLoading ? "Creating account..." : "Create Account";
    if (btnSpinner) btnSpinner.classList.toggle("hidden", !isLoading);
    if (btnArrow)   btnArrow.classList.toggle("hidden", isLoading);
  }
  
  // ─── PASSWORD STRENGTH ───────────────────────────────────────
  function getStrength(pass) {
    if (pass.length === 0) return { level: 0, label: "", cls: "" };
    let score = 0;
    if (pass.length >= 6)  score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
  
    if (score <= 1) return { level: 33,  label: "Lemah",  cls: "weak" };
    if (score <= 3) return { level: 66,  label: "Sedang", cls: "medium" };
    return            { level: 100, label: "Kuat",   cls: "strong" };
  }
  
  function updateStrength(pass) {
    if (!strengthFill || !strengthLabel) return;
    const { level, label, cls } = getStrength(pass);
    strengthFill.style.width = level + "%";
    strengthFill.className   = "strength-fill" + (cls ? " " + cls : "");
    strengthLabel.textContent = label;
    strengthLabel.className   = "strength-label" + (cls ? " " + cls : "");
  }
  
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
    const val = passInput.value;
    updateStrength(val);
    if (val.length > 0 && val.length < 6) {
      showFieldError(passError, "Password minimal 6 karakter");
      passInput.classList.add("is-invalid");
      passInput.classList.remove("is-valid");
    } else if (val.length >= 6) {
      clearFieldError(passError, passInput);
      passInput.classList.add("is-valid");
      passInput.classList.remove("is-invalid");
    } else {
      clearFieldError(passError, passInput);
      updateStrength("");
    }
    // Revalidate confirm jika sudah ada isi
    if (confirmInput.value.length > 0) {
      if (confirmInput.value !== val) {
        showFieldError(confirmError, "Password tidak cocok");
        confirmInput.classList.add("is-invalid");
        confirmInput.classList.remove("is-valid");
      } else {
        clearFieldError(confirmError, confirmInput);
        confirmInput.classList.add("is-valid");
      }
    }
  });
  
  confirmInput?.addEventListener("input", () => {
    const val = confirmInput.value;
    if (val.length > 0 && val !== passInput.value) {
      showFieldError(confirmError, "Password tidak cocok");
      confirmInput.classList.add("is-invalid");
      confirmInput.classList.remove("is-valid");
    } else if (val.length > 0) {
      clearFieldError(confirmError, confirmInput);
      confirmInput.classList.add("is-valid");
    } else {
      clearFieldError(confirmError, confirmInput);
    }
  });
  
  // ─── PASSWORD TOGGLES ────────────────────────────────────────
  passToggle?.addEventListener("click", () => {
    const show = passInput.type === "password";
    passInput.type = show ? "text" : "password";
    if (passToggleIcon) passToggleIcon.className = show ? "fas fa-eye-slash" : "fas fa-eye";
  });
  
  confirmToggle?.addEventListener("click", () => {
    const show = confirmInput.type === "password";
    confirmInput.type = show ? "text" : "password";
    if (confirmToggleIcon) confirmToggleIcon.className = show ? "fas fa-eye-slash" : "fas fa-eye";
  });
  
  // ─── FIREBASE ERROR MAP ──────────────────────────────────────
  const ERROR_MAP = {
    "auth/email-already-in-use":   "Email ini sudah terdaftar. Coba login atau reset password.",
    "auth/invalid-email":          "Format email tidak valid.",
    "auth/weak-password":          "Password terlalu lemah. Gunakan minimal 6 karakter.",
    "auth/network-request-failed": "Koneksi bermasalah. Cek internet lo.",
    "auth/operation-not-allowed":  "Registrasi saat ini tidak tersedia.",
  };
  
  // ─── SUBMIT ──────────────────────────────────────────────────
  regForm?.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const email    = emailInput.value.trim();
    const password = passInput.value;
    const confirm  = confirmInput.value;
  
    let hasError = false;
  
    if (!EMAIL_RE.test(email)) {
      showFieldError(emailError, "Masukkan email yang valid");
      emailInput.classList.add("is-invalid");
      hasError = true;
    }
    if (password.length < 6) {
      showFieldError(passError, "Password minimal 6 karakter");
      passInput.classList.add("is-invalid");
      hasError = true;
    }
    if (password !== confirm) {
      showFieldError(confirmError, "Password tidak cocok");
      confirmInput.classList.add("is-invalid");
      hasError = true;
    }
    if (hasError) return;
  
    setLoading(true);
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.sendEmailVerification().then(() => {
          KopeeToast.success(
            "Cek inbox lo untuk verifikasi email, lalu login untuk akses VIP!",
            "Pendaftaran Berhasil! 🎉", 3500
          );
          return auth.signOut();
        });
      })
      .then(() => {
        setTimeout(() => navigateTo("login.html"), 2800);
      })
      .catch((error) => {
        KopeeToast.error(ERROR_MAP[error.code] || "Terjadi kesalahan: " + error.message, "Gagal Daftar");
        setLoading(false);
      });
  });