// script.js - Interaktivitas & Fungsionalitas BSU FMIPA UNM

// ==========================================
// 1. DATA MASTER & AUTENTIKASI NASABAH (STORAGE)
// ==========================================
const DEFAULT_USER = {
    isLoggedIn: false,
    nama: "Andi M. Resky Pratama",
    nim: "210101502001",
    prodi: "Pendidikan Kimia",
    fakultas: "FMIPA UNM",
    status: "Mahasiswa Aktif",
    email: "a.resky@student.unm.ac.id",
    phone: "+62 812-3456-7890",
    noRekening: "BSU-MIPA-2024-042",
    saldo: 185000,
    poin: 370,
    totalOrganik: 16.0,
    totalAnorganik: 26.5,
    history: [
        { id: "BSU-TX-104", tanggal: "28 Sep 2026", kategori: "Anorganik", jenis: "Botol Plastik PET Bersih", berat: 4.5, nilai: 18000, poin: 36, status: "Selesai" },
        { id: "BSU-TX-103", tanggal: "21 Sep 2026", kategori: "Organik", jenis: "Dedaunan Kering & Sisa Buah Kantin", berat: 8.0, nilai: 8000, poin: 24, status: "Selesai" },
        { id: "BSU-TX-102", tanggal: "14 Sep 2026", kategori: "Anorganik", jenis: "Kardus Bekas & Kertas HVS Ujian", berat: 12.0, nilai: 36000, poin: 72, status: "Selesai" },
        { id: "BSU-TX-101", tanggal: "05 Sep 2026", kategori: "Anorganik", jenis: "Kaleng Minuman Aluminium", berat: 2.0, nilai: 20000, poin: 40, status: "Selesai" },
        { id: "BSU-TX-100", tanggal: "28 Agu 2026", kategori: "Organik", jenis: "Sisa Sayuran & Kulit Buah Organik", berat: 8.0, nilai: 8000, poin: 24, status: "Selesai" }
    ]
};

function getBSUUser() {
    const data = localStorage.getItem("bsu_user_data");
    if (!data) {
        localStorage.setItem("bsu_user_data", JSON.stringify(DEFAULT_USER));
        return DEFAULT_USER;
    }
    return JSON.parse(data);
}

function saveBSUUser(user) {
    localStorage.setItem("bsu_user_data", JSON.stringify(user));
}

function loginBSU(nim, password, nama, prodi) {
    const user = getBSUUser();
    user.isLoggedIn = true;
    if (nim) user.nim = nim;
    if (nama) user.nama = nama;
    if (prodi) user.prodi = prodi;
    saveBSUUser(user);
    return user;
}

function logoutBSU() {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Nasabah BSU FMIPA UNM?")) {
        const user = getBSUUser();
        user.isLoggedIn = false;
        saveBSUUser(user);
        alert("Anda telah berhasil keluar (Logout). Mengalihkan ke Beranda...");
        window.location.href = "index.html";
    }
}

