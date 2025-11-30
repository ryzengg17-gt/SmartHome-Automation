// URL backend
const API = "http://localhost:3000/api";

// === UPDATE SENSOR DATA ===
async function loadData() {
    try {
        const res = await fetch(API + "/data");
        const data = await res.json();

        // Suhu & Gas
        document.getElementById("temp").innerText = data.temperature + " °C";
        document.getElementById("gas").innerText = data.gas + " ppm";

        // Cuaca (icon)
        updateWeatherIcon(data.weather);
        document.getElementById("weatherText").innerText = data.weather;

        // Waktu (pagi/siang/sore/malam)
        document.getElementById("daytime").innerText = data.daytime;

    } catch (err) {
        console.log("Error load data:", err);
    }
}

// === UPDATE IKON CUACA ===
function updateWeatherIcon(weather) {
    let img = document.getElementById("weatherIcon");

    switch (weather) {
        case "hujan":
            img.src = "icons/rain.gif";
            break;
        case "panas":
            img.src = "icons/sun.gif";
            break;
        case "mendung":
            img.src = "icons/cloud.gif";
            break;
        case "berkabut":
            img.src = "icons/fog.gif";
            break;
        default:
            img.src = "icons/cloud.gif";
    }
}

// === KONTROL LAMPU ===
async function toggleLamp(id, state) {
    await fetch(API + "/lamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, state: state })
    });

    loadData();
}

// Reload data setiap 2 detik
setInterval(loadData, 2000);
loadData();