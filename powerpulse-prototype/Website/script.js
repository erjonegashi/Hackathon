// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  initNavigation();
  initButtons();
  initCardAnimations();
  initScrollEffects();
  initPreviewCard();
  initDemoCards();
}

// Smooth scroll navigation
function initNavigation() {
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        link.style.color = '#06d6a0';
        setTimeout(() => {
          link.style.color = '#cbd5e1';
        }, 600);
      }
    });
  });
}

// Enhanced button interactions
function initButtons() {
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.02)';
      this.style.transition = 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}


// Scroll animations for cards
function initCardAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.feature-card, .work-card, .stack-card, .benefit-card, .testimonial-card, .faq-card, .demo-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 500ms ease, transform 500ms ease';
    observer.observe(card);
  });
}


// Active section highlight on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + current) {
      link.style.color = '#06d6a0';
    } else {
      link.style.color = '#cbd5e1';
    }
  });
});

// Floating animation for preview card
const previewCard = document.querySelector('.preview-card');
if (previewCard) {
  let animationId;
  let time = 0;
  const animate = () => {
    time += 0.005;
    previewCard.style.transform = `translateY(${Math.sin(time) * 8}px)`;
    animationId = requestAnimationFrame(animate);
  };
  animate();
}

// Counter animation for preview values
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current.toFixed(1);
  }, 20);
}

// Trigger counter when preview card is visible
if (previewCard) {
  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const valueElement = entry.target.querySelector('.preview-value');
        if (valueElement) {
          animateCounter(valueElement, 4.2);
        }
      }
    });
  });
  observer2.observe(previewCard);
}

// Parallax effect on hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrollPosition = window.scrollY;
    hero.style.transform = `translateY(${scrollPosition * 0.3}px)`;
  }
});
