

// Loader overlay logic
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    const loader = document.getElementById('site-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 700);
    }
  }, 2500); // Show loader for 2.5s
});

// Dark mode toggle logic
window.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('darkModeToggle');
  if (!toggleButton) return;
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')) {
      toggleButton.textContent = 'Light Mode';
      toggleButton.style.backgroundColor = '#555';
    } else {
      toggleButton.textContent = 'Dark Mode';
      toggleButton.style.backgroundColor = '#2e8b57';
    }
  });
});

// GSAP Scroll Animations
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const animateItems = gsap.utils.toArray('.feature-item, .auth, .about, #contact, #signup');
    animateItems.forEach((item, i) => {
      let delayTime = i * 0.3;
      if(item.id === 'contact') {
        delayTime = 0.1; // reduce delay for contact section
      }
      gsap.fromTo(item, 
        {autoAlpha: 0, y: 50}, 
        {
          duration: 1,
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            toggleActions: 'play reverse play reverse',
          },
          delay: delayTime
        }
      );
    });
  }
});

// 3D Tilt Card Effect for all .tilt-card elements
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tilt-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `perspective(900px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.18s cubic-bezier(.03,.98,.52,.99)';
      card.classList.add('tilted');
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.35s cubic-bezier(.03,.98,.52,.99)';
      card.classList.remove('tilted');
    });
  });
});

// Show/hide nav-links scrollbar on mobile interaction
window.addEventListener('DOMContentLoaded', function() {
  var navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  function isMobile() {
    return window.innerWidth <= 768;
  }
  function showScrollbar() {
    if (isMobile()) navLinks.classList.add('show-scrollbar');
  }
  function hideScrollbar() {
    if (isMobile()) navLinks.classList.remove('show-scrollbar');
  }
  navLinks.addEventListener('mouseenter', showScrollbar);
  navLinks.addEventListener('mouseleave', hideScrollbar);
  navLinks.addEventListener('focusin', showScrollbar);
  navLinks.addEventListener('focusout', hideScrollbar);
  navLinks.addEventListener('touchstart', showScrollbar);
  navLinks.addEventListener('touchend', hideScrollbar);
  window.addEventListener('resize', function() {
    if (!isMobile()) navLinks.classList.remove('show-scrollbar');
  });
});
