/* ==========================================================================
   KAA WORKS - NEXT-GEN INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Next-Gen Libraries
    const lenis = initLenisScroll();
    initGSAPAnimations(lenis);
    initLottieScroll();

    // Initialize Interactive Elements
    initThemeToggle();
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initStatsCounter();
    initPortfolioFilter();
    initProjectModal(lenis);
    initMagneticButtons();
    initContactForm();
});

/* ==========================================================================
   LENIS SMOOTH SCROLLING
   ========================================================================== */
function initLenisScroll() {
    const lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // cubic-bezier physics
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.05,
        smoothTouch: false,
        infinite: false,
    });

    // Sync ScrollTrigger updates with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return lenis;
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER TIMELINES
   ========================================================================== */
function initGSAPAnimations(lenis) {
    gsap.registerPlugin(ScrollTrigger);

    // Text Splitter Utility (Splits text into masks for word-by-word reveal)
    function splitText(selector) {
        document.querySelectorAll(selector).forEach(el => {
            if (el.querySelector('.word-wrapper')) return;

            const text = el.textContent.trim();
            el.innerHTML = '';

            const words = text.split(/\s+/);
            words.forEach(word => {
                const wrapper = document.createElement('span');
                wrapper.className = 'word-wrapper';

                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.textContent = word;

                wrapper.appendChild(inner);
                el.appendChild(wrapper);
                el.appendChild(document.createTextNode(' ')); // maintain spacing
            });
        });
    }

    // Split text layers
    splitText('.reveal-text');
    splitText('.reveal-text-slow');

    // 1. Text reveals on scroll
    document.querySelectorAll('.reveal-text').forEach(el => {
        gsap.to(el.querySelectorAll('.word-inner'), {
            y: 0,
            duration: 1.1,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    document.querySelectorAll('.reveal-text-slow').forEach(el => {
        gsap.to(el.querySelectorAll('.word-inner'), {
            y: 0,
            duration: 1.4,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });

    // 2. Hero Background scale down on scroll
    gsap.to('.hero-bg', {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // 3. Portfolio parallax effect on project card images
    document.querySelectorAll('.project-card').forEach(card => {
        const img = card.querySelector('.project-img');
        if (!img) return;

        gsap.to(img, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Helper: Smooth navigation scroll links binding with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target, { offset: -60 });
            }
        });
    });
}

/* ==========================================================================
   LOTTIE SCROLL ANIMATION
   ========================================================================== */
function initLottieScroll() {
    const container = document.getElementById('lottie-scroll');
    if (!container) return;

    let loaded = false;

    // Load animated vector mouse scroll indicator
    const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://lottie.host/8e1f574d-93fe-4b13-bb1e-35beab0bf458/VnN1P0h5yW.json' // minimal scrolling mouse loop
    });

    anim.addEventListener('DOMLoaded', () => {
        loaded = true;
        container.style.opacity = '1';
    });

    // Resilient Fallback (If offline or CDN down, serve stylized CSS loop)
    setTimeout(() => {
        if (!loaded) {
            container.innerHTML = '<div class="scroll-fallback-dot"></div>';
            const style = document.createElement('style');
            style.textContent = `
                .scroll-fallback-dot {
                    width: 2px;
                    height: 12px;
                    background-color: var(--accent);
                    margin: 8px auto;
                    animation: fallbackScrollDot 1.8s infinite ease-in-out;
                }
                @keyframes fallbackScrollDot {
                    0% { transform: translateY(-5px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(18px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }, 2000);
}



/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('kaa-theme') || 'dark-theme';
    body.className = savedTheme;

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('kaa-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('kaa-theme', 'dark-theme');
        }
    });
}

/* ==========================================================================
   HEADER SCROLL STYLE
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('mobile-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !overlay) return;

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (overlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-grid');
    const nums = document.querySelectorAll('.stat-num');
    
    if (!statsSection || nums.length === 0) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                nums.forEach(num => {
                    const target = parseInt(num.getAttribute('data-val'), 10);
                    let current = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current >= target) {
                            num.textContent = target + '+';
                        } else {
                            num.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    updateCounter();
                });
                animated = true;
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
}

/* ==========================================================================
   PORTFOLIO FILTERING
   ========================================================================== */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT MODALS (WITH LENIS INTEGRATION)
   ========================================================================== */
const projectData = {
    'villa-pine': {
        title: "Villa Pine",
        cat: "Rezidanst / Orman Evi",
        img: "./assets/hero_villa.png",
        loc: "Muğla, Türkiye",
        area: "420 m²",
        year: "2024",
        client: "Ateş Ailesi",
        desc: "Villa Pine, çam ormanlarının gölgesinde, doğayla bütünleşik bir yaşam kurgusuyla tasarlandı. Brüt beton ve doğal ahşabın ham dokuları, yapının çevre peyzajıyla kaybolmasını sağlarken, geniş cam cepheler gün ışığını iç mekana davet ediyor. İç ve dış mekan sınırlarını kaldıran bu konsept, modern ve sürdürülebilir mimarinin rafine bir örneğidir."
    },
    'brutalist-horizon': {
        title: "Brutalist Horizon",
        cat: "Rezidanst / Sahil Evi",
        img: "./assets/portfolio_residence.png",
        loc: "İzmir, Türkiye",
        area: "510 m²",
        year: "2025",
        client: "Mono Kürasyon",
        desc: "Ege Denizi'ne bakan dik bir yamaçta konumlanan Brutalist Horizon, yalın geometrisi ve cesur konsol yapılarıyla ufuk çizgisini selamlıyor. Heykelsi brüt beton kütle, rüzgar ve güneş kontrolü sağlarken, sonsuzluk havuzuyla birleşen teras alanları açık hava yaşantısını maksimize ediyor. Sadeliğin gücüyle şekillenen bu yapı, zamansız bir deniz sığınağıdır."
    },
    'cube-gallery': {
        title: "Cube Gallery",
        cat: "Ticari / Sanat Galerisi",
        img: "./assets/portfolio_commercial.png",
        loc: "İstanbul, Türkiye",
        area: "1200 m²",
        year: "2025",
        client: "Karaköy Sanat Vakfı",
        desc: "Karaköy'ün tarihi dokusunun merkezinde yer alan Cube Gallery, eski bir endüstriyel ambarın modern bir sanat galerisine dönüşüm projesidir. Dev cam yüzeyler ve iç mekan avluları, sergi alanlarına homojen bir aydınlık sağlarken, yalın beton zeminler ve paslanmaz çelik detaylar sergilenen sanat eserlerini ön plana çıkarıyor. Tarih ve modernite arasında sessiz bir diyalog."
    },
    'japandi-curation': {
        title: "Japandi Curation",
        cat: "İç Mimari / Penthouse",
        img: "./assets/portfolio_interior.png",
        loc: "İstanbul, Türkiye",
        area: "280 m²",
        year: "2023",
        client: "Demir Ortaklığı",
        desc: "Japandi Curation, İskandinav fonksiyonelliği ile Japon minimalizminin dinginliğini bir araya getiren bir çatı katı dairesi projesidir. Mikro çimento zeminler, sıcak meşe paneller, el yapımı seramikler ve düşük profilli mobilyalarla mekanda dingin bir atmosfer hedeflendi. Doğal ışığın gölge oyunlarıyla zenginleşen iç mekanlar, şehir karmaşasının ortasında bir vaha sunuyor."
    }
};

function initProjectModal(lenis) {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const cards = document.querySelectorAll('.project-card');
    
    const modalTitle = document.getElementById('modal-title');
    const modalCat = document.getElementById('modal-cat');
    const modalImg = document.getElementById('modal-img');
    const specLoc = document.getElementById('spec-loc');
    const specArea = document.getElementById('spec-area');
    const specYear = document.getElementById('spec-year');
    const specClient = document.getElementById('spec-client');
    const modalDesc = document.getElementById('modal-desc');

    if (!modal || !closeBtn || cards.length === 0) return;

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalCat.textContent = data.cat;
        modalImg.src = data.img;
        modalImg.alt = data.title;
        specLoc.textContent = data.loc;
        specArea.textContent = data.area;
        specYear.textContent = data.year;
        specClient.textContent = data.client;
        modalDesc.textContent = data.desc;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Halt smooth scrolling when modal is active
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Resume smooth scrolling on close
        if (lenis) lenis.start();
        document.body.style.overflow = '';
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            openModal(projectId);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   MAGNETIC BUTTONS EFFECT
   ========================================================================== */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('[data-magnetic]');

    if (window.matchMedia('(hover: hover)').matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const bound = btn.getBoundingClientRect();
                
                const x = e.clientX - (bound.left + bound.width / 2);
                const y = e.clientY - (bound.top + bound.height / 2);
                
                const magnetStrength = 0.35;
                
                btn.style.transform = `translate(${x * magnetStrength}px, ${y * magnetStrength}px)`;
                
                const text = btn.querySelector('span');
                if (text) {
                    text.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                }
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
                const text = btn.querySelector('span');
                if (text) {
                    text.style.transform = 'translate(0px, 0px)';
                }
            });
        });
    }
}

/* ==========================================================================
   CONTACT FORM & ACCORDION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');

    if (!form || !submitBtn || !status) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        const origBtnText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Gönderiliyor...';
        status.className = 'form-status';
        status.textContent = '';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = origBtnText;
            
            status.className = 'form-status success';
            status.textContent = '✓ Mesajınız başarıyla gönderildi! Sizinle en kısa sürede iletişime geçeceğiz.';
            
            form.reset();
            
            setTimeout(() => {
                status.style.opacity = '0';
                setTimeout(() => {
                    status.textContent = '';
                    status.style.opacity = '1';
                }, 500);
            }, 5000);
        }, 1500);
    });

    // Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    const activeServiceImg = document.getElementById('active-service-img');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accordionItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
                
                // Dynamic preview photo transition
                const newImgSrc = item.getAttribute('data-service-img');
                if (newImgSrc && activeServiceImg) {
                    activeServiceImg.style.opacity = '0';
                    activeServiceImg.style.transform = 'scale(0.97)';
                    setTimeout(() => {
                        activeServiceImg.src = newImgSrc;
                        activeServiceImg.style.opacity = '1';
                        activeServiceImg.style.transform = 'scale(1)';
                    }, 300);
                }

                // Let ScrollTrigger recalculate positions after layout shifts
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 500);
            }
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL (FALLBACK OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}
