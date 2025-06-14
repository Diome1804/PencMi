export function isValidPhoneNumber(number) {
  // Vérifie que le numéro contient exactement 9 chiffres
  return /^\d{9}$/.test(number);
}