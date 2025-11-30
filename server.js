const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ===== LOAD / CREATE USERS FILE =====
const userFile = './users.json';

if (!fs.existsSync(userFile)) {
    fs.writeFileSync(userFile, JSON.stringify({
        username: "admin",
        password: "12345"
    }, null, 2));
}

// Load user login data
function loadUser() {
    return JSON.parse(fs.readFileSync(userFile));
}

// Save user login data
function saveUser(data) {
    fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
}

// ====================================
// 🔐 LOGIN API
// ====================================
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = loadUser();

    if (username === user.username && password === user.password) {
        return res.json({ success: true });
    }
    res.json({ success: false, message: "Username atau password salah" });
});

// ====================================
// 🔐 CHANGE USERNAME & PASSWORD
// ====================================
app.post('/change-credentials', (req, res) => {
    const { oldUser, oldPass, newUser, newPass } = req.body;
    const user = loadUser();

    if (oldUser === user.username && oldPass === user.password) {
        saveUser({
            username: newUser,
            password: newPass
        });
        return res.json({ success: true, message: "Berhasil diganti!" });
    }
    res.json({ success: false, message: "Data lama salah!" });
});

// ====================================
// 💡 LAMPU (4 lampu) — sementara disimpan lokal
// ====================================
let lampState = {
    lamp1: false,
    lamp2: false,
    lamp3: false,
    lamp4: false
};

app.get('/lamp', (req, res) => {
    res.json(lampState);
});

app.post('/lamp', (req, res) => {
    const { lamp, state } = req.body;
    lampState[lamp] = state;
    res.json({ success: true, lampState });
});

// ====================================
// 🌡 SENSOR DATA (dummy dulu)
// ====================================
app.get('/sensor', (req, res) => {
    res.json({
        suhu: 28.5,
        kelembaban: 75,
        gas: 120,
        cuaca: "Hujan",
        luar_suhu: 26,
        waktu: "Sore"
    });
});

// ====================================
app.listen(PORT, () => {
    console.log(Server berjalan di port ${PORT});
});