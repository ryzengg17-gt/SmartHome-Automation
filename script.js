/* ===== LOGIN SYSTEM ===== */
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "12345") {
        window.location.href = "index.html";
    } else {
        alert("Username atau Password salah!");
    }
}

function logout() {
    window.location.href = "login.html";
}

/* ===== LAMPU ===== */
function toggleLamp(id) {
    let btn = document.getElementById("lamp" + id);

    if (btn.classList.contains("on")) {
        btn.classList.remove("on");
        btn.innerText = "OFF";
    } else {
        btn.classList.add("on");
        btn.innerText = "ON";
    }
}

/* ===== CUACA (DEMO SAAT BELUM ADA SENSOR) ===== */
function updateWeather(status) {
    const icon = document.getElementById("weatherIcon");
    const text = document.getElementById("weatherStatus");

    if (!icon || !text) return;

    if (status === "rain") {
        icon.innerHTML = "🌧️";
        text.innerText = "Hujan";
    } else if (status === "sun") {
        icon.innerHTML = "☀️";
        text.innerText = "Cerah";
    } else if (status === "cloud") {
        icon.innerHTML = "☁️";
        text.innerText = "Mendung";
    }
}

// contoh animasi demo
setInterval(() => {
    let w = ["rain", "sun", "cloud"];
    updateWeather(w[Math.floor(Math.random()*3)]);
}, 5000);