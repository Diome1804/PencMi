import { createElement } from "../utils/domHelpers.js";
import { CHAT_STYLES } from "../constants/chatStyles.js";
import { useSelectedContact } from "../hooks/useSelectedContact.js";
import { createConversationSidebar } from "../components/chat/ConversationSidebar.js";
import { createChatZone } from "../components/chat/ChatZone.js";
import displayMessages from "../components/MessageList.js";
import createChatHeader from "../components/chat/ChatHeader.js";
import createMenuSidebar from "../components/MenuSidebar.js";
import showAddContactForm from "../components/AddContactForm.js";
import renderContacts from "../components/ContactList.js";
import { getArchivedContacts, getBlockedContacts, updateContact, deleteContact } from "../services/contactService.js";
import showCreateGroupForm from "../components/CreateGroupForm.js";
import renderGroups from "../components/GroupList.js";
import { archiveGroup, deleteGroup, leaveGroup, getArchivedGroups } from "../services/groupService.js";

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

  // Variable pour le groupe sélectionné
  let selectedGroup = null;

  // Fonctions d'actions du chat
  const resetChat = () => {
    chatHeader.setTitle("Sélectionne un contact");
    chatHeader.setButtonsVisible(false);
    chatHeader.setGroupButtonsVisible(false); // ← Ajouter cette ligne
    messagesContainer.innerHTML = "";
  };

  const refreshContacts = () => {
    renderContacts(
      conversationList,
      chatHeader,
      messagesContainer,
      displayMessages,
      (contact) => {
        selectedGroup = null; // ← Réinitialiser le groupe
        setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
        // Masquer les boutons de groupe quand on sélectionne un contact
        chatHeader.setGroupButtonsVisible(false);
      }
    );
  };

  // ← NOUVELLE fonction pour gérer la sélection de groupe
  const setSelectedGroup = (group) => {
    console.log('Groupe sélectionné:', group); // ← Debug
    selectedGroup = group;
    
    // Réinitialiser le contact sélectionné
    setSelectedContact(null, chatHeader, messagesContainer, displayMessages, userId);
    
    if (selectedGroup) {
      console.log('Affichage du groupe:', selectedGroup.name); // ← Debug
      chatHeader.setTitle(`Groupe: ${selectedGroup.name}`);
      chatHeader.setButtonsVisible(false); // Masquer les boutons de contact
      chatHeader.setGroupButtonsVisible(true, selectedGroup.adminId === parseInt(userId)); // Afficher les boutons de groupe
      messagesContainer.innerHTML = `
        <div class="p-4 text-center text-gray-500">
          <i class="fas fa-users text-4xl mb-2 block"></i>
          <p>Messages du groupe "${selectedGroup.name}"</p>
          <p class="text-sm">Fonctionnalité à implémenter</p>
        </div>
      `;
    }
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

  // Actions pour les groupes
  const leaveGroupAction = async () => {
    if (selectedGroup && confirm(`Quitter le groupe "${selectedGroup.name}" ?`)) {
      try {
        await leaveGroup(selectedGroup.id, userId);
        alert('Vous avez quitté le groupe');
        renderGroups(conversationList, setSelectedGroup);
        chatHeader.setTitle("Mes groupes");
        chatHeader.setGroupButtonsVisible(false);
        messagesContainer.innerHTML = "";
        selectedGroup = null;
      } catch (error) {
        alert('Erreur lors de la sortie du groupe');
      }
    }
  };

  const archiveGroupAction = async () => {
    if (selectedGroup && confirm(`Archiver le groupe "${selectedGroup.name}" ?`)) {
      try {
        await archiveGroup(selectedGroup.id);
        alert('Groupe archivé');
        renderGroups(conversationList, setSelectedGroup);
        chatHeader.setTitle("Mes groupes");
        chatHeader.setGroupButtonsVisible(false);
        messagesContainer.innerHTML = "";
        selectedGroup = null;
      } catch (error) {
        alert('Erreur lors de l\'archivage du groupe');
      }
    }
  };

  const deleteGroupAction = async () => {
    if (selectedGroup && selectedGroup.adminId === parseInt(userId) && 
        confirm(`Supprimer définitivement le groupe "${selectedGroup.name}" ?`)) {
      try {
        await deleteGroup(selectedGroup.id);
        alert('Groupe supprimé');
        renderGroups(conversationList, setSelectedGroup);
        chatHeader.setTitle("Mes groupes");
        chatHeader.setGroupButtonsVisible(false);
        messagesContainer.innerHTML = "";
        selectedGroup = null;
      } catch (error) {
        alert('Erreur lors de la suppression du groupe');
      }
    }
  };

  // Création du header de chat
  const chatHeader = createChatHeader(
    deleteContactAction,
    archiveContactAction,
    blockContactAction,
    leaveGroupAction,
    deleteGroupAction,
    archiveGroupAction
  );

  // Création de la zone de chat
  const { chatZone, messagesContainer: msgContainer } = createChatZone(chatHeader, getSelectedContact, displayMessages, userId);
  messagesContainer = msgContainer;

  // Création de la sidebar des conversations
  const { conversationSidebar, conversationList: convList } = createConversationSidebar(
    chatHeader,
    messagesContainer,
    displayMessages,
    (contact) => {
      selectedGroup = null; // Réinitialiser le groupe
      setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
      chatHeader.setGroupButtonsVisible(false); // Masquer les boutons de groupe
    },
    userId
  );
  conversationList = convList;

  // Création du menu sidebar
  const menuSidebar = createMenuSidebar({
    onDiscussions: () => {
      selectedGroup = null;
      renderContacts(conversationList, chatHeader, messagesContainer, displayMessages,
        (contact) => {
          selectedGroup = null;
          setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
          chatHeader.setGroupButtonsVisible(false);
        },
        undefined, userId);
      const selectedContact = getSelectedContact();
      if (selectedContact) {
        chatHeader.setTitle("Discussion avec " + selectedContact.name);
        chatHeader.setButtonsVisible(true);
        chatHeader.setGroupButtonsVisible(false);
        displayMessages(messagesContainer, selectedContact, userId);
      } else {
        chatHeader.setTitle("Sélectionne un contact");
        chatHeader.setButtonsVisible(false);
        chatHeader.setGroupButtonsVisible(false);
        messagesContainer.innerHTML = "";
      }
    },

    onContacts: () => {
      selectedGroup = null;
      showAddContactForm(() =>
        renderContacts(conversationList, chatHeader, messagesContainer, displayMessages,
          (contact) => {
            selectedGroup = null;
            setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
            chatHeader.setGroupButtonsVisible(false);
          })
      );
    },

    onArchives: () => {
      selectedGroup = null;
      getArchivedContacts(userId).then((contacts) => {
        renderContacts(conversationList, chatHeader, messagesContainer, displayMessages,
          (contact) => {
            selectedGroup = null;
            setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
            chatHeader.setGroupButtonsVisible(false);
          },
          contacts);
        chatHeader.setTitle("Contacts archivés");
        chatHeader.setButtonsVisible(false);
        chatHeader.setGroupButtonsVisible(false);
        messagesContainer.innerHTML = "";
      });
    },

    onBlocked: () => {
      selectedGroup = null;
      getBlockedContacts(userId).then((contacts) => {
        renderContacts(conversationList, chatHeader, messagesContainer, displayMessages,
          (contact) => {
            selectedGroup = null;
            setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
            chatHeader.setGroupButtonsVisible(false);
          },
          contacts);
        chatHeader.setTitle("Contacts bloqués");
        chatHeader.setButtonsVisible(false);
        chatHeader.setGroupButtonsVisible(false);
        messagesContainer.innerHTML = "";
      });
    },

    onGroups: () => {
      console.log('Clic sur Groupes'); // ← Debug
      // Réinitialiser le contact sélectionné
      setSelectedContact(null, chatHeader, messagesContainer, displayMessages, userId);
      
      renderGroups(conversationList, setSelectedGroup);
      
      chatHeader.setTitle("Mes groupes");
      chatHeader.setButtonsVisible(false);
      chatHeader.setGroupButtonsVisible(false);
      messagesContainer.innerHTML = "";
      selectedGroup = null;
      
      const createGroupBtn = createElement('button', 'w-full p-3 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2 mb-2');
      createGroupBtn.innerHTML = '<i class="fas fa-plus"></i><span>Créer un groupe</span>';
      createGroupBtn.onclick = () => {
        showCreateGroupForm(() => {
          renderGroups(conversationList, setSelectedGroup);
        });
      };
      
      conversationList.insertBefore(createGroupBtn, conversationList.firstChild);
    },

    conversationList: conversationList,
    chatHeader: chatHeader,
    messagesContainer: messagesContainer,
    displayMessages: displayMessages,
    setSelectedContact: (contact) => {
      selectedGroup = null;
      setSelectedContact(contact, chatHeader, messagesContainer, displayMessages, userId);
      chatHeader.setGroupButtonsVisible(false);
    },
    userId: userId,
    selectedContact: getSelectedContact()
  });

  // Assemblage final
  app.append(menuSidebar, conversationSidebar, chatZone);

  return app;
}
