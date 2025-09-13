let users = JSON.parse(localStorage.getItem("users")) || [];
let chats = JSON.parse(localStorage.getItem("chats")) || {};
let currentUser = localStorage.getItem("currentUser");

// Registrar usuário
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  if (!username || !password) {
    msg.textContent = "Preencha tudo!";
    return;
  }

  if (users.find(u => u.username === username)) {
    msg.textContent = "Usuário já existe!";
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  msg.textContent = "Registrado! Agora faça login.";
}

// Login
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    msg.textContent = "Usuário ou senha inválidos!";
    return;
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "chats.html";
}

// Mostrar lista de conversas
if (window.location.pathname.includes("chats.html")) {
  const list = document.getElementById("chat-list");

  function renderChats() {
    list.innerHTML = "";
    const userChats = Object.keys(chats).filter(c => c.includes(currentUser));
    userChats.forEach(chatId => {
      const other = chatId.replace(currentUser, "").replace("-", "");
      const li = document.createElement("li");
      li.textContent = other;
      li.onclick = () => {
        localStorage.setItem("currentChat", chatId);
        window.location.href = "chat.html";
      };
      list.appendChild(li);
    });
  }

  renderChats();

  window.addChat = function() {
    const newChat = document.getElementById("new-chat").value.trim();
    if (!newChat || !users.find(u => u.username === newChat)) return;
    const chatId = [currentUser, newChat].sort().join("-");
    if (!chats[chatId]) chats[chatId] = [];
    localStorage.setItem("chats", JSON.stringify(chats));
    renderChats();
    document.getElementById("new-chat").value = "";
  };
}

// Tela de chat
if (window.location.pathname.includes("chat.html")) {
  const chatId = localStorage.getItem("currentChat");
  const messages = chats[chatId] || [];
  const msgDiv = document.getElementById("messages");
  const title = document.getElementById("chat-title");

  const other = chatId.split("-").find(u => u !== currentUser);
  title.textContent = other;

  function renderMessages() {
    msgDiv.innerHTML = "";
    messages.forEach(m => {
      const div = document.createElement("div");
      div.classList.add("message");
      div.classList.add(m.user === currentUser ? "sent" : "received");
      div.textContent = `${m.user}: ${m.text}`;
      msgDiv.appendChild(div);
    });
    msgDiv.scrollTop = msgDiv.scrollHeight;
  }

  window.sendMessage = function() {
    const input = document.getElementById("msg-input");
    const text = input.value.trim();
    if (!text) return;

    messages.push({ user: currentUser, text });
    chats[chatId] = messages;
    localStorage.setItem("chats", JSON.stringify(chats));
    input.value = "";
    renderMessages();
  };

  renderMessages();
}
