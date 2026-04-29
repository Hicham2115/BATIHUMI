/**
 * BATIHUMI - Main JavaScript
 * Professional Humidity Treatment Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initUrgenceBar();
    initNavigation();
    initHeaderScroll();
    initSmoothScroll();
    initInfiniteCarousel();
    initModal();
    initForms();
    initFaqAccordion();
    initAnimations();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle menu on button click
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Toggle hamburger animation
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    function handleScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * S9 — Navigable testimonials carousel with arrows, dots, swipe, and autoplay
 */
function initInfiniteCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('avis-prev');
    const nextBtn = document.getElementById('avis-next');
    const dotsContainer = document.getElementById('avis-dots');

    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.temoignage-card'));
    if (!cards.length) return;

    let current = 0;
    let autoplayTimer = null;

    function visibleCount() {
        return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    }

    function totalSlides() {
        return Math.max(1, cards.length - visibleCount() + 1);
    }

    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides(); i++) {
            const dot = document.createElement('button');
            dot.className = 'avis-dot' + (i === current ? ' active' : '');
            dot.setAttribute('aria-label', `Avis ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.avis-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = Math.max(0, Math.min(index, totalSlides() - 1));
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight || 0);
        track.style.transform = `translateX(-${current * cardWidth}px)`;
        updateDots();
    }

    function next() { goTo(current === totalSlides() - 1 ? 0 : current + 1); }
    function prev() { goTo(current === 0 ? totalSlides() - 1 : current - 1); }

    function startAutoplay() {
        autoplayTimer = setInterval(next, 4000);
    }
    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(); });

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { stopAutoplay(); diff > 0 ? next() : prev(); startAutoplay(); }
    }, { passive: true });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    // Re-init on resize
    window.addEventListener('resize', () => {
        buildDots();
        goTo(Math.min(current, totalSlides() - 1));
    }, { passive: true });

    // Init
    track.style.transition = 'transform 0.4s ease';
    track.style.animation = 'none';
    buildDots();
    goTo(0);
    startAutoplay();
}

/**
 * Modal Functionality
 */
function initModal() {
    const modal = document.getElementById('diagnostic-modal');
    const modalClose = document.getElementById('modal-close');
    const mobileBtn = document.getElementById('mobile-diagnostic-btn');
    
    if (!modal) return;
    
    // Open modal
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * French phone validation — accepts 06/07 mobile and 01-09 landlines
 */
function isValidFrenchPhone(value) {
    const digits = value.replace(/\D/g, '');
    return /^(0[1-9])(\d{8})$/.test(digits);
}

/**
 * Form Handling
 */
function initForms() {
    // Diagnostic micro-forms (hero + modal) — inline confirmation
    const diagForms = [
        {
            formId: 'diagnostic-form',
            phoneId: 'diag-phone',
            phoneErrorId: 'diag-phone-error',
            prenomId: 'diag-prenom',
            confirmationId: 'diag-confirmation',
            confirmationMsgId: 'diag-confirmation-msg',
        },
        {
            formId: 'modal-diagnostic-form',
            phoneId: 'modal-phone',
            phoneErrorId: 'modal-phone-error',
            prenomId: 'modal-prenom',
            confirmationId: 'modal-confirmation',
            confirmationMsgId: 'modal-confirmation-msg',
        },
    ];

    diagForms.forEach(({ formId, phoneId, phoneErrorId, prenomId, confirmationId, confirmationMsgId }) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const phoneInput = document.getElementById(phoneId);
        const phoneError = document.getElementById(phoneErrorId);

        // Real-time phone validation
        if (phoneInput && phoneError) {
            phoneInput.addEventListener('blur', () => {
                if (phoneInput.value && !isValidFrenchPhone(phoneInput.value)) {
                    phoneError.textContent = 'Numéro invalide — format attendu : 06 ou 07 XX XX XX XX';
                } else {
                    phoneError.textContent = '';
                }
            });
            phoneInput.addEventListener('input', () => {
                if (phoneError.textContent) phoneError.textContent = '';
            });
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Phone validation before submit
            if (phoneInput && !isValidFrenchPhone(phoneInput.value)) {
                phoneError.textContent = 'Numéro invalide — format attendu : 06 ou 07 XX XX XX XX';
                phoneInput.focus();
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi…';
            submitBtn.disabled = true;

            try {
                const data = new FormData(form);
                const response = await fetch(form.action, { method: 'POST', body: data });
                const result = await response.json();

                if (result.success) {
                    const prenom = document.getElementById(prenomId)?.value?.trim() || '';
                    const msg = prenom
                        ? `Merci ${prenom} ! Notre expert vous rappelle sous 2h pour organiser votre diagnostic gratuit en Île-de-France.`
                        : 'Merci ! Notre expert vous rappelle sous 2h pour organiser votre diagnostic gratuit en Île-de-France.';

                    form.style.display = 'none';
                    const confirmation = document.getElementById(confirmationId);
                    const confirmationMsg = document.getElementById(confirmationMsgId);
                    if (confirmation && confirmationMsg) {
                        confirmationMsg.textContent = msg;
                        confirmation.style.display = 'block';
                    }
                } else {
                    showNotification('Une erreur est survenue. Appelez-nous directement au 07 68 84 13 24.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch {
                showNotification('Une erreur est survenue. Appelez-nous directement au 07 68 84 13 24.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    });

    // Contact form — standard notification
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            try {
                const data = new FormData(contactForm);
                const response = await fetch(contactForm.action, { method: 'POST', body: data });
                const result = await response.json();

                if (result.success) {
                    showNotification('Votre demande a été envoyée ! Nous vous contacterons très bientôt.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('Une erreur est survenue. Veuillez réessayer ou nous appeler.', 'error');
                }
            } catch {
                showNotification('Une erreur est survenue. Veuillez réessayer ou nous appeler.', 'error');
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
}

/**
 * Show Notification
 */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Fermer">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: calc(100% - 40px);
    `;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: 0.5rem;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .realisation-card, .garantie-card, .coordonnee-card, .section-header'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index % 4 * 0.1}s, transform 0.6s ease ${index % 4 * 0.1}s`;
        observer.observe(el);
    });
    
    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Active Section Detection for Navigation
 */
function initActiveSectionDetection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// Initialize active section detection
document.addEventListener('DOMContentLoaded', initActiveSectionDetection);

/**
 * S11 — Urgence bar dismiss
 */
function initUrgenceBar() {
    const bar = document.getElementById('urgence-bar');
    const closeBtn = document.getElementById('urgence-bar-close');
    if (!bar || !closeBtn) return;

    // Remember dismiss across page session
    if (sessionStorage.getItem('urgence-dismissed')) {
        bar.style.display = 'none';
        return;
    }

    // Push navbar below the bar
    document.body.classList.add('has-urgence-bar');

    closeBtn.addEventListener('click', () => {
        bar.style.opacity = '0';
        bar.style.transform = 'translateY(-100%)';
        document.body.classList.remove('has-urgence-bar');
        setTimeout(() => { bar.style.display = 'none'; }, 300);
        sessionStorage.setItem('urgence-dismissed', '1');
    });
}

/**
 * S12 — FAQ accordion
 */
function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        // Set initial heights
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0';
        }

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                i.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked if it was closed
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/**
 * Phone number formatting
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 2 === 0) {
            formatted += ' ';
        }
        formatted += value[i];
    }
    
    input.value = formatted;
}

// Apply phone formatting to all phone inputs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});
