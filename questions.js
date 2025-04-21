const backendURL = "https://wil7y3-github-io.onrender.com"; // Remplace par ton URL Render
    const commentairesDiv = document.getElementById("commentaires");

    function afficherCommentaires(commentaires, parentId = null, container = commentairesDiv) {
      const filtrés = commentaires.filter(c => c.parentId === parentId);

      filtrés.forEach(commentaire => {
        const div = document.createElement("div");
        div.className = parentId ? "bulle-reponse" : "bulle-commentaire";

        div.innerHTML = `
          <div class="pseudo">${commentaire.pseudo}</div>
          <div class="texte">${commentaire.message}</div>
          <div class="date">${new Date(commentaire.date).toLocaleString()}</div>
          <button class="btn-repondre">Répondre</button>
        `;

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

    function chargerCommentaires() {
      fetch(`${backendURL}/commentaires`)
        .then(res => res.json())
        .then(data => {
          commentairesDiv.innerHTML = "";
          afficherCommentaires(data);
        });
    }

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

    chargerCommentaires();
