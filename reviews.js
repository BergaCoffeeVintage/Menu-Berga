
/* ==========================================
   BERGA COFFEE — CUSTOMER REVIEWS
   ========================================== */

const SUPABASE_URL = "https://hvicejqownqtdhfboozg.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_Lk2WzuuD0_bz6qm_P039Dg_I1soLC-4";

const PAGE_SIZE = 5;

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("reviewForm");
const nameInput = document.getElementById("reviewName");
const commentInput = document.getElementById("reviewComment");
const ratingInput = document.getElementById("reviewRating");
const ratingHint = document.getElementById("ratingHint");
const charCount = document.getElementById("charCount");
const submitButton = document.getElementById("submitReview");
const formMessage = document.getElementById("formMessage");
const reviewsList = document.getElementById("reviewsList");
const loadMoreButton = document.getElementById("loadMore");

const averageRating = document.getElementById("averageRating");
const averageStars = document.getElementById("averageStars");
const reviewCount = document.getElementById("reviewCount");

let selectedRating = 0;
let displayedLimit = PAGE_SIZE;
let cachedReviews = [];
let isSubmitting = false;

/* ==========================================
   STAR PICKER
   ========================================== */

const starButtons = document.querySelectorAll(".star-button");

function updateStarPicker(rating) {
  starButtons.forEach((button) => {
    const value = Number(button.dataset.rating);
    button.classList.toggle("selected", value <= rating);
    button.setAttribute("aria-pressed", String(value === rating));
  });

  const descriptions = {
    1: "Kurang memuaskan",
    2: "Cukup",
    3: "Baik",
    4: "Sangat baik",
    5: "Luar biasa!"
  };

  ratingHint.textContent = descriptions[rating] || "Pilih bintang 1 sampai 5";
}

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);
    ratingInput.value = String(selectedRating);
    updateStarPicker(selectedRating);
  });
});

commentInput.addEventListener("input", () => {
  charCount.textContent = commentInput.value.length;
});

/* ==========================================
   MESSAGE HELPERS
   ========================================== */

function showMessage(message, type = "") {
  formMessage.textContent = message;
  formMessage.className = "form-message";

  if (type) {
    formMessage.classList.add(type);
  }
}

/* ==========================================
   FORMAT DATE
   ========================================== */

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

/* ==========================================
   CREATE REVIEW CARD SAFELY
   ========================================== */

function createReviewCard(review) {
  const card = document.createElement("article");
  card.className = "review-card";

  const top = document.createElement("div");
  top.className = "review-card-top";

  const authorBlock = document.createElement("div");

  const author = document.createElement("div");
  author.className = "review-author";
  author.textContent = review.name;

  const date = document.createElement("div");
  date.className = "review-date";
  date.textContent = formatDate(review.created_at);

  authorBlock.append(author, date);

  const stars = document.createElement("div");
  stars.className = "review-stars";
  stars.setAttribute("aria-label", `${review.rating} dari 5 bintang`);
  stars.textContent =
    "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

  top.append(authorBlock, stars);

  const comment = document.createElement("p");
  comment.className = "review-comment";
  comment.textContent = review.comment;

  card.append(top, comment);

  return card;
}

/* ==========================================
   UPDATE RATING SUMMARY
   ========================================== */

async function loadRatingSummary() {
  const { data, error } = await db
    .from("reviews")
    .select("rating");

  if (error) {
    console.error("Gagal menghitung rating:", error.message);
    averageRating.textContent = "—";
    averageStars.textContent = "☆☆☆☆☆";
    reviewCount.textContent = "Rating belum tersedia";
    return;
  }

  const ratings = data || [];
  const total = ratings.length;

  if (total === 0) {
    averageRating.textContent = "—";
    averageStars.textContent = "☆☆☆☆☆";
    reviewCount.textContent = "Belum ada ulasan";
    return;
  }

  const average =
    ratings.reduce((sum, item) => sum + item.rating, 0) / total;

  averageRating.textContent = average.toFixed(1);
  averageStars.textContent =
    "★".repeat(Math.round(average)) +
    "☆".repeat(5 - Math.round(average));

  reviewCount.textContent =
    `${total} ${total === 1 ? "ulasan" : "ulasan pelanggan"}`;
}

/* ==========================================
   LOAD REVIEWS
   ========================================== */

async function loadReviews() {
  const { data, error } = await db
    .from("reviews")
    .select("id, name, rating, comment, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(displayedLimit);

  if (error) {
    console.error("Gagal memuat review:", error.message);
    reviewsList.replaceChildren();

    const errorText = document.createElement("p");
    errorText.className = "empty-text";
    errorText.textContent =
      "Ulasan belum bisa dimuat. Periksa konfigurasi database dan koneksi internet.";
    reviewsList.appendChild(errorText);
    loadMoreButton.hidden = true;
    return;
  }

  cachedReviews = data || [];
  renderReviews();
}

function renderReviews() {
  reviewsList.replaceChildren();

  if (cachedReviews.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-text";
    empty.textContent =
      "Belum ada ulasan. Jadilah pelanggan pertama yang berbagi cerita!";
    reviewsList.appendChild(empty);
    loadMoreButton.hidden = true;
    return;
  }

  cachedReviews.forEach((review) => {
    reviewsList.appendChild(createReviewCard(review));
  });

  loadMoreButton.hidden = cachedReviews.length < displayedLimit;
}

/* ==========================================
   SUBMIT REVIEW
   ========================================== */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const rating = selectedRating;

  if (name.length < 2 || name.length > 60) {
    showMessage("Nama harus terdiri dari 2–60 karakter.", "error");
    return;
  }

  if (rating < 1 || rating > 5) {
    showMessage("Silakan pilih rating bintang 1 sampai 5.", "error");
    return;
  }

  if (comment.length < 3 || comment.length > 1000) {
    showMessage("Komentar harus terdiri dari 3–1000 karakter.", "error");
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;
  submitButton.textContent = "SENDING REVIEW...";
  showMessage("Sedang mengirim ulasan...");

  try {
    const { error } = await db
      .from("reviews")
      .insert({
        name,
        rating,
        comment
      });

    if (error) {
      throw error;
    }

    form.reset();
    selectedRating = 0;
    ratingInput.value = "";
    charCount.textContent = "0";
    updateStarPicker(0);

    displayedLimit = Math.max(PAGE_SIZE, displayedLimit);
    showMessage("Terima kasih! Ulasanmu berhasil dikirim.", "success");

    await Promise.all([
      loadReviews(),
      loadRatingSummary()
    ]);

    reviewsList.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    console.error("Gagal mengirim review:", error);

    showMessage(
      "Ulasan belum berhasil dikirim. Periksa koneksi dan pengaturan Supabase, lalu coba lagi.",
      "error"
    );
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = "SUBMIT REVIEW →";
  }
});

/* ==========================================
   LOAD MORE
   ========================================== */

loadMoreButton.addEventListener("click", async () => {
  displayedLimit += PAGE_SIZE;
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "LOADING...";

  await loadReviews();

  loadMoreButton.disabled = false;
  loadMoreButton.textContent = "LOAD MORE REVIEWS ↓";
});

/* ==========================================
   INITIAL LOAD & AUTOMATIC REFRESH
   ========================================== */

async function refreshReviews() {
  await Promise.all([
    loadReviews(),
    loadRatingSummary()
  ]);
}

updateStarPicker(0);
refreshReviews();

// Perbarui daftar agar review pengunjung lain ikut terlihat.
setInterval(refreshReviews, 15000);
