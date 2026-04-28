'use strict';

(function () {
    window.addEventListener('load', function () {
        setupThemeToggle();
        preserveQueryParams();
        setupMobileMenu();
    });

    function setupThemeToggle() {
        var root = document.documentElement;
        var toggle = document.getElementById('themeToggle');
        var metaThemeColor = document.getElementById('themeColorMeta');
        if (!toggle) {
            return;
        }

        function getStoredTheme() {
            try {
                return window.localStorage.getItem('exglos-theme');
            } catch (error) {
                return null;
            }
        }

        function setStoredTheme(theme) {
            try {
                window.localStorage.setItem('exglos-theme', theme);
            } catch (error) {
                // Ignore storage failures and keep the active theme for this session only.
            }
        }

        function resolveTheme() {
            var storedTheme = getStoredTheme();
            return storedTheme === 'dark' ? 'dark' : 'light';
        }

        function applyTheme(theme) {
            var nextTheme = theme === 'dark' ? 'dark' : 'light';
            var nextAria = nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

            root.setAttribute('data-theme', nextTheme);
            toggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
            toggle.setAttribute('aria-label', nextAria);

            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', nextTheme === 'dark' ? '#0b0f15' : '#f7f8fa');
            }
        }

        applyTheme(resolveTheme());

        toggle.addEventListener('click', function () {
            var currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setStoredTheme(nextTheme);
            applyTheme(nextTheme);
        });
    }

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
