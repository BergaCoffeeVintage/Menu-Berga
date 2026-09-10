// ==========================================
// BERGA COFFEE
// MAIN JAVASCRIPT
// ==========================================


// ==========================================
// MENU ASSETS
// Urutan sesuai menu yang dikirim
// ==========================================

const pages = [
  {
    file: "assets/09-daytime-specials.jpg",
    title: "Daytime Specials · 08.00–14.00 WIB"
  },
  {
    file: "assets/08-the-brew-room.jpg",
    title: "The Brew Room · Sip to Remember"
  },
  {
    file: "assets/06-black-white-handbrew.jpg",
    title: "Black Series · White Series · Hand Brew Collection"
  },
  {
    file: "assets/05-matcha-choco-frappe.jpg",
    title: "Matcha Series · Choco Series · Frappe Series"
  },
  {
    file: "assets/04-signature-coffee-tea.jpg",
    title: "Signature Non-Coffee · Signature Coffee · Tea Series"
  },
  {
    file: "assets/07-the-kitchen.jpg",
    title: "The Kitchen · Comfort Every Bites"
  },
  {
    file: "assets/03-kitchen-pasta.jpg",
    title: "From Berga's Kitchen · Pasta Collection"
  },
  {
    file: "assets/02-french-fries-timeless-bites.jpg",
    title: "French Fries Series · Timeless Bites"
  },
  {
    file: "assets/01-toast-sweet-endings.jpg",
    title: "Toast & Oven Bakes · Sweet Endings"
  }
];


// ==========================================
// MENU PAGES
// ==========================================

const pagesEl =
  document.getElementById("pages");

const lightbox =
  document.getElementById("lightbox");

const lightboxImage =
  document.getElementById("lightboxImage");

const pageNumber =
  document.getElementById("pageNumber");

const pageTitle =
  document.getElementById("pageTitle");

let currentIndex = 0;


// Generate menu cards

if (pagesEl) {

  pages.forEach((page, index) => {

    const card =
      document.createElement("article");

    card.className = "page-card";


    card.innerHTML = `
      <img
        src="${page.file}"
        alt="${page.title}"
        loading="${index < 2 ? "eager" : "lazy"}"
      >

      <span class="page-label">
        ${String(index + 1).padStart(2, "0")}
        ·
        ${page.title}
      </span>
    `;


    card.addEventListener(
      "click",
      () => openLightbox(index)
    );


    pagesEl.appendChild(card);

  });

}


// ==========================================
// LIGHTBOX
// ==========================================

function openLightbox(index) {

  if (
    !lightbox ||
    !lightboxImage
  ) {
    return;
  }


  currentIndex = index;

  const page =
    pages[currentIndex];


  lightboxImage.src =
    page.file;

  lightboxImage.alt =
    page.title;


  if (pageNumber) {

    pageNumber.textContent =
      `Page ${currentIndex + 1} / ${pages.length}`;

  }


  if (pageTitle) {

    pageTitle.textContent =
      page.title;

  }


  lightbox.classList.add("open");


  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


// ==========================================
// CLOSE LIGHTBOX
// ==========================================

function closeLightbox() {

  if (!lightbox) {
    return;
  }


  lightbox.classList.remove("open");


  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


// ==========================================
// NEXT / PREVIOUS PAGE
// ==========================================

function movePage(direction) {

  currentIndex =
    (
      currentIndex +
      direction +
      pages.length
    ) % pages.length;


  openLightbox(currentIndex);

}


// ==========================================
// LIGHTBOX BUTTONS
// ==========================================

const closeBtn =
  document.getElementById("closeBtn");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");


if (closeBtn) {

  closeBtn.addEventListener(
    "click",
    closeLightbox
  );

}


if (prevBtn) {

  prevBtn.addEventListener(
    "click",
    () => movePage(-1)
  );

}


if (nextBtn) {

  nextBtn.addEventListener(
    "click",
    () => movePage(1)
  );

}


// Klik background untuk menutup lightbox

if (lightbox) {

  lightbox.addEventListener(
    "click",
    (event) => {

      if (event.target === lightbox) {

        closeLightbox();

      }

    }
  );

}


// ==========================================
// KEYBOARD LIGHTBOX
// ==========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      !lightbox ||
      !lightbox.classList.contains("open")
    ) {
      return;
    }


    // ESC

    if (event.key === "Escape") {

      closeLightbox();

    }


    // Arrow Left

    if (event.key === "ArrowLeft") {

      movePage(-1);

    }


    // Arrow Right

    if (event.key === "ArrowRight") {

      movePage(1);

    }

  }
);


