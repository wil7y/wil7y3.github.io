const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = "commentaires.json";

app.use(cors());
app.use(express.json());

// Lire les commentaires
function lireCommentaires() {
  if (!fs.existsSync(FILE)) return [];
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
}

// Sauvegarder les commentaires
function sauvegarderCommentaires(commentaires) {
  fs.writeFileSync(FILE, JSON.stringify(commentaires, null, 2));
}

// Obtenir tous les commentaires
app.get("/commentaires", (req, res) => {
  const commentaires = lireCommentaires();
  res.json(commentaires);
});

// Ajouter un commentaire ou une réponse
app.post("/commentaires", (req, res) => {
  const { pseudo, message, parentId = null } = req.body;

  if (!pseudo || !message) {
    return res.status(400).json({ erreur: "Pseudo et message requis" });
  }

  const nouveauCommentaire = {
    id: uuidv4(),
    pseudo,
    message,
    date: new Date().toISOString(),
    parentId,
  };

  const commentaires = lireCommentaires();
  commentaires.push(nouveauCommentaire);
  sauvegarderCommentaires(commentaires);

  res.status(201).json(nouveauCommentaire);
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en écoute sur le port ${PORT}`);
});
