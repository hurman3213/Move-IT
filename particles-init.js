// particles-init.js - Sandman Dust Canvas Particle Effect (website theme)

document.addEventListener('DOMContentLoaded', function () {
  // Enable smooth scrolling via CSS
  try {
    document.documentElement.style.scrollBehavior = 'smooth';
  } catch (e) {}

  // Add smooth scroll for anchor links (for browsers that don't support CSS smooth scroll)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId) || document.querySelector(`[name='${targetId}']`);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
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

  // Try to use WebGL2 for GPU acceleration, fallback to 2D if not available
  let gl = null;
  let ctx = null;
  let useWebGL = false;
  try {
    gl = canvas.getContext('webgl2', { alpha: false });
    if (gl) useWebGL = true;
  } catch (e) {}
  if (!useWebGL) {
    ctx = canvas.getContext('2d');
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (useWebGL && gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Theme colors (matching website theme)
  const brightColors = [
    [127,255,0,0.9],   // neon green
    [57,255,20,0.8],   // electric green
    [50,205,50,0.7],   // lime green
    [255,255,255,0.5]  // white accent
  ];

  // Lower particle count for low-end devices
  const particleCount = window.innerWidth < 700 ? 120 : 220;
  const particles = [];
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
      this.vx = (Math.random() - 0.5) * 0.13;
      this.vy = (Math.random() - 0.5) * 0.13;
      this.size = Math.random() * 0.5 + 0.3;
      this.color = brightColors[Math.floor(Math.random() * brightColors.length)];
      this.glow = 0;
    }
    update() {
      this.vx *= 0.997;
      this.vy *= 0.997;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const radius = 180;
        if (dist < radius) {
          const strength = (1 - dist / radius);
          const angle = Math.atan2(dy, dx);
          const direction = attractMode ? -1 : 1;
          const force = strength * 0.22 * direction;
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          this.glow = Math.max(0, 1 - dist / radius);
        } else {
          this.glow *= 0.94;
        }
      }
    }
  }

  function initParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // WebGL2 rendering (very simple, no glow, just colored points)
  function renderWebGL() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let p of particles) {
      // Draw as points (no glow, just color)
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      gl.clearColor(p.color[0]/255, p.color[1]/255, p.color[2]/255, p.color[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.SCISSOR_TEST);
    }
  }

  // 2D rendering (with simple glow)
  function render2D() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.color[3]})`;
      ctx.shadowColor = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${Math.min(1,p.glow)})`;
      ctx.shadowBlur = 4 * p.glow + 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function animate() {
    for (let p of particles) p.update();
    if (useWebGL) {
      renderWebGL();
    } else {
      render2D();
    }
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
});