// ==========================================
// 2. RENDER NAVBAR AUTH & GLOBAL SEARCH
// ==========================================
function updateNavbarAuth() {
    const authContainers = document.querySelectorAll(".auth-nav-container");
    const user = getBSUUser();

    authContainers.forEach(container => {
        if (user.isLoggedIn) {
            const shortName = user.nama ? user.nama.trim().split(" ")[0] : "Nasabah";
            container.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2 px-2 py-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="height: 32px; font-size: 0.85rem;">
                        <i class="fa-solid fa-circle-user text-success fs-6"></i>
                        <span class="d-none d-sm-inline fw-semibold">${shortName}</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 user-dropdown-custom">
                        <li class="user-dropdown-header-custom">
                            <div class="user-name">${user.nama || 'Nasabah BSU'}</div>
                            <div class="user-role">${user.status || 'Civitas MIPA'}</div>
                        </li>
                        <li>
                            <a class="dropdown-item d-flex align-items-center" href="profile.html">
                                <i class="fa-solid fa-user me-2 text-success"></i>Profil & Saldo
                            </a>
                        </li>
                        <li><hr class="dropdown-divider my-1 border-secondary"></li>
                        <li>
                            <button class="dropdown-item text-danger d-flex align-items-center" onclick="logoutBSU()">
                                <i class="fa-solid fa-arrow-right-from-bracket me-2"></i>Keluar (Logout)
                            </button>
                        </li>
                    </ul>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html" class="btn btn-auth-nav btn-sm px-3" style="height: 32px; font-size: 0.85rem; display: inline-flex; align-items: center;">
                    <i class="fa-solid fa-arrow-right-to-bracket me-1"></i> Masuk / Login
                </a>
            `;
        }
    });
}

// Handler khusus untuk tombol "Buka Profil & Cek Saldo"
function checkProfileAccess(event) {
    if (event) event.preventDefault();
    const user = getBSUUser();
    if (user && user.isLoggedIn) {
        window.location.href = "profile.html";
    } else {
        window.location.href = "login.html";
    }
}

// Modal HTML Pencarian & Login Universal
function injectUniversalModals() {
    if (document.getElementById("loginModal")) return;

    const modalHTML = `
    <!-- Modal Login Nasabah -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <div class="d-flex align-items-center gap-2">
                        <img src="images/logo_BSU.png" alt="BSU" style="height: 35px;">
                        <h5 class="modal-title fw-bold" id="loginModalLabel">Masuk Akun Nasabah</h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <p class="text-muted small mb-4">Area Pengguna / Nasabah Bank Sampah Unit FMIPA UNM. Silakan masuk menggunakan NIM/NIP Anda.</p>
                    
                    <form id="universalLoginForm">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">NIM / NIP Civitas Akademika</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fa-solid fa-id-card text-success"></i></span>
                                <input type="text" class="form-control" id="loginNIM" placeholder="Contoh: 210101502001" required value="210101502001">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Kata Sandi</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light"><i class="fa-solid fa-lock text-success"></i></span>
                                <input type="password" class="form-control" id="loginPassword" placeholder="••••••••" required value="bsufmipa2026">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Peran Civitas</label>
                            <select class="form-select" id="loginRole">
                                <option value="Mahasiswa Aktif" selected>Mahasiswa FMIPA UNM</option>
                                <option value="Dosen">Dosen FMIPA UNM</option>
                                <option value="Tenaga Kependidikan">Tenaga Kependidikan (Tendik)</option>
                                <option value="Mitra Eksternal">Mitra / Masyarakat Eksternal</option>
                            </select>
                        </div>
                        <div class="d-grid gap-2 mb-3">
                            <button type="submit" class="btn btn-green fw-bold py-2">
                                <i class="fa-solid fa-right-to-bracket me-1"></i> Masuk Sekarang
                            </button>
                            <button type="button" class="btn btn-outline-success btn-sm" id="btnQuickDemoLogin">
                                <i class="fa-solid fa-bolt me-1"></i> Quick Demo Login (Civitas MIPA)
                            </button>
                        </div>
                    </form>
                    <div class="text-center small text-muted">
                        Belum punya akun nasabah? Hubungi pengurus di Sekretariat BSU Kampus Parantambung atau via <a href="contact.html" class="text-success fw-bold text-decoration-none">Hubungi Kami</a>.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Hasil Pencarian Global -->
    <div class="modal fade" id="searchResultModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content rounded-4 border-0 shadow">
                <div class="modal-header border-bottom">
                    <h5 class="modal-title fw-bold" id="searchModalLabel">
                        <i class="fa-solid fa-magnifying-glass text-success me-2"></i>Hasil Pencarian
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <p class="text-muted small" id="searchKeywordSummary">Menampilkan hasil untuk kata kunci...</p>
                    <div class="list-group" id="searchResultsList">
                        <!-- Dynamic Results -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Event listener login form
    const loginForm = document.getElementById("universalLoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nim = document.getElementById("loginNIM").value.trim();
            loginBSU(nim, "password");
            const modalEl = document.getElementById("loginModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            alert("Login Berhasil! Selamat datang di Area Nasabah BSU FMIPA UNM.");
            window.location.href = "profile.html";
        });
    }

    // Quick demo login
    const btnDemo = document.getElementById("btnQuickDemoLogin");
    if (btnDemo) {
        btnDemo.addEventListener("click", function () {
            loginBSU("210101502001", "bsufmipa2026", "Andi M. Resky Pratama", "Pendidikan Kimia");
            const modalEl = document.getElementById("loginModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            window.location.href = "profile.html";
        });
    }
}

// Global Search Handler
function initGlobalSearch() {
    const searchForms = document.querySelectorAll('form[role="search"]');

    const SEARCH_INDEX = [
        { title: "Pemilahan Sampah Organik (Kompos & Eco-enzyme)", desc: "Pengolahan limbah sisa makanan, daun kering kampus menjadi kompos & eco-enzyme.", url: "work.html#organik" },
        { title: "Penerimaan Sampah Anorganik (Plastik, Kertas, Logam)", desc: "Pengumpulan botol plastik, kardus, kaleng aluminium untuk didaur ulang bernilai rupiah.", url: "work.html#anorganik" },
        { title: "Cakupan Layanan Internal & Eksternal", desc: "Melayani mahasiswa, dosen, tendik, kantin FMIPA UNM dan masyarakat sekitar Parantambung.", url: "work.html#cakupan" },
        { title: "Berita & Kegiatan BSU FMIPA UNM", desc: "Artikel peresmian BSU, inovasi ekonomi sirkular, dan pembaruan kegiatan civitas.", url: "news.html" },
        { title: "Profil & Struktur Organisasi BSU FMIPA UNM", desc: "Sejarah, latar belakang ekonomi sirkular, dan struktur organisasi pengurus.", url: "about.html" },
        { title: "Testimoni Nasabah & Civitas Akademika", desc: "Pengalaman mahasiswa, dosen, dan pengelola kantin menabung sampah di BSU.", url: "testimoni.html" },
        { title: "Kontak Pengurus (Humaerah & Amel)", desc: "Nomor WhatsApp, telepon, lokasi kampus Parantambung Jl. Daeng Tata Makassar.", url: "contact.html" },
        { title: "Profil Saya (Saldo & Riwayat Penyetoran)", desc: "Informasi saldo tabungan rupiah, total poin, dan riwayat setoran sampah.", url: "profile.html" },
        { title: "Masuk / Login Akun Nasabah", desc: "Halaman autentikasi civitas akademika untuk mengakses buku tabungan sampah.", url: "login.html" }
    ];

    searchForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = form.querySelector('input[type="search"]');
            if (!input) return;
            const query = input.value.trim().toLowerCase();
            if (!query) {
                alert("Silakan masukkan kata kunci pencarian terlebih dahulu.");
                return;
            }

            const results = SEARCH_INDEX.filter(item => 
                item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
            );

            const listEl = document.getElementById("searchResultsList");
            const summaryEl = document.getElementById("searchKeywordSummary");
            if (summaryEl) summaryEl.innerHTML = `Ditemukan <strong>${results.length}</strong> hasil untuk pencarian "<em>${query}</em>":`;

            if (listEl) {
                if (results.length === 0) {
                    listEl.innerHTML = `
                        <div class="text-center py-4 text-muted">
                            <i class="fa-regular fa-face-meh fs-1 mb-2"></i>
                            <p>Tidak ditemukan hasil untuk "${query}". Coba kata kunci seperti: <em>organik, anorganik, kontak, saldo, testimoni</em>.</p>
                        </div>
                    `;
                } else {
                    listEl.innerHTML = results.map(r => `
                        <a href="${r.url}" class="list-group-item list-group-item-action p-3">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h6 class="mb-1 text-success fw-bold"><i class="fa-solid fa-link me-2"></i>${r.title}</h6>
                                <span class="badge bg-success-subtle text-success small">Buka</span>
                            </div>
                            <p class="mb-1 text-muted small">${r.desc}</p>
                        </a>
                    `).join("");
                }
            }

            const searchModal = new bootstrap.Modal(document.getElementById("searchResultModal"));
            searchModal.show();
        });
    });
}

