// ==========================================
// KARISYA DREAMY — ROBLOX VERIFICATION
// ==========================================

// NOMOR WHATSAPP ADMIN
const nomorWhatsApp = "6285694782857";

// ==========================================
// CLOUDFLARE WORKER
// ==========================================

const ROBLOX_PROXY_URL = "https://roblox-api.xavvlabs.workers.dev";
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

// ==========================================
// PILIH PAKET
// ==========================================

function pilihPaket(namaPaket, harga, tipe) {
  const paketSelect = document.getElementById("paket");
  const total = document.getElementById("total");
  const options = paketSelect.options;

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    const optionNama = option.value;
    const optionHarga = option.getAttribute("data-price");
    const optionTipe = option.getAttribute("data-type");

    if (
      optionNama === namaPaket &&
      Number(optionHarga) === harga &&
      optionTipe === tipe
    ) {
      paketSelect.selectedIndex = i;
      break;
    }
  }

  total.textContent = formatRupiah(harga);

  document.getElementById("order").scrollIntoView({
    behavior: "smooth",
  });
}

// ==========================================
// UPDATE TOTAL
// ==========================================

document.getElementById("paket").addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const harga = selectedOption.getAttribute("data-price");
  const total = document.getElementById("total");

  if (harga) {
    total.textContent = formatRupiah(Number(harga));
  } else {
    total.textContent = "Rp0";
  }
});

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

// ==========================================
// JIKA USERNAME BERUBAH
// ==========================================

usernameInput.addEventListener("input", resetVerifikasiRoblox);

// ==========================================
// CARI AKUN ROBLOX
// ==========================================

async function cariAkunRoblox(username) {
  const url = `${ROBLOX_PROXY_URL}/api/roblox/${encodeURIComponent(username)}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => null);

  console.log("URL:", url);
  console.log("Status:", response.status);
  console.log("Data:", data);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Server bermasalah: HTTP ${response.status}`);
  }

  if (!data || data.success !== true) {
    return null;
  }

  return data;
}

// ==========================================
// TOMBOL CEK AKUN ROBLOX
// ==========================================

verifyButton.addEventListener("click", async function () {
  const username = usernameInput.value.trim();

  if (!username) {
    robloxStatus.textContent = "Masukkan username Roblox dulu ya ♡";

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
        "Username Roblox tidak ditemukan. Coba cek lagi penulisannya.";

      robloxStatus.className = "roblox-status error";
      robloxStatus.style.display = "block";
      robloxStatus.hidden = false;

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

      robloxAvatar.alt = `Character Roblox ${namaUsername}`;

      robloxAvatar.style.display = "block";
    } else {
      robloxAvatar.removeAttribute("src");

      robloxAvatar.alt = "Character Roblox tidak tersedia";
    }

    robloxUserIdValue.value = userId;

    robloxDisplayNameValue.value = namaDisplay;

    robloxProfile.hidden = false;

    robloxStatus.textContent =
      "Akun Roblox ditemukan. Pastikan username dan character di atas sudah benar.";

    robloxStatus.className = "roblox-status success";

    akunRobloxTerverifikasi = true;

    orderButton.disabled = false;
  } catch (error) {
    console.error("Roblox verification error:", error);

    robloxStatus.textContent =
      "Gagal menghubungkan ke Roblox. Coba lagi beberapa saat.";

    robloxStatus.className = "roblox-status error";
  } finally {
    verifyButton.disabled = false;

    verifyButton.innerHTML = "Cek Akun Roblox <span>✦</span>";
  }
});

// ==========================================
// SUBMIT ORDER
// ==========================================

document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const paketSelect = document.getElementById("paket");

    const username = usernameInput.value.trim();

    if (!paketSelect.value) {
      alert("Yuk pilih paket Robux dulu ✨");

      return;
    }

    if (!username) {
      alert("Masukkan username Roblox kamu dulu ya ♡");

      return;
    }

    if (!akunRobloxTerverifikasi) {
      alert(
        "Cek dan pastikan username Roblox kamu sudah terverifikasi dulu ya ♡",
      );

      usernameInput.focus();

      return;
    }

    const selectedOption = paketSelect.options[paketSelect.selectedIndex];

    const paket = selectedOption.value;

    const harga = Number(selectedOption.getAttribute("data-price"));

    const tipe = selectedOption.getAttribute("data-type");

    const userId = robloxUserIdValue.value;

    const displayName = robloxDisplayNameValue.value;

    // ======================================
    // ORDER ID
    // ======================================

    const sekarang = new Date();

    const tahun = String(sekarang.getFullYear()).slice(-2);

    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");

    const tanggal = String(sekarang.getDate()).padStart(2, "0");

    const jam = String(sekarang.getHours()).padStart(2, "0");

    const menit = String(sekarang.getMinutes()).padStart(2, "0");

    const detik = String(sekarang.getSeconds()).padStart(2, "0");

    const orderID = `KD-${tanggal}${bulan}${tahun}-${jam}${menit}${detik}`;

    // ======================================
    // PESAN WHATSAPP
    // ======================================

    const pesan = `*PESANAN ✨*

Order ID: ${orderID}

*DETAIL PESANAN*
━━━━━━━━━━━━━━━━
Jenis: ${tipe}
Paket: ${paket}
Username Roblox: ${username}
Display Name: ${displayName}
User ID: ${userId}
Total: ${formatRupiah(harga)}
Status: Username terverifikasi dari data Roblox
━━━━━━━━━━━━━━━━

Halo Admin Karisya Dreamy 💗
Saya mau order Robux dengan detail di atas.

Mohon info pembayaran selanjutnya ya ✨

Thank you ♡
`;

    const pesanEncoded = encodeURIComponent(pesan);

    const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${pesanEncoded}`;

    window.open(linkWhatsApp, "_blank");
  });

// ==========================================
// DEFAULT
// ==========================================

orderButton.disabled = true;
