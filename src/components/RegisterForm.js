import { createElement, createInput, createButton } from '../utils/domHelpers.js';
import { STYLES } from '../constants/styles.js';
import { getUserByPhone, addUser } from '../services/userService.js';

export function createRegisterForm(onSuccess) {
  const form = createElement('form', `${STYLES.form} hidden`);
  const nameInput = createInput('text', 'Nom', STYLES.input);
  const nameError = createElement('div', STYLES.error);
  const phoneInput = createInput('text', 'Numéro de téléphone', STYLES.input);
  const phoneError = createElement('div', STYLES.error);
  const submitBtn = createButton("S'inscrire", STYLES.submit, 'submit');

  form.append(nameInput, nameError, phoneInput, phoneError, submitBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();
    nameError.textContent = '';
    phoneError.textContent = '';
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    let hasError = false;
    
    if (!name) {
      nameError.textContent = "Le nom est requis.";
      hasError = true;
    }
    if (!phone) {
      phoneError.textContent = "Le numéro est requis.";
      hasError = true;
    }
    if (hasError) return;
    
    let user = await getUserByPhone(phone);
    if (user) {
      phoneError.textContent = "Ce numéro existe déjà. Veuillez vous connecter.";
      return;
    }
    
    user = await addUser({ name, phone });
    localStorage.setItem("currentUser", JSON.stringify(user));
    onSuccess(user);
  };

  return { form, nameError, phoneError };
}