// ==========================================
// 3. PROFILE DASHBOARD LOGIC (profile.html)
// ==========================================
function initProfileDashboard() {
    const profileContainer = document.getElementById("profileDashboardContainer");
    if (!profileContainer) return;

    let user = getBSUUser();

    function renderProfile() {
        // Render Biodata
        const elNama = document.getElementById("profileNama");
        const elNim = document.getElementById("profileNIM");
        const elProdi = document.getElementById("profileProdi");
        const elFakultas = document.getElementById("profileFakultas");
        const elStatus = document.getElementById("profileStatus");
        const elEmail = document.getElementById("profileEmail");
        const elPhone = document.getElementById("profilePhone");
        const elNoRek = document.getElementById("profileNoRek");

        if (elNama) elNama.textContent = user.nama;
        if (elNim) elNim.textContent = user.nim;
        if (elProdi) elProdi.textContent = user.prodi;
        if (elFakultas) elFakultas.textContent = user.fakultas;
        if (elStatus) elStatus.textContent = user.status;
        if (elEmail) elEmail.textContent = user.email;
        if (elPhone) elPhone.textContent = user.phone;
        if (elNoRek) elNoRek.textContent = user.noRekening;

        // Render Finansial & Statistik
        const elSaldo = document.getElementById("profileSaldo");
        const elPoin = document.getElementById("profilePoin");
        const elOrganik = document.getElementById("profileOrganik");
        const elAnorganik = document.getElementById("profileAnorganik");
        const elTotalSampah = document.getElementById("profileTotalSampah");

        if (elSaldo) elSaldo.textContent = "Rp " + user.saldo.toLocaleString("id-ID");
        if (elPoin) elPoin.textContent = user.poin + " Poin";
        if (elOrganik) elOrganik.textContent = user.totalOrganik.toFixed(1) + " Kg";
        if (elAnorganik) elAnorganik.textContent = user.totalAnorganik.toFixed(1) + " Kg";
        if (elTotalSampah) elTotalSampah.textContent = (user.totalOrganik + user.totalAnorganik).toFixed(1) + " Kg";

        // Render Riwayat Transaksi
        renderHistoryTable("semua");
    }

    function renderHistoryTable(filter) {
        const tableBody = document.getElementById("historyTableBody");
        if (!tableBody) return;

        let filtered = user.history;
        if (filter === "organik") filtered = user.history.filter(h => h.kategori.toLowerCase() === "organik");
        if (filter === "anorganik") filtered = user.history.filter(h => h.kategori.toLowerCase() === "anorganik");

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Belum ada riwayat penyetoran untuk kategori ini.</td></tr>`;
            return;
        }

        tableBody.innerHTML = filtered.map(row => {
            const isOrganik = row.kategori.toLowerCase() === "organik";
            const badgeClass = isOrganik ? "badge-organik" : "badge-anorganik";
            const icon = isOrganik ? '<i class="fa-solid fa-leaf text-success me-1"></i>' : '<i class="fa-solid fa-recycle text-primary me-1"></i>';
            return `
                <tr>
                    <td class="small fw-semibold">${row.tanggal}</td>
                    <td class="small text-muted font-monospace">${row.id}</td>
                    <td><span class="category-pill ${badgeClass}">${icon} ${row.kategori}</span></td>
                    <td class="small fw-medium">${row.jenis}</td>
                    <td class="small text-end fw-bold">${row.berat.toFixed(1)} Kg</td>
                    <td class="small text-end text-success fw-bold">+Rp ${row.nilai.toLocaleString("id-ID")}</td>
                    <td class="small text-end fw-bold text-warning">+${row.poin} Poin</td>
                </tr>
            `;
        }).join("");
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll(".btn-history-filter");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            filterBtns.forEach(b => b.classList.remove("active", "btn-success"));
            filterBtns.forEach(b => b.classList.add("btn-outline-secondary"));
            this.classList.remove("btn-outline-secondary");
            this.classList.add("active", "btn-success");
            const filterType = this.getAttribute("data-filter");
            renderHistoryTable(filterType);
        });
    });

    // Simulasi Setor Sampah Form
    const depositForm = document.getElementById("formSimulasiSetor");
    if (depositForm) {
        depositForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const kategori = document.getElementById("setorKategori").value;
            const jenis = document.getElementById("setorJenis").value;
            const berat = parseFloat(document.getElementById("setorBerat").value);

            if (isNaN(berat) || berat <= 0) {
                alert("Silakan masukkan berat sampah yang valid (> 0 kg).");
                return;
            }

            // Estimasi Saldo & Poin
            let tarifPerKg = 3000;
            let poinPerKg = 8;
            if (kategori === "Organik") {
                tarifPerKg = 1000;
                poinPerKg = 3;
            } else {
                if (jenis.includes("Logam") || jenis.includes("Kaleng")) {
                    tarifPerKg = 10000;
                    poinPerKg = 20;
                } else if (jenis.includes("Kardus") || jenis.includes("Kertas")) {
                    tarifPerKg = 3000;
                    poinPerKg = 6;
                } else {
                    tarifPerKg = 4000;
                    poinPerKg = 8;
                }
            }

            const nilai = Math.round(berat * tarifPerKg);
            const poin = Math.round(berat * poinPerKg);

            const newTx = {
                id: "BSU-TX-" + Math.floor(105 + Math.random() * 900),
                tanggal: "Hari ini (Simulasi)",
                kategori: kategori,
                jenis: jenis,
                berat: berat,
                nilai: nilai,
                poin: poin,
                status: "Selesai"
            };

            user.history.unshift(newTx);
            user.saldo += nilai;
            user.poin += poin;
            if (kategori === "Organik") {
                user.totalOrganik += berat;
            } else {
                user.totalAnorganik += berat;
            }

            saveBSUUser(user);
            renderProfile();

            alert(`Penyetoran Sampah Berhasil Dicatat!\n\nKategori: ${kategori} (${jenis})\nBerat: ${berat} Kg\nSaldo Ditambahkan: +Rp ${nilai.toLocaleString("id-ID")}\nPoin Reward: +${poin} Poin`);
            depositForm.reset();

            const modalEl = document.getElementById("modalSetorSampah");
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
        });
    }

    // Modal Tarik Saldo
    const formTarik = document.getElementById("formTarikSaldo");
    if (formTarik) {
        formTarik.addEventListener("submit", function (e) {
            e.preventDefault();
            const nominal = parseInt(document.getElementById("tarikNominal").value);
            const metode = document.getElementById("tarikMetode").value;

            if (isNaN(nominal) || nominal < 10000) {
                alert("Penarikan minimum adalah Rp 10.000.");
                return;
            }
            if (nominal > user.saldo) {
                alert("Saldo Anda tidak mencukupi untuk melakukan penarikan sebesar Rp " + nominal.toLocaleString("id-ID"));
                return;
            }

            user.saldo -= nominal;
            saveBSUUser(user);
            renderProfile();

            alert(`Permintaan Penarikan Saldo Berhasil Diajukan!\nNominal: Rp ${nominal.toLocaleString("id-ID")}\nMetode: ${metode}\nPengurus BSU akan memverifikasi pencairan dana ke rekening Anda.`);
            formTarik.reset();

            const modalEl = document.getElementById("modalTarikSaldo");
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
        });
    }

    renderProfile();
}

// ==========================================
// 4. FEEDBACK FORMULIR PESAN & SARAN
// ==========================================
function initGeneralFormFeedback() {
    const suggestionForms = document.querySelectorAll("footer form, .contact-form-custom");
    suggestionForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Terima kasih! Pesan dan saran Anda telah berhasil terkirim ke pengurus BSU FMIPA UNM. Kami mengapresiasi partisipasi Anda dalam mewujudkan kampus hijau.");
            form.reset();
        });
    });
}

// ==========================================
// 5. INISIALISASI SAAT DOM SIAP
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // Efek interaktif hover kartu layanan
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach(card => {
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-6px)";
            this.style.boxShadow = "0 12px 25px rgba(40, 167, 69, 0.18)";
            this.style.borderColor = "#218838";
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
            this.style.borderColor = "#28a745";
        });
    });

    injectUniversalModals();
    updateNavbarAuth();
    initGlobalSearch();
    initProfileDashboard();
    initGeneralFormFeedback();
});