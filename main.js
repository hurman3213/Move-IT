

// Loader overlay logic
window.addEventListener('DOMContentLoaded', function() {
  // Hide scrollbar while loader is visible
  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    const loader = document.getElementById('site-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        // Restore scrollbar after loader is gone
        document.body.style.overflow = '';
      }, 700);
    } else {
      // Fallback: restore scrollbar if loader not found
      document.body.style.overflow = '';
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
      // Reduce delay for faster response and use a smoother ease
      let delayTime = i * 0.12;
      if(item.id === 'contact') {
        delayTime = 0.05;
      }
      gsap.fromTo(item, 
        {autoAlpha: 0, y: 40}, 
        {
          duration: 0.7,
          autoAlpha: 1,
          y: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 98%', // animate a bit earlier
            toggleActions: 'play none none reverse',
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
