import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const USERS_FILE = "./users.json";

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generatePhone() {
  const dd = Math.floor(Math.random() * 90 + 10); // 10–99
  const part1 = Math.floor(9000 + Math.random() * 1000); 
  const part2 = Math.floor(1000 + Math.random() * 9000); 
  return `+8 (${dd}) 9${part1}-${part2}`;
}

// Registrar usuário
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  const newUser = {
    id: Date.now(),
    username,
    password, // se quiser dá pra hashear depois
    phone: generatePhone()
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ success: true, user: newUser });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).json({ error: "Usuário ou senha inválidos" });

  res.json({ success: true, user });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
