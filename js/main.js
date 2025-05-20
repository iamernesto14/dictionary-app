const toggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  // Update moon icon based on dark mode state
  if (document.body.classList.contains('dark-mode')) {
    themeIcon.src = 'assets/images/icon-moon-dark.svg';
  } else {
    themeIcon.src = 'assets/images/icon-moon.svg';
  }
});