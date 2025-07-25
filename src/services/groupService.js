const API_URL = "https://backend-6s9s.onrender.com"; 


export async function getAllGroups() {
  try {
    const response = await fetch(`${API_URL}/groups`);
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return [];
  }
}

export async function getGroupsByUserId(userId) {
  try {
    const response = await fetch(`${API_URL}/groups?members_like=${userId}`);
    const groups = await response.json();
    // Filtrer pour s'assurer que l'utilisateur est vraiment membre
    return groups.filter(group => group.members.includes(userId));
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes de l\'utilisateur:', error);
    return [];
  }
}

export async function createGroup(groupData) {
  try {
    const response = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...groupData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error);
    throw error;
  }
}

export async function updateGroup(groupId, updates) {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString()
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du groupe:', error);
    throw error;
  }
}

export async function deleteGroup(groupId) {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la suppression du groupe:', error);
    throw error;
  }
}

export async function addMemberToGroup(groupId, userId) {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`);
    const group = await response.json();
    
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      return await updateGroup(groupId, { members: group.members });
    }
    return group;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    throw error;
  }
}

export async function removeMemberFromGroup(groupId, userId) {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`);
    const group = await response.json();
    
    group.members = group.members.filter(id => id !== userId);
    return await updateGroup(groupId, { members: group.members });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    throw error;
  }
}
// ... tes fonctions existantes ...

// Nouvelle fonction pour archiver un groupe
export async function archiveGroup(groupId) {
  try {
    return await updateGroup(groupId, { archived: true });
  } catch (error) {
    console.error('Erreur lors de l\'archivage du groupe:', error);
    throw error;
  }
}

// Nouvelle fonction pour récupérer les groupes archivés
export async function getArchivedGroups(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const groups = await response.json();
    
    if (!Array.isArray(groups)) {
      return [];
    }
    
    return groups.filter(group => 
      group.archived === true &&
      group.members && Array.isArray(group.members) && 
      group.members.includes(parseInt(userId))
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes archivés:', error);
    return [];
  }
}

// Fonction pour quitter un groupe
export async function leaveGroup(groupId, userId) {
  try {
    return await removeMemberFromGroup(groupId, userId);
  } catch (error) {
    console.error('Erreur lors de la sortie du groupe:', error);
    throw error;
  }
}