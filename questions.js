const backendURL = "https://wil7y3-github-io.onrender.com"; // à modifier selon ton URL
const commentairesDiv = document.getElementById("commentaires");

// Affichage des commentaires et réponses
function afficherCommentaires(commentaires, parentId = null, container = commentairesDiv) {
  const filtrés = commentaires.filter(c => c.parentId === parentId);

  filtrés.forEach(commentaire => {
    const div = document.createElement("div");
    div.className = parentId ? "bulle bulle-reponse" : "bulle bulle-commentaire";

    div.innerHTML = `
      <div class="pseudo">${commentaire.pseudo}</div>
      <div class="texte">${commentaire.message}</div>
      <div class="date">${new Date(commentaire.date).toLocaleString()}</div>
      <div class="likes">
        <button class="like-btn">👍</button>
        <span class="like-count">${commentaire.likes || 0}</span>
      </div>
      <button class="btn-repondre">Répondre</button>
    `;

    // Like
    const likeBtn = div.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      fetch(`${backendURL}/like/${commentaire.id}`, { method: "POST" })
        .then(() => chargerCommentaires());
    });

    // Réponse
    const reponseZone = document.createElement("div");
    reponseZone.classList.add("reponse-zone");

    div.querySelector(".btn-repondre").addEventListener("click", () => {
      if (reponseZone.innerHTML !== "") return;

      const form = document.createElement("form");
      form.classList.add("reponse-form");
      form.innerHTML = `
        <input type="text" placeholder="Votre pseudo" required />
        <textarea rows="2" placeholder="Votre réponse" required></textarea>
        <button type="submit">Envoyer</button>
      `;

      form.addEventListener("submit", e => {
        e.preventDefault();
        const pseudo = form.querySelector("input").value.trim();
        const message = form.querySelector("textarea").value.trim();
        if (pseudo && message) {
          fetch(`${backendURL}/commentaires`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pseudo, message, parentId: commentaire.id })
          }).then(() => chargerCommentaires());
        }
      });

      reponseZone.appendChild(form);
    });

    container.appendChild(div);
    container.appendChild(reponseZone);
    afficherCommentaires(commentaires, commentaire.id, reponseZone);
  });
}

// Envoi du commentaire principal
document.getElementById("formulaire").addEventListener("submit", function(e) {
  e.preventDefault();
  const pseudo = document.getElementById("pseudo").value.trim();
  const message = document.getElementById("message").value.trim();

  if (pseudo && message) {
    fetch(`${backendURL}/commentaires`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, message })
    }).then(() => {
      this.reset();
      chargerCommentaires();
    });
  }
});

// Chargement initial
function chargerCommentaires() {
  fetch(`${backendURL}/commentaires`)
    .then(res => res.json())
    .then(data => {
      commentairesDiv.innerHTML = "";
      afficherCommentaires(data);
    });
}

chargerCommentaires();
