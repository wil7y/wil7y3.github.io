// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FICHIER = 'commentaires.json';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Lire les commentaires
function lireCommentaires() {
  if (!fs.existsSync(FICHIER)) return [];
  return JSON.parse(fs.readFileSync(FICHIER));
}

// Sauvegarder les commentaires
function sauvegarderCommentaires(commentaires) {
  fs.writeFileSync(FICHIER, JSON.stringify(commentaires, null, 2));
}

// Récupérer les commentaires
app.get('/commentaires', (req, res) => {
  res.json(lireCommentaires());
});

// Ajouter un commentaire ou une réponse
app.post('/commentaires', (req, res) => {
  const commentaires = lireCommentaires();
  const { pseudo, message, parentId } = req.body;
  const nouveau = {
    id: Date.now(),
    pseudo,
    message,
    date: new Date().toISOString(),
    parentId: parentId || null,
    likes: 0
  };
  commentaires.push(nouveau);
  sauvegarderCommentaires(commentaires);
  res.status(201).json(nouveau);
});

// Ajouter un like
app.post('/like/:id', (req, res) => {
  const commentaires = lireCommentaires();
  const id = parseInt(req.params.id);
  const index = commentaires.findIndex(c => c.id === id);
  if (index !== -1) {
    commentaires[index].likes = (commentaires[index].likes || 0) + 1;
    sauvegarderCommentaires(commentaires);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
