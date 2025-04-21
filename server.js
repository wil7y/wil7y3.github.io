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

//---ROUTE DE STATS---
app.post('/stats', (req, res) => {
    const visiteur = {
        date: new Date().toDateString(),
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forward-for'] || req.socket.remoteAddress,
        page: req.body.page || "inconnue"
    };

    //Lire les stats existantes
    let stats = [];
    if (fs.existsSync('stats.json')){
        stats = JSON.parse(fs.readFileSync('stats.json', 'utf8'));
    }

    stats.push(visiteur);

    fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));

    res.status(200).json({ message: 'Stat enregistrée'});

});

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
