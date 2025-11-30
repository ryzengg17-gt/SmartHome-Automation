// ========== LOGIN SYSTEM ==========
let defaultUser = localStorage.getItem("user") || "admin";
let defaultPass = localStorage.getItem("pass") || "12345";

function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === defaultUser && p === defaultPass) {
        window.location.href = "dashboard.html";
    } else {
        alert("Username atau password salah!");
    }
}

// ========== LAMPU ON/OFF ==========
function toggleLamp(id) {
    let sw = document.getElementById(id);
    sw.classList.toggle("on");
}

// ========== POPUP GANTI PASSWORD ==========
function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function saveNewLogin() {
    let newU = document.getElementById("newUser").value;
    let newP = document.getElementById("newPass").value;

    if (newU === "" || newP === "") {
        alert("Tidak boleh kosong!");
        return;
    }

    localStorage.setItem("user", newU);
    localStorage.setItem("pass", newP);

    alert("Login berhasil diperbarui!");
    closePopup();
}