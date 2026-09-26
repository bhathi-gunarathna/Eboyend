document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

    const dom = {
        header:           $('#header'),
        hamburgerBtn:     $('#hamburgerBtn'),
        mobileNav:        $('#mobileNav'),
        mobileNavOverlay: $('#mobileNavOverlay'),
        mobileNavClose:   $('#mobileNavClose'),
        heroSection:      $('#hero'),
        heroSlides:       $$('.hero__slide'),
        heroIndicators:   $$('.hero__indicator'),
        introSection:     $('#intro'),
        favoritesSection: $('#favorites'),
        favoritesGrid:    $('#favoritesGrid'),
        movieSearch:      $('#movieSearch'),
        searchResults:    $('#searchResults'),
        searchSpinner:    $('#searchSpinner'),
        contactSection:   $('#contact'),
        contactForm:      $('#contactForm'),
        submitBtn:        $('#submitBtn'),
        formMessage:      $('#formMessage'),
        footer:           $('#footer'),
        navLinks:         $$('.header__nav-link'),
        mobileNavLinks:   $$('.mobile-nav__link'),
    };

    // GSAP ANIMATIONS

    const initAnimations = () => {
        if (typeof gsap === 'undefined') return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) gsap.defaults({ duration: 0.01, ease: 'none' });

        // --- Header: fade in on page load ---
        gsap.from(dom.header, {
            y: -80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });


        if (dom.heroSlides.length > 0) {
            gsap.to('.hero__slideshow', {
                scale: 1.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: dom.heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }


        const introElements = $$('.gsap-fade-up', dom.introSection);
        if (introElements.length > 0) {
            gsap.to(introElements, {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: dom.introSection,
                    start: 'top 80%',
                }
            });
        }


        const favHeader = $('.gsap-fade-up', dom.favoritesSection);
        if (favHeader) {
            gsap.to(favHeader, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: dom.favoritesSection,
                    start: 'top 80%',
                }
            });
        }


        const staticCards = $$('.movie-card', dom.favoritesGrid);
        if (staticCards.length > 0) {
            gsap.from(staticCards, {
                y: 60,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'all',
                scrollTrigger: {
                    trigger: dom.favoritesGrid,
                    start: 'top 85%',
                }
            });
        }


        const contactHeader = $('.gsap-fade-up', dom.contactSection);
        if (contactHeader) {
            gsap.to(contactHeader, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: dom.contactSection,
                    start: 'top 80%',
                }
            });
        }


        const formWrapper = $('.gsap-fade-right', dom.contactSection);
        if (formWrapper) {
            gsap.to(formWrapper, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: dom.contactSection,
                    start: 'top 75%',
                }
            });
        }


        const mapWrapper = $('.gsap-fade-left', dom.contactSection);
        if (mapWrapper) {
            gsap.to(mapWrapper, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: dom.contactSection,
                    start: 'top 75%',
                }
            });
        }


        gsap.from(dom.footer, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: dom.footer,
                start: 'top 95%',
            }
        });
    };


    const openMobileNav = () => {
        dom.mobileNav.classList.add('is-open');
        dom.mobileNav.setAttribute('aria-hidden', 'false');
        dom.hamburgerBtn.classList.add('is-active');
        dom.hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (dom.mobileNavOverlay) gsap.fromTo(dom.mobileNavOverlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
            gsap.fromTo(dom.mobileNav, { x: 32, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
            gsap.fromTo(dom.mobileNavLinks, { x: 18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.32, stagger: 0.055, delay: 0.08, ease: 'power2.out' });
        }
    };

    const closeMobileNav = () => {
        dom.mobileNav.classList.remove('is-open');
        dom.mobileNav.setAttribute('aria-hidden', 'true');
        dom.hamburgerBtn.classList.remove('is-active');
        dom.hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.to(dom.mobileNav, { x: 24, autoAlpha: 0, duration: 0.22, ease: 'power2.in' });
            if (dom.mobileNavOverlay) gsap.to(dom.mobileNavOverlay, { autoAlpha: 0, duration: 0.2 });
        }
    };

    if (dom.hamburgerBtn) {
        dom.hamburgerBtn.addEventListener('click', () => {
            const isOpen = dom.mobileNav.classList.contains('is-open');
            isOpen ? closeMobileNav() : openMobileNav();
        });
    }

    if (dom.mobileNavOverlay) {
        dom.mobileNavOverlay.addEventListener('click', closeMobileNav);
    }

    if (dom.mobileNavClose) {
        dom.mobileNavClose.addEventListener('click', closeMobileNav);
    }

    // Close on link click
    dom.mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });


    const initSlideshow = () => {
        if (dom.heroSlides.length <= 1) return;

        let currentSlide = 0;
        let slideshowInterval;

        const goToSlide = (index) => {
            const previousSlide = dom.heroSlides[currentSlide];
            previousSlide.classList.remove('active');
            dom.heroIndicators[currentSlide]?.classList.remove('active');

            currentSlide = index;

            const nextSlide = dom.heroSlides[currentSlide];
            nextSlide.classList.add('active');
            dom.heroIndicators[currentSlide]?.classList.add('active');
            if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.fromTo(nextSlide, { autoAlpha: 0, scale: 1.045 }, { autoAlpha: 1, scale: 1, duration: 1.15, ease: 'power2.out', overwrite: true });
                gsap.to(previousSlide, { autoAlpha: 0, duration: 0.65, ease: 'power1.out', overwrite: true });
            }
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % dom.heroSlides.length;
            goToSlide(next);
        };

        const startSlideshow = () => {
            slideshowInterval = setInterval(nextSlide, 5000);
        };

        const stopSlideshow = () => {
            clearInterval(slideshowInterval);
        };

        // Indicator clicks
        dom.heroIndicators.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                stopSlideshow();
                goToSlide(idx);
                startSlideshow();
            });
        });

        // Pause on hover
        if (dom.heroSection) {
            dom.heroSection.addEventListener('mouseenter', stopSlideshow);
            dom.heroSection.addEventListener('mouseleave', startSlideshow);
        }

        startSlideshow();
    };


    let searchDebounce;

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const showSpinner = (show) => {
        if (dom.searchSpinner) {
            dom.searchSpinner.classList.toggle('active', show);
        }
    };

    const searchShows = async (query) => {
        if (!query || query.length < 2) {
            dom.searchResults.classList.remove('active');
            dom.searchResults.innerHTML = '';
            return;
        }

        showSpinner(true);

        try {
            const response = await fetch(
                `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
            );
            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            showSpinner(false);
            renderSearchResults(data);
        } catch (err) {
            showSpinner(false);
            console.error('Search error:', err);
            dom.searchResults.innerHTML =
                '<div class="search-results__message">Error fetching results. Please try again.</div>';
            dom.searchResults.classList.add('active');
        }
    };

    const renderSearchResults = (results) => {
        dom.searchResults.innerHTML = '';

        if (!results || results.length === 0) {
            dom.searchResults.innerHTML =
                '<div class="search-results__message">No results found.</div>';
            dom.searchResults.classList.add('active');
            return;
        }

    
        const items = results.slice(0, 10);

        items.forEach((item, idx) => {
            const show = item.show;
            const imgUrl = show.image?.medium || 'https://via.placeholder.com/40x56/1a1a1a/666?text=N/A';
            const rating = show.rating?.average || 'N/A';

            const el = document.createElement('div');
            el.className = 'search-results__item';
            el.setAttribute('role', 'option');
            el.innerHTML = `
                <img src="${imgUrl}" alt="${show.name}" width="40" height="56" loading="lazy">
                <div class="search-results__info">
                    <h4>${show.name}</h4>
                    <span>⭐ ${rating}</span>
                </div>
            `;

            el.addEventListener('click', () => {
                addToFavorites(show);
            });

            dom.searchResults.appendChild(el);

            // Stagger animation
            if (typeof gsap !== 'undefined') {
                gsap.from(el, { opacity: 0, y: 10, delay: idx * 0.04, duration: 0.3 });
            }
        });

        dom.searchResults.classList.add('active');
    };

    
    if (dom.movieSearch) {
        dom.movieSearch.addEventListener('input', (e) => {
            clearTimeout(searchDebounce);
            const q = e.target.value.trim();
            searchDebounce = setTimeout(() => searchShows(q), 500);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.favorites__search-wrapper')) {
                dom.searchResults.classList.remove('active');
            }
        });
    }

    
    let favorites = [];

    // Load from localStorage
    const loadFavorites = () => {
        try {
            const stored = localStorage.getItem('movieFavorites');
            favorites = stored ? JSON.parse(stored) : [];
        } catch {
            favorites = [];
        }
    };

    const saveFavorites = () => {
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    };

    const addToFavorites = (show) => {
        // Prevent duplicates
        if (favorites.some(f => f.id === show.id)) {
            // Flash the existing card
            const existing = dom.favoritesGrid.querySelector(`[data-id="${show.id}"]`);
            if (existing && typeof gsap !== 'undefined') {
                gsap.fromTo(existing, { borderColor: '#d4a843' },
                    { borderColor: 'transparent', duration: 1, border: '2px solid', ease: 'power2.out' });
            }
            return;
        }

        const desc = stripHtml(show.summary);
        const movie = {
            id: show.id,
            title: show.name,
            image: show.image?.medium || 'https://via.placeholder.com/300x420/1a1a1a/666?text=No+Image',
            description: desc.length > 120 ? desc.substring(0, 120) + '...' : desc || 'No description available.',
            rating: show.rating?.average || null
        };

        favorites.push(movie);
        saveFavorites();
        renderCard(movie, true);

        
        dom.movieSearch.value = '';
        dom.searchResults.classList.remove('active');
        dom.searchResults.innerHTML = '';
    };

    const renderCard = (movie, animate = false) => {
        const card = document.createElement('article');
        card.className = 'movie-card';
        card.dataset.id = movie.id;

        const ratingHtml = movie.rating
            ? `<div class="movie-card__rating">⭐ ${movie.rating}</div>`
            : '';

        card.innerHTML = `
            <div class="movie-card__image-wrapper">
                <img
                    src="${movie.image}"
                    alt="${movie.title}"
                    class="movie-card__image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/300x420/1a1a1a/666?text=No+Image'"
                >
                <button class="movie-card__remove" aria-label="Remove ${movie.title} from favourites" title="Remove">
                    &times;
                </button>
            </div>
            <div class="movie-card__info">
                <h3 class="movie-card__title">${movie.title}</h3>
                <p class="movie-card__desc">${movie.description}</p>
                ${ratingHtml}
            </div>
        `;

        
        card.querySelector('.movie-card__remove').addEventListener('click', () => {
            removeFromFavorites(movie.id, card);
        });

        dom.favoritesGrid.appendChild(card);
        bindCardInteraction(card);

        
        if (animate && typeof gsap !== 'undefined') {
            gsap.from(card, {
                scale: 0.8,
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: 'back.out(1.7)'
            });
        }
    };

    const removeFromFavorites = (id, cardEl) => {
        favorites = favorites.filter(f => f.id !== id);
        saveFavorites();

        if (typeof gsap !== 'undefined') {
            gsap.to(cardEl, {
                scale: 0.8,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    cardEl.remove();
                    ScrollTrigger.refresh();
                }
            });
        } else {
            cardEl.remove();
        }
    };


    const renderPersistedFavorites = () => {
        loadFavorites();
        favorites.forEach(movie => renderCard(movie, false));
    };

    const initStaticCardRemoveButtons = () => {
        const staticCards = $$('.movie-card[data-static="true"]', dom.favoritesGrid);
        staticCards.forEach(card => {
            const removeBtn = card.querySelector('.movie-card__remove');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            scale: 0.8,
                            opacity: 0,
                            duration: 0.4,
                            ease: 'power2.in',
                            onComplete: () => card.remove()
                        });
                    } else {
                        card.remove();
                    }
                });
            }
        });
    };

    // FORM VALIDATION

    const validators = {
        required: (value) => value.trim().length > 0,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => !value || /^[\+]?[\d\s\-\(\)]{7,20}$/.test(value),
    };

    const showFieldError = (fieldId, message) => {
        const field = $(`#${fieldId}`);
        const errorEl = $(`#${fieldId}Error`);
        if (field) field.classList.add('is-invalid');
        if (errorEl) errorEl.textContent = message;

        // GSAP shake animation
        if (field && typeof gsap !== 'undefined') {
            gsap.fromTo(field,
                { x: 0 },
                { x: [-8, 8, -6, 6, -3, 3, 0], duration: 0.5, ease: 'power2.out' }
            );
        }
    };

    const clearFieldError = (fieldId) => {
        const field = $(`#${fieldId}`);
        const errorEl = $(`#${fieldId}Error`);
        if (field) field.classList.remove('is-invalid');
        if (errorEl) errorEl.textContent = '';
    };

    const showFormMessage = (type, message) => {
        if (!dom.formMessage) return;
        dom.formMessage.className = 'contact-form__message is-visible';
        dom.formMessage.classList.add(type === 'success' ? 'is-success' : 'is-error');
        dom.formMessage.textContent = message;

        if (typeof gsap !== 'undefined') {
            gsap.from(dom.formMessage, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' });
        }
    };

    if (dom.contactForm) {
        ['firstName', 'lastName', 'email', 'phone', 'comments'].forEach(id => {
            const field = $(`#${id}`);
            if (field) {
                field.addEventListener('input', () => clearFieldError(id));
            }
        });

        const termsCheckbox = $('#agreeTerms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => clearFieldError('agreeTerms'));
        }
    }

    // Form submission
    if (dom.contactForm) {
        dom.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;

            // Reset message
            dom.formMessage.className = 'contact-form__message';
            dom.formMessage.textContent = '';

            // First Name
            const firstName = $('#firstName').value;
            if (!validators.required(firstName)) {
                showFieldError('firstName', 'First name is required');
                isValid = false;
            }

            // Last Name
            const lastName = $('#lastName').value;
            if (!validators.required(lastName)) {
                showFieldError('lastName', 'Last name is required');
                isValid = false;
            }

            // Email
            const email = $('#email').value;
            if (!validators.required(email)) {
                showFieldError('email', 'Email is required');
                isValid = false;
            } else if (!validators.email(email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Phone validation
            const phone = $('#phone').value;
            if (phone && !validators.phone(phone)) {
                showFieldError('phone', 'Please enter a valid phone number');
                isValid = false;
            }

            // Comments
            const comments = $('#comments').value;
            if (!validators.required(comments)) {
                showFieldError('comments', 'Message is required');
                isValid = false;
            }

            // Terms checkbox
            const agreeTerms = $('#agreeTerms').checked;
            if (!agreeTerms) {
                showFieldError('agreeTerms', 'You must agree to the Terms & Conditions');
                isValid = false;
            }

            if (!isValid) return;

            // Submit form
            dom.submitBtn.classList.add('is-loading');
            dom.submitBtn.disabled = true;

            const formData = {
                firstName,
                lastName,
                email,
                phone,
                comments,
                agreeTerms
            };

            try {
                const response = await fetch('api/submit.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    showFormMessage('success', result.message || 'Thank you! Your message has been sent successfully.');
                    dom.contactForm.reset();

                    if (typeof gsap !== 'undefined') {
                        gsap.from(dom.formMessage, {
                            scale: 0.8,
                            duration: 0.5,
                            ease: 'back.out(1.7)'
                        });
                    }
                } else {
                    const errorMsg = result.errors
                        ? Object.values(result.errors).join('. ')
                        : 'Something went wrong. Please try again.';
                    showFormMessage('error', errorMsg);
                }
            } catch (err) {
                console.warn('API not available, simulating success:', err);
                showFormMessage('success', 'Thank you! Your message has been received. (Demo mode)');
                dom.contactForm.reset();
            } finally {
                dom.submitBtn.classList.remove('is-loading');
                dom.submitBtn.disabled = false;
            }
        });
    }

   
    const allNavLinks = [...dom.navLinks, ...dom.mobileNavLinks];

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = $(href);
                if (target) {
                    const headerOffset = dom.header ? dom.header.offsetHeight : 0;
                    const targetPos = target.offsetTop - headerOffset;
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                }
            }
        });
    });

    // scroll
    const sections = $$('section[id]');
    const updateActiveNav = () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop - 80;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < bottom) {
                dom.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    
    window.toggleRTL = () => {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        document.documentElement.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => ScrollTrigger.refresh(), 200);
        }
    };

  
    // Progressive bar.
    const bindCardInteraction = (card) => {
        if (!card || card.dataset.gsapBound === 'true') return;
        card.dataset.gsapBound = 'true';
        if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const image = card.querySelector('.movie-card__image');
        const remove = card.querySelector('.movie-card__remove');
        const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power3.out' });
        const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power3.out' });
        card.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch') return;
            const rect = card.getBoundingClientRect();
            rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 10);
            rotateX((0.5 - (event.clientY - rect.top) / rect.height) * 8);
        });
        card.addEventListener('pointerenter', () => {
            gsap.to(card, { y: -7, scale: 1.015, duration: 0.28, ease: 'power2.out' });
            if (image) gsap.to(image, { scale: 1.07, duration: 0.55, ease: 'power2.out' });
            if (remove) gsap.fromTo(remove, { scale: 0.86 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
        });
        card.addEventListener('pointerleave', () => {
            rotateY(0); rotateX(0);
            gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out' });
            if (image) gsap.to(image, { scale: 1, duration: 0.45, ease: 'power2.out' });
        });
    };

    const initMicroInteractions = () => {
        if (typeof gsap === 'undefined') return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        $$('.movie-card', dom.favoritesGrid).forEach(bindCardInteraction);
        if (dom.movieSearch) {
            dom.movieSearch.addEventListener('focus', () => {
                if (!reduceMotion) gsap.to(dom.movieSearch, { scale: 1.015, duration: 0.22, boxShadow: '0 0 0 3px rgba(212,168,67,.18)', ease: 'power2.out' });
            });
            dom.movieSearch.addEventListener('blur', () => gsap.to(dom.movieSearch, { scale: 1, duration: 0.22, clearProps: 'boxShadow' }));
        }
        if (!reduceMotion) {
            $$('.header__nav-link, .mobile-nav__link, button, .footer__social-link').forEach((el) => {
                if (el.matches('.movie-card__remove, #hamburgerBtn, #mobileNavClose')) return;
                el.addEventListener('pointerenter', () => gsap.to(el, { y: -2, duration: 0.18, ease: 'power2.out' }));
                el.addEventListener('pointerleave', () => gsap.to(el, { y: 0, duration: 0.22, ease: 'power2.out' }));
            });
        }
        if (!$('#scrollProgress')) {
            const progress = document.createElement('div');
            progress.id = 'scrollProgress';
            Object.assign(progress.style, { position: 'fixed', inset: '0 auto auto 0', height: '3px', width: '100%', transform: 'scaleX(0)', transformOrigin: 'left center', background: '#d4a843', zIndex: '9999', pointerEvents: 'none' });
            document.body.appendChild(progress);
            if (typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
                gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.2 } });
            }
        }
    };

   
    initAnimations();
    initSlideshow();
    initStaticCardRemoveButtons();
    renderPersistedFavorites();
    initMicroInteractions();
});
