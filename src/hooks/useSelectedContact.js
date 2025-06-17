export function useSelectedContact() {
  let selectedContact = null;

  const setSelectedContact = (contact, chatHeader = null, messagesContainer = null, displayMessages = null, userId = null) => {
    selectedContact = contact;
    
    // Vérifier que chatHeader existe avant d'appeler setTitle
    if (chatHeader && chatHeader.setTitle) {
      if (selectedContact) {
        localStorage.setItem("selectedContactId", selectedContact.id);
        chatHeader.setTitle("Discussion avec " + selectedContact.name);
        chatHeader.setButtonsVisible(true);
        if (displayMessages && messagesContainer && userId) {
          displayMessages(messagesContainer, selectedContact, userId);
        }
      } else {
        localStorage.removeItem("selectedContactId");
        chatHeader.setTitle("Sélectionne un contact");
        chatHeader.setButtonsVisible(false);
        if (messagesContainer) {
          messagesContainer.innerHTML = "";
        }
      }
    }
  };

  const getSelectedContact = () => selectedContact;

  return { setSelectedContact, getSelectedContact };
}