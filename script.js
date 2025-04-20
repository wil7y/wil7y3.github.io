// Sélectionner toutes les sections à animer
const sections = document.querySelectorAll('section');

function revealOnScroll() {
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 100) {
      section.style.opacity = 1;
      section.style.transform = 'translateY(0)';
      section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    }
  });
}

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  menuToggle.classList.toggle('open');
});

const copyButton = document.getElementById('copy-btn');
const codeBlock = document.getElementById('arduino-code');

copyButton.addEventListener('click', () => {
  const codeText = codeBlock.innerText; // Récupère le texte brut
  navigator.clipboard.writeText(codeText).then(() => {
    // Feedback utilisateur
    copyButton.textContent = 'Copié!';
    setTimeout(() => {
      copyButton.textContent = 'Copier le code';
    }, 2000);
  }).catch(() => {
    // Si navigator.clipboard ne fonctionne pas (sur certains vieux navigateurs)
    fallbackCopyText(codeText);
  });
});

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    alert('Code copié!');
  } catch (err) {
    alert('Impossible de copier');
  }
  document.body.removeChild(textarea);
}