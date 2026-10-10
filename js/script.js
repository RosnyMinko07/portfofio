/* ==================== TYPING ANIMATION ==================== */
var typed = new Typed(".typing", {
    strings: ["", "", "Developpeur Full-Stack", "Developpeur mobile"],
    typeSpeed: 100,
    BackSpeed: 60,
    loop: true
});

/* ==================== NAVIGATION & DÉFILEMENT EN CASCADE ==================== */
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".site-header .nav li a, .nav li a");
    const navMenu = document.querySelector(".nav-menu");
    const navTogglerBtn = document.querySelector(".nav-toggler");
    const sections = document.querySelectorAll(".section");

    // Défilement fluide au clic sur un lien de navigation
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }

                // Fermer le menu mobile si ouvert
                if (navMenu && navMenu.classList.contains("open")) {
                    navMenu.classList.remove("open");
                }
                if (navTogglerBtn && navTogglerBtn.classList.contains("open")) {
                    navTogglerBtn.classList.remove("open");
                }
            }
        });
    });

    // Bouton "Engagez moi" (hire-me) -> défilement fluide vers contact
    const hireMeBtn = document.querySelector(".hire-me");
    if (hireMeBtn) {
        hireMeBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Toggle menu mobile (burger)
    if (navTogglerBtn && navMenu) {
        navTogglerBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            navTogglerBtn.classList.toggle("open");
            navMenu.classList.toggle("open");
        });
    }

    // Fermer le menu mobile au clic en dehors
    document.addEventListener("click", function(e) {
        if (navMenu && navMenu.classList.contains("open")) {
            if (!navMenu.contains(e.target) && navTogglerBtn && !navTogglerBtn.contains(e.target)) {
                navMenu.classList.remove("open");
                navTogglerBtn.classList.remove("open");
            }
        }
    });

    // ScrollSpy : mise à jour du lien actif au défilement en cascade
    if ("IntersectionObserver" in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.2,
            rootMargin: "-75px 0px -40% 0px"
        };

        const navObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach(function(link) {
                        const href = link.getAttribute("href");
                        if (href === "#" + id) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(function(sec) {
            navObserver.observe(sec);
        });
    }
});
