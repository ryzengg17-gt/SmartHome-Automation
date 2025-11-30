// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'replace_this_with_strong_secret', // ganti di production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 jam
}));

// Files
const USERS_FILE = path.join(__dirname, 'users.json');
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure users.json exists (create default admin if not)
function ensureFiles() {
  if (!fs.existsSync(USERS_FILE)) {
    // default admin: username admin, password ChangeMe123 (hashed)
    const pw = bcrypt.hashSync('ChangeMe123', 10);
    const users = { admin: { passwordHash: pw } };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('Created default users.json (username: admin, password: ChangeMe123). Change it ASAP.');
  }
  if (!fs.existsSync(DATA_FILE)) {
    // initial virtual data (no hardware yet)
    const data = {
      lamps: { l1: false, l2: false, l3: false, l4: false },
      sensors: {
        indoorTemp: null,
        indoorHum: null,
        outdoorTemp: null,
        outdoorHum: null,
        gasPpm: null,
        weather: 'unknown', // sunny, rainy, cloudy, fog
        timeOfDay: 'unknown' // morning, day, afternoon, night
      },
      lastUpdate: Date.now()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }
}
ensureFiles();

// Serve static frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// AUTH middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}

// --- AUTH APIs ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  if (!users[username]) return res.json({ ok: false, error: 'Invalid credentials' });
  const u = users[username];
  if (bcrypt.compareSync(password, u.passwordHash)) {
    req.session.user = username;
    return res.json({ ok: true, user: username });
  } else {
    return res.json({ ok: false, error: 'Invalid credentials' });
  }
});

app.post('/api/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Change admin username/password (only logged-in admin)
app.post('/api/change-credentials', requireAuth, (req, res) => {
  const { newUsername, newPassword } = req.body;
  if (!newUsername || !newPassword) return res.json({ ok: false, error: 'Missing fields' });
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const oldUser = req.session.user;
  const pwHash = bcrypt.hashSync(newPassword, 10);
  // remove old user, set new
  delete users[oldUser];
  users[newUsername] = { passwordHash: pwHash };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  req.session.user = newUsername; // keep session
  return res.json({ ok: true, user: newUsername });
});

// --- Data APIs ---
// Get current status (for dashboard polling)
app.get('/api/status', requireAuth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  return res.json({ ok: true, data });
});

// Toggle lamp (virtual)
app.post('/api/toggle-lamp', requireAuth, (req, res) => {
  const { lamp } = req.body; // lamp: l1/l2/l3/l4
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  if (!data.lamps.hasOwnProperty(lamp)) return res.json({ ok: false, error: 'Invalid lamp' });
  data.lamps[lamp] = !data.lamps[lamp];
  data.lastUpdate = Date.now();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return res.json({ ok: true, lamp, state: data.lamps[lamp] });
});

// Set sensor data (for simulation/testing) - in real project ESP32 would call this
app.post('/api/set-sensors', requireAuth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const incoming = req.body;
  // allow partial updates
  if (incoming.sensors) {
    data.sensors = Object.assign(data.sensors || {}, incoming.sensors);
  }
  if (incoming.lamps) {
    data.lamps = Object.assign(data.lamps || {}, incoming.lamps);
  }
  data.lastUpdate = Date.now();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return res.json({ ok: true, data });
});

// Serve user info
app.get('/api/user', requireAuth, (req, res) => {
  return res.json({ ok: true, user: req.session.user });
});

// Fallback
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});