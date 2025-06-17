// Couleurs prédéfinies pour les avatars
export const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
  'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
];

/**
 * Génère une couleur d'avatar basée sur le nom
 * @param {string} name - Le nom de la personne
 * @returns {string} - La classe CSS de couleur
 */
export function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Génère les initiales à partir du nom
 * @param {string} name - Le nom complet
 * @returns {string} - Les initiales (max 2 caractères)
 */
export function getInitials(name) {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Crée un élément avatar
 * @param {string} name - Le nom de la personne
 * @param {string} size - Taille de l'avatar ('sm', 'md', 'lg')
 * @param {string} customColor - Couleur personnalisée (optionnel)
 * @returns {HTMLElement} - L'élément avatar
 */
export function createAvatar(name, size = 'md', customColor = null) {
  const avatar = document.createElement('div');
  
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg', 
    lg: 'w-16 h-16 text-xl'
  };
  
  const color = customColor || getAvatarColor(name);
  const initials = getInitials(name);
  
  avatar.className = `${sizes[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${color}`;
  avatar.textContent = initials;
  avatar.title = name; // Tooltip avec le nom complet
  
  return avatar;
}

/**
 * Crée un avatar avec indicateur de statut
 * @param {string} name - Le nom de la personne
 * @param {boolean} isOnline - Statut en ligne
 * @param {string} size - Taille de l'avatar
 * @returns {HTMLElement} - Container avec avatar et indicateur
 */
export function createAvatarWithStatus(name, isOnline = false, size = 'md') {
  const container = document.createElement('div');
  container.className = 'relative';
  
  const avatar = createAvatar(name, size);
  container.appendChild(avatar);
  
  if (isOnline) {
    const indicator = document.createElement('div');
    const indicatorSizes = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };
    
    indicator.className = `${indicatorSizes[size]} bg-green-400 rounded-full border-2 border-white absolute -bottom-1 -right-1`;
    container.appendChild(indicator);
  }
  
  return container;
}
