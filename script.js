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


      // ==================================
      // JENIS ACARA
      // ==================================

      const eventType =
        document
          .getElementById("eventType")
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
Jenis Acara: ${eventType}
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
