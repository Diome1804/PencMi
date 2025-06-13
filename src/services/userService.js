


async function loadDiscussions() {
  // ...affichage des discussions avec contacts...
  const groups = await getGroups();
  const discussionsList = document.getElementById('discussions-list'); // adapte l'id
  groups.forEach(group => {
    const li = document.createElement('li');
    li.textContent = group.name + ' (Groupe)';
    li.onclick = () => openGroupChat(group); // à adapter selon ta logique
    discussionsList.appendChild(li);
  });
}// filepath: /home/lex_code/Documents/JavaScript/PencMi/src/services/userService.js
const API_URL = "https://backend-6s9s.onrender.com"; // Change this to your actual API URL

export async function getUserByPhone(phone) {
  const res = await fetch(`${API_URL}/users?phone=${encodeURIComponent(phone)}`);
  const users = await res.json();
  return users[0] || null;
}

export async function addUser(user) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return await res.json();
}