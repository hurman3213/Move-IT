// particles-init.js - Sandman Dust Canvas Particle Effect (website theme)
// Replaces particles.js background with a custom canvas effect

document.addEventListener('DOMContentLoaded', function () {
  // Remove any old particles.js container if present
  const oldParticles = document.getElementById('particles-js');
  if (oldParticles) oldParticles.remove();

  // Create and style the canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas-bg';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Theme colors (matching website theme)
  const brightColors = [
    'rgba(127,255,0,0.9)',   // neon green
    'rgba(57,255,20,0.8)',   // electric green
    'rgba(50,205,50,0.7)',   // lime green
    'rgba(255,255,255,0.5)'  // white accent
  ];

  const particles = [];
  const particleCount = 200;
  const mouse = { x: null, y: null };
  let attractMode = false;

  function setMouse(x, y) {
    mouse.x = x;
    mouse.y = y;
  }
  window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) setMouse(touch.clientX, touch.clientY);
  }, { passive: false });
  window.addEventListener('mousemove', (e) => {
    setMouse(e.clientX, e.clientY);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'a') attractMode = !attractMode;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.size = Math.random() * 0.6 + 0.4;
      this.baseColor = brightColors[Math.floor(Math.random() * brightColors.length)];
      this.glow = 0;
    }
    update() {
      this.vx *= 0.998;
      this.vy *= 0.998;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const radius = 250;
        if (dist < radius) {
          const strength = (1 - dist / radius);
          const angle = Math.atan2(dy, dx);
          const direction = attractMode ? -1 : 1;
          const force = strength * 0.3 * direction;
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          this.glow = Math.max(0, 1 - dist / radius);
        } else {
          this.glow *= 0.96;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      if (this.glow > 0.95) {
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.shadowColor = 'white';
      } else {
        ctx.fillStyle = this.baseColor;
        ctx.shadowColor = this.baseColor;
      }
      ctx.shadowBlur = 6 * this.glow + 4;
      ctx.fill();
    }
  }

  function initParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
});
