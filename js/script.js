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

// ==========================================
// 2. MODAL PENCARIAN GLOBAL
// ==========================================
function injectUniversalModals() {
    if (document.getElementById("searchResultModal")) return;

    const modalHTML = `
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
}

// Global Search Handler
function initGlobalSearch() {
    const searchForms = document.querySelectorAll('form[role="search"]');

    const SEARCH_INDEX = [
        { title: "Pemilahan Sampah Organik (Kompos & Eco-enzyme)", desc: "Pengolahan limbah sisa makanan, daun kering kampus menjadi kompos & eco-enzyme.", url: "work.html#organik" },
        { title: "Penerimaan Sampah Anorganik (Plastik, Kertas, Logam)", desc: "Pengumpulan botol plastik, kardus, kaleng aluminium untuk didaur ulang bernilai rupiah.", url: "work.html#anorganik" },
        { title: "Cakupan Layanan Internal & Eksternal", desc: "Melayani mahasiswa, dosen, tendik, kantin FMIPA UNM dan masyarakat sekitar Parangtambung.", url: "work.html#cakupan" },
        { title: "Berita & Kegiatan BSU FMIPA UNM", desc: "Artikel peresmian BSU, inovasi ekonomi sirkular, dan pembaruan kegiatan civitas.", url: "news.html" },
        { title: "Profil & Struktur Organisasi BSU FMIPA UNM", desc: "Sejarah, latar belakang ekonomi sirkular, dan struktur organisasi pengurus.", url: "about.html" },
        { title: "Testimoni Nasabah & Civitas Akademika", desc: "Pengalaman mahasiswa, dosen, dan pengelola kantin menabung sampah di BSU.", url: "testimoni.html" },
        { title: "Kontak Pengurus (Humaerah & Amel)", desc: "Nomor WhatsApp, telepon, lokasi kampus Parangtambung Jl. Daeng Tata Makassar.", url: "contact.html" },
        { title: "Profil Saya (Saldo & Riwayat Penyetoran)", desc: "Informasi saldo tabungan rupiah, total poin, dan riwayat setoran sampah.", url: "profile.html" }
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
// 5. SINKRONISASI DASHBOARD PORTAL PUBLIK BSU
// ==========================================
const PORTAL_PUBLIK_EXEC_URL = "https://script.google.com/macros/s/AKfycbxKydERj5VtycVGqyDssFqdbUG7oQePoVGuupXJqquHbOeoUBJorkgo30zbW4shr19-5w/exec";

function initPortalDashboardSync() {
    const elTotalKg = document.getElementById("portalTotalKg");
    const elDepositCount = document.getElementById("portalDepositCount");
    const elCategoryCount = document.getElementById("portalCategoryCount");
    const elSyncStatus = document.getElementById("portalSyncStatus");

    if (!elTotalKg || !elDepositCount || !elCategoryCount) return;

    const formatIDNumber = (val) => {
        const n = Number(val);
        if (Number.isNaN(n)) return String(val);
        return n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
    };

    const applyPortalStats = (stats, isLive) => {
        if (stats.totalKg !== undefined) elTotalKg.textContent = formatIDNumber(stats.totalKg);
        if (stats.depositCount !== undefined) elDepositCount.textContent = formatIDNumber(stats.depositCount);
        if (stats.categoryCount !== undefined) elCategoryCount.textContent = formatIDNumber(stats.categoryCount);
        if (elSyncStatus && isLive && stats.updated) {
            elSyncStatus.textContent = `Live • ${stats.updated}`;
        }
    };

    // Tampilkan cache terakhir jika ada
    try {
        const cached = localStorage.getItem("bsu_portal_dashboard_cache");
        if (cached) applyPortalStats(JSON.parse(cached), false);
    } catch (_) {}

    // Ambil data live dari Portal Publik (JSON endpoint ?format=json)
    fetch(`${PORTAL_PUBLIK_EXEC_URL}?format=json`, { method: "GET", mode: "cors" })
        .then(res => {
            const ct = res.headers.get("content-type") || "";
            if (!res.ok || !ct.includes("application/json")) {
                throw new Error("Endpoint belum mengembalikan JSON");
            }
            return res.json();
        })
        .then(data => {
            if (data && (data.totalKg !== undefined || data.depositCount !== undefined)) {
                applyPortalStats(data, true);
                try {
                    localStorage.setItem("bsu_portal_dashboard_cache", JSON.stringify(data));
                } catch (_) {}
            }
        })
        .catch(() => {
            // Fallback diam ke data Portal Publik terbaru yang tertampil di HTML
        });
}

// ==========================================
// 6. EFEK SCROLL & KLIK SEDERHANA
// ==========================================
function initScrollAndClickEffects() {
    // 1) Scroll Reveal (Fade-Up saat elemen masuk layar)
    const revealTargets = document.querySelectorAll(
        ".service-card, .news-card, .org-card, .testimonial-card, .step-card, .profile-card, .stats-box, .eco-about-photo-frame, .banner-box-style"
    );

    if ("IntersectionObserver" in window && revealTargets.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("eco-revealed");
                    setTimeout(() => {
                        entry.target.style.transitionDelay = "0ms";
                    }, 650);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

        revealTargets.forEach((el, idx) => {
            el.classList.add("eco-reveal");
            el.style.transitionDelay = `${(idx % 4) * 60}ms`;
            observer.observe(el);
        });
    }

    // 2) Navbar Shadow saat Scroll + Tombol Kembali ke Atas (Back to Top)
    const navbar = document.querySelector(".navbar-dark-custom");
    let backToTopBtn = document.getElementById("ecoBackToTop");
    if (!backToTopBtn) {
        backToTopBtn = document.createElement("button");
        backToTopBtn.id = "ecoBackToTop";
        backToTopBtn.type = "button";
        backToTopBtn.className = "eco-back-to-top";
        backToTopBtn.setAttribute("aria-label", "Kembali ke atas");
        backToTopBtn.title = "Kembali ke atas";
        backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);

        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function handleScrollState() {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (navbar) navbar.classList.toggle("navbar-scrolled", y >= 20);
        if (backToTopBtn) backToTopBtn.classList.toggle("show", y > 300);
    }
    window.addEventListener("scroll", handleScrollState, { passive: true });
    handleScrollState();

    // 3) Smooth Scroll untuk tautan anchor internal (#section)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (!href || href === "#" || this.hasAttribute("data-bs-toggle")) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // 4) Efek Klik Ripple sederhana pada tombol utama
    const clickButtons = document.querySelectorAll(
        ".btn-green, .btn-auth-nav, .btn-hero-eco, .btn-hero-outline, .btn-outline-success, .btn-whatsapp"
    );
    clickButtons.forEach(btn => {
        btn.classList.add("eco-ripple-host");
        btn.addEventListener("click", function (e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement("span");
            ripple.className = "eco-ripple-wave";
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 520);
        });
    });
}

// ==========================================
// 6. INISIALISASI SAAT DOM SIAP
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
    initGlobalSearch();
    initProfileDashboard();
    initGeneralFormFeedback();
    initPortalDashboardSync();
    initScrollAndClickEffects();
});