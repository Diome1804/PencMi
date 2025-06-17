import { createElement } from "../utils/domHelpers.js";
import { CHAT_STYLES } from "../constants/chatStyles.js";
import { useSelectedContact } from "../hooks/useSelectedContact.js";
import { createConversationSidebar } from "../components/chat/ConversationSidebar.js";
import { createChatZone } from "../components/chat/ChatZone.js";
import displayMessages from "../components/MessageList.js";
import createChatHeader from "../components/ChatHeader.js";
import createMenuSidebar from "../components/MenuSidebar.js";
import showAddContactForm from "../components/AddContactForm.js";
import renderContacts from "../components/ContactList.js";
import { getArchivedContacts, getBlockedContacts, updateContact, deleteContact } from "../services/contactService.js";

export default function createChatPage() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  // Chargement de Font Awesome
  const faLink = createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  document.head.appendChild(faLink);

  const app = createElement("div", CHAT_STYLES.app);

  // Hook pour gérer le contact sélectionné
  const { setSelectedContact, getSelectedContact } = useSelectedContact();

  // Variables qui seront initialisées plus tard
  let conversationList;
  let messagesContainer;

  // Fonctions d'actions du chat
  const resetChat = () => {
    chatHeader.setTitle("Sélectionne un contact");
    chatHeader.setButtonsVisible(false);
    messagesContainer.innerHTML = "";
  };

  const refreshContacts = () => {
    renderContacts(
      conversationList,
      chatHeader,
      messagesContainer,
      displayMessages,
      (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId)
    );
  };

  const deleteContactAction = async () => {
    const selectedContact = getSelectedContact();
    if (selectedContact && confirm("Supprimer ce contact ?")) {
      await deleteContact(selectedContact.id);
      refreshContacts();
      resetChat();
      setSelectedContact(null, chatHeader, messagesContainer, displayMessages, userId);
    }
  };

  const archiveContactAction = async () => {
    const selectedContact = getSelectedContact();
    if (selectedContact) {
      await updateContact(selectedContact.id, { archived: true });
      refreshContacts();
      resetChat();
    }
  };

  const blockContactAction = async () => {
    const selectedContact = getSelectedContact();
    if (selectedContact) {
      await updateContact(selectedContact.id, { blocked: true });
      refreshContacts();
      resetChat();
    }
  };

  // Création du header de chat
  const chatHeader = createChatHeader(
    deleteContactAction,
    archiveContactAction,
    blockContactAction
  );

  // Création de la zone de chat
  const { chatZone, messagesContainer: msgContainer } = createChatZone(chatHeader, getSelectedContact, displayMessages, userId);
  messagesContainer = msgContainer; // Assignation de la référence

  // Création de la sidebar des conversations
  const { conversationSidebar, conversationList: convList } = createConversationSidebar(
    chatHeader, 
    messagesContainer, 
    displayMessages, 
    (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId), 
    userId
  );
  conversationList = convList; // Assignation de la référence

  // Création du menu sidebar
  const menuSidebar = createMenuSidebar({
    onDiscussions: () => {
      renderContacts(conversationList, chatHeader, messagesContainer, displayMessages, 
        (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId), 
        undefined, userId);
      const selectedContact = getSelectedContact();
      if (selectedContact) {
        chatHeader.setTitle("Discussion avec " + selectedContact.name);
        chatHeader.setButtonsVisible(true);
        displayMessages(messagesContainer, selectedContact, userId);
      } else {
        chatHeader.setTitle("Sélectionne un contact");
        chatHeader.setButtonsVisible(false);
        messagesContainer.innerHTML = "";
      }
    },
    onContacts: () => {
      showAddContactForm(() =>
        renderContacts(conversationList, chatHeader, messagesContainer, displayMessages, 
          (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId))
      );
    },
    onArchives: () => {
      getArchivedContacts(userId).then((contacts) => {
        renderContacts(conversationList, chatHeader, messagesContainer, displayMessages, 
          (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId), 
          contacts);
        chatHeader.setTitle("Contacts archivés");
        chatHeader.setButtonsVisible(false);
        messagesContainer.innerHTML = "";
      });
    },
    onBlocked: () => {
      getBlockedContacts(userId).then((contacts) => {
        renderContacts(conversationList, chatHeader, messagesContainer, displayMessages, 
          (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId), 
          contacts);
        chatHeader.setTitle("Contacts bloqués");
        chatHeader.setButtonsVisible(false);
        messagesContainer.innerHTML = "";
      });
    },
    conversationList: conversationList,
    chatHeader: chatHeader,
    messagesContainer: messagesContainer,
    displayMessages: displayMessages,
    setSelectedContact: (contact) => setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId),
    userId: userId,
    selectedContact: getSelectedContact()
  });

  // Assemblage final
  app.append(menuSidebar, conversationSidebar, chatZone);

  return app;
}