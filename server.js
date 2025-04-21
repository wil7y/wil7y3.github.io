const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = './commentaires.json';

app.use(cors());
app.use(express.json());

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

app.get('/commentaires', (req, res) => {
    const data = fs.readFileSync(filePath);
    res.json(JSON.parse(data));
});

app.post('/commentaires', (req, res) => {
    const {pseudo, message} = req.body;
    if (!pseudo || !message) {
        return res.status(400).json({ error: 'Pseudo et message requis'});
    }

    const commentaires = JSON.parse(fs.readFileSync(filePath));
    const nouveau = {
        id: Date.now(),
        pseudo,
        message,
        date: new Date().toISOString()
    };
    commentaires.push(nouveau);
    fs.writeFileSync(filePath, JSON.stringify(commentaires, null, 2));
    res.status(201).json({ success: true });
});

app.listen(PORT, () => {
    console.log('Serveur démarré sur le port ${PORT}');
});