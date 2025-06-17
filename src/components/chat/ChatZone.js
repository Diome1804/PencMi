import { createElement } from '../../utils/domHelpers.js';
import { CHAT_STYLES } from '../../constants/chatStyles.js';
import { createMessageForm } from './MessageForm.js';

export function createChatZone(chatHeader, getSelectedContact, displayMessages, userId) {
  const chatZone = createElement('div', CHAT_STYLES.chatZone);
  const messagesContainer = createElement('div', CHAT_STYLES.messagesContainer);
  
  const messageForm = createMessageForm(getSelectedContact, messagesContainer, displayMessages, userId);

  chatZone.append(chatHeader, messagesContainer, messageForm);

  return { chatZone, messagesContainer };
}
