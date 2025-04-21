const { response } = require("express");

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
  // Si vous avez une animation du bouton hamburger
  menuToggle.classList.toggle('open');
});

fetch('https://wil7y3-github-io.onrender.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    page: window.location.pathname
  })
})
.then(response => response.json())
.then(data => {
  console.log('Statistique enregistrée');
})
.catch(error => {
  console.error('Erreur d envoi des stats:', error);
});

const PASSWORD = "1ko14ochampion"; // <- Change ce mot de passe !

function checkPassword() {
  const input = document.getElementById("password").value;
  const error = document.getElementById("loginError");
  if (input === PASSWORD) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminContent").classList.remove("hidden");
    loadStats();
  } else {
    error.textContent = "Mot de passe incorrect.";
  }
}

function loadStats() {
  fetch('https://wil7y3-github-io.onrender.com')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#statsTable tbody');
      data.reverse().forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(stat.date).toLocaleString()}</td>
          <td>${stat.ip}</td>
          <td>${stat.userAgent}</td>
          <td>${stat.page}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Erreur chargement stats:', err);
    });
}

