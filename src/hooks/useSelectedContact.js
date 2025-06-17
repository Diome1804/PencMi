export function useSelectedContact() {
  let selectedContact = null;

  const setSelectedContact = (contact, chatHeader, messagesContainer, displayMessages, userId) => {
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

  const getSelectedContact = () => selectedContact;

  return { setSelectedContact, getSelectedContact };
}
