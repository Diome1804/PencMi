

import {isValidPhoneNumber} from "../utils/phoneValidation"; 

const API_URL = "https://backend-6s9s.onrender.com/contacts"; // Change this to your actual API URL

export async function getContacts(userId) {
  const res = await fetch(`${API_URL}?userId=${userId}&archived=false&blocked=false`);
  return await res.json();
}

export async function getArchivedContacts(userId) {
  const res = await fetch(`${API_URL}?userId=${userId}&archived=true`);
  return await res.json();
}

export async function getBlockedContacts(userId) {
  const res = await fetch(`${API_URL}?userId=${userId}&blocked=true`);
  return await res.json();
}

export async function addContact(contact) {
  if(!isValidPhoneNumber(contact.numero)) {
    throw new Error("le numero doit etre compose de 9  chiffres");
  } 
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return await res.json();
}

export async function updateContact(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteContact(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}