// ==========================================
// FULLSCREEN
// ==========================================

const fullscreenBtn =
  document.getElementById("fullscreenBtn");


if (fullscreenBtn) {

  fullscreenBtn.addEventListener(
    "click",
    async () => {

      try {

        if (!document.fullscreenElement) {

          await document.documentElement
            .requestFullscreen();

        } else {

          await document
            .exitFullscreen();

        }

      } catch (error) {

        console.log(
          "Fullscreen tidak didukung:",
          error
        );

      }

    }
  );

}


// ==========================================
// DAYTIME SPECIALS
// ==========================================

const specialBtn =
  document.getElementById("specialBtn");


if (specialBtn) {

  specialBtn.addEventListener(
    "click",
    () => {

      // Daytime Specials adalah halaman pertama
      openLightbox(0);

    }
  );

}


// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menuToggle =
  document.getElementById("menuToggle");

const nav =
  document.getElementById("nav");


if (
  menuToggle &&
  nav
) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        nav.classList.toggle("open");


      menuToggle.setAttribute(
        "aria-expanded",
        isOpen
      );

    }
  );


  // Tutup navbar setelah klik menu

  nav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          nav.classList.remove("open");


          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}


// ==========================================
// RESERVATION FORM
// ==========================================

const reservationForm =
  document.getElementById(
    "reservationForm"
  );


if (reservationForm) {

  reservationForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      // ==================================
      // AMBIL DATA RESERVASI
      // ==================================

      const name =
        document
          .getElementById("guestName")
          .value
          .trim();


      const phone =
        document
          .getElementById("guestPhone")
          .value
          .trim();


      const day =
        document
          .getElementById("reservationDay")
          .value;


      const date =
        document
          .getElementById("reservationDate")
          .value;


      const time =
        document
          .getElementById("reservationTime")
          .value;


      const room =
        document
          .getElementById("room")
          .value;


      const guestCount =
        document
          .getElementById("guestCount")
          .value;


      const notes =
        document
          .getElementById("notes")
          .value
          .trim();


      // ==================================
      // ADMIN RESERVASI
      // ==================================

      const selectedAdmin =
        document.querySelector(
          'input[name="admin"]:checked'
        );


      if (!selectedAdmin) {

        alert(
          "Silakan pilih Admin Reservasi terlebih dahulu."
        );

        return;

      }


      const adminNumber =
        selectedAdmin.value;


      // ==================================
      // FORMAT TANGGAL INDONESIA
      // ==================================

      let formattedDate =
        date;


      if (date) {

        const dateObject =
          new Date(
            date + "T00:00:00"
          );


        formattedDate =
          dateObject.toLocaleDateString(
            "id-ID",
            {
              day: "2-digit",
              month: "long",
              year: "numeric"
            }
          );

      }


      // ==================================
      // PESAN WHATSAPP
      // ==================================

      const message =
`Halo Berga Coffee, saya ingin melakukan reservasi.

*DATA RESERVASI*

Nama: ${name}
Nomor WhatsApp: ${phone}
Hari: ${day}
Tanggal: ${formattedDate}
Jam: ${time} WIB
Ruangan: ${room}
Jumlah Orang: ${guestCount}

Catatan:
${notes || "-"}

Mohon konfirmasi ketersediaan reservasi saya.

Terima kasih.`;


      // ==================================
      // WHATSAPP URL
      // ==================================

      const whatsappURL =
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;


      // Buka WhatsApp

      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );

}


// ==========================================
// MINIMUM RESERVATION DATE
// Tidak bisa memilih tanggal yang sudah lewat
// ==========================================

const reservationDate =
  document.getElementById(
    "reservationDate"
  );


if (reservationDate) {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );


  reservationDate.min =
    `${year}-${month}-${day}`;

}
