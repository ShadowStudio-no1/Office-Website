// Carousel functionality
class TestimonialsCarousel {
  constructor() {
    this.carousel = document.querySelector('.testimonials-carousel');
    this.track = document.querySelector('.testimonials-track');
    this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.dotsContainer = document.querySelector('.carousel-dots');
    
    this.currentIndex = 0;
    this.cardWidth = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Create dots
    this.cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });

    // Add event listeners
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    this.track?.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.track?.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.track?.addEventListener('touchend', () => this.handleTouchEnd());

    // Initialize card indices for staggered animation
    this.cards.forEach((card, index) => {
      card.style.setProperty('--card-index', index);
    });

    // Handle resize
    window.addEventListener('resize', () => this.updateLayout());
    this.updateLayout();

    // Start auto-scroll if more than one card
    if (this.cards.length > 1) {
      this.startAutoScroll();
    }
  }

  updateLayout() {
    if (!this.track) return;
    
    const viewportWidth = window.innerWidth;
    let cardsPerView = 1;

    if (viewportWidth >= 1200) {
      cardsPerView = 3;
    } else if (viewportWidth >= 768) {
      cardsPerView = 2;
    }

    this.cardWidth = this.carousel.offsetWidth / cardsPerView;
    this.goToSlide(this.currentIndex, false);
  }

  goToSlide(index, animate = true) {
    if (!this.track) return;
    
    this.currentIndex = index;
    const offset = -index * this.cardWidth;
    
    if (animate) {
      this.track.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    } else {
      this.track.style.transition = 'none';
    }
    
    this.track.style.transform = `translateX(${offset}px)`;
    this.updateDots();
    
    if (animate) {
      setTimeout(() => {
        this.track.style.transition = '';
      }, 600);
    }
  }

  prev() {
    const newIndex = this.currentIndex - 1;
    if (newIndex >= 0) {
      this.goToSlide(newIndex);
    } else {
      // Bounce effect
      this.track.style.transform = `translateX(50px)`;
      setTimeout(() => {
        this.track.style.transform = `translateX(0)`;
      }, 150);
    }
  }

  next() {
    const newIndex = this.currentIndex + 1;
    const maxIndex = this.cards.length - 1;
    if (newIndex <= maxIndex) {
      this.goToSlide(newIndex);
    } else {
      // Bounce effect
      this.track.style.transform = `translateX(-50px)`;
      setTimeout(() => {
        this.track.style.transform = `translateX(0)`;
      }, 150);
    }
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.track.style.transition = 'none';
  }

  handleTouchMove(e) {
    if (!this.touchStartX) return;
    
    const currentX = e.touches[0].clientX;
    const diff = this.touchStartX - currentX;
    const offset = -this.currentIndex * this.cardWidth - diff;
    
    this.track.style.transform = `translateX(${offset}px)`;
  }

  handleTouchEnd() {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = this.cardWidth / 3;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    } else {
      this.goToSlide(this.currentIndex);
    }
    
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  startAutoScroll() {
    setInterval(() => {
      if (document.hidden) return;
      
      const newIndex = (this.currentIndex + 1) % this.cards.length;
      this.goToSlide(newIndex);
    }, 5000);
  }
}

// 3D Card Effects
class TestimonialCard {
  constructor(card) {
    this.card = card;
    this.content = card.querySelector('.card-content');
    this.cardBg = card.querySelector('.card-bg');
    this.init();
  }

  init() {
    this.card.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.card.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.card.addEventListener('mouseenter', () => this.handleMouseEnter());
  }

  handleMouseMove(e) {
    const rect = this.card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update card rotation
    const rotateY = ((x - 50) * 0.1).toFixed(2);
    const rotateX = (-(y - 50) * 0.1).toFixed(2);
    
    this.content.style.transform = `
      translateY(-10px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
    
    // Update background gradient position
    this.cardBg.style.setProperty('--mouse-x', `${x}%`);
    this.cardBg.style.setProperty('--mouse-y', `${y}%`);
  }

  handleMouseLeave() {
    this.content.style.transform = '';
  }

  handleMouseEnter() {
    this.content.style.transition = 'transform 0.2s ease-out';
    setTimeout(() => {
      this.content.style.transition = '';
    }, 200);
  }
}

// Video Modal
class VideoModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    document.querySelectorAll('.play-video').forEach(button => {
      button.addEventListener('click', (e) => {
        const videoId = e.currentTarget.dataset.videoId;
        this.openModal(videoId);
      });
    });
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="close-modal">
          <i class="ri-close-line"></i>
        </button>
        <div class="video-container"></div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.modal = modal;

    modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
    modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal());
  }

  openModal(videoId) {
    if (!this.modal) this.createModal();
    
    // Example: Replace with actual video implementation
    const videoContainer = this.modal.querySelector('.video-container');
    videoContainer.innerHTML = `
      <div class="video-placeholder">
        <i class="ri-film-line"></i>
        <p>Video ID: ${videoId}</p>
        <p>Coming Soon!</p>
      </div>
    `;
    
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    const videoContainer = this.modal.querySelector('.video-container');
    videoContainer.innerHTML = '';
  }
}

// Stats Animation
class StatsCounter {
  constructor() {
    this.stats = document.querySelectorAll('.testimonials-stats .stat h4');
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );
    
    this.init();
  }

  init() {
    this.stats.forEach(stat => {
      this.observer.observe(stat);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateValue(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  animateValue(element) {
    const value = parseInt(element.textContent);
    const suffix = element.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const start = 0;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (value - start) + start);
      element.textContent = currentValue + suffix;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }
}

// Testimonial data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechVision",
    image: "res/testimonials/client1.jpg",
    text: "Shadow Studio transformed our digital presence completely. Their attention to detail and innovative solutions exceeded our expectations."
  },
  {
    name: "Michael Chen",
    role: "CTO, InnovateCorp",
    image: "res/testimonials/client2.jpg",
    text: "The team's expertise in both design and development helped us launch our product ahead of schedule. Truly outstanding work!"
  },
  {
    name: "Emma Davis",
    role: "Product Manager, NextGen",
    image: "res/testimonials/client3.jpg",
    text: "Working with Shadow Studio was a game-changer for our startup. They delivered a beautiful, functional product that our users love."
  }
];

// Initialize testimonial slider
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  // Create testimonial cards
  testimonials.forEach((testimonial, index) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', index * 100);
    
    card.innerHTML = `
      <div class="card-inner">
        <div class="testimonial-header">
          <div class="client-info">
            <img src="${testimonial.image}" alt="${testimonial.name}" 
                 onerror="this.src='res/testimonials/default-avatar.jpg'">
            <div>
              <h3>${testimonial.name}</h3>
              <p>${testimonial.role}</p>
            </div>
          </div>
          <i class="ri-double-quotes-l quote-icon"></i>
        </div>
        <p class="testimonial-text">${testimonial.text}</p>
      </div>
    `;
    
    slider.appendChild(card);
  });

  // Initialize AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true
  });

  // Initialize carousel
  new TestimonialsCarousel();

  // Initialize card effects
  document.querySelectorAll('.testimonial-card').forEach(card => {
    new TestimonialCard(card);
  });

  // Initialize video modal
  new VideoModal();

  // Initialize stats counter
  new StatsCounter();
});
