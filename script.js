// ==========================================
// KARISYA DREAMY — ORDER, ROBLOX, PROMO & BANNER
// ==========================================

const nomorWhatsApp = "6285780075159";
const ROBLOX_PROXY_URL = "https://roblox-api.xavvlabs.workers.dev";

const DISKON_JUMAT = 0.1;

// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}


function hariIniJumat() {
  // Tes manual: tambahkan ?promo=1 di URL
  if (new URLSearchParams(location.search).get("promo") === "1") return true;

  const hari = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return hari === "Fri";
}

const promoAktif = hariIniJumat();

const HARGA_KENA_PROMO = [17000, 34000, 51000]; // paket 100, 200, 300
function hargaAkhir(hargaAsli) {
  return promoAktif && HARGA_KENA_PROMO.includes(hargaAsli)
    ? Math.round(hargaAsli * (1 - DISKON_JUMAT))
    : hargaAsli;
}

// ==========================================
// ELEMENT UTAMA
// ==========================================

const paketSelect = document.getElementById("paket");
const total = document.getElementById("total");
const totalNote = document.getElementById("totalNote");
const barTotal = document.getElementById("barTotal");
const mobileBar = document.getElementById("mobileBar");

function tampilTotal(teks) {
  total.textContent = teks;
  if (barTotal) barTotal.textContent = teks;
}

// ==========================================
// TERAPKAN HARGA PROMO KE KARTU & DROPDOWN
// ==========================================

function terapkanPromoJumat() {
  if (!promoAktif) return;

  // 1) Dropdown form
  Array.from(paketSelect.options).forEach(function (opt) {
    const asli = Number(opt.getAttribute("data-price"));
    if (!asli) return;
    const baru = hargaAkhir(asli);
    if (baru === asli) return; // bukan paket promo
    opt.setAttribute("data-base-price", asli);
    opt.setAttribute("data-price", baru);
    opt.textContent = `${opt.value} — ${formatRupiah(baru)} (diskon 10%)`;
  });

  // 2) Kartu paket
  document.querySelectorAll(".package-card").forEach(function (kartu) {
    const hargaEl = kartu.querySelector(":scope > strong");
    if (!hargaEl) return;
    const asli = Number(hargaEl.textContent.replace(/[^\d]/g, ""));
    const baru = hargaAkhir(asli);
    if (!asli || baru === asli) return; // bukan paket promo
    kartu.classList.add("is-promo");
    const badge = document.createElement("div");
    badge.className = "promo-badge";
    badge.textContent = "-10%";
    kartu.appendChild(badge);
    hargaEl.innerHTML = `<s>${formatRupiah(asli)}</s>${formatRupiah(baru)}`;
  });

  // 3) Info Jumat
  const note = document.getElementById("fridayNote");
  if (note) note.hidden = false;
}

// ==========================================
// PILIH PAKET
// ==========================================

function tandaiKartuTerpilih() {
  const nilai = paketSelect.value;
  document.querySelectorAll(".package-card").forEach(function (kartu) {
    const nama = kartu.querySelector("h3").textContent.trim();
    kartu.classList.toggle("picked", !!nilai && nama === nilai);
  });
}

function pilihPaket(namaPaket, harga, tipe) {
  const options = paketSelect.options;
  let harganya = hargaAkhir(harga);

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (
      option.value === namaPaket &&
      option.getAttribute("data-type") === tipe
    ) {
      paketSelect.selectedIndex = i;
      harganya = Number(option.getAttribute("data-price"));
      break;
    }
  }

  tampilTotal(formatRupiah(harganya));
  updateCatatanTotal();
  tandaiKartuTerpilih();

  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
}

// Total ikut berubah kalau paket diganti lewat dropdown
paketSelect.addEventListener("change", function () {
  const opt = paketSelect.options[paketSelect.selectedIndex];
  const harga = opt ? Number(opt.getAttribute("data-price")) : 0;
  tampilTotal(formatRupiah(harga || 0));
  updateCatatanTotal();
  tandaiKartuTerpilih();
});

// ==========================================
// UPDATE TOTAL
// ==========================================

function updateCatatanTotal() {
  if (!totalNote) return;
  const opt = paketSelect.options[paketSelect.selectedIndex];
  const kenaPromo =
    promoAktif &&
    opt &&
    opt.getAttribute("data-base-price") &&
    opt.getAttribute("data-base-price") !== opt.getAttribute("data-price");
  totalNote.textContent = kenaPromo
    ? "Sudah termasuk diskon Jumat 10%"
    : "Sesuai paket yang dipilih";
}

// ==========================================
// FILTER PAKET
// ==========================================

