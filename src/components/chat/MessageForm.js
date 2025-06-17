import { createElement, createInput, createButton } from '../../utils/domHelpers.js';
import { CHAT_STYLES } from '../../constants/chatStyles.js';
import { addMessage } from '../../services/messageService.js';

export function createMessageForm(getSelectedContact, messagesContainer, displayMessages, userId) {
  const form = createElement('form', CHAT_STYLES.messageForm);

  const input = createInput('text', 'Écris un message', CHAT_STYLES.messageInput);
  input.required = true;

  const button = createButton('', CHAT_STYLES.sendButton, 'submit');
  const icon = createElement('i', CHAT_STYLES.sendIcon);
  button.appendChild(icon);

  form.append(input, button);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    const selectedContact = getSelectedContact();
    
    if (!selectedContact) {
      alert("Sélectionne un contact d'abord !");
      return;
    }
    
    if (text) {
      await addMessage({
        userId,
        contactId: selectedContact.id,
        text,
        timestamp: Date.now(),
        read: false
      });
      displayMessages(messagesContainer, selectedContact, userId);
      input.value = "";
    }
  });

  return form;
}
