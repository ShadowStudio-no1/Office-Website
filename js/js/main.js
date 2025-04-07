// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize Testimonials Slider with Swiper
    const testimonialSlider = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 50,
                centeredSlides: true,
            },
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        }
    });
    
    // Animate counter numbers
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = Math.ceil(target / speed);
            
            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(() => animateCounters(), 1);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Start counter animation when testimonials section is in view
    const testimonialsSection = document.querySelector('.testimonials-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (testimonialsSection) {
        observer.observe(testimonialsSection);
    }

    // Remove preloader when page is fully loaded
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        document.body.classList.remove('loading');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    });

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    // Hide cursor on mobile devices
    function handleCursorVisibility() {
        if (cursor && follower) {
            const isMobile = window.innerWidth <= 991 || 
                             'ontouchstart' in window || 
                             navigator.maxTouchPoints > 0;
            
            // Hide cursor elements on mobile/touch devices
            cursor.style.display = isMobile ? 'none' : 'block';
            follower.style.display = isMobile ? 'none' : 'block';
            
            // Only add mousemove listener on non-touch devices
            if (!isMobile) {
                document.addEventListener('mousemove', (e) => {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                    
                    follower.style.left = e.clientX + 'px';
                    follower.style.top = e.clientY + 'px';
                });
            }
        }
    }

    // Initial cursor setup
    handleCursorVisibility();
    
    // Update cursor visibility on resize
    window.addEventListener('resize', handleCursorVisibility);

    // Navigation menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', 
                navToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });
    }

    // Mobile dropdown toggle
    if (window.innerWidth <= 991) {
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            // Skip Services and Portfolio links - they should navigate directly
            if (link && item.querySelector('.mega-menu') && 
                link.getAttribute('href') !== '#services' && 
                link.getAttribute('href') !== '#portfolio') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                });
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // For Services and Portfolio links on mobile, always navigate
            const isMobile = window.innerWidth <= 991;
            const isServiceOrPortfolio = 
                this.getAttribute('href') === '#services' || 
                this.getAttribute('href') === '#portfolio';
            
            // Skip if it's a dropdown toggle on mobile (except Services/Portfolio)
            if (isMobile && this.parentElement.classList.contains('nav-item') && 
                this.parentElement.querySelector('.mega-menu') && !isServiceOrPortfolio) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-link.active')?.classList.remove('active');
                navLink?.classList.add('active');
            }
        });
    });

    // Window resize handler and compatibility fixes
    window.addEventListener('resize', handleResize);
    
    // Initial call to handle resize and compatibility
    handleResize();
    
    function handleResize() {
        if (window.innerWidth > 991) {
            // Reset mobile menu state
            navItems.forEach(item => item.classList.remove('active'));
        } else {
            // Mobile-specific adjustments
            
            // Fallback for :has() selector (Safari < 15.4, old browsers)
            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                if (link && (link.getAttribute('href') === '#services' || 
                             link.getAttribute('href') === '#portfolio')) {
                    // Add a mobile-direct-nav class for easy styling
                    item.classList.add('mobile-direct-nav');
                    
                    // Add direct navigation hint
                    if (!link.querySelector('.direct-nav-hint')) {
                        const hint = document.createElement('span');
                        hint.className = 'direct-nav-hint';
                        link.appendChild(hint);
                    }
                    
                    // Find and forcibly hide mega-menu for these items on mobile
                    const megaMenu = item.querySelector('.mega-menu');
                    if (megaMenu) {
                        megaMenu.style.display = 'none';
                        megaMenu.style.visibility = 'hidden';
                    }
                }
            });
        }
    }
});