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
        question: "1. Kako monopol određuje cijenu i količinu proizvodnje?",
        options: [
            "Monopol određuje količinu gdje je cijena jednaka graničnom trošku, a cijenu prema krivulji ponude.",
            "Monopol određuje količinu tako da izjednači granični trošak s graničnim prihodom i zatim postavlja cijenu prema krivulji potražnje."
        ],
        answer: "Monopol određuje količinu tako da izjednači granični trošak s graničnim prihodom i zatim postavlja cijenu prema krivulji potražnje."
    },
    {
        question: "2. Koji je glavni razlog neučinkovitosti monopola u usporedbi sa savršenom konkurencijom?",
        options: [
            "Monopol proizvodi veću količinu po nižoj cijeni od savršene konkurencije.",
            "Monopol cijenu postavlja nižu od graničnog troška.",
            "Monopol cijenu postavlja veću od graničnog troška, što dovodi do manje potrošnje nego što je ekonomski učinkovito."
        ],
        answer: "Monopol cijenu postavlja veću od graničnog troška, što dovodi do manje potrošnje nego što je ekonomski učinkovito."
    },
    {
        question: "3. Kako se granični prihod ponaša u odnosu na cijenu kod monopola?",
        options: [
            "Granični prihod je uvijek manji od cijene",
            "Granični prihod je uvijek veći od cijene",
            "Granični prihod je jednak cijeni samo kada je potražnja savršeno elastična",
            "Granični prihod ne ovisi o cijeni"
        ],
        answer: "Granični prihod je uvijek manji od cijene"
    },
    {
        question: "4. Što označava pojam ODREĐIVAČ CIJENE?",
        options: [
            "Poduzeće koje određuje cijene u skladu s konkurentskim tržištem",
            "Državna agencija koja postavlja cijene dobara",
            "Poduzeće koje samo određuje cijenu temeljem svoje odluke o količini proizvodnje",
            "Poduzeće koje proizvodi po konstantnim troškovima"
        ],
        answer: "Poduzeće koje samo određuje cijenu temeljem svoje odluke o količini proizvodnje"
    },
    {
        question: "5. Koji je od sljedećih izvora monopolske moći?",
        options: [
            "Slobodan ulazak novih poduzeća na tržište",
            "Ekskluzivne franšize dodijeljene od strane vlade",
            "Niska potražnja na tržištu",
            "Višak ponude u industriji"
        ],
        answer: "Ekskluzivne franšize dodijeljene od strane vlade"
    },
    {
        question: "6. U kojoj točki krivulje potražnje monopol ostvaruje najveći ukupni prihod?",
        options: [
            "Kada je potražnja savršeno elastična",
            "Kada su granični trošak i granični prihod jednaki",
            "Kada je potražnja jedinično elastična (elastičnost = -1)",
            "Kada je cijena maksimalna"
        ],
        answer: "Kada je potražnja jedinično elastična (elastičnost = -1)"
    },
    {
        question: "7. Što je točno za granični prihod u odnosu na elastičnost potražnje?",
        options: [
            "Granični prihod je negativan kada je potražnja jedinično elastična",
            "Granični prihod je pozitivan kada je potražnja elastična",
            "Granični prihod je uvijek jednak nuli kod monopola",
            "Granični prihod se ne mijenja s elastičnošću"
        ],
        answer: "Granični prihod je pozitivan kada je potražnja elastična"
    },
    {
        question: "8. Što najbolje opisuje monopol?",
        options: [
            "Tržište s velikim brojem konkurenata",
            "Tržište na kojem postoji samo jedno poduzeće bez bliskih supstituta",
            "Tržište koje prihvaća tržišnu cijenu kao zadanu",
            "Tržište s potpuno slobodnim ulaskom i izlaskom"
        ],
        answer: "Tržište na kojem postoji samo jedno poduzeće bez bliskih supstituta"
    },
    {
        question: "9. Koja izjava najbolje opisuje prirodni monopol?",
        options: [
            "Poduzeće koje proizvodi luksuzne proizvode s visokom cijenom",
            "Poduzeće koje ima potpunu kontrolu nad cijenama zbog državne potpore",
            "Poduzeće koje ima padajuće dugoročne prosječne troškove u cijelom rasponu potražnje"
        ],
        answer: "Poduzeće koje ima padajuće dugoročne prosječne troškove u cijelom rasponu potražnje"
    },
    {
        question: "10. Što predstavlja područje označeno kao GRC u analizi monopola?",
        options: [
            "Dobit monopola.",
            "Gubitak ekonomske dobiti ili tzv. deadweight loss uzrokovan monopolom.",
            "Potrošački višak u savršenoj konkurenciji."
        ],
        answer: "Gubitak ekonomske dobiti ili tzv. deadweight loss uzrokovan monopolom."
    },
    {
        question: "11. Koji je ključni razlog zbog kojeg monopol može ostvarivati dugoročni profit?",
        options: [
            "Postoji slobodan ulazak novih konkurenata.",
            "Ulazak na tržište je blokiran, što sprječava konkurenciju.",
            "Monopol ima horizontalnu krivulju potražnje."
        ],
        answer: "Ulazak na tržište je blokiran, što sprječava konkurenciju."
    },
    {
        question: "12. Zašto monopol nikada neće odabrati cijenu i količinu u neelastičnom dijelu krivulje potražnje?",
        options: [
            "Jer je tada ukupni prihod uvijek viši",
            "Jer smanjenjem cijene u tom dijelu ukupni prihod pada",
            "Jer tada raste granični prihod",
            "Jer tada granični trošak postaje negativan"
        ],
        answer: "Jer smanjenjem cijene u tom dijelu ukupni prihod pada"
    },
    {
        question: "13. Koji je od sljedećih primjera prepreke ulasku na tržište?",
        options: [
            "Visoki nepovratni troškovi oglašavanja",
            "Mala potražnja za luksuznim dobrima",
            "Postojanje više malih poduzeća u industriji",
            "Jednostavan pristup svim sirovinama"
        ],
        answer: "Visoki nepovratni troškovi oglašavanja"
    },
    {
        question: "14. Koja je ključna razlika između monopola i poduzeća u savršenoj konkurenciji kada je riječ o određivanju cijene?",
        options: [
            "Monopol određuje cijenu na temelju graničnog troška",
            "Monopol se suočava s horizontalnom krivuljom potražnje",
            "Monopol je cjenovni određivač, dok je poduzeće u savršenoj konkurenciji cjenovni primatelj",
            "Oba subjekta mogu slobodno odrediti i cijenu i količinu"
        ],
        answer: "Monopol je cjenovni određivač, dok je poduzeće u savršenoj konkurenciji cjenovni primatelj"
    },
    {
        question: "15. Koji je jedan od glavnih javnih politika prema prirodnim monopolima?",
        options: [
            "Potpuna zabrana monopola.",
            "Regulacija cijena i kontrola profita monopolista kako bi se spriječila zloupotreba moći.",
            "Potpuna liberalizacija tržišta bez ikakve regulacije."
        ],
        answer: "Regulacija cijena i kontrola profita monopolista kako bi se spriječila zloupotreba moći."
    },
    {
        question: "16. Liječnici, stomatolozi i mehaničari u izoliranim mjestima također mogu biti monopolisti.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "17. Monopol je u savršenoj konkurenciji prihvatitelj cijene, dok je poduzeće određivač cijene.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    },
    {
        question: "18. Odaberite točnu tvrdnju.",
        options: [
            "U slučaju savršene konkurencije, dodatni prihod koji poduzeće ostvaruje prodajom dodatne jedinice jednak je tržišnoj cijeni.",
            "U slučaju savršene konkurencije, dodatni prihod koji poduzeće ostvaruje prodajom dodatne jedinice manji je od tržišne cijene.",
            "U slučaju savršene konkurencije, dodatni prihod koji poduzeće ostvaruje prodajom dodatne jedinice veći je od tržišne cijene."
        ],
        answer: "U slučaju savršene konkurencije, dodatni prihod koji poduzeće ostvaruje prodajom dodatne jedinice jednak je tržišnoj cijeni."
    },
    {
        question: "19. Monopolskoj firmi zajamčen je profit.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Netočno"
    },
    {
        question: "20. Poduzeće s opadajućom krivuljom dugoročnih prosječnih troškova u cijelom rasponu proizvodnje relevantnom za postojeću potražnju monopolizirat će industriju.",
        options: [
            "Točno",
            "Netočno"
        ],
        answer: "Točno"
    }
];

const testId = "test_7";

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
