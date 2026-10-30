// ==========================================
// KARISYA DREAMY — ORDER, ROBLOX & BANNER
// ==========================================

const nomorWhatsApp = "6285780075159";
const ROBLOX_PROXY_URL = "https://roblox-api.xavvlabs.workers.dev";

// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
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
  if (total) total.textContent = teks;
  if (barTotal) barTotal.textContent = teks;
}

// ==========================================
// RAPIKAN FORMAT HARGA KARTU & DROPDOWN
// ==========================================

function rapikanHarga() {
  if (!paketSelect) return;

  document.querySelectorAll(".package-card").forEach(function (kartu) {
    const hargaEl = kartu.querySelector(":scope > strong");
    if (!hargaEl) return;

    const harga = Number(hargaEl.textContent.replace(/[^\d]/g, ""));
    if (harga) hargaEl.textContent = formatRupiah(harga);
  });

  Array.from(paketSelect.options).forEach(function (opt) {
    const harga = Number(opt.dataset.price);
    if (!harga) return;

    opt.textContent = `${opt.value} — ${formatRupiah(harga)}`;
  });

  updateTotal();
}

// ==========================================
// PILIH PAKET
// ==========================================

function tandaiKartuTerpilih() {
  if (!paketSelect) return;

  const nilai = paketSelect.value;

  document.querySelectorAll(".package-card").forEach(function (kartu) {
    const nama = kartu.querySelector("h3").textContent.trim();
    kartu.classList.toggle("picked", Boolean(nilai) && nama === nilai);
  });
}

function pilihPaket(namaPaket, harga, tipe) {
  if (!paketSelect) return;

  const options = paketSelect.options;

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (
      option.value === namaPaket &&
      option.getAttribute("data-type") === tipe
    ) {
      paketSelect.selectedIndex = i;
      break;
    }
  }

  updateTotal();
  tandaiKartuTerpilih();

  const orderSection = document.getElementById("order");

  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });
  }
}

// ==========================================
// UPDATE TOTAL PEMBAYARAN
// ==========================================

function updateTotal() {
  if (!paketSelect) return;

  const opt = paketSelect.options[paketSelect.selectedIndex];
  const harga = opt ? Number(opt.dataset.price) : 0;

  tampilTotal(formatRupiah(harga));

  if (totalNote) totalNote.textContent = "Sesuai paket yang dipilih";

  tandaiKartuTerpilih();
}

if (paketSelect) {
  paketSelect.addEventListener("change", function () {
    updateTotal();
    cekMobileBar();
  });
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
      chips.forEach(function (item) {
        item.classList.remove("active");
      });

      chip.classList.add("active");

      const filter = chip.getAttribute("data-f");

      document.querySelectorAll(".package-card").forEach(function (kartu) {
        const robux = Number(kartu.getAttribute("data-robux"));
        kartu.classList.toggle("is-hidden", !cocok(filter, robux));
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

  if (robloxStatus) {
    robloxStatus.textContent = "";
    robloxStatus.className = "roblox-status";
  }

  if (robloxProfile) robloxProfile.hidden = true;
  if (robloxAvatar) robloxAvatar.removeAttribute("src");

  if (robloxUserIdValue) robloxUserIdValue.value = "";
  if (robloxDisplayNameValue) robloxDisplayNameValue.value = "";

  if (orderButton) orderButton.disabled = true;
}

if (usernameInput) {
  usernameInput.addEventListener("input", resetVerifikasiRoblox);
}

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

if (verifyButton) {
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
}

// ==========================================
// SUBMIT ORDER KE WHATSAPP
// ==========================================

const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", function (event) {
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
      alert("Verifikasi username Roblox kamu dulu.");
      usernameInput.focus();
      return;
    }

    const selectedOption = paketSelect.options[paketSelect.selectedIndex];

    const paket = selectedOption.value;
    const harga = Number(selectedOption.dataset.price);
    const tipe = selectedOption.dataset.type;
    const userId = robloxUserIdValue.value;
    const displayName = robloxDisplayNameValue.value;

    const s = new Date();
    const p = (n) => String(n).padStart(2, "0");

    const orderID =
      `KD-${p(s.getDate())}${p(s.getMonth() + 1)}` +
      `${String(s.getFullYear()).slice(-2)}-` +
      `${p(s.getHours())}${p(s.getMinutes())}${p(s.getSeconds())}`;

    const pesan = `*PESANAN BARU — KARISYA DREAMY*

Order ID: ${orderID}

*DETAIL PESANAN*
━━━━━━━━━━━━━━━━
Jenis: ${tipe}
Paket: ${paket}
Username Roblox: ${username}
Display Name: ${displayName}
User ID: ${userId}
Total: ${formatRupiah(harga)}
Status Akun: Terverifikasi
━━━━━━━━━━━━━━━━

Halo Admin Karisya Dreamy, saya ingin memesan Robux sesuai detail di atas.
Mohon informasi pembayaran selanjutnya. Terima kasih.`;

    const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    window.open(linkWhatsApp, "_blank");
  });
}

// ==========================================
// BANNER IKLAN — 2 SLIDE
// ==========================================

(function initAdBanner() {
  const track = document.getElementById("adTrack");
  const frame = document.getElementById("adFrame");
  const dots = document.querySelectorAll("#adDots i");
  const prev = document.getElementById("adPrev");
  const next = document.getElementById("adNext");

  if (!track || !frame || !prev || !next) return;

  const JEDA = 3000;
  const jumlah = track.children.length;

  if (!jumlah) return;

  let index = 0;
  let timer = null;
  let startX = 0;

  function tampil(i) {
    index = (i + jumlah) % jumlah;
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(function (dot, n) {
      dot.classList.toggle("on", n === index);
    });
  }

  function berhenti() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function mulai() {
    berhenti();
    timer = setInterval(function () {
      tampil(index + 1);
    }, JEDA);
  }

  prev.addEventListener("click", function () {
    tampil(index - 1);
    mulai();
  });

  next.addEventListener("click", function () {
    tampil(index + 1);
    mulai();
  });

  dots.forEach(function (dot, n) {
    dot.addEventListener("click", function () {
      tampil(n);
      mulai();
    });
  });

  frame.addEventListener("mouseenter", berhenti);
  frame.addEventListener("mouseleave", mulai);

  frame.addEventListener(
    "touchstart",
    function (event) {
      startX = event.touches[0].clientX;
      berhenti();
    },
    { passive: true },
  );

  frame.addEventListener("touchend", function (event) {
    const dx = event.changedTouches[0].clientX - startX;

    if (Math.abs(dx) > 40) {
      tampil(index + (dx < 0 ? 1 : -1));
    }

    mulai();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      berhenti();
    } else {
      mulai();
    }
  });

  tampil(0);
  mulai();
})();

// ==========================================
// MOBILE BAR & TOMBOL KE ATAS
// ==========================================

const toTop = document.getElementById("toTop");
const orderSection = document.getElementById("order");

function cekMobileBar() {
  if (toTop) {
    toTop.hidden = window.scrollY < 500;
  }

  if (mobileBar && orderSection && paketSelect) {
    const rect = orderSection.getBoundingClientRect();
    const sedangDiForm = rect.top < window.innerHeight && rect.bottom > 0;

    mobileBar.hidden = !(paketSelect.value && !sedangDiForm);
  }
}

window.addEventListener("scroll", cekMobileBar, { passive: true });
window.addEventListener("resize", cekMobileBar);

// ==========================================
// DEFAULT
// ==========================================

rapikanHarga();

if (orderButton) {
  orderButton.disabled = true;
}

cekMobileBar();
