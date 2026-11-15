document.documentElement.classList.add('js');

const menu = document.querySelector('[data-menu]');
const navigation = document.querySelector('[data-navigation]');
function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

const preview = document.querySelector('[data-preview]');
const mobilePreview = document.querySelector('[data-preview-mobile]');
const previewButtons = [...document.querySelectorAll('[data-preview-src]')];
const fullPreview = document.querySelector('[data-full-preview]');
const previewDescription = document.querySelector('[data-preview-description]');
previewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    previewButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    mobilePreview.srcset = button.dataset.mobileSrc;
    preview.src = button.dataset.previewSrc;
    preview.alt = button.dataset.previewAlt;
    previewDescription.textContent = button.dataset.previewCaption;
    fullPreview.href = button.dataset.previewSrc;
  });
});
document.querySelector('[data-show-compare]')?.addEventListener('click', () => {
  previewButtons.find((button) => button.textContent === 'Compare models')?.click();
});

const skinImage = document.querySelector('[data-skin-preview]');
const skinDescription = document.querySelector('[data-skin-description]');
const skinButtons = [...document.querySelectorAll('[data-skin-src]')];
skinButtons.forEach((button) => {
  button.addEventListener('click', () => {
    skinButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    skinImage.src = button.dataset.skinSrc;
    skinImage.alt = button.dataset.skinAlt;
    skinDescription.textContent = button.dataset.skinCaption;
  });
});

const dialog = document.querySelector('[data-preview-dialog]');
const dialogImage = dialog?.querySelector('img');
if (dialog && typeof dialog.showModal === 'function') {
  fullPreview.addEventListener('click', (event) => {
    event.preventDefault();
    dialogImage.src = fullPreview.href;
    dialogImage.alt = preview.alt;
    dialog.showModal();
  });
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
