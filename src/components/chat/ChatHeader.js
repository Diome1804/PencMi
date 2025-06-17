export default function createChatHeader(onDelete, onArchive, onBlock, onLeaveGroup, onDeleteGroup, onArchiveGroup) {
  const chatHeader = document.createElement("div");
  chatHeader.className = "p-4 bg-blue-600 text-white font-semibold shadow flex justify-between items-center";
  chatHeader.style.height = "80px";

  // Titre à gauche
  const title = document.createElement("span");
  title.textContent = "Sélectionne un contact";
  chatHeader.appendChild(title);

  // Groupe de boutons à droite (contacts)
  const contactBtnGroup = document.createElement("div");
  contactBtnGroup.className = "flex gap-3";

  // Boutons pour contacts
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "hover:text-red-400";
  deleteBtn.title = "Supprimer";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  if (onDelete) deleteBtn.onclick = onDelete;
  contactBtnGroup.appendChild(deleteBtn);

  const archiveBtn = document.createElement("button");
  archiveBtn.className = "hover:text-yellow-300";
  archiveBtn.title = "Archiver";
  archiveBtn.innerHTML = '<i class="fas fa-archive"></i>';
  if (onArchive) archiveBtn.onclick = onArchive;
  contactBtnGroup.appendChild(archiveBtn);

  const blockBtn = document.createElement("button");
  blockBtn.className = "hover:text-gray-300";
  blockBtn.title = "Bloquer";
  blockBtn.innerHTML = '<i class="fas fa-ban"></i>';
  if (onBlock) blockBtn.onclick = onBlock;
  contactBtnGroup.appendChild(blockBtn);

  // Groupe de boutons pour groupes
  const groupBtnGroup = document.createElement("div");
  groupBtnGroup.className = "flex gap-3";

  const leaveGroupBtn = document.createElement("button");
  leaveGroupBtn.className = "hover:text-yellow-300";
  leaveGroupBtn.title = "Quitter le groupe";
  leaveGroupBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
  if (onLeaveGroup) leaveGroupBtn.onclick = onLeaveGroup;
  groupBtnGroup.appendChild(leaveGroupBtn);

  const archiveGroupBtn = document.createElement("button");
  archiveGroupBtn.className = "hover:text-gray-300";
  archiveGroupBtn.title = "Archiver le groupe";
  archiveGroupBtn.innerHTML = '<i class="fas fa-archive"></i>';
  if (onArchiveGroup) archiveGroupBtn.onclick = onArchiveGroup;
  groupBtnGroup.appendChild(archiveGroupBtn);

  const deleteGroupBtn = document.createElement("button");
  deleteGroupBtn.className = "hover:text-red-400";
  deleteGroupBtn.title = "Supprimer le groupe";
  deleteGroupBtn.innerHTML = '<i class="fas fa-trash"></i>';
  if (onDeleteGroup) deleteGroupBtn.onclick = onDeleteGroup;
  groupBtnGroup.appendChild(deleteGroupBtn);

  chatHeader.appendChild(contactBtnGroup);
  chatHeader.appendChild(groupBtnGroup);

  // Méthodes utilitaires
  chatHeader.setTitle = (txt) => { title.textContent = txt; };
  
  chatHeader.setButtonsVisible = (visible) => {
    contactBtnGroup.style.display = visible ? "flex" : "none";
  };
  
  // Nouvelle méthode pour les boutons de groupe
  chatHeader.setGroupButtonsVisible = (visible, isAdmin = false) => {
    groupBtnGroup.style.display = visible ? "flex" : "none";
    // Seul l'admin peut supprimer le groupe
    deleteGroupBtn.style.display = (visible && isAdmin) ? "block" : "none";
  };
  
  chatHeader.setButtonsVisible(false);
  chatHeader.setGroupButtonsVisible(false);

  return chatHeader;
}
