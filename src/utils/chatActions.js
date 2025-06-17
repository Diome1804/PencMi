import { updateContact, deleteContact } from '../services/contactService.js';

export function createChatActions() {
  const deleteContactAction = async (selectedContact, onSuccess) => {
    if (selectedContact && confirm("Supprimer ce contact ?")) {
      await deleteContact(selectedContact.id);
      if (onSuccess) onSuccess();
      return true; // Contact supprimé
    }
    return false;
  };

  const archiveContactAction = async (selectedContact, onSuccess) => {
    if (selectedContact) {
      await updateContact(selectedContact.id, { archived: true });
      if (onSuccess) onSuccess();
      return true;
    }
    return false;
  };

  const blockContactAction = async (selectedContact, onSuccess) => {
    if (selectedContact) {
      await updateContact(selectedContact.id, { blocked: true });
      if (onSuccess) onSuccess();
      return true;
    }
    return false;
  };

  return { deleteContactAction, archiveContactAction, blockContactAction };
}
