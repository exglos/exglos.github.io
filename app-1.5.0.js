'use strict';

(function () {
    window.addEventListener('load', function () {
        preserveQueryParams();
        setupMobileMenu();
    });

    function preserveQueryParams() {
        var query = window.location.search;
        if (!query) {
            return;
        }

        document.querySelectorAll('a[data-preserve-query]').forEach(function (link) {
            if (link.getAttribute('href') && link.getAttribute('href').indexOf('#') === 0) {
                return;
            }

            try {
                var url = new URL(link.href, window.location.href);
                if (!url.search) {
                    url.search = query.slice(1);
                    link.href = url.toString();
                }
            } catch (error) {
                // Ignore malformed URLs and leave the original link untouched.
            }
        });
    }

    function setupMobileMenu() {
        var toggle = document.getElementById('menuToggle');
        var menu = document.getElementById('mobileMenu');

        if (!toggle || !menu) {
            return;
        }

        function setOpen(isOpen) {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            menu.classList.toggle('is-open', isOpen);
        }

        toggle.addEventListener('click', function () {
            var isOpen = toggle.getAttribute('aria-expanded') === 'true';
            setOpen(!isOpen);
        });

        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                setOpen(false);
            }
        });

        document.addEventListener('click', function (event) {
            if (!menu.classList.contains('is-open')) {
                return;
            }

            if (menu.contains(event.target) || toggle.contains(event.target)) {
                return;
            }

            setOpen(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 760) {
                setOpen(false);
            }
        });
    }

})();
