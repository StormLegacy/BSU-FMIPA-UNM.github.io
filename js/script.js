document.addEventListener("DOMContentLoaded", function() {
    // 1. Efek Navbar Berubah Warna / Blur saat Halaman Di-scroll
    const header = document.querySelector(".header");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 2. Interaktif Slider Dots pada Banner/Hero
    const dots = document.querySelectorAll(".slider-dots .dot");
    dots.forEach((dot, index) => {
        dot.addEventListener("click", function() {
            dots.forEach(d => d.classList.remove("active"));
            this.classList.add("active");
            console.log(`Slide hero ke-${index + 1} aktif.`);
        });
    });

    // 3. Validasi & Feedback Interaktif Form Kontak
    const sendButton = document.querySelector(".contact_section .send_bt a");
    if (sendButton) {
        sendButton.addEventListener("click", function(e) {
            e.preventDefault();
            const nameInput = document.querySelector("input[name='Your Name']");
            const emailInput = document.querySelector("input[name='Email']");
            
            if (nameInput && nameInput.value.trim() === "") {
                alert("Mohon masukkan nama Anda terlebih dahulu.");
                nameInput.focus();
                return;
            }
            if (emailInput && emailInput.value.trim() === "") {
                alert("Mohon masukkan alamat email Anda.");
                emailInput.focus();
                return;
            }
            
            alert("Terima kasih! Pesan atau permintaan panggilan balik Anda telah terkirim.");
        });
    }

    // 4. Efek klik tombol Newsletter Subscribe
    const subscribeBtn = document.querySelector(".subscribe_bt a");
    if (subscribeBtn) {
        subscribeBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const emailField = document.querySelector(".update_mail");
            if (emailField && emailField.value.trim() !== "") {
                alert("Terima kasih telah berlangganan newsletter kami!");
                emailField.value = "";
            } else {
                alert("Silakan masukkan email yang valid untuk berlangganan.");
            }
        });
    }
});