  import { getContacts } from '../services/contactService.js';
  import { createAvatarWithStatus } from '../utils/avatarUtils.js';

  export default async function renderContacts(
    container, 
    chatHeader, 
    messagesContainer, 
    displayMessages, 
    setSelectedContact, 
    contacts = null, 
    userId = null, 
    searchValue = ""
  ) {
    container.innerHTML = '';

    try {
      let contactList = contacts || await getContacts(userId);
    
      if (searchValue) {
        contactList = contactList.filter(contact => 
          contact.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          contact.phone.includes(searchValue)
        );
      }

      if (contactList.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'p-4 text-center text-gray-500';
        emptyState.innerHTML = `
          <i class="fas fa-user-friends text-4xl mb-2 block"></i>
          <p>Aucun contact trouvé</p>
        `;
        container.appendChild(emptyState);
        return;
      }

      contactList.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center space-x-3';

        // ← UTILISER la fonction utilitaire pour créer l'avatar
        const avatarContainer = createAvatarWithStatus(contact.name, false, 'md'); // false = pas en ligne pour l'instant

        // Informations du contact
        const contactInfo = document.createElement('div');
        contactInfo.className = 'flex-1 min-w-0';

        const contactName = document.createElement('div');
        contactName.className = 'font-semibold text-gray-800 truncate';
        contactName.textContent = contact.name;

        const contactPhone = document.createElement('div');
        contactPhone.className = 'text-sm text-gray-500 truncate';
        contactPhone.textContent = contact.phone;

        contactInfo.append(contactName, contactPhone);

        // Badges de statut
        const statusContainer = document.createElement('div');
        statusContainer.className = 'flex flex-col gap-1';

        if (contact.archived) {
          const archivedBadge = document.createElement('div');
          archivedBadge.className = 'text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-center';
          archivedBadge.textContent = 'Archivé';
          statusContainer.appendChild(archivedBadge);
        }

        if (contact.blocked) {
          const blockedBadge = document.createElement('div');
          blockedBadge.className = 'text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full text-center';
          blockedBadge.textContent = 'Bloqué';
          statusContainer.appendChild(blockedBadge);
        }

        // Assemblage
        contactItem.append(avatarContainer, contactInfo, statusContainer);

        // Gestion du clic
        contactItem.onclick = () => {
          if (setSelectedContact) {
            setSelectedContact(contact);
          }
        };

        container.appendChild(contactItem);
      });

    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'p-4 text-center text-red-500';
      errorDiv.textContent = 'Erreur lors du chargement des contacts';
      container.appendChild(errorDiv);
    }
  }