/* ====== LOGIN ====== */
let USER = "admin";
let PASS = "1234";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", login);
    }
});

function login(e) {
    e.preventDefault();
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === USER && p === PASS) {
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("loginMsg").innerHTML = "Username / Password salah!";
    }
}

/* ====== DASHBOARD ====== */

function toggleLamp(id) {
    let btn = document.getElementById("lamp" + id);
    let state = btn.classList.contains("on") ? "OFF" : "ON";

    btn.classList.toggle("on");
    btn.innerHTML = Lampu ${id} - ${state};
}

/* ====== SETTINGS ====== */
function openSettings() {
    document.getElementById("settingsPopup").style.display = "flex";
}

function closeSettings() {
    document.getElementById("settingsPopup").style.display = "none";
}

function saveLoginData() {
    let newU = document.getElementById("newUser").value;
    let newP = document.getElementById("newPass").value;

    if (newU.trim() === "" || newP.trim() === "") {
        document.getElementById("settingsMsg").innerHTML = "Tidak boleh kosong!";
        return;
    }

    USER = newU;
    PASS = newP;

    document.getElementById("settingsMsg").innerHTML = "Berhasil disimpan!";
}