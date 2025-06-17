import { createElement, createInput, createButton } from '../utils/domHelpers.js';
import { createGroup } from '../services/groupService.js';
import { getContacts } from '../services/contactService.js';

export default function showCreateGroupForm(onGroupCreated) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  // Overlay
  const overlay = createElement('div', 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50');
  
  // Modal
  const modal = createElement('div', 'bg-white rounded-lg p-6 w-full max-w-md mx-4');
  
  // Titre
  const title = createElement('h2', 'text-xl font-bold mb-4 text-gray-800', 'Créer un groupe');
  
  // Formulaire
  const form = createElement('form', 'space-y-4');
  
  // Nom du groupe
  const nameInput = createInput('text', 'Nom du groupe', 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400');
  nameInput.required = true;
  
  // Description du groupe
  const descriptionInput = createElement('textarea', 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none');
  descriptionInput.placeholder = 'Description du groupe (optionnel)';
  descriptionInput.rows = 3;
  
  // Section des membres
  const membersSection = createElement('div', 'space-y-2');
  const membersLabel = createElement('label', 'block text-sm font-medium text-gray-700', 'Sélectionner les membres :');
  const membersContainer = createElement('div', 'max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1');
  
  // Charger les contacts
  loadContacts();
  
  async function loadContacts() {
    try {
      const contacts = await getContacts(userId);
      contacts.forEach(contact => {
        const memberItem = createElement('div', 'flex items-center space-x-2');
        
        const checkbox = createElement('input', 'rounded');
        checkbox.type = 'checkbox';
        checkbox.value = contact.contactUserId;
        checkbox.id = `member-${contact.id}`;
        
        const label = createElement('label', 'text-sm text-gray-700 cursor-pointer');
        label.htmlFor = `member-${contact.id}`;
        label.textContent = contact.name;
        
        memberItem.append(checkbox, label);
        membersContainer.appendChild(memberItem);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
    }
  }
  
  // Messages d'erreur
  const errorDiv = createElement('div', 'text-red-500 text-sm min-h-[20px]');
  
  // Boutons
  const buttonGroup = createElement('div', 'flex gap-3 justify-end');
  const cancelBtn = createButton('Annuler', 'px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50');
  const createBtn = createButton('Créer le groupe', 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700', 'submit');
  
  buttonGroup.append(cancelBtn, createBtn);
  
  // Assemblage du formulaire
  membersSection.append(membersLabel, membersContainer);
  form.append(nameInput, descriptionInput, membersSection, errorDiv, buttonGroup);
  modal.append(title, form);
  overlay.appendChild(modal);
  
  // Gestion des événements
  cancelBtn.onclick = (e) => {
    e.preventDefault();
    document.body.removeChild(overlay);
  };
  
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  };
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    
    const groupName = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!groupName) {
      errorDiv.textContent = 'Le nom du groupe est requis.';
      return;
    }
    
    // Récupérer les membres sélectionnés
    const selectedMembers = [];
    const checkboxes = membersContainer.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
      selectedMembers.push(parseInt(checkbox.value));
    });
    
    // Ajouter le créateur du groupe
    selectedMembers.push(userId);
    
    try {
      const groupData = {
        name: groupName,
        description: description || '',
        members: selectedMembers,
        adminId: userId,
        avatar: '',
      };
      
      const newGroup = await createGroup(groupData);
      document.body.removeChild(overlay);
      
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }
      
      alert('Groupe créé avec succès !');
    } catch (error) {
      errorDiv.textContent = 'Erreur lors de la création du groupe.';
      console.error('Erreur:', error);
    }
  };
  
  document.body.appendChild(overlay);
}
