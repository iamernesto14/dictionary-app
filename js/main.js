document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const fontSelect = document.getElementById('language');

  // Dark mode toggle
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      themeIcon.src = 'assets/images/icon-moon-dark.svg';
    } else {
      themeIcon.src = 'assets/images/icon-moon.svg';
    }
  });

  // Font selection
  fontSelect.addEventListener('change', () => {
    const selectedFont = fontSelect.value;
    let fontFamily;

    switch (selectedFont.toLowerCase()) {
      case 'sans serif':
      case 'sans-serif':
        fontFamily = 'var(--font-sans)';
        break;
      case 'serif':
        fontFamily = 'var(--font-serif)';
        break;
      case 'mono':
        fontFamily = 'var(--font-mono)';
        break;
      default:
        fontFamily = 'var(--font-sans)';
    }

    document.body.style.setProperty('--current-font', fontFamily);
  });
});