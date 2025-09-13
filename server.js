// server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let channels = {
  geral: [],
  jogos: [],
  memes: []
};

wss.on('connection', ws => {
  ws.on('message', msg => {
    // msg deve vir em JSON: { canal, usuario, texto }
    const data = JSON.parse(msg.toString());
    if(channels[data.canal]) {
      channels[data.canal].push({ usuario: data.usuario, texto: data.texto });
      // envia para todos conectados
      wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ canal: data.canal, usuario: data.usuario, texto: data.texto }));
        }
      });
    }
  });
});

server.listen(4321, () => console.log("Servidor rodando na porta 4321"));
