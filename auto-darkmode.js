// auto-darkmode.js
// Detects user's OS/browser color scheme and applies dark or light mode automatically
(function() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const body = document.body;
  const toggleButton = document.getElementById('darkModeToggle');
  if (prefersDark) {
    body.classList.add('dark-mode');
    if (toggleButton) {
      toggleButton.textContent = 'Light Mode';
      toggleButton.style.backgroundColor = '#555';
    }
  } else if (prefersLight) {
    body.classList.remove('dark-mode');
    if (toggleButton) {
      toggleButton.textContent = 'Dark Mode';
      toggleButton.style.backgroundColor = '#2e8b57';
    }
  }
})();
