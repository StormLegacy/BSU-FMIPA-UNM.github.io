// jquery.js - Efek Interaktif dan Animasi Tambahan dengan jQuery

$(document).ready(function () {
    // 1. Efek Fade-In bertahap pada halaman saat pertama kali dimuat
    $("body").hide().fadeIn(400);

    // 2. Efek Smooth Scroll (Guliran Halus) saat mengklik tautan internal
    $("a.nav-link, footer a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 600, function(){
                window.location.hash = hash;
            });
        }
    });

    // 3. Efek Interaktif Hover pada Kartu Layanan (Service Cards)
    $(".service-card").hover(
        function() {
            $(this).stop().animate({
                marginTop: "-8px"
            }, 200);
            $(this).css("box-shadow", "0 12px 25px rgba(40, 167, 69, 0.2)");
        },
        function() {
            $(this).stop().animate({
                marginTop: "0px"
            }, 200);
            $(this).css("box-shadow", "0 6px 15px rgba(0, 0, 0, 0.06)");
        }
    );

    // 4. Efek Klik Interaktif pada Tombol (Efek Sedikit Mengecil Saat Ditekan)
    $(".btn").on("mousedown", function() {
        $(this).css("transform", "scale(0.96)");
    }).on("mouseup mouseleave", function() {
        $(this).css("transform", "scale(1)");
    });
});