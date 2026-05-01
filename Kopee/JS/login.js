// ─── LOGIN.JS — Kopee (Phase 1: Page Transition) ────────────
// Semua alert() diganti KopeeToast + page transition smooth

const loginForm = document.querySelector('#login-form');

// ─── PAGE TRANSITION HELPER ──────────────────────────────────
function navigateTo(url) {
  document.body.classList.add("page-leaving");
  setTimeout(() => { window.location.href = url; }, 350);
}

// Inject fade CSS untuk halaman login/register
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

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email    = document.querySelector('#email-log').value;
    const password = document.querySelector('#pass-log').value;
    const btn      = document.querySelector('#log-btn');

    // Disable tombol saat loading
    btn.disabled    = true;
    btn.textContent = 'Signing in...';

    console.log("Mencoba login untuk:", email);

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        if (user.emailVerified) {
            console.log("Login sukses & email verified!");
            KopeeToast.success(
                'Selamat datang di Kopee VIP. Menikmati pengalaman eksklusif Anda.',
                'Login Berhasil! ☕',
                2500
            );
            // Kasih waktu user lihat toast sebelum redirect
            setTimeout(() => navigateTo('index.html'), 1800);
        } else {
            KopeeToast.warning(
                'Cek inbox atau folder spam lo, lalu klik link verifikasi dulu ya.',
                'Verifikasi Email Dulu!'
            );
            auth.signOut().then(() => {
                btn.disabled    = false;
                btn.textContent = 'Sign In';
            });
        }
    })
    .catch((error) => {
        console.error("Error login:", error.message);

        // Map Firebase error ke pesan yang lebih friendly
        const errorMap = {
            'auth/user-not-found':       'Email ini belum terdaftar. Yuk daftar dulu!',
            'auth/wrong-password':       'Password salah. Coba lagi atau reset password.',
            'auth/invalid-email':        'Format email tidak valid.',
            'auth/user-disabled':        'Akun ini telah dinonaktifkan.',
            'auth/too-many-requests':    'Terlalu banyak percobaan. Tunggu beberapa menit.',
            'auth/network-request-failed': 'Koneksi bermasalah. Cek internet lo.',
            'auth/invalid-credential':   'Email atau password salah. Coba lagi ya.',
        };

        const msg = errorMap[error.code] || 'Terjadi kesalahan: ' + error.message;
        KopeeToast.error(msg, 'Login Gagal');

        btn.disabled    = false;
        btn.textContent = 'Sign In';
    });
});