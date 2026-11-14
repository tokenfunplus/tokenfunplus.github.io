document.documentElement.classList.add('js');

const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const answerButtons = [...document.querySelectorAll('[data-select-answer]')];
const contextNote = document.querySelector('[data-context-note]');

answerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    answerButtons.forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-pressed', String(selected));
      item.textContent = selected ? 'Selected for next turn ✓' : 'Use this answer';
      item.closest('.answer-card').classList.toggle('selected', selected);
    });
    if (contextNote) {
      contextNote.textContent = `Next turn uses Model ${button.dataset.selectAnswer}'s answer. The other answer stays in your history.`;
    }
  });
});

const galleryButtons = [...document.querySelectorAll('[data-gallery-image]')];
const galleryImage = document.querySelector('[data-gallery-preview]');
const galleryCaption = document.querySelector('[data-gallery-description]');
const galleryLink = document.querySelector('[data-gallery-link]');

galleryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (!galleryImage) return;
    galleryButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    galleryImage.src = button.dataset.galleryImage;
    galleryImage.alt = button.dataset.galleryAlt;
    if (galleryCaption) galleryCaption.textContent = button.dataset.galleryCaption;
    if (galleryLink) galleryLink.href = button.dataset.galleryImage;
    document.dispatchEvent(new CustomEvent('product-theme-change', { detail: index }));
  });
});
