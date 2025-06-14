import { addContact } from "../services/contactService.js";

export default function showAddContactForm(onContactAdded) {
  if (document.getElementById("addContactForm")) return;

  const form = document.createElement("form");
  form.id = "addContactForm";
  form.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50";

  const box = document.createElement("div");
  box.className =
    "bg-white p-8 rounded-xl shadow-xl flex flex-col gap-4 min-w-[300px]";

  const title = document.createElement("h2");
  title.textContent = "Ajouter un contact";
  title.className = "text-xl font-bold mb-2 text-blue-700";
  box.appendChild(title);

  // Message d'erreur
  const errorMsg = document.createElement("p");
  errorMsg.className = "text-red-600 text-sm mb-2 hidden";
  errorMsg.textContent = "Tous les champs sont obligatoires.";
  box.appendChild(errorMsg);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Nom du contact";
  nameInput.className = "border rounded px-3 py-2";
  box.appendChild(nameInput);

  const phoneInput = document.createElement("input");
  phoneInput.type = "tel";
  phoneInput.placeholder = "Numéro de téléphone";
  phoneInput.className = "border rounded px-3 py-2";
  box.appendChild(phoneInput);

  const btns = document.createElement("div");
  btns.className = "flex gap-2 justify-end";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Annuler";
  cancelBtn.className = "px-4 py-2 rounded bg-gray-200 hover:bg-gray-300";
  cancelBtn.onclick = () => form.remove();
  btns.appendChild(cancelBtn);

  const addBtn = document.createElement("button");
  addBtn.type = "submit";
  addBtn.textContent = "Ajouter";
  addBtn.className = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700";
  btns.appendChild(addBtn);

  box.appendChild(btns);
  form.appendChild(box);

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorMsg.classList.add("hidden"); // Cache le message d'erreur au début

    // Vérifie si tous les champs sont remplis
    if (!nameInput.value.trim() || !phoneInput.value.trim()) {
      errorMsg.textContent = "Tous les champs sont obligatoires.";
      errorMsg.classList.remove("hidden");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    try {
      await addContact({
        userId: currentUser.id,
        name: nameInput.value,
        numero: phoneInput.value,
        archived: false,
        blocked: false
      });
      form.remove();
      if (onContactAdded) onContactAdded();
    } catch (err) {
      errorMsg.textContent = err.message;
      errorMsg.classList.remove("hidden");
    }
  };

  document.body.appendChild(form);
}