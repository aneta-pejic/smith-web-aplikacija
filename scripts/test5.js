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
        question: "1. Što opisuje proizvodna funkcija u poduzeću?",
        options: [
            "Odnos između ukupnih troškova i varijabilnih troškova",
            "Odnos između proizvodnih čimbenika i outputa poduzeća",
            "Omjer graničnog i prosječnog proizvoda"
        ],
        answer: "Odnos između proizvodnih čimbenika i outputa poduzeća"
    },
    {
        question: "2. Što predstavlja granični proizvod (MPL) rada?",
        options: [
            "Ukupnu proizvodnju podijeljenu s količinom rada",
            "Ukupne troškove podijeljene s brojem radnika",
            "Omjer promjene u outputu i promjene u količini rada"
        ],
        answer: "Omjer promjene u outputu i promjene u količini rada"
    },
    {
        question: "3. Koji pojam opisuje troškove koji se mijenjaju s razinom proizvodnje?",
        options: [
            "Varijabilni troškovi",
            "Fiksni troškovi",
            "Ukupni troškovi"
        ],
        answer: "Varijabilni troškovi"
    },
    {
        question: "4. Koja je osnovna razlika između kratkoročnog i dugoročnog razdoblja u pogledu proizvodnih faktora?",
        options: [
            "U dugom roku svi proizvodni faktori su fiksni",
            "U kratkom roku svi proizvodni faktori su varijabilni",
            "U dugom roku svi proizvodni faktori su varijabilni"
        ],
        answer: "U dugom roku svi proizvodni faktori su varijabilni"
    },
    {
        question: "5. Što poduzeće želi postići prema pravilu marginalne odluke?",
        options: [
            "Maksimizirati fiksne troškove",
            "Izabrati najskuplju kombinaciju faktora",
            "Maksimalnu moguću proizvodnju za dani ukupni trošak"
        ],
        answer: "Maksimalnu moguću proizvodnju za dani ukupni trošak"
    },
    {
        question: "6. Što opisuje dio LRAC krivulje koji pada?",
        options: [
            "Diseekonomije razmjera",
            "Konstantni troškovi",
            "Ekonomije razmjera",
            "Zakon opadajućih prinosa"
        ],
        answer: "Ekonomije razmjera"
    },
    {
        question: "7. Što kaže zakon opadajućih graničnih prinosa?",
        options: [
            "Granični proizvod varijabilnog faktora s vremenom raste, pod pretpostavkom konstantnih ostalih čimbenika",
            "Granični proizvod varijabilnog faktora s vremenom počinje opadati, pod pretpostavkom da su ostali čimbenici nepromijenjeni"
        ],
        answer: "Granični proizvod varijabilnog faktora s vremenom počinje opadati, pod pretpostavkom da su ostali čimbenici nepromijenjeni"
    },
    {
        question: "8. Koji je izraz za prosječni ukupni trošak (ATC)?",
        options: [
            "Ukupni trošak podijeljen s količinom proizvedene robe",
            "Ukupni varijabilni trošak podijeljen s količinom kapitala",
            "Ukupni fiksni trošak podijeljen s brojem radnika",
            "Granični trošak po jedinici rada"
        ],
        answer: "Ukupni trošak podijeljen s količinom proizvedene robe"
    },
    {
        question: "9. Ako poduzeće postaje „kapitalno intenzivnije”, što se događa s njegovom proizvodnom kombinacijom?",
        options: [
            "Koristi relativno više rada i manje kapitala",
            "Koristi relativno više kapitala i manje rada",
            "Povećava omjer rada prema kapitalu"
        ],
        answer: "Koristi relativno više kapitala i manje rada"
    },
    {
        question: "10. Koji je uvjet za učinkovitu uporabu faktora prema pravilu marginalne odluke?",
        options: [
            "MPK = MPL",
            "MPK/PK = MPL/PL",
            "PK = PL",
            "MPK * PL = MPL * PK"
        ],
        answer: "MPK/PK = MPL/PL"
    },
    {
        question: "11. Ako su kapital i rad jedini faktori za proizvodnju određenog proizvoda, tada dodatni 1€ potrošen na kapital, uz uvjet nepromijenjenog ukupnog troška, znači oduzimanje _€ iz rada. (Upišite broj.)",
        answer: "1"
    },
    {
        question: "12. Ako Vam je prosjek 3.0 i dobijete još jednu ocjenu dobar(3)... (Odaberi jedan ili više točnih odgovora.)",
        options: [
            "Vaša granična ocjena jednaka je prosjeku.",
            "Vaš prosjek ostaje nepromijenjen.",
            "Prethodne tvdnje nisu točne."
        ],
        answer: ["Vaša granična ocjena jednaka je prosjeku.", "Vaš prosjek ostaje nepromijenjen."],
        multi: true
    },
    {
        question: "13. Ukupni fiksni trošak (TFC) je trošak koji se mijenja s razinom proizvodnjom.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "14. Ukupni trošak (TC) je zbroj ukupnog varijabilnog troška i ukupnog fiksnog troška.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "15. U dugom roku ne razlikujemo ukupne varijabilne troškove i ukupne troškove: ukupni trošak je ujedno i ukupni varijabilni trošak.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "16. Pretpostavimo da neko poduzeće koje se bavi proizvodnjom jakni plaća svoje radnike po 100€ dnevno. Ako ne proizvodi nijednu jaknu njezin varijabilni trošak tada iznosi _€.",
        answer: "0"
    },
    {
        question: "17. Koliko iznosi ΔQ ako se proizvodnja poveća sa 6 na 7 jedinica?",
        options: [
            "-1",
            "0",
            "1"
        ],
        answer: "1"
    },
    {
        question: "18. Širenjem poslovanja poduzeće može početi koristiti strojeve i sustave za veliku proizvodnju koji znatno povećavaju trošak po jedinici.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "19. Logika odnosa između graničnog troška i prosječnog ukupnog i varijabilnog troška ista je kao i za odnos između graničnog i prosječnog proizvoda.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "20. Pretpostavimo da tvrtke u određenoj industriji doživljavaju neekonomičnosti razmjera već pri relativno niskim razinama proizvodnje. Takva će industrija biti karakterizirana velikim brojem prilično malih tvrtki. Primjer takve industrije su:",
        options: [
            "frizeri",
            "restorani",
            "kozmetičari",
            "svi navedeni"
        ],
        answer: "svi navedeni"
    }
];

const testId = "test_5";

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

    console.log("Rezultat:", score);

    const endTime = Date.now();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    const rezultatObj = {
        datum: new Date().toISOString(),
        bodovi: score,
        ukupno: quizData.length,
        vrijeme: timeString
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
