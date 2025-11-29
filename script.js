async function loadData() {
    try {
        let res = await fetch("http://localhost:3000/data");
        let data = await res.json();

        document.getElementById("suhu").innerText = data.suhu || "--";
        document.getElementById("cuaca").innerText = data.cuaca || "--";
        document.getElementById("gas").innerText = data.gas || "--";
    } catch (e) {
        console.log("Gagal ambil data");
    }
}

function toggleLampu(id) {
    fetch(http://localhost:3000/lampu${id}/toggle);
}

setInterval(loadData, 2000);
loadData();