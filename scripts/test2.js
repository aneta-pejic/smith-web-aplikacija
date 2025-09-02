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
        question: "1. Kako se još nazivaju komplementi?",
        options: [
            "dopunska dobra",
            "zamjenska dobra",
            "supstituti"
        ],
        answer: "dopunska dobra"
    },
    {
        question: "2. Kada će se povećati potražnja za čokoladom? (Odaberi jedan ili više točnih odgovora.)",
        options: [
            "Kada se snizi cijena čokolade s 5 na 3 eura.",
            "Kada se poveća dohodak potrošača.",
            "Kada se uvede porez na čokoladu."
        ],
        answer: ["Kad se snizi cijena čokolade s 5 na 3 eura.", "Kad se poveća dohodak potrošača."],
        multi: true
    },
    {
        question: "3. Broj kupaca ne utječe na ukupnu količinu dobra ili usluga.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "4. Krivulja ponude je grafički prikaz _______ ______.",
        answer: "tablice ponude"
    },
    {
        question: "5. Kava i krafne su primjer",
        options: [
            "supstituta",
            "komplemenata"
        ],
        answer: "komplemenata"
    },
    {
        question: "6. Promjena cijene rada ili nekog drugog čimbenika proizvodnje promijenit će trošak proizvodnje bilo koje količine dobara ili usluga.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "7. Promjena cijene dobra ili usluge uzrokuje promjenu tražene količine, što se prikazuje kao...",
        options: [
            "pomicanje duž krivulje potražnje.",
            "pomak cijele krivulje potražnje."
        ],
        answer: "pomicanje duž krivulje potražnje."
    },
    {
        question: "8. Povećanje ponude prikazuje se kao pomak krivulje ponude ulijevo.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "9. Smanjenje ponude prikazuje se kao pomak krivulje ponude udesno.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "10. Dobro je inferiorno dobro ako povećanje dohotka smanjuje potražnju za tim dobrom.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "11. Prirodne pojave nikako ne mogu utjecati na ponudu.",
        options: [
            "Ova tvrdnja je točna.",
            "Ova tvrdnja nije točna."
        ],
        answer: "Ova tvrdnja nije točna."
    },
    {
        question: "12. Što NIJE jedno od faktora čije promjene utječu na ponudu?",
        options: [
            "tehnologija",
            "broj kupaca",
            "broj prodavača"
        ],
        answer: "broj kupaca"
    },
    {
        question: "13. Dva dobra su ________ ako povećanje cijene jednog dobra povećava potražnju za drugim.",
        options: [
            "komplementi",
            "normalna dobra",
            "supstituti"
        ],
        answer: "supstituti"
    },
    {
        question: "14. Dobro je inferiorno dobro ako povećanje dohotka povećava potražnju za tim dobrom.",
        options: [
            "Netočno",
            "Točno"
        ],
        answer: "Netočno"
    },
    {
        question: "15. Mnoge odluke o proizvodnji i prodaji donose se mnogo prije nego što je proizvod spreman za tržište.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "16. Povećanje plaće radnika uzrokuje pomak krivulje ponude ______.",
        answer: ["ulijevo", "lijevo", "prema lijevo"]
    },
    {
        question: "17. Tablica koja prikazuje ponudu nekog dobra ili usluge koja se tražei pri različitim cijenama u određenom vremenskom razdoblju naziva se raspored potražnje.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "18. Povećanje troškova proizvodnje povećanje ponude.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "19. Pretpostavimo da se u nekom gradu svakog mjeseca proda 100.000 kino ulaznica po cijeni od 8 eura po ulaznici. Ta količina, 100.000, predstavlja količinu potražnje za kino ulaznicama mjesečno, pri cijeni od 8 eura. Ako bi cijena bila 12 eura, očekujemo manju količinu potražnje, a ako bi bila 4 eura, očekujemo veću količinu.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "20. Očekivanja kupaca mogu utjecati na potražnju za nekim proizvodom.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    }
];

const testId = "test_2";

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
