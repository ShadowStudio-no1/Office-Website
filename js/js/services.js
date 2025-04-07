// Track mouse position for section background
const servicesSection = document.querySelector('.services');
if (servicesSection) {
  servicesSection.addEventListener('mousemove', (e) => {
    const rect = servicesSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    servicesSection.style.setProperty('--mouse-x', `${x}%`);
    servicesSection.style.setProperty('--mouse-y', `${y}%`);
  });
}

// Handle card hover effects and 3D transforms
document.querySelectorAll('.service-card').forEach((card, index) => {
  // Set card index for staggered animations
  card.style.setProperty('--card-index', index);
  
  // Handle mouse move for 3D effect
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.querySelector('.card-content').style.transform = 
      `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
    // Update gradient position
    const gradientX = ((x / rect.width) * 100);
    const gradientY = ((y / rect.height) * 100);
    card.querySelector('.card-bg').style.setProperty('--mouse-x', `${gradientX}%`);
    card.querySelector('.card-bg').style.setProperty('--mouse-y', `${gradientY}%`);
  });
  
  // Reset card transform on mouse leave
  card.addEventListener('mouseleave', () => {
    card.querySelector('.card-content').style.transform = 
      'translateY(0) rotateX(0) rotateY(0)';
    card.querySelector('.card-bg').style.setProperty('--mouse-x', '50%');
    card.querySelector('.card-bg').style.setProperty('--mouse-y', '50%');
  });
});

// Initialize AOS with custom settings
AOS.init({
  duration: 800,
  offset: 100,
  once: true,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

// Update data-text attribute for heading glow effect
const sectionHeading = document.querySelector('.services .section-header h1');
if (sectionHeading) {
  sectionHeading.setAttribute('data-text', sectionHeading.textContent);
}

// Smooth scroll for anchor links
document.querySelectorAll('.learn-more').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Portfolio Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        // Reset animation
        item.style.animation = 'none';
        item.offsetHeight; // Trigger reflow
        
        if (filter === 'all' || filter === category) {
          item.style.display = 'block';
          // Add fade in animation
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Add hover effect to portfolio items
  portfolioItems.forEach(item => {
    const image = item.querySelector('img');
    const overlay = item.querySelector('.portfolio-overlay');

    item.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
      image.style.transform = 'scale(1.1)';
    });

    item.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      image.style.transform = 'scale(1)';
    });
  });

  // Add smooth scroll for CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-btn, .view-project');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = btn.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// Add keyframe animation for fade in effect
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Services section enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize glow effects for service cards
  const cards = document.querySelectorAll('.cyber-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
  });

  // Add hover effect for service icons
  const icons = document.querySelectorAll('.cyber-icon');
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.querySelector('svg').style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.querySelector('svg').style.transform = 'scale(1) rotate(0deg)';
    });
  });

  // Smooth scroll for service card links
  const cardLinks = document.querySelectorAll('.cyber-card-button');
  cardLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
