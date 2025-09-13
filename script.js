const ws = new WebSocket("ws://localhost:8080");
let canalAtual = "geral";

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const channelList = document.getElementById("channelList");
const chatHeader = document.getElementById("chatHeader");

// Trocar canal
channelList.addEventListener("click", e => {
  if(e.target.tagName === "LI") {
    canalAtual = e.target.dataset.canal;
    chatHeader.textContent = `Canal: #${canalAtual}`;
    messagesDiv.innerHTML = "";
  }
});

// Enviar mensagem
sendBtn.addEventListener("click", () => {
  if(msgInput.value.trim() === "") return;
  const msg = { canal: canalAtual, usuario: "Você", texto: msgInput.value };
  ws.send(JSON.stringify(msg));
  msgInput.value = "";
});

// Receber mensagem
ws.onmessage = event => {
  const data = JSON.parse(event.data);
  if(data.canal === canalAtual) {
    addMessage(data.usuario, data.texto);
  }
};

// Função pra montar mensagem bonitinha
function addMessage(usuario, texto) {
  const div = document.createElement("div");
  div.className = "message";

  const avatar = document.createElement("div");
  avatar.className = "avatar";

  const content = document.createElement("div");
  content.className = "messageContent";
  content.innerHTML = `<strong>${usuario}</strong>${texto}`;

  div.appendChild(avatar);
  div.appendChild(content);
  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
