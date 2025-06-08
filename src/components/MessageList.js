import { getMessagesForContact } from "../services/messageService.js";

export default function displayMessages(messagesContainer, contact) {
  messagesContainer.innerHTML = "";
  if (!contact) return;
  getMessagesForContact(contact.name).then((msgs) => {
    msgs.forEach((msg) => {
      const msgDiv = document.createElement("div");
      msgDiv.className = "flex flex-col items-end mb-2";
      const bubble = document.createElement("div");
      bubble.className =
        "self-end bg-blue-500 text-white px-4 py-2 rounded-xl max-w-xs ml-auto";
      bubble.textContent = msg.text;
      const time = document.createElement("span");
      time.className = "text-xs text-gray-400 mt-1";
      time.textContent = msg.time;
      msgDiv.appendChild(bubble);
      msgDiv.appendChild(time);
      messagesContainer.appendChild(msgDiv);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}