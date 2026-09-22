document.addEventListener("DOMContentLoaded", function () {
    // Menambahkan efek interaktif saat kursor menyentuh kotak layanan (Card Hover Effect)
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-8px)";
            this.style.boxShadow = "0 12px 25px rgba(40, 167, 69, 0.2)";
            this.style.borderColor = "#218838";
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
            this.style.borderColor = "#28a745";
        });
    });
});