const firebaseConfig = {
    apiKey: "AIzaSyCnUdPELmKbIaVZ-c6dZfJxcLSkfpFGrFw",
    authDomain: "smith-web-app.firebaseapp.com",
    databaseURL: "https://smith-web-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "smith-web-app",
    storageBucket: "smith-web-app.appspot.com",
    messagingSenderId: "125667806079",
    appId: "1:125667806079:web:35d20a1d012ddbd3abe84a"
};

firebase.initializeApp(firebaseConfig);

const testImena = {
    test_1: "Ekonomija",
    test_2: "Ponuda i potražnja",
    test_3: "Elastičnost: Mjera odgovora",
    test_4: "Analiza izbora potrošača",
    test_5: "Proizvodnja i troškovi",
    test_6: "Tržišta savršene konkurencije",
    test_7: "Monopol",
    test_8: "Plaće i zaposlenost u savršenoj konkurenciji"
};

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        prikaziRezultate(user.uid);
        prikaziNapredakTestova(user.uid);
    } else {
        alert("Niste prijavljeni.");
    }
});

function prikaziRezultate(uid) {
    const rezultatiRef = firebase.database().ref(`rezultati/${uid}`);
    const tbody = document.querySelector("#rezultatiTablica tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const podaciZaPieChart = [];

    rezultatiRef.once("value", snapshot => {
        snapshot.forEach(testSnap => {
            const kvizId = testSnap.key;
            let najbolji = null;

            testSnap.forEach(pokusajSnap => {  
                const r = pokusajSnap.val();
                const postotak = (r.bodovi / r.ukupno) * 100;
                if (!najbolji || postotak > najbolji.postotak) {
                    najbolji = {
                        bodovi: r.bodovi,
                        ukupno: r.ukupno,
                        datum: new Date(r.datum),
                        postotak
                    };
                }
            });

            if (najbolji) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${testImena[kvizId] || kvizId}</td>
                    <td>${najbolji.bodovi}/${najbolji.ukupno}</td>
                    <td>${najbolji.postotak.toFixed(1)}%</td>
                    <td>${najbolji.datum.toLocaleDateString()}</td>
                `;
                tbody.appendChild(row);

                podaciZaPieChart.push({ kviz: testImena[kvizId] || kvizId, postotak: najbolji.postotak });
            }
        });

        prikaziPieChartTestova(podaciZaPieChart);
    });
}

function prikaziPieChartTestova(podaci) {
    const kategorije = {
        "90% - 100%": 0,
        "75% - 90%": 0,
        "60% - 75%": 0,
        "50% - 60%": 0,
        "< 50%": 0
    };

    podaci.forEach(el => {
        const p = parseFloat(el.postotak);
        if (p >= 90) kategorije["90% - 100%"]++;
        else if (p >= 75) kategorije["75% - 90%"]++;
        else if (p >= 60) kategorije["60% - 75%"]++;
        else if (p >= 50) kategorije["50% - 60%"]++;
        else kategorije["< 50%"]++;
    });

    const pieData = Object.entries(kategorije).map(([label, value]) => {
        const boje = {
            "90% - 100%": "#A096D1",
            "75% - 89%": "#9CC2D6",
            "60% - 74%": "#FBBBBB",
            "50% - 59%": "#8C7775",
            "< 50%": "#82DAC8"
        };
        return { label, value, color: boje[label] };
    });

    nacrtajPieChart("pieChartContainer", pieData);
}

function nacrtajPieChart(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = "<canvas id='pieCanvas' width='300' height='300'></canvas>";

    const canvas = document.getElementById('pieCanvas');
    const ctx = canvas.getContext('2d');

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 130, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        startAngle += sliceAngle;
    });

    const legend = document.createElement("div");
    legend.className = "legend";
    data.forEach(item => {
        const legendItem = document.createElement("div");
        legendItem.className = "legend-item";

        const colorBox = document.createElement("div");
        colorBox.className = "legend-color";
        colorBox.style.backgroundColor = item.color;

        const label = document.createElement("span");
        label.textContent = `${item.label}: ${item.value}`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });
    container.appendChild(legend);
}

let testoviData = {};


function prikaziNapredakTestova(uid) {
    const ref = firebase.database().ref(`rezultati/${uid}`);
    ref.once("value", snapshot => {
        testoviData = {};

        snapshot.forEach(testSnap => {
            const testId = testSnap.key;
            testoviData[testId] = [];
            testSnap.forEach(rezultatSnap => {
                const r = rezultatSnap.val();
                const datum = new Date(r.datum);
                if (isNaN(datum)) return;
                testoviData[testId].push({
                    datum,
                    postotak: (r.bodovi / r.ukupno) * 100   // bodovi/ukupno, ne r.rezultat
                });
            });
            testoviData[testId].sort((a, b) => a.datum - b.datum);
        });

        const select = document.getElementById("kvizSelect");
        select.innerHTML = "";

        for (const testId in testoviData) {
            const opcija = document.createElement("option");
            opcija.value = testId;
            opcija.textContent = testImena[testId] || testId;
            select.appendChild(opcija);
        }

        window.testovi = testoviData;

        const prviTest = select.options[0];
        if (prviTest) {
            select.value = prviTest.value;
            nacrtajLinijskiGrafTestova({ [prviTest.value]: testoviData[prviTest.value] });
        }
    });
}


document.getElementById("kvizSelect").addEventListener("change", e => {
    const odabrani = e.target.value;
    const filtrirani = {};
    filtrirani[odabrani] = testoviData[odabrani] || [];
    nacrtajLinijskiGrafTestova(filtrirani);
});

function nacrtajLinijskiGrafTestova(data) {
    const canvas = document.getElementById('napredakCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const margina = 60;
    let sviDatumi = [];
    let sviPostotci = [];

    for (const test in data) {
        data[test].forEach(d => {
            sviDatumi.push(d.datum);
            sviPostotci.push(d.postotak);
        });
    }

    if (sviDatumi.length === 0) {
        ctx.fillText("Nema podataka za prikaz napretka.", width / 2 - 100, height / 2);
        return;
    }

    const minDatum = new Date(Math.min(...sviDatumi));
    const maxDatum = new Date(Math.max(...sviDatumi));
    const minPostotak = 0;
    const maxPostotak = 100;

    const xScale = (datum) => margina + ((datum - minDatum) / (maxDatum - minDatum || 1)) * (width - 2 * margina);
    const yScale = (postotak) => height - margina - ((postotak - minPostotak) / (maxPostotak - minPostotak)) * (height - 2 * margina);

    // Osa X i Y
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margina, margina);
    ctx.lineTo(margina, height - margina);
    ctx.lineTo(width - margina, height - margina);
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";

    for (let i = 0; i <= 5; i++) {
        let y = yScale(i * 20);
        ctx.fillText(i * 20 + "%", margina - 10, y + 5);
        ctx.strokeStyle = "#ddd";
        ctx.beginPath();
        ctx.moveTo(margina, y);
        ctx.lineTo(width - margina, y);
        ctx.stroke();
    }

    ctx.textAlign = "center";
    const brojOznakaX = 6;
    for (let i = 0; i <= brojOznakaX; i++) {
        const t = minDatum.getTime() + (i / brojOznakaX) * (maxDatum - minDatum);
        const d = new Date(t);
        const label = d.toLocaleDateString();
        const x = xScale(d);
        ctx.fillText(label, x, height - margina + 20);
    }

    const boje = ["#22a215"];
    let index = 0;

    for (const kvizId in data) {
        const niz = data[kvizId];
        if (niz.length === 0) continue;

        ctx.strokeStyle = boje[index % boje.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        niz.forEach((point, i) => {
            const x = xScale(point.datum);
            const y = yScale(point.postotak);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // crtanje točkica nakon linije
        niz.forEach(point => {
            const x = xScale(point.datum);
            const y = yScale(point.postotak);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = boje[index % boje.length];
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.stroke();
        });

        index++;
    }

    ctx.fillStyle = "#000";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Napredak kroz vrijeme", width / 2, 30);
}
