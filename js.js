
const WEDDING_DATE = new Date("2026-12-20T08:00:00+07:00"); 
const $ = (id) => document.getElementById(id);


window.addEventListener("load", function checkBootstrap() {
  if (document.querySelector("link[data-fallback]")) {
    console.warn("Folder bootstrap lokal tidak ditemukan, memakai Bootstrap dari CDN. Letakkan file Bootstrap di folder bootstrap/ agar bisa dipakai tanpa internet.");
  }
  const cssOk = getComputedStyle(document.documentElement).getPropertyValue("--bs-blue").trim() !== "";
  const jsOk = typeof bootstrap !== "undefined";
  const rtl = getComputedStyle(document.documentElement).direction === "rtl";
  if (cssOk && jsOk && !rtl) return;
  const problems = [
    !cssOk && "CSS Bootstrap tidak termuat",
    !jsOk && "JavaScript Bootstrap tidak termuat",
    rtl && "arah halaman kanan-ke-kiri (RTL)"
  ].filter(Boolean).join("; ");
  console.error("Masalah Bootstrap:", problems);
  const bar = document.createElement("div");
  bar.className = "bs-warning";
  bar.setAttribute("role", "alert");
  bar.textContent = "Peringatan: " + problems + ". Periksa folder bootstrap dan koneksi internet.";
  document.body.prepend(bar);
});


const guest = new URLSearchParams(location.search).get("to");
if (guest) $("guestName").textContent = guest; 

const cover = $("cover");
const openButton = $("openInvitation");

function openInvitation() {
  cover.classList.add("is-open");              
  cover.setAttribute("aria-hidden", "true");    
  document.body.classList.remove("is-locked");  
  window.scrollTo(0, 0);
}

if (openButton && cover) {
  openButton.addEventListener("click", openInvitation);
} else {
  console.error("Tombol atau cover tidak ditemukan. Periksa id 'openInvitation' dan 'cover' di HTML.");
}


function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) { $("countdown").hidden = true; $("cd-message").hidden = false; return false; }
  $("cd-days").textContent = Math.floor(diff / 864e5);
  $("cd-hours").textContent = Math.floor(diff / 36e5) % 24;
  $("cd-minutes").textContent = Math.floor(diff / 6e4) % 60;
  $("cd-seconds").textContent = Math.floor(diff / 1e3) % 60;
  return true;
}
if (updateCountdown()) {
  const timer = setInterval(() => { if (!updateCountdown()) clearInterval(timer); }, 1000);
}


document.querySelectorAll(".gallery-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    $("photoModalImg").src = btn.dataset.src;
    $("photoModalImg").alt = btn.dataset.alt;
  });
});


$("rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const count = Number($("rsvpCount").value);
  $("rsvpCount").setCustomValidity(count >= 1 && count <= 5 ? "" : "invalid");
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;
  const alertBox = $("rsvpAlert");
  alertBox.textContent = `Terima kasih, ${$("rsvpName").value.trim()}! Konfirmasi "${$("rsvpStatus").value}" untuk ${count} orang tercatat di tampilan ini (belum tersimpan ke server).`;
  alertBox.hidden = false;
  form.reset(); form.classList.remove("was-validated");
});


const WISH_KEY = "wedding-wishes";
function loadWishes() {
  try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch { return []; }
}
function renderWishes() {
  const list = $("wishList");
  list.replaceChildren();
  loadWishes().forEach((w) => {
    const card = document.createElement("div");
    card.className = "event-card wish-card py-2";
    const name = document.createElement("strong");
    const msg = document.createElement("p");
    name.textContent = w.name; msg.textContent = w.message; msg.className = "mb-0";
    card.append(name, msg);
    list.append(card);
  });
}
$("wishForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;
  const wishes = loadWishes();
  wishes.unshift({ name: $("wishName").value.trim(), message: $("wishMessage").value.trim() });
  try { localStorage.setItem(WISH_KEY, JSON.stringify(wishes)); } catch {}
  form.reset(); form.classList.remove("was-validated");
  renderWishes();
});
renderWishes();


$("copyAccount").addEventListener("click", async () => {
  const number = $("accountNumber").textContent.trim();
  try {
    await navigator.clipboard.writeText(number);
    $("copyStatus").textContent = "Nomor rekening disalin.";
  } catch {
    $("copyStatus").textContent = "Gagal menyalin otomatis. Salin manual: " + number;
  }
});


const music = $("bgMusic"), musicBtn = $("musicBtn");
musicBtn.addEventListener("click", async () => {
  try {
    if (music.paused) { await music.play(); } else { music.pause(); }
  } catch {
    alert("File musik belum ada. Letakkan file audio legal di audio/musik.mp3.");
  }
});
music.addEventListener("play", () => setMusicState(true));
music.addEventListener("pause", () => setMusicState(false));
function setMusicState(on) {
  musicBtn.classList.toggle("is-playing", on);
  musicBtn.setAttribute("aria-pressed", on);
  musicBtn.setAttribute("aria-label", on ? "Jeda musik" : "Putar musik");
}

document.querySelectorAll("#menu .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = $("menu");
    if (menu.classList.contains("show") && typeof bootstrap !== "undefined") bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});