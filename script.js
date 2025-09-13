// script.js
const ws = new WebSocket("ws://localhost:8080");
let canalAtual = "geral";

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const channelList = document.getElementById("channelList");

channelList.addEventListener("click", e => {
  if(e.target.tagName === "LI") {
    canalAtual = e.target.dataset.canal;
    messagesDiv.innerHTML = ""; // limpa chat quando muda de canal
  }
});

sendBtn.addEventListener("click", () => {
  if(msgInput.value.trim() === "") return;
  const msg = { canal: canalAtual, usuario: "Você", texto: msgInput.value };
  ws.send(JSON.stringify(msg));
  msgInput.value = "";
});

ws.onmessage = event => {
  const data = JSON.parse(event.data);
  if(data.canal === canalAtual) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${data.usuario}:</strong> ${data.texto}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
};
