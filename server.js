const http = require('http');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.scryptSync(password, 'salt', 64).toString('hex');
}

function verifyPassword(password, hash) {
  const hashed = crypto.scryptSync(password, 'salt', 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashed, 'hex'));
}

const users = [
  { id: 1, username: 'admin', name: 'Администратор Системы', role: 'admin', passwordHash: hashPassword('admin123') },
  { id: 2, username: 'manager', name: 'Менеджер Продаж', role: 'user', passwordHash: hashPassword('manager123') }
];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        const user = users.find(u => u.username === username);
        if (!user || !verifyPassword(password, user.passwordHash)) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid credentials' }));
          return;
        }
        const sessionUser = { id: user.id, username: user.username, name: user.name, role: user.role };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token: crypto.randomUUID(), user: sessionUser }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad request' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Auth server running on http://localhost:3000');
});
