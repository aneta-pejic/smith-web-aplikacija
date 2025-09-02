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
        question: "1. Koja je vrijednost unakrsne elastičnosti potražnje za dva dobra koja su supstituti?",
        options: [
            "Pozitivna",
            "Negativna",
            "Nula"
        ],
        answer: "Pozitivna"
    },
    {
        question: "2. Što mjeri cjenovna elastičnost ponude?",
        options: [
            "Osjetljivost potražnje na promjene prihoda",
            "Osjetljivost ponuđene količine na promjene cijene",
            "Promjenu cijene zbog promjene potražnje"
        ],
        answer: "Osjetljivost ponuđene količine na promjene cijene"
    },
    {
        question: "3. Što mjeri cjenovna elastičnost potražnje (eᴰ)?",
        options: [
            "Ukupan prihod poduzeća",
            "Postotnu promjenu cijene podijeljenu s promjenom količine",
            "Postotnu promjenu količine potražene podijeljenu s postotnom promjenom cijene",
            "Promjenu nagiba krivulje potražnje"
        ],
        answer: "Postotnu promjenu količine potražene podijeljenu s postotnom promjenom cijene"
    },
    {
        question: "4. Kada povećanje cijene dovodi do porasta ukupnog prihoda, kakva je tada potražnja?",
        options: [
            "Neelastična",
            "Elastična",
            "Jedinično elastična",
            "Savršeno elastična"
        ],
        answer: "Neelastična"
    },
    {
        question: "5. Koja je ispravna formula za izračun cjenovne elastičnosti ponude (eS)?",
        options: [
            "Promjena cijene podijeljena s promjenom prihoda",
            "Promjena količine podijeljena s promjenom potražnje",
            "Postotna promjena ponuđene količine podijeljena s postotnom promjenom cijene",
            "Ukupna količina ponuđena puta cijena"
        ],
        answer: "Postotna promjena ponuđene količine podijeljena s postotnom promjenom cijene"
    },
    {
        question: "6. Što mjeri dohodovna elastičnost potražnje?",
        options: [
            "Postotnu promjenu cijene proizvoda u odnosu na promjenu potražnje",
            "Postotnu promjenu tražene količine pri određenoj cijeni u odnosu na promjenu dohotka",
            "Postotnu promjenu tražene količine pri promjeni cijene srodnog dobra"
        ],
        answer: "Postotnu promjenu tražene količine pri određenoj cijeni u odnosu na promjenu dohotka"
    },
    {
        question: "7. Vrijednost dohodovne elastičnosti potražnje za normalna dobra je ________.",
        answer: "pozitivna"
    },
    {
        question: "8. Kada je ponuda savršeno neelastična?",
        options: [
            "Kada je krivulja ponude vodoravna",
            "Kada je cjenovna elastičnost ponude jednaka 1",
            "Kada cijena ne utječe na količinu ponuđenu",
            "Kada se količina ponuđena udvostruči zbog rasta cijene"
        ],
        answer: "Kada cijena ne utječe na količinu ponuđenu"
    },
    {
        question: "9. Zašto je cjenovna elastičnost ponude veća u duljem vremenskom razdoblju?",
        options: [
            "Jer se kupci lakše prilagođavaju",
            "Jer proizvođači imaju više mogućnosti prilagodbe",
            "Jer cijene stagniraju kroz vrijeme",
            "Jer potražnja postaje konstantna"
        ],
        answer: "Jer proizvođači imaju više mogućnosti prilagodbe"
    },
    {
        question: "10. Što se događa s apsolutnom vrijednošću cjenovne elastičnosti potražnje kako se krećemo niz linearnu krivulju potražnje?",
        options: [
            "Ostaje konstantna",
            "Raste",
            "Opada",
            "Postaje pozitivna"
        ],
        answer: "Opada"
    },
    {
        question: "11. Što znači negativna dohodovna elastičnost potražnje?",
        options: [
            "Dobro je normalno",
            "Dobro je inferiorno",
            "Dobro je supstitut",
            "Dobro je komplement"
        ],
        answer: "Dobro je inferiorno"
    },
    {
        question: "12. Koja je prednost metode luk-elastičnosti u odnosu na standardnu metodu izračuna?",
        options: [
            "Ne koristi prosječne vrijednosti",
            "Rezultati su veći u apsolutnoj vrijednosti",
            "Rezultat je isti bez obzira na smjer promjene"
        ],
        answer: "Rezultat je isti bez obzira na smjer promjene"
    },
    {
        question: "13. Ako je unakrsna elastičnost potražnje između dva dobra jednaka nuli, što to znači?",
        options: [
            "Dobra su komplementi",
            "Dobra su supstituti",
            "Dobra su nepovezana",
            "Promjena cijene jednog dobra utječe na potražnju za drugim"
        ],
        answer: "Dobra su nepovezana"
    },
    {
        question: "14. Što se događa s ponudom rada u nekim vrlo dobro plaćenim zanimanjima kada plaće rastu?",
        options: [
            "Ponuda rada se povećava jer svi žele više raditi",
            "Ponuda rada ostaje nepromijenjena",
            "Ponuda rada se može smanjiti jer radnici preferiraju slobodno vrijeme",
            "Radnici prelaze na niže plaćene poslove"
        ],
        answer: "Ponuda rada se može smanjiti jer radnici preferiraju slobodno vrijeme"
    },
    {
        question: "15. Koja je osnovna razlika između nagiba krivulje i elastičnosti?",
        options: [
            "Nagib koristi postotke, elastičnost koristi iznose",
            "Elastičnost koristi postotne promjene, nagib koristi apsolutne promjene",
            "Nagib se mijenja duž krivulje, a elastičnost ostaje ista",
            "Elastičnost se računa samo za linije, a nagib za krivulje"
        ],
        answer: "Elastičnost koristi postotne promjene, nagib koristi apsolutne promjene"
    },
    {
        question: "16. Kada se primjenjuje na ponudu rada, cjenovna elastičnost ponude uvijek je pozitivna, nikako ne može biti negativna.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "17. Metoda luk-elastičnosti daje nam procjenu elastičnosti potražnje.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "18. Za komplementarne proizvode unakrsna elastičnost cijene je _________.",
        answer: ["negativna", "Negativna", "NEGATIVNA"]
    },
    {
        question: "19. Što je točno za ponudu ako je elastičnost ponude manja od 1?",
        options: [
            "Ponuda je jedinično elastična.",
            "Ponuda je cjenovno elastična.",
            "Ponuda je cjenovno neelastična."
        ],
        answer: "Ponuda je cjenovno neelastična."
    },
    {
        question: "20. Što je točno za ponudu ako je elastičnost ponude jednaka 1?",
        options: [
            "Ponuda je jedinično elastična.",
            "Ponuda je cjenovno elastična.",
            "Ponuda je cjenovno neelastična."
        ],
        answer: "Ponuda je jedinično elastična."
    }
];

const testId = "test_3";

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
