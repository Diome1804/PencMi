export default function createMenuSidebar({
  onDiscussions,
  onContacts,
  onArchives,
  onBlocked,
  onGroups, // ← AJOUTER ce paramètre
  chatHeader,
  messagesContainer,
  displayMessages,
  setSelectedContact,
  userId,
  selectedContact
}) {
  const menuSidebar = document.createElement("div");
  menuSidebar.className = "w-16 bg-gray-900 text-white flex flex-col items-center py-4 justify-center space-y-6";

  const menuItems = [
    { name: "Discussions", icon: "fa-comments", onClick: onDiscussions },
    { name: "Contacts", icon: "fa-user-friends", onClick: onContacts },
    { name: "Archivés", icon: "fa-archive", onClick: onArchives },
    { name: "Bloqués", icon: "fa-ban", onClick: onBlocked },
    { name: "Groupes", icon: "fa-users", onClick: onGroups }, // ← AJOUTER onClick: onGroups
    { name: "Diffusions", icon: "fa-bullhorn" },
    { 
      name: "Déconnexion", 
      icon: "fa-sign-out-alt", 
      onClick: () => {
        localStorage.removeItem("currentUser");
        window.location.href = "/";
      }
    },
  ];

  menuItems.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "text-xl hover:text-blue-400 focus:outline-none flex items-center justify-center w-10 h-10";
    btn.title = item.name;

    const icon = document.createElement("i");
    icon.className = `fas ${item.icon}`;
    btn.appendChild(icon);

    if (item.onClick) {
      btn.addEventListener("click", item.onClick);
    }

    menuSidebar.appendChild(btn);
  });

  return menuSidebar;
}
