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

let currentUser = null;
let startTime = Date.now();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        console.log("Prijavljen:", user.uid);
    } else {
        console.warn("Korisnik nije prijavljen.");
        alert("Niste prijavljeni. Rezultati kviza neće biti spremljeni.");
    }
});

const quizData = [
    {
        question: "1. Što je točno u vezi sa supstitucijskim učinkom povećanja nadnice?",
        options: [
            "Smanjuje količinu ponuđenog rada",
            "Potiče pojedinca da ponudi više rada",
            "Nema utjecaja na količinu rada",
            "Sve navedeno je točno"
        ],
        answer: "Potiče pojedinca da ponudi više rada"
    },
    {
        question: "2. Što se događa s graničnom korisnošću slobodnog vremena kada pojedinac više radi?",
        options: [
            "Ostaje ista",
            "Smanjuje se",
            "Povećava se"
        ],
        answer: "Povećava se"
    },
    {
        question: "3. Ako dodatni radnik poveća proizvodnju za 4 jedinice, a cijena jedinice je 20€, koliki je njegov MRP?",
        options: [
            "4€",
            "80€",
            "16€",
            "24€"
        ],
        answer: "80€"
    },
    {
        question: "4. Što se događa s MRP kada se počne primjenjivati zakon opadajućih graničnih prinosa?",
        options: [
            "MRP ostaje konstantan",
            "MRP počinje rasti",
            "MRP se udvostručuje",
            "MRP počinje padati"
        ],
        answer: "MRP počinje padati"
    },
    {
        question: "5. Koji je potencijalni negativan učinak subvencioniranja plaća niskokvalificiranim radnicima?",
        options: [
            "Smanjenje zaposlenosti visokoobrazovanih radnika",
            "Smanjenje poticaja za razvijanje traženih vještina",
            "Smanjenje ponude radne snage",
            "Potpuni nestanak razlika u plaćama"
        ],
        answer: "Smanjenje poticaja za razvijanje traženih vještina"
    },
    {
        question: "6. Što predstavlja granični prihod od faktora (MRP)?",
        options: [
            "Ukupni prihod poduzeća od prodaje",
            "Dodatni prihod koji poduzeće ostvari upotrebom dodatne jedinice faktora",
            "Dodatni trošak zbog povećane proizvodnje"
        ],
        answer: "Dodatni prihod koji poduzeće ostvari upotrebom dodatne jedinice faktora"
    },
    {
        question: "7. Kada dohodovni učinak nadmašuje supstitucijski učinak, krivulja ponude rada:",
        options: [
            "Ima pozitivan nagib",
            "Postaje horizontalna",
            "Postaje okomita",
            "Savija se unatrag"
        ],
        answer: "Savija se unatrag"
    },
    {
        question: "8. Koji čimbenik neće uzrokovati pomak krivulje ponude rada?",
        options: [
            "Promjena preferencija između rada i slobodnog vremena",
            "Promjena radnog vremena bez promjene nadnice",
            "Dobivanje nasljedstva",
            "Povećanje troškova aktivnosti za slobodno vrijeme"
        ],
        answer: "Promjena radnog vremena bez promjene nadnice"
    },
    {
        question: "9. Kako se određuju plaće na tržištu rada u uvjetima savršene konkurencije?",
        options: [
            "Vlada ih administrativno određuje",
            "Sjecištem krivulja ponude i potražnje",
            "Prema broju zaposlenih u sektoru",
            "Nasumičnim odabirom tržišnih sudionika"
        ],
        answer: "Sjecištem krivulja ponude i potražnje"
    },
    {
        question: "10. Što se događa kada vlada uvede minimalnu plaću iznad tržišne ravnotežne razine?",
        options: [
            "Zaposlenost raste, a ponuda rada opada",
            "Povećava se ponuda rada, smanjuje se potražnja i dolazi do viška radne snage",
            "Povećava se i zaposlenost i potražnja za radom"
        ],
        answer: "Povećava se ponuda rada, smanjuje se potražnja i dolazi do viška radne snage"
    },
    {
        question: "11. Što uzrokuje pomak potražnje za radom ulijevo, odnosno njezino smanjenje?",
        options: [
            "Povećanje stanovništva",
            "Tehnološki napredak koji povećava potražnju",
            "Smanjenje građevinske aktivnosti ili tehnološke promjene koje smanjuju potražnju za određenim vještinama",
            "Rastuće plaće u alternativnim zanimanjima"
        ],
        answer: "Smanjenje građevinske aktivnosti ili tehnološke promjene koje smanjuju potražnju za određenim vještinama"
    },
    {
        question: "12. Koji je jedan od ciljeva programa osposobljavanja u javnom sektoru?",
        options: [
            "Ograničiti pristup određenim zanimanjima",
            "Povećati ljudski kapital i potražnju za radom",
            "Smanjiti broj visokoobrazovanih radnika"
        ],
        answer: "Povećati ljudski kapital i potražnju za radom"
    },
    {
        question: "13. Kako se izračunava granični prihod od faktora (MRP)?",
        options: [
            "MRP = MP + MR",
            "MRP = MP / MR",
            "MRP = MP * MR",
            "MRP = MR - MP"
        ],
        answer: "MRP = MP * MR"
    },
    {
        question: "14. Kako pad cijene komplementa radu (npr. brige o djeci) utječe na ponudu rada?",
        options: [
            "Smanjuje ponudu rada jer rad postaje manje atraktivan",
            "Povećava ponudu rada jer je lakše ići na posao",
            "Ne utječe na ponudu rada",
            "Povećava cijenu slobodnog vremena"
        ],
        answer: "Povećava ponudu rada jer je lakše ići na posao"
    },
    {
        question: "15. Koliko će računovođa gospođa Lancaster zaposliti ako je MFC (granični trošak faktora) 150€, a MRP pada?",
        options: [
            "Sve dok je MRP = 0",
            "Sve dok je MRP > MFC",
            "Sve dok je MRP = MFC",
            "Sve dok je MRP < MFC"
        ],
        answer: "Sve dok je MRP = MFC"
    },
    {
        question: "16. Alternativni trošak slobodnog vremena je nadnica koju pojedinac može zaraditi.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "17. Je li moguće da poduzeće koje slijedi pravilo granične odluke za zapošljavanje radne snage na kraju proizvede drugačiju količinu outputa od one koju bi odabralo da je slijedilo pravilo granične odluke za određivanje količine proizvodnje? Postoji li sukob između ova dva pravila granične odluke?",
        options: [
            "Da",
            "Ne"
        ],
        answer: "Ne"
    },
    {
        question: "18. Krivulja potražnje poduzeća za nekim faktorom proizvodnje jest opadajući dio njegove krivulje graničnog prihoda proizvoda.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "19. Što ponuda više raste, to će povećanje plaća biti veće, čak i ako potražnja raste.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "20. Tehnološke promjene mogu povećati potražnju za nekim radnicima, a smanjiti je za druge.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    }
];

const testId = "test_8";

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit");

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let vrijeme = 10 * 60;
let timer;

window.onload = function () {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            renderQuestions();
            startTimer();

            const form = document.getElementById("quiz-form");
            form.addEventListener("submit", submitTest);
        } else {
            alert("Niste prijavljeni. Molimo prijavite se kako biste mogli predati test.");
        }
    });
};

