import { createElement, createInput, createButton } from '../utils/domHelpers.js';
import { STYLES } from '../constants/styles.js';
import { getUserByPhone } from '../services/userService.js';

export function createLoginForm(onSuccess) {
  const form = createElement('form', STYLES.form);
  const phoneInput = createInput('text', 'Numéro de téléphone', STYLES.input);
  const errorDiv = createElement('div', STYLES.error);
  const submitBtn = createButton('Se connecter', STYLES.submit, 'submit');

  form.append(phoneInput, errorDiv, submitBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    const phone = phoneInput.value.trim();
    
    if (!phone) {
      errorDiv.textContent = "Le numéro est requis.";
      return;
    }
    
    const user = await getUserByPhone(phone);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      onSuccess(user);
    } else {
      errorDiv.textContent = "Numéro inconnu. Veuillez vous inscrire.";
    }
  };

  return { form, errorDiv };
}
