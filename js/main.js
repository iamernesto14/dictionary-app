document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const fontSelect = document.getElementById('language');
  const searchForm = document.getElementById('search-form');
  const wordContent = document.getElementById('word-content');


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

  // Initial fetch for "keyboard"
fetch('https://api.dictionaryapi.dev/api/v2/entries/en/keyboard')
  .then(response => response.json())
  .then(data => renderWordData(data[0]))
  .catch(error => {
    wordContent.innerHTML = '<p class="error-message">Failed to load initial word.</p>';
    console.error('Initial fetch error:', error);
  });

  // Search form submission
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value.trim();
    if (!searchInput) return;

    wordContent.innerHTML = '<p class="loading">Loading</p>';
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchInput)}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const data = await response.json();

      // Check if data is an array (valid response) or an object (error response)
      if (Array.isArray(data) && data.length > 0) {
        renderWordData(data[0]); 
      } else {
        throw new Error('No definitions found');
      }
    } catch (error) {
      wordContent.innerHTML = `<p class="error-message">Sorry, we couldn't find definitions for "${searchInput}". Please try another word.</p>`;
      console.error('Error fetching word:', error);
    }
  });

  // Function to render word data
  function renderWordData(entry) {
    const { word, phonetic, phonetics, meanings, sourceUrls } = entry;
    const phoneticText = phonetic || (phonetics && phonetics[0]?.text) || '';
    const audioUrl = phonetics && phonetics.find(p => p.audio)?.audio;

    // Generate meanings HTML
    const meaningsHtml = meanings.map(meaning => {
      const definitionsHtml = meaning.definitions.map(def => `
        <li>${def.definition}${def.example ? `<p>"${def.example}"</p>` : ''}</li>
      `).join('');
      const synonymsHtml = meaning.synonyms.length > 0 ? `
        <div class="synonyms">
          <h4>Synonyms</h4>
          <span>${meaning.synonyms.join(', ')}</span>
        </div>
      ` : '';

      return `
        <div class="definition">
          <h3>${meaning.partOfSpeech}</h3>
          <hr>
        </div>
        <div class="meaning">
          <h4>Meaning</h4>
          <ul class="meaning-list">
            ${definitionsHtml}
          </ul>
          ${synonymsHtml}
        </div>
      `;
    }).join('');

    // Generate source HTML
    const sourceHtml = sourceUrls && sourceUrls.length > 0 ? `
      <footer>
        <div class="source">
          <h5>Source</h5>
          <div class="source-link">
            <a href="${sourceUrls[0]}" target="_blank">${sourceUrls[0]}</a>
            <img src="assets/images/icon-new-window.svg" alt="New Window">
          </div>
        </div>
      </footer>
    ` : '';

    // Generate full HTML
    wordContent.innerHTML = `
      <div class="key-words">
        <div>
          <h1>${word}</h1>
          ${phoneticText ? `<p>${phoneticText}</p>` : ''}
        </div>
        ${audioUrl ? `
          <img class="play-icon" src="assets/images/icon-play.svg" alt="Play pronunciation" data-audio="${audioUrl}">
        ` : ''}
      </div>
      ${meaningsHtml}
      ${sourceHtml}
    `;

    // Add event listener for audio playback
    const playIcon = wordContent.querySelector('.play-icon');
    if (playIcon) {
      playIcon.addEventListener('click', () => {
        const audio = new Audio(playIcon.dataset.audio);
        audio.play().catch(error => console.error('Error playing audio:', error));
      });
    }
  }
});