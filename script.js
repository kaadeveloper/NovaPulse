const API_URL = window.location.hostname.includes("pages.dev")
  ? "https://novapulse-pv86.onrender.com/chat"
  : "/chat";

let chats = JSON.parse(localStorage.getItem("novapulse_chats")) || [];
let activeChatId = localStorage.getItem("novapulse_active_chat");

function saveChats() {
  localStorage.setItem("novapulse_chats", JSON.stringify(chats));
  localStorage.setItem("novapulse_active_chat", activeChatId);
}

function newChat() {
  const chat = {
    id: Date.now().toString(),
    title: "Nieuwe chat",
    messages: []
  };

  chats.unshift(chat);
  activeChatId = chat.id;
  saveChats();
  renderChatList();
  renderChat();
}

function getActiveChat() {
  return chats.find(c => c.id === activeChatId);
}

function renderChatList() {
  const list = document.getElementById("chatList");
  list.innerHTML = "";

  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "chat-item" + (chat.id === activeChatId ? " active" : "");

    item.innerHTML = `
      <span onclick="openChat('${chat.id}')">${chat.title}</span>
      <div class="chat-actions">
        <button onclick="renameChat('${chat.id}')">✏️</button>
        <button onclick="deleteChat('${chat.id}')">🗑️</button>
      </div>
    `;

    list.appendChild(item);
  });
}

function openChat(id) {
  activeChatId = id;
  saveChats();
  renderChatList();
  renderChat();
}

function renameChat(id) {
  const chat = chats.find(c => c.id === id);
  const name = prompt("Nieuwe naam voor deze chat:", chat.title);
  if (!name) return;

  chat.title = name;
  saveChats();
  renderChatList();
}

function deleteChat(id) {
  if (!confirm("Weet je zeker dat je deze chat wilt verwijderen?")) return;

  chats = chats.filter(c => c.id !== id);

  if (activeChatId === id) {
    activeChatId = chats[0]?.id || null;
  }

  if (chats.length === 0) {
    newChat();
    return;
  }

  saveChats();
  renderChatList();
  renderChat();
}

function renderChat() {
  const chatBox = document.getElementById("chat");
  const chat = getActiveChat();

  chatBox.innerHTML = "";

  if (!chat) return;

  chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.role === "user" ? "message user" : "message ai";
    div.textContent = msg.content;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();
  if (!text) return;

  let chat = getActiveChat();

  if (!chat) {
    newChat();
    chat = getActiveChat();
  }

  chat.messages.push({ role: "user", content: text });

  if (chat.title === "Nieuwe chat") {
    chat.title = text.length > 28 ? text.slice(0, 28) + "..." : text;
  }

  input.value = "";
  saveChats();
  renderChatList();
  renderChat();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    chat.messages.push({
      role: "ai",
      content: data.reply || "NovaPulse AI kon geen antwoord ophalen."
    });

  } catch (error) {
    chat.messages.push({
      role: "ai",
      content: "Fout: kan geen verbinding maken met NovaPulse AI."
    });
  }

  saveChats();
  renderChatList();
  renderChat();
}

if (chats.length === 0) {
  newChat();
} else {
  activeChatId = activeChatId || chats[0].id;
  renderChatList();
  renderChat();
}