function startTimer() {
    const timerEl = document.getElementById("timer");

    timer = setInterval(() => {
        const minutes = Math.floor(vrijeme / 60);
        const seconds = vrijeme % 60;
        timerEl.textContent = `Vrijeme: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        vrijeme--;

        if (vrijeme < 0) {
            clearInterval(timer);
            document.getElementById("quiz-form").requestSubmit();
        }
    }, 1000);
}

function renderQuestions() {
    const form = document.getElementById("quiz-form");
    form.innerHTML = "";

    quizData.forEach((pitanje, index) => {
        const div = document.createElement("div");
        div.className = "question";

        const label = document.createElement("p");
        label.className = "question-text";
        label.textContent = pitanje.question;
        div.appendChild(label);

        if (pitanje.options) {
            pitanje.options.forEach((opcija, optIndex) => {
                const opcijaContainer = document.createElement("div");
                opcijaContainer.className = "opcija-container";

                const input = document.createElement("input");
                input.type = pitanje.multi ? "checkbox" : "radio";
                input.name = pitanje.multi ? `q${index + 1}[]` : `q${index + 1}`;
                input.value = opcija;
                input.id = `q${index + 1}_opt${optIndex}`;

                const labelFor = document.createElement("label");
                labelFor.setAttribute("for", input.id);
                labelFor.textContent = opcija;
                labelFor.className = "opcija-label";

                opcijaContainer.appendChild(input);
                opcijaContainer.appendChild(labelFor);

                div.appendChild(opcijaContainer);
            });
        } else {
            const input = document.createElement("input");
            input.type = "text";
            input.name = `q${index + 1}`;
            input.placeholder = "Unesite svoj odgovor...";
            input.className = "tekst-odgovor";
            div.appendChild(input);
        }

        form.appendChild(div);
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Predaj test";
    submitButton.className = "submit-button";
    form.appendChild(submitButton);
}

function submitTest(e) {
    e.preventDefault();
    console.log("submitTest called");

    const form = document.getElementById("quiz-form");
    const formData = new FormData(form);
    const odgovori = {};

    quizData.forEach((pitanje, index) => {
        const key = `q${index + 1}`;
        if (pitanje.multi) {
            odgovori[key] = formData.getAll(`${key}[]`);
        } else {
            odgovori[key] = formData.get(key) || "";
        }
    });

    const neodgovoreni = quizData.filter((pitanje, index) => {
        const key = `q${index + 1}`;
        const odgovor = odgovori[key];
        if (pitanje.multi) {
            return !Array.isArray(odgovor) || odgovor.length === 0;
        }
        return typeof odgovor !== "string" || odgovor.trim() === "";
    });

    if (vrijeme > 0 && neodgovoreni.length > 0) {
        const potvrda = confirm("Niste odgovorili na sva pitanja. Želite li ipak predati test?");
        if (!potvrda) return;
        console.log("Potvrđeno predavanje bez svih odgovora");
    }

    clearInterval(timer);

    if (!currentUser) {
        alert("Niste prijavljeni! Molimo prijavite se kako bi se rezultat mogao spremiti.");
        return;
    }

    let score = 0;

    quizData.forEach((pitanje, index) => {
        const key = `q${index + 1}`;
        const korisnikovOdgovor = odgovori[key];

        if (pitanje.multi) {
            const korisnik = (korisnikovOdgovor || []).map(o => o.trim().toLowerCase()).sort();
            const tocno = pitanje.answer.map(a => a.trim().toLowerCase()).sort();
            if (JSON.stringify(korisnik) === JSON.stringify(tocno)) {
                score++;
            }
        } else if (typeof pitanje.answer === "string") {
            if (korisnikovOdgovor.trim().toLowerCase() === pitanje.answer.trim().toLowerCase()) {
                score++;
            }
        } else if (Array.isArray(pitanje.answer)) {
            const korisnikOdgovorTrim = korisnikovOdgovor.trim().toLowerCase();
            const tocniOdgovori = pitanje.answer.map(a => a.trim().toLowerCase());
            if (tocniOdgovori.includes(korisnikOdgovorTrim)) {
                score++;
            }
        }
    });

    const rezultatObj = {
        datum: new Date().toISOString(),
        bodovi: score,
        ukupno: quizData.length
    };

    firebase.database()
        .ref(`rezultati/${currentUser.uid}/${testId}`)
        .push(rezultatObj)
        .then(() => {
            console.log("Rezultat test-a spremljen.");
            showResult(score);
        })
        .catch(error => {
            console.error("Greška pri spremanju rezultata:", error);
        });
}

function showResult(score) {
    const ukupno = quizData.length;
    const postotak = ((score / ukupno) * 100).toFixed(2);

    document.getElementById("rezultat").innerHTML = `
    <h2>Kviz završen!</h2>
    <p>Osvojeni bodovi: <strong>${score}/${ukupno}</strong></p>
    <p>Postotak: <strong>${postotak}%</strong></p>
  `;

    document.getElementById("quiz-form").style.display = "none";
    clearInterval(timer);
}

function closeQuiz() {
    window.history.back();
}
