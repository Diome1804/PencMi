import { createElement, createButton } from '../utils/domHelpers.js';
import { STYLES } from '../constants/styles.js';
import { createLoginForm } from '../components/LoginForm.js';
import { createRegisterForm } from '../components/RegisterForm.js';

export default function createLoginPage(onLogin) {
  const container = createElement('div', STYLES.container);
  const card = createElement('div', STYLES.card);
  const logo = createElement('div', STYLES.logo, 'Bienvenu sur PencMi');
  
  // Boutons de navigation
  const btnGroup = createElement('div', STYLES.btnGroup);
  const btnConnexion = createButton('Connexion', STYLES.btnActive);
  const btnInscription = createButton('Inscription', STYLES.btnInactive);
  btnGroup.append(btnConnexion, btnInscription);

  // Formulaires
  const handleSuccess = (user) => {
    if (onLogin) onLogin(user);
    window.dispatchEvent(new Event('loginSuccess'));
  };

  const { form: loginForm, errorDiv: loginError } = createLoginForm(handleSuccess);
  const { form: registerForm, nameError, phoneError } = createRegisterForm(handleSuccess);

  // Gestion des onglets
  const switchToLogin = () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    btnConnexion.className = STYLES.btnActive;
    btnInscription.className = STYLES.btnInactive;
    clearErrors();
  };

  const switchToRegister = () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    btnConnexion.className = STYLES.btnInactive;
    btnInscription.className = STYLES.btnActive;
    clearErrors();
  };

  const clearErrors = () => {
    loginError.textContent = '';
    nameError.textContent = '';
    phoneError.textContent = '';
  };

  btnConnexion.onclick = (e) => { e.preventDefault(); switchToLogin(); };
  btnInscription.onclick = (e) => { e.preventDefault(); switchToRegister(); };

  card.append(logo, btnGroup, loginForm, registerForm);
  container.appendChild(card);
  
  return container;
}
