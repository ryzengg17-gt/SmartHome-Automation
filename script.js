// ------------------- LAMPU ------------------------
function toggleLamp(id) {
    const btn = document.getElementById("lamp" + id);
    const current = btn.classList.contains("on");

    if (current) {
        btn.classList.remove("on");
        btn.innerText = "OFF";
        fetch(/lamp/${id}/off);
    } else {
        btn.classList.add("on");
        btn.innerText = "ON";
        fetch(/lamp/${id}/on);
    }
}

// ------------------- UPDATE SENSOR ------------------------
async function loadData() {
    try {
        const r = await fetch("/data");
        const data = await r.json();

        document.getElementById("cuaca").innerHTML = data.cuaca;
        document.getElementById("suhuDalam").innerHTML = data.suhuDalam + " °C";
        document.getElementById("suhuLuar").innerHTML = data.suhuLuar + " °C";
        document.getElementById("gas").innerHTML = data.gas;

    } catch(e) {
        console.log("Gagal mengambil data");
    }
}

setInterval(loadData, 2000);
loadData();