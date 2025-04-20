// Remplacez cette URL par celle que vous avez obtenue avec Sheet.best
const apiUrl = 'https://api.sheetbest.com/sheets/06fdfce2-1eab-4768-b31a-e46cbef4f384';

function loadQuestions() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('qa-section');
        container.innerHTML = '';
        data.forEach(item => {
          const div = document.createElement('div');
          div.className = 'question-reponse';
  
          // Question
          const questionDiv = document.createElement('div');
          questionDiv.className = 'bulle-question';
          questionDiv.innerHTML = `<div class="question-text">${item.Question}</div>`;
  
          // Réponse
          const reponseDiv = document.createElement('div');
          reponseDiv.className = 'bulle-reponse';
          reponseDiv.innerHTML = `<div class="reponse-text">${item.Reponses}</div>`;
  
          // Ajout
          div.appendChild(questionDiv);
          div.appendChild(reponseDiv);
          container.appendChild(div);
        });
      });
  }

function poserQuestion() {
  const input = document.getElementById('question-input');
  const question = input.value.trim();
  if (question === '') {
    alert('Veuillez entrer une question.');
    return;
  }

  // Envoi de la nouvelle question via POST
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Question: question, Reponses: '' }) // Adapté à votre structure
  })
  .then(() => {
    input.value = ''; // Vider le champ
    loadQuestions(); // Recharger la liste pour voir la nouvelle question
  })
  .catch(error => {
    console.error('Erreur lors de l\'envoi:', error);
  });
}

// Charger les questions quand la page s'ouvre
window.onload = () => {
  loadQuestions();
  // Optionnel : recharger toutes les 10 secondes
  // setInterval(loadQuestions, 10000);
};