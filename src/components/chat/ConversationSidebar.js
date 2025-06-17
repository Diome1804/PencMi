import { createElement, createInput } from '../../utils/domHelpers.js';
import { CHAT_STYLES } from '../../constants/chatStyles.js';
import renderContacts from '../ContactList.js';

export function createConversationSidebar(chatHeader, messagesContainer, displayMessages, setSelectedContact, userId) {
  const conversationSidebar = createElement('div', CHAT_STYLES.conversationSidebar);

  // Barre de recherche
  const searchBar = createElement('div', CHAT_STYLES.searchBar);
  const searchInput = createInput('text', 'Rechercher...', CHAT_STYLES.searchInput);
  searchBar.appendChild(searchInput);

  // Liste des conversations
  const conversationList = createElement('div', CHAT_STYLES.conversationList);

  // Gestion de la recherche
  searchInput.addEventListener("input", (e) => {
    const searchValue = e.target.value;
    renderContacts(
      conversationList,
      chatHeader,
      messagesContainer,
      displayMessages,
      setSelectedContact,
      undefined,
      userId,
      searchValue
    );
  });

  // Rendu initial des contacts
  renderContacts(
    conversationList,
    chatHeader,
    messagesContainer,
    displayMessages,
    setSelectedContact,
    undefined,
    userId
  );

  conversationSidebar.append(searchBar, conversationList);

  return { conversationSidebar, conversationList };
}
