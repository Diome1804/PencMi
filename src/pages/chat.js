import showAddContactForm from "../components/AddContactForm.js";
import renderContacts from "../components/ContactList.js";
import displayMessages from "../components/MessageList.js";
import createChatHeader from "../components/ChatHeader.js";
import { addMessage } from "../services/messageService.js";
import { getArchivedContacts, getBlockedContacts, updateContact, deleteContact } from "../services/contactService.js";
import createMenuSidebar from "../components/MenuSidebar.js";

export default function createChatPage() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  const app = document.createElement("div");
  app.className = "flex h-screen w-screen";

  // === Load Font Awesome ===
  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  document.head.appendChild(faLink);

  // === Secondary Sidebar (Liste de discussions) ===
  const conversationSidebar = document.createElement("div");
  conversationSidebar.className = "w-1/4 bg-white border-r flex flex-col";

  const searchBar = document.createElement("div");
  searchBar.className = "p-4 border-b";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Rechercher...";
  searchInput.className =
    "w-full px-4 py-2 border rounded-lg focus:outline-none";
  searchBar.appendChild(searchInput);

  const conversationList = document.createElement("div");
  conversationList.className = "flex-1 overflow-y-auto";

  // 1. Crée d'abord messagesContainer
  const messagesContainer = document.createElement("div");
  messagesContainer.className = "flex-1 overflow-y-auto p-4 space-y-2";

  // 2. Crée le header AVANT le menuSidebar
  let selectedContact = null;
  const setSelectedContact = (contact) => {
    selectedContact = contact;
    if (selectedContact) {
      localStorage.setItem("selectedContactId", selectedContact.id);
      chatHeader.setTitle("Discussion avec " + selectedContact.name);
      chatHeader.setButtonsVisible(true);
      displayMessages(messagesContainer, selectedContact, userId);
    } else {
      localStorage.removeItem("selectedContactId");
      chatHeader.setTitle("Sélectionne un contact");
      chatHeader.setButtonsVisible(false);
      messagesContainer.innerHTML = "";
    }
  };

  const chatHeader = createChatHeader(
    async () => {
      if (selectedContact && confirm("Supprimer ce contact ?")) {
        await deleteContact(selectedContact.id);
        renderContacts(
          conversationList,
          chatHeader,
          messagesContainer,
          displayMessages,
          setSelectedContact
        );
        chatHeader.setTitle("Sélectionne un contact");
        chatHeader.setButtonsVisible(false);
        messagesContainer.innerHTML = "";
        selectedContact = null;
      }
    },
    async () => {
      if (selectedContact) {
        await updateContact(selectedContact.id, { archived: true });
        renderContacts(
          conversationList,
          chatHeader,
          messagesContainer,
          displayMessages,
          setSelectedContact
        );
        chatHeader.setTitle("Sélectionne un contact");
        chatHeader.setButtonsVisible(false);
      }
    },
    async () => {
      if (selectedContact) {
        await updateContact(selectedContact.id, { blocked: true });
        renderContacts(
          conversationList,
          chatHeader,
          messagesContainer,
          displayMessages,
          setSelectedContact
        );
        chatHeader.setTitle("Sélectionne un contact");
        chatHeader.setButtonsVisible(false);
      }
    }
  );

  // 3. Crée le menuSidebar ensuite
  const menuSidebar = createMenuSidebar({
    onDiscussions: () => {
      renderContacts(
        conversationList,
        chatHeader,
        messagesContainer,
        displayMessages,
        setSelectedContact,
        undefined,
        userId
      );
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
        renderContacts(
          conversationList,
          chatHeader,
          messagesContainer,
          displayMessages,
          setSelectedContact
        )
      );
    },
    onArchives: () => {
      getArchivedContacts(userId).then((contacts) => {
        renderContacts(
          conversationList,
          chatHeader,
          messagesContainer,
          displayMessages,
          setSelectedContact,
          contacts
        );
        chatHeader.setTitle("Contacts archivés");
        chatHeader.setButtonsVisible(false);
        messagesContainer.innerHTML = "";
      });
    },
    onBlocked: () => {
      getBlockedContacts(userId).then((contacts) => {
        renderContacts(
          conversationList,
          chatHeader,
          messagesContainer,
          displayMessages,
          setSelectedContact,
          contacts
        );
        chatHeader.setTitle("Contacts bloqués");
        chatHeader.setButtonsVisible(false);
        messagesContainer.innerHTML = "";
      });
    },
    conversationList,
    chatHeader,
    messagesContainer,
    displayMessages,
    setSelectedContact,
    userId,
    selectedContact
  });

  // Affiche la liste des contacts au démarrage
  renderContacts(
    conversationList,
    chatHeader,
    messagesContainer,
    displayMessages,
    setSelectedContact,
    undefined,
    userId
  );

  // Après avoir chargé les contacts (après renderContacts)
  const selectedContactId = localStorage.getItem("selectedContactId");
  if (selectedContactId) {
    // Optionnel : tu peux sélectionner le contact ici si tu veux
  }

  conversationSidebar.appendChild(searchBar);
  conversationSidebar.appendChild(conversationList);

  // Formulaire de message natif
  const form = document.createElement("form");
  form.className = "flex items-center p-4 bg-white border-t w-full px-30";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Écris un message";
  input.className =
    "flex-1 px-4 py-2 border rounded-full mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400";
  input.required = true;

  const button = document.createElement("button");
  button.type = "submit";
  button.className =
    "bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700";

  const icon = document.createElement("i");
  icon.className = "fas fa-paper-plane";
  button.appendChild(icon);

  form.appendChild(input);
  form.appendChild(button);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
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
      displayMessages(messagesContainer, selectedContact, userId); // Rafraîchit l'affichage
      input.value = "";
    }
  });

  // === Zone principale de chat ===
  const chatZone = document.createElement("div");
  chatZone.className = "flex-1 flex flex-col bg-gray-100";

  // Ajoute les éléments à chatZone
  chatZone.appendChild(chatHeader);
  chatZone.appendChild(messagesContainer);
  chatZone.appendChild(form); // Ajoute le formulaire natif

  // Assemblage final
  app.appendChild(menuSidebar);
  app.appendChild(conversationSidebar);
  app.appendChild(chatZone);

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
      searchValue // <-- Passe la valeur ici
    );
  });

  return app;
}
