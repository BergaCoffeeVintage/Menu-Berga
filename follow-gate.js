
(() => {
  // GANTI dengan URL Instagram resmi Berga Coffee.
  const INSTAGRAM_URL = "https://www.instagram.com/USERNAME/";

  // Akses berlaku selama tab browser ini masih aktif.
  // Ini bukan bukti bahwa pengunjung sudah follow.
  const SESSION_KEY = "berga_follow_gate_acknowledged";

  function initGate() {
    if (sessionStorage.getItem(SESSION_KEY) === "yes") {
      return;
    }

    const gate = document.createElement("div");
    gate.id = "berga-follow-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "berga-gate-title");

    gate.innerHTML = `
      <section class="berga-gate-card">
        <p class="berga-gate-brand">berga.</p>
        <p class="berga-gate-subtitle">Coffee · Vintage and Timeless</p>

        <hr class="berga-gate-divider">

        <h1 id="berga-gate-title" class="berga-gate-title">
          A Little More Berga
        </h1>

        <p class="berga-gate-description">
          Ikuti Instagram Berga Coffee untuk mendapatkan kabar
          terbaru tentang menu, promo, dan suasana kedai kami.
          Setelah itu, kamu bisa melanjutkan ke website.
        </p>

        <a
          class="berga-gate-button"
          href="${https://www.instagram.com/berga_coffee/?hl=en}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow Instagram Berga
        </a>

        <button
          type="button"
          class="berga-gate-button berga-gate-secondary"
          id="berga-gate-continue"
        >
          Lanjut ke Website
        </button>

        <p class="berga-gate-note">
          Status follow tidak dapat diverifikasi oleh sistem ini.
          Tombol lanjut tidak membuktikan bahwa kamu sudah mengikuti
          akun Berga Coffee.
        </p>
      </section>
    `;

    document.body.appendChild(gate);
    document.body.classList.add("berga-gate-active");

    document
      .getElementById("berga-gate-continue")
      .addEventListener("click", () => {
        sessionStorage.setItem(SESSION_KEY, "yes");
        gate.remove();
        document.body.classList.remove("berga-gate-active");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGate);
  } else {
    initGate();
  }
})();
