const backendURL = "https://wil7y3-github-io.onrender.com"; // à adapter

async function chargerCommentaires() {
  const res = await fetch(`${backendURL}/commentaires`);
  const commentaires = await res.json();
  const liste = document.getElementById('commentList');
  liste.innerHTML = '';
  commentaires.reverse().forEach(c => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${c.pseudo}</strong> : ${c.message} <br><small>${new Date(c.date).toLocaleString()}</small>`;
    liste.appendChild(item);
  });
}

document.getElementById('commentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pseudo = document.getElementById('pseudo').value;
  const message = document.getElementById('message').value;

  await fetch(`${backendURL}/commentaires`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pseudo, message })
  });

  document.getElementById('pseudo').value = '';
  document.getElementById('message').value = '';
  chargerCommentaires();
});

chargerCommentaires();
