/* ============================================================
   RODRIGUES JR. ADVOGADOS — site.js v3
   Tema / Acessibilidade / AOS / Interações
   ============================================================ */

(function () {
    'use strict';

    /* ── 1. TEMA (dark/light/high-contrast) ──────────────── */
    var THEME_KEY = 'rj_theme';
    var FONT_KEY  = 'rj_font';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        var btn = document.querySelector('[data-action="theme"]');
        if (!btn) return;
        if (theme === 'dark')   btn.textContent = '☀';
        if (theme === 'light')  btn.textContent = '🌙';
        if (theme === 'high-contrast') btn.textContent = '◑';

        var hcBtn = document.querySelector('[data-action="contrast"]');
        if (hcBtn) hcBtn.classList.toggle('active', theme === 'high-contrast');
    }

    function initTheme() {
        var saved = localStorage.getItem(THEME_KEY);
        applyTheme(saved || getSystemTheme());

        /* Ouve mudanças do SO se não houver preferência salva */
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : (current === 'light' ? 'dark' : 'light'));
    }

    function toggleHighContrast() {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'high-contrast' ? (localStorage.getItem('rj_prev_theme') || getSystemTheme()) : 'high-contrast');
        if (current !== 'high-contrast') {
            localStorage.setItem('rj_prev_theme', current);
        }
    }

    /* ── 2. TAMANHO DE FONTE ─────────────────────────────── */
    var FONTS = ['sm', 'md', 'lg', 'xl'];

    function applyFont(size) {
        document.documentElement.setAttribute('data-font', size);
        localStorage.setItem(FONT_KEY, size);

        document.querySelectorAll('[data-action^="font"]').forEach(function (b) {
            b.classList.remove('active');
        });
        var active = document.querySelector('[data-action="font-' + size + '"]');
        if (active) active.classList.add('active');

        /* Recalcula AOS para evitar quebras de animação */
        if (typeof AOS !== 'undefined') {
            setTimeout(function () { AOS.refresh(); }, 50);
        }
    }

    function initFont() {
        var saved = localStorage.getItem(FONT_KEY) || 'md';
        applyFont(saved);
    }

    /* ── 3. TOOLBAR DE ACESSIBILIDADE ────────────────────── */
    function initA11yToolbar() {
        document.querySelectorAll('.a11y-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var action = btn.dataset.action;
                if (action === 'theme')    toggleTheme();
                if (action === 'contrast') toggleHighContrast();
                if (action === 'font-sm')  applyFont('sm');
                if (action === 'font-md')  applyFont('md');
                if (action === 'font-lg')  applyFont('lg');
                if (action === 'font-xl')  applyFont('xl');
            });
        });
    }

    /* ── 4. HEADER scroll shadow ────────────────────────── */
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ── 5. MENU MOBILE ──────────────────────────────────── */
    function initMobileMenu() {
        var toggle = document.getElementById('menuToggle');
        var nav    = document.getElementById('mainNav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ── 6. CONTADOR ANIMADO ─────────────────────────────── */
    function initCounters() {
        var counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length || !window.IntersectionObserver) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el     = entry.target;
                var target = parseInt(el.dataset.target, 10);
                var start  = 0;
                var dur    = 1600;
                var startT = null;

                function step(ts) {
                    if (!startT) startT = ts;
                    var progress = Math.min((ts - startT) / dur, 1);
                    /* Ease out cubic */
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { obs.observe(c); });
    }

    /* ── 7. FAQ ACCORDION ────────────────────────────────── */
    function initFaq() {
        document.querySelectorAll('.faq-question').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var answer = btn.nextElementSibling;
                var isOpen = btn.getAttribute('aria-expanded') === 'true';

                /* Fecha todos */
                document.querySelectorAll('.faq-question').forEach(function (b) {
                    b.setAttribute('aria-expanded', 'false');
                    var a = b.nextElementSibling;
                    if (a) a.classList.remove('open');
                });

                /* Abre este se estava fechado */
                if (!isOpen) {
                    btn.setAttribute('aria-expanded', 'true');
                    if (answer) answer.classList.add('open');
                }
            });
        });
    }

    /* ── 8. GTM / Meta Pixel — rastreamento CTAs ─────────── */
    function initTracking() {
        document.querySelectorAll('[data-gtm-event]').forEach(function (el) {
            el.addEventListener('click', function () {
                var label = el.dataset.gtmEvent;
                if (window.dataLayer) {
                    window.dataLayer.push({ event: 'cta_click', cta_label: label });
                }
                if (typeof gtag !== 'undefined' && window._gadsConvId) {
                    gtag('event', 'conversion', { send_to: window._gadsConvId });
                }
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', { content_name: label });
                }
            });
        });
    }

    /* ── 9. SMOOTH SCROLL com offset header ──────────────── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = a.getAttribute('href').replace('#', '');
                if (!id) return;
                var target = document.getElementById(id);
                if (!target) return;
                e.preventDefault();
                var hH = document.getElementById('header')
                    ? document.getElementById('header').offsetHeight : 0;
                var y = target.getBoundingClientRect().top + window.scrollY - hH - 16;
                window.scrollTo({ top: y, behavior: 'smooth' });
            });
        });
    }

    /* ── 10. AOS INIT ────────────────────────────────────── */
    function initAOS() {
        if (typeof AOS === 'undefined') return;
        AOS.init({
            duration: 680,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    /* ── BOOT ────────────────────────────────────────────── */
    /* Tema e fonte aplicados ANTES do DOM ready para evitar flash */
    initTheme();
    initFont();

    document.addEventListener('DOMContentLoaded', function () {
        initA11yToolbar();
        initHeader();
        initMobileMenu();
        initCounters();
        initFaq();
        initTracking();
        initSmoothScroll();
        initAOS();
    });

})();
