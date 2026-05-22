/* ============================================================
   RODRIGUES JR. ADVOGADOS — site.js v4
   Tema / Acessibilidade / Popup / Scroll / Ripple / Interações
   ============================================================ */

(function () {
    'use strict';

    /* ── 1. TEMA (dark / light / hc) ───────────────────────── */
    var THEME_KEY = 'rj_theme';
    var FONT_KEY  = 'rj_font';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        /* Marca botão ativo no popup */
        document.querySelectorAll('[data-action^="theme-"]').forEach(function (b) {
            b.classList.remove('active');
        });
        var activeBtn = document.querySelector('[data-action="theme-' + theme + '"]');
        if (activeBtn) activeBtn.classList.add('active');
    }

    function initTheme() {
        var saved = localStorage.getItem(THEME_KEY);
        applyTheme(saved || getSystemTheme());

        /* Ouve mudanças do SO enquanto não há preferência salva */
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    /* ── 2. TAMANHO DE FONTE ─────────────────────────────────── */
    function applyFont(size) {
        document.documentElement.setAttribute('data-font', size);
        localStorage.setItem(FONT_KEY, size);

        document.querySelectorAll('[data-action^="font-"]').forEach(function (b) {
            b.classList.remove('active');
        });
        var activeBtn = document.querySelector('[data-action="font-' + size + '"]');
        if (activeBtn) activeBtn.classList.add('active');

        /* Recalcula AOS para evitar quebras de animação após redimensionamento */
        if (typeof AOS !== 'undefined') {
            setTimeout(function () { AOS.refresh(); }, 50);
        }
    }

    function initFont() {
        var saved = localStorage.getItem(FONT_KEY) || 'md';
        applyFont(saved);
    }

    /* ── 3. POPUP DE ACESSIBILIDADE ──────────────────────────── */
    function initA11yPopup() {
        var trigger  = document.getElementById('a11yTrigger');
        var modal    = document.getElementById('a11yModal');
        var backdrop = document.getElementById('a11yBackdrop');
        var closeBtn = document.getElementById('a11yClose');
        if (!trigger || !modal || !backdrop) return;

        function openPopup() {
            modal.classList.add('open');
            backdrop.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            backdrop.setAttribute('aria-hidden', 'false');
            trigger.setAttribute('aria-expanded', 'true');
            /* Foca no primeiro elemento focável */
            var first = modal.querySelector('button, [tabindex="0"]');
            if (first) setTimeout(function () { first.focus(); }, 50);
        }

        function closePopup() {
            modal.classList.remove('open');
            backdrop.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            backdrop.setAttribute('aria-hidden', 'true');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
        }

        trigger.addEventListener('click', function () {
            var isOpen = modal.classList.contains('open');
            isOpen ? closePopup() : openPopup();
        });

        backdrop.addEventListener('click', closePopup);

        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        /* Fechar com Escape */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closePopup();
            }
        });

        /* Ações dentro do modal */
        modal.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;
            var action = btn.dataset.action;

            if (action === 'theme-dark')  applyTheme('dark');
            if (action === 'theme-light') applyTheme('light');
            if (action === 'theme-hc')    applyTheme('hc');
            if (action === 'font-sm')     applyFont('sm');
            if (action === 'font-md')     applyFont('md');
            if (action === 'font-lg')     applyFont('lg');
            if (action === 'font-xl')     applyFont('xl');
        });
    }

    /* ── 4. SCROLL PROGRESS BAR ──────────────────────────────── */
    function initScrollProgress() {
        var bar = document.getElementById('scrollProgress');
        if (!bar) return;

        function update() {
            var scrollTop    = window.scrollY || window.pageYOffset;
            var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
            var pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width  = Math.min(pct, 100) + '%';
        }

        window.addEventListener('scroll', update, { passive: true });
        update(); /* estado inicial */
    }

    /* ── 5. LOGO scroll effect ──────────────────────────────── */
    function initHeader() {
        var logo = document.querySelector('.logo-fixed');
        if (!logo) return;
        window.addEventListener('scroll', function () {
            logo.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ── 6. MENU MOBILE (drawer lateral) ────────────────────── */
    function initMobileMenu() {
        var toggle   = document.getElementById('menuToggle');
        var nav      = document.getElementById('mainNav');
        var backdrop = document.getElementById('navBackdrop');
        if (!toggle || !nav) return;

        function openNav() {
            nav.classList.add('open');
            toggle.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            if (backdrop) {
                backdrop.classList.add('open');
                backdrop.setAttribute('aria-hidden', 'false');
            }
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            nav.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            if (backdrop) {
                backdrop.classList.remove('open');
                backdrop.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            nav.classList.contains('open') ? closeNav() : openNav();
        });
        if (backdrop) backdrop.addEventListener('click', closeNav);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });
    }

    /* ── 7. NAV ACTIVE via IntersectionObserver ──────────────── */
    function initNavActive() {
        var navLinks = document.querySelectorAll('#mainNav a[href^="#"]');
        if (!navLinks.length || !window.IntersectionObserver) return;

        var sections = [];
        navLinks.forEach(function (link) {
            var id  = link.getAttribute('href').replace('#', '');
            var sec = document.getElementById(id);
            if (sec) sections.push(sec);
        });
        if (!sections.length) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sections.forEach(function (s) { obs.observe(s); });
    }

    /* ── 8. RIPPLE EM BOTÕES ─────────────────────────────────── */
    function initRipple() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.btn');
            if (!btn) return;

            /* Remove ripples anteriores */
            btn.querySelectorAll('.ripple-circle').forEach(function (r) { r.remove(); });

            var rect   = btn.getBoundingClientRect();
            var size   = Math.max(rect.width, rect.height) * 2;
            var x      = e.clientX - rect.left - size / 2;
            var y      = e.clientY - rect.top  - size / 2;

            var ripple = document.createElement('span');
            ripple.className = 'ripple-circle';
            ripple.style.cssText = [
                'position:absolute',
                'border-radius:50%',
                'background:rgba(255,255,255,0.25)',
                'width:'  + size + 'px',
                'height:' + size + 'px',
                'left:'   + x    + 'px',
                'top:'    + y    + 'px',
                'pointer-events:none',
                'animation:ripple 0.55s ease-out forwards'
            ].join(';');

            btn.style.position = btn.style.position || 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 600);
        });
    }

    /* ── 9. CONTADOR ANIMADO ─────────────────────────────────── */
    function initCounters() {
        var counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length || !window.IntersectionObserver) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el     = entry.target;
                var target = parseInt(el.dataset.target, 10);
                var dur    = 1600;
                var startT = null;

                function step(ts) {
                    if (!startT) startT = ts;
                    var progress = Math.min((ts - startT) / dur, 1);
                    var eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { obs.observe(c); });
    }

    /* ── 10. FAQ ACCORDION ───────────────────────────────────── */
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

    /* ── 11. GTM / Meta Pixel — rastreamento CTAs ─────────────── */
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

    /* ── 12. SMOOTH SCROLL com offset header ─────────────────── */
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

    /* ── 13. AOS INIT ────────────────────────────────────────── */
    function initAOS() {
        if (typeof AOS === 'undefined') return;
        AOS.init({
            duration: 750,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            delay: 0
        });
    }

    /* ── BOOT ────────────────────────────────────────────────── */
    /* Tema e fonte aplicados antes do DOMContentLoaded para evitar flash */
    initTheme();
    initFont();

    document.addEventListener('DOMContentLoaded', function () {
        initA11yPopup();
        initScrollProgress();
        initHeader();
        initMobileMenu();
        initNavActive();
        initRipple();
        initCounters();
        initFaq();
        initTracking();
        initSmoothScroll();
        initAOS();
    });

})();
