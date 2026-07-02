/* ==========================================================
   Wedding Admin Dashboard
   admin.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const title = document.querySelector(".title");

    const menuItems = document.querySelectorAll(".menu li");
    const pages = document.querySelectorAll(".page");

    const quickCards = document.querySelectorAll(".quick-card");

    /* ==========================================
       Sidebar Mobile
    ========================================== */

    menuBtn.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            sidebar.classList.toggle("show");

        } else {

            sidebar.classList.toggle("collapsed");

        }

    });

    /* ==========================================
       Menu Navigation
    ========================================== */

    function openPage(pageName) {

        pages.forEach(page => {

            page.classList.remove("active");

        });

        const target = document.getElementById(pageName + "Page");

        if (target) {

            target.classList.add("active");

            target.classList.add("fade-in");

        }

        menuItems.forEach(item => {

            item.classList.remove("active");

            if (item.dataset.page === pageName) {

                item.classList.add("active");

            }

        });

        title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);

        if (window.innerWidth <= 768) {

            sidebar.classList.remove("show");

        }

    }

    menuItems.forEach(item => {

        item.addEventListener("click", function () {

            const page = this.dataset.page;

            if (!page) return;

            openPage(page);

        });

    });

    quickCards.forEach(card => {

        card.addEventListener("click", function () {

            const page = this.dataset.page;

            if (!page) return;

            openPage(page);

        });

    });

    /* ==========================================
       Counter Animation
    ========================================== */

    function animateCounter(id, target) {

        const el = document.getElementById(id);

        if (!el) return;

        let count = 0;

        const speed = Math.max(1, Math.ceil(target / 60));

        const timer = setInterval(() => {

            count += speed;

            if (count >= target) {

                count = target;

                clearInterval(timer);

            }

            el.innerText = count;

        }, 20);

    }

    animateCounter("totalGuest", 0);
    animateCounter("totalPresent", 0);
    animateCounter("totalAbsent", 0);
    animateCounter("totalRSVP", 0);

    /* ==========================================
       Loading Screen
    ========================================== */

    const loading = document.querySelector(".loading");

    if (loading) {

        window.addEventListener("load", () => {

            setTimeout(() => {

                loading.classList.add("hide");

            }, 500);

        });

    }

    /* ==========================================
       Toast Notification
    ========================================== */

    window.showToast = function (titleText, message) {

        let toast = document.querySelector(".toast");

        if (!toast) {

            toast = document.createElement("div");

            toast.className = "toast";

            toast.innerHTML = `

                <h4></h4>

                <p></p>

            `;

            document.body.appendChild(toast);

        }

        toast.querySelector("h4").innerText = titleText;
        toast.querySelector("p").innerText = message;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    };

    /* ==========================================
       Dark Mode
    ========================================== */

    const darkMode = localStorage.getItem("darkmode");

    if (darkMode === "on") {

        document.body.classList.add("dark");

    }

    window.toggleDarkMode = function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("darkmode", "on");

            showToast("Dark Mode", "Mode gelap diaktifkan");

        } else {

            localStorage.setItem("darkmode", "off");

            showToast("Light Mode", "Mode terang diaktifkan");

        }

    };

    /* ==========================================
       Ripple Effect
    ========================================== */

    document.querySelectorAll(".btn,.quick-card,.card").forEach(item => {

        item.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            ripple.className = "ripple";

            ripple.style.left = e.offsetX + "px";

            ripple.style.top = e.offsetY + "px";

            this.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });

});
