import { createElement } from '../utils/domHelpers.js';
import { getGroupsByUserId } from '../services/groupService.js';

export default async function renderGroups(container, onGroupSelect, showArchived = false) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;
  
  // Vider le container
  container.innerHTML = '';
  
  try {
    let groups;
    if (showArchived) {
      const { getArchivedGroups } = await import('../services/groupService.js');
      groups = await getArchivedGroups(userId);
    } else {
      groups = await getGroupsByUserId(userId);
      // Filtrer les groupes non archivés
      groups = groups.filter(group => !group.archived);
    }
    
    if (groups.length === 0) {
      const emptyState = createElement('div', 'p-4 text-center text-gray-500');
      emptyState.innerHTML = `
        <i class="fas fa-users text-4xl mb-2 block"></i>
        <p>${showArchived ? 'Aucun groupe archivé' : 'Aucun groupe trouvé'}</p>
        ${!showArchived ? '<p class="text-sm">Créez votre premier groupe !</p>' : ''}
      `;
      container.appendChild(emptyState);
      return;
    }
    
    groups.forEach(group => {
      const groupItem = createElement('div', 'p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center space-x-3');
      
      // Avatar du groupe
      const avatar = createElement('div', 'w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold');
      avatar.textContent = group.name.charAt(0).toUpperCase();
      
      // Informations du groupe
      const groupInfo = createElement('div', 'flex-1');
      const groupName = createElement('div', 'font-semibold text-gray-800', group.name);
      const memberCount = createElement('div', 'text-sm text-gray-500', `${group.members.length} membre(s)`);
      
      if (group.description) {
        const description = createElement('div', 'text-xs text-gray-400 truncate', group.description);
        groupInfo.append(groupName, description, memberCount);
      } else {
        groupInfo.append(groupName, memberCount);
      }
      
      // Badges
      const badgeContainer = createElement('div', 'flex flex-col gap-1');
      
      if (group.adminId === parseInt(userId)) {
        const adminBadge = createElement('div', 'text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-center', 'Admin');
        badgeContainer.appendChild(adminBadge);
      }
      
      if (group.archived) {
        const archivedBadge = createElement('div', 'text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-center', 'Archivé');
        badgeContainer.appendChild(archivedBadge);
      }
      
      groupItem.append(avatar, groupInfo, badgeContainer);
      
      // Gestion du clic
      groupItem.onclick = () => {
        if (onGroupSelect) {
          onGroupSelect(group);
        }
      };
      
      container.appendChild(groupItem);
    });
    
  } catch (error) {
    console.error('Erreur lors du chargement des groupes:', error);
    const errorDiv = createElement('div', 'p-4 text-center text-red-500', 'Erreur lors du chargement des groupes');
    container.appendChild(errorDiv);
  }
}