// ─── REGISTER.JS — Kopee (Phase 1: Page Transition) ─────────
// Semua alert() diganti dengan KopeeToast + page transition smooth

const regForm = document.querySelector('#reg-form');

// ─── PAGE TRANSITION HELPER ──────────────────────────────────
function navigateTo(url) {
  document.body.classList.add("page-leaving");
  setTimeout(() => { window.location.href = url; }, 350);
}

(function injectTransitionCSS() {
  if (document.getElementById('kopee-transition-css')) return;
  const style = document.createElement('style');
  style.id = 'kopee-transition-css';
  style.textContent = `
    body { animation: pageFadeIn 0.4s ease forwards; }
    @keyframes pageFadeIn { from { opacity:0; transform:translateY(8px);} to {opacity:1;transform:translateY(0);} }
    body.page-leaving { animation: pageFadeOut 0.35s ease forwards; }
    @keyframes pageFadeOut { from {opacity:1;transform:translateY(0);} to {opacity:0;transform:translateY(-8px);} }
  `;
  document.head.appendChild(style);
})();

regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email       = document.querySelector('#email-reg').value;
    const password    = document.querySelector('#pass-reg').value;
    const confirmPass = document.querySelector('#pass-reg-confirm').value;
    const btn         = document.querySelector('#reg-btn');

    // Validasi password
    if (password !== confirmPass) {
        KopeeToast.warning(
            'Password dan konfirmasi password tidak sama. Cek lagi ya!',
            'Password Tidak Cocok'
        );
        return;
    }

    if (password.length < 6) {
        KopeeToast.warning(
            'Password minimal 6 karakter ya untuk keamanan akun lo.',
            'Password Terlalu Pendek'
        );
        return;
    }

    // Disable tombol saat loading
    btn.disabled    = true;
    btn.textContent = 'Creating account...';

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            user.sendEmailVerification().then(() => {
                KopeeToast.success(
                    'Cek inbox lo untuk verifikasi email, lalu login untuk akses VIP!',
                    'Pendaftaran Berhasil! 🎉',
                    3500
                );

                auth.signOut().then(() => {
                    setTimeout(() => navigateTo('login.html'), 2800);
                });
            });
        })
        .catch((error) => {
            console.error("Error register:", error.message);

            const errorMap = {
                'auth/email-already-in-use': 'Email ini sudah terdaftar. Coba login atau reset password.',
                'auth/invalid-email':        'Format email tidak valid.',
                'auth/weak-password':        'Password terlalu lemah. Gunakan minimal 6 karakter.',
                'auth/network-request-failed': 'Koneksi bermasalah. Cek internet lo.',
                'auth/operation-not-allowed': 'Registrasi saat ini tidak tersedia.',
            };

            const msg = errorMap[error.code] || 'Terjadi kesalahan: ' + error.message;
            KopeeToast.error(msg, 'Gagal Daftar');

            btn.disabled    = false;
            btn.textContent = 'Sign Up';
        });
});