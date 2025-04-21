const backendURL = "https://wil7y3-github-io.onrender.com"; // Remplace par ton URL Render
const formulaire = document.getElementById("formulaire");
const commentairesDiv = document.getElementById("commentaires");

// Charger les commentaires au chargement
fetch(`${backendURL}/commentaires`)
  .then(response => response.json())
  .then(data => {
    commentairesDiv.innerHTML = "";
    data.forEach(commentaire => {
      const div = document.createElement("div");
      div.classList.add("bulle-commentaire");
      div.innerHTML = `
        <div class="pseudo">${commentaire.pseudo}</div>
        <div class="texte">${commentaire.message}</div>
        <div class="date">${new Date(commentaire.date).toLocaleString()}</div>
      `;
      commentairesDiv.appendChild(div);
    });
  });

// Soumettre un commentaire
formulaire.addEventListener("submit", function(event) {
  event.preventDefault();

  const pseudo = document.getElementById("pseudo").value.trim();
  const message = document.getElementById("message").value.trim();

  if (pseudo && message) {
    fetch(`${backendURL}/commentaires`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pseudo, message })
    })
    .then(response => response.json())
    .then(data => {
      formulaire.reset();
      // Recharger les commentaires
      return fetch(`${backendURL}/commentaires`);
    })
    .then(response => response.json())
    .then(data => {
      commentairesDiv.innerHTML = "";
      data.forEach(commentaire => {
        const div = document.createElement("div");
        div.classList.add("bulle-commentaire");
        div.innerHTML = `
          <div class="pseudo">${commentaire.pseudo}</div>
          <div class="texte">${commentaire.message}</div>
          <div class="date">${new Date(commentaire.date).toLocaleString()}</div>
        `;
        commentairesDiv.appendChild(div);
      });
    });
  }
});
