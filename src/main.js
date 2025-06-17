
import createLoginPage from './pages/login.js';
import createChatPage from './pages/chat.js';
import './styles/index.css';

document.body.className = 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen flex items-center justify-center';

// Fonction pour afficher la bonne page selon la connexion
function renderApp() {
  document.body.innerHTML = '';
  document.body.className = 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen flex items-center justify-center';
  const user = localStorage.getItem('currentUser');
  if (user) {
    document.body.appendChild(createChatPage());
  } else {
    document.body.appendChild(createLoginPage());
  }
}

// Premier affichage
renderApp();

// Quand l'utilisateur se connecte
window.addEventListener('loginSuccess', renderApp);
