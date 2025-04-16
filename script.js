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