(function initFilter() {
  const chips = document.querySelectorAll("#filterChips .chip");
  if (!chips.length) return;

  function cocok(filter, robux) {
    if (filter === "small") return robux <= 300;
    if (filter === "mid") return robux >= 500 && robux <= 1000;
    if (filter === "big") return robux >= 1500;
    return true;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.getAttribute("data-f");
      document.querySelectorAll(".package-card").forEach(function (kartu) {
        const robux = Number(kartu.getAttribute("data-robux"));
        kartu.classList.toggle("is-hidden", !cocok(f, robux));
      });
    });
  });
})();

// ==========================================
// ELEMENT ROBLOX
// ==========================================

const usernameInput = document.getElementById("username");
const verifyButton = document.getElementById("verifyRobloxButton");
const robloxStatus = document.getElementById("robloxStatus");
const robloxProfile = document.getElementById("robloxProfile");
const robloxAvatar = document.getElementById("robloxAvatar");
const robloxDisplayName = document.getElementById("robloxDisplayName");
const robloxUsername = document.getElementById("robloxUsername");
const robloxUserId = document.getElementById("robloxUserId");
const robloxUserIdValue = document.getElementById("robloxUserIdValue");
const robloxDisplayNameValue = document.getElementById(
  "robloxDisplayNameValue",
);
const orderButton = document.querySelector(".order-button");

let akunRobloxTerverifikasi = false;

// ==========================================
// RESET VERIFIKASI
// ==========================================

function resetVerifikasiRoblox() {
  akunRobloxTerverifikasi = false;

  robloxStatus.textContent = "";
  robloxStatus.className = "roblox-status";

  robloxProfile.hidden = true;
  robloxAvatar.removeAttribute("src");

  robloxUserIdValue.value = "";
  robloxDisplayNameValue.value = "";

  orderButton.disabled = true;
}

usernameInput.addEventListener("input", resetVerifikasiRoblox);

// ==========================================
// CARI AKUN ROBLOX
// ==========================================

async function cariAkunRoblox(username) {
  const url = `${ROBLOX_PROXY_URL}/api/roblox/${encodeURIComponent(username)}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  const data = await response.json().catch(() => null);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Server bermasalah: HTTP ${response.status}`);
  }

  if (!data || data.success !== true) return null;

  return data;
}

verifyButton.addEventListener("click", async function () {
  const username = usernameInput.value.trim();

  if (!username) {
    robloxStatus.textContent = "Masukkan username Roblox terlebih dahulu.";
    robloxStatus.className = "roblox-status error";
    usernameInput.focus();
    return;
  }

  akunRobloxTerverifikasi = false;
  orderButton.disabled = true;
  robloxProfile.hidden = true;

  verifyButton.disabled = true;
  verifyButton.innerHTML = "Sedang mengecek... <span>⏳</span>";

  robloxStatus.textContent = "Menghubungkan ke data Roblox...";
  robloxStatus.className = "roblox-status loading";

  try {
    const user = await cariAkunRoblox(username);

    if (!user) {
      robloxStatus.textContent =
        "Username tidak ditemukan. Periksa kembali ejaannya.";
      robloxStatus.className = "roblox-status error";
      return;
    }

    const namaUsername = user.username || username;
    const namaDisplay = user.displayName || namaUsername;
    const userId = user.userId;

    robloxDisplayName.textContent = namaDisplay;
    robloxUsername.textContent = `@${namaUsername}`;
    robloxUserId.textContent = `User ID: ${userId}`;

    const avatarUrl = user.avatar || user.image || user.headshot || "";

    if (avatarUrl) {
      robloxAvatar.src = avatarUrl;
      robloxAvatar.alt = `Avatar Roblox ${namaUsername}`;
      robloxAvatar.style.display = "block";
    } else {
      robloxAvatar.removeAttribute("src");
      robloxAvatar.alt = "Avatar Roblox tidak tersedia";
    }

    robloxUserIdValue.value = userId;
    robloxDisplayNameValue.value = namaDisplay;

    robloxProfile.hidden = false;

    robloxStatus.textContent =
      "Akun ditemukan. Pastikan username dan avatar di atas sudah sesuai.";
    robloxStatus.className = "roblox-status success";

    akunRobloxTerverifikasi = true;
    orderButton.disabled = false;
  } catch (error) {
    console.error("Roblox verification error:", error);
    robloxStatus.textContent =
      "Gagal terhubung ke Roblox. Silakan coba lagi beberapa saat.";
    robloxStatus.className = "roblox-status error";
  } finally {
    verifyButton.disabled = false;
    verifyButton.innerHTML = "Cek Akun Roblox <span>→</span>";
  }
});

// ==========================================
// SUBMIT ORDER
// ==========================================

document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!paketSelect.value) {
      alert("Pilih paket Robux terlebih dahulu.");
      return;
    }

    if (!username) {
      alert("Masukkan username Roblox terlebih dahulu.");
      return;
    }

    if (!akunRobloxTerverifikasi) {
      alert(
        "Verifikasi username Roblox kamu dulu lewat tombol Cek Akun Roblox.",
      );
      usernameInput.focus();
      return;
    }

    const selectedOption = paketSelect.options[paketSelect.selectedIndex];
    const paket = selectedOption.value;
    const harga = Number(selectedOption.getAttribute("data-price"));
    const hargaAsli =
      Number(selectedOption.getAttribute("data-base-price")) || harga;
    const tipe = selectedOption.getAttribute("data-type");
    const userId = robloxUserIdValue.value;
    const displayName = robloxDisplayNameValue.value;

    // Order ID
    const s = new Date();
    const p = (n) => String(n).padStart(2, "0");
    const orderID = `KD-${p(s.getDate())}${p(s.getMonth() + 1)}${String(s.getFullYear()).slice(-2)}-${p(s.getHours())}${p(s.getMinutes())}${p(s.getSeconds())}`;

    const barisHarga =
      promoAktif && hargaAsli !== harga
        ? `Harga Normal: ${formatRupiah(hargaAsli)}
Diskon Jumat 10%: -${formatRupiah(hargaAsli - harga)}
Total: ${formatRupiah(harga)}`
        : `Total: ${formatRupiah(harga)}`;

const pesan = `*૮₍˶ᵔ ᵕ ᵔ˶₎ა BOBux ORDER MASUKK!! 🎀*
    
*୨୧ KARISYA DREAMY ORDER ୨୧*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
୨୧ Order ID            : ${orderID}
୨୧ Jenis               : ${tipe}
୨୧ Paket               : ${paket}
୨୧ Username Roblox     : ${username}
୨୧ Display Name        : ${displayName}
୨୧ User ID             : ${userId}
${barisHarga}
୨୧ Status Akun         : Terverifikasi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hαllooo minsyyy ♡ akuu mauu take bObux inii >< 💗 ditungguu next step-nyaa, minsy! 🛒

₊˚ʚ A Little Shop Born From a Dream ɞ˚₊`;

    const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    window.open(linkWhatsApp, "_blank");
  });

// ==========================================
// BANNER IKLAN (2 slide, geser otomatis)
// ==========================================

(function initAdBanner() {
  const track = document.getElementById("adTrack");
  const frame = document.getElementById("adFrame");
  const dots = document.querySelectorAll("#adDots i");
  const prev = document.getElementById("adPrev");
  const next = document.getElementById("adNext");

  if (!track || !frame) return;

  const JEDA = 3000; // ms — waktu antar geseran (ubah di sini)
  const jumlah = track.children.length;
  let index = 0;
  let timer = null;

  function tampil(i) {
    index = (i + jumlah) % jumlah;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle("on", n === index));
  }

  function mulai() {
    berhenti();
    timer = setInterval(() => tampil(index + 1), JEDA);
  }

  function berhenti() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  prev.addEventListener("click", () => {
    tampil(index - 1);
    mulai();
  });
  next.addEventListener("click", () => {
    tampil(index + 1);
    mulai();
  });
  dots.forEach((d, n) =>
    d.addEventListener("click", () => {
      tampil(n);
      mulai();
    }),
  );

  // Berhenti saat di-hover (desktop)
  frame.addEventListener("mouseenter", berhenti);
  frame.addEventListener("mouseleave", mulai);

  // Geser dengan jari (HP)
  let startX = 0;
  frame.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      berhenti();
    },
    { passive: true },
  );
  frame.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) tampil(index + (dx < 0 ? 1 : -1));
    mulai();
  });

  // Hemat baterai saat tab tidak aktif
  document.addEventListener("visibilitychange", () =>
    document.hidden ? berhenti() : mulai(),
  );

  tampil(0);
  mulai();
})();

// ==========================================
// BAR HP & TOMBOL KE ATAS
// ==========================================

(function initExtras() {
  const toTop = document.getElementById("toTop");
  const orderSection = document.getElementById("order");

  function cek() {
    const y = window.scrollY;
    if (toTop) toTop.hidden = y < 500;

    if (mobileBar) {
      const r = orderSection.getBoundingClientRect();
      const sedangDiForm = r.top < window.innerHeight && r.bottom > 0;
      const sudahPilih = !!paketSelect.value;
      mobileBar.hidden = !(sudahPilih && !sedangDiForm);
    }
  }

  window.addEventListener("scroll", cek, { passive: true });
  paketSelect.addEventListener("change", cek);
  window.addEventListener("resize", cek);
  cek();
})();

// ==========================================
// DEFAULT
// ==========================================

terapkanPromoJumat();
orderButton.disabled = true;
