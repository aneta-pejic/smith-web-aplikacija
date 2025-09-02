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
    question: "1. Varijabla je...",
    options: [
      "veličina čija se vrijednost može mijenjati.",
      "veličina koja ostaje nepromijenjena."
    ],
    answer: "veličina čija se vrijednost može mijenjati."
  },
  {
    question: "2. Inflacija _____ jedna od tri ključna pojma u ekonomiji.",
    answer: "nije"
  },
  {
    question: "3. Hipoteza koja opstane nakon brojnih testiranja i opće je prihvaćena naziva se zakonom.",
    options: ["Točno", "Netočno"],
    answer: "Netočno"
  },
  {
    question: "4. Što je oportunitetni trošak?",
    options: [
      "Vrijednost najbolje alternative koje se odričemo prilikom donošenja odluke",
      "Trošak proizvodnje nekog dobra ili usluge",
      "Dug koji nastaje zbog ekonomskih odluka"
    ],
    answer: "Vrijednost najbolje alternative koje se odričemo prilikom donošenja odluke"
  },
  {
    question: "5. Ekonomisti pretpostavljaju da su svi ljudi sebični.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Netočno"
  },
  {
    question: "6. Ekonomisti promatraju donošenje odluka kao odluke koje se donose na _________, tj. male promjene u razinama aktivnosti.",
    answer: ["marginama", "margini"]
  },
  {
    question: "7. U ekonomiji razlikujemo dvije vrste tvrdnji:",
    options: [
      "pozitivne i negativne",
      "normativne i pozitivne",
      "normativne i negativne",
    ],
    answer: "normativne i pozitivne"
  },
  {
    question: "8. Što proučava ekonomija kao društvena znanost?",
    options: [
      "Načine na koje prirodni resursi nastaju i razvijaju se",
      "Kako ljudi donose odluke među dostupnim alternativama",
      "Isključivo financijske transakcije i poslovanje banaka",
      "Povijest trgovine i razvoja novca"
    ],
    answer: "Kako ljudi donose odluke među dostupnim alternativama"
  },
  {
    question: "9. Zašto zrak može biti oskudno dobro?",
    options: [
      "Zato što ga uvijek ima u neograničenim količinama",
      "Zato što može imati alternativne upotrebe, poput disanja i kao odlagalište otpada",
      "Zato što svi ljudi jednako dišu"
    ],
    answer: "Zato što može imati alternativne upotrebe, poput disanja i kao odlagalište otpada"
  },
  {
    question: "10.  Koji je osnovni cilj pojedinaca prema ekonomistima kada donose odluke?",
    options: [
      "Zadovoljiti društvene norme",
      "Maksimizirati vrijednost cilja definiranog prema vlastitom samointeresu",
      "Djelovati nesebično u korist drugih",
      "Uvijek birati najjeftiniju opciju"
    ],
    answer: "Maksimizirati vrijednost cilja definiranog prema vlastitom samointeresu"
  },
  {
    question: "11. Dva velika problema kod testiranja ekonomskih hipoteza su:",
    options: [
      "problem svih-ostalih-stvari-nepromijenjenih i zabluda lažne uzročnosti",
      "ceteris paribus i zabluda lažne uzročnosti"
    ],
    answer: "problem svih-ostalih-stvari-nepromijenjenih i zabluda lažne uzročnosti"
  },
  {
    question: "12. Odaberi temeljna ekonomska pitanja.",
    options: [
      "Što treba proizvoditi?",
      "Kako treba proizvoditi?",
      "Tko će trošiti najviše dobara?",
      "Za koga treba proizvoditi?"
    ],
    answer: ["Što treba proizvoditi?", "Kako treba proizvoditi?", "Za koga treba proizvoditi?"],
    multi: true
  },
  {
    question: "13. Konstanta je...",
    options: [
      "veličina čija se vrijednost može mijenjati.",
      "veličina koja ostaje nepromijenjena."
    ],
    answer: "veličina koja ostaje nepromijenjena."
  },
  {
    question: "14. Ekonomija se dijeli na dva područja: __________ i __________. (Odgovore odvojiti zarezom.)",
    answer: ["mikroekonomiju, makroekonomiju", "mikroekonomiju,makroekonomiju", "makroekonomiju, mikroekonomiju", "makroekonomiju,mikroekonomiju", "makroekonomija, mikroekonomija", "makroekonomija,mikroekonomija", "mikroekonomija, makroekonomija", "mikroekonomija,makroekonomija"]
  },
  {
    question: "15. Koja je razlika između mikroekonomije i makroekonomije?",
    options: [
      "Mikroekonomija se bavi pojedincima i poduzećima, a makroekonomija ukupnom razinom ekonomske aktivnosti",
      "Makroekonomija analizira ponašanje tržišta nekretnina",
      "Mikroekonomija se bavi isključivo bankama",
      "Makroekonomija se bavi donošenjem osobnih financijskih odluka"
    ],
    answer: "Mikroekonomija se bavi pojedincima i poduzećima, a makroekonomija ukupnom razinom ekonomske aktivnosti"
  },
  {
    question: "16. Ono dobro kod kojeg odabir jedne upotrebe ne zahtijeva odricanje od druge naziva se...",
    options: [
      "oskudno dobro",
      "slobodno dobro",
      "dobrovoljno dobro"
    ],
    answer: "slobodno dobro"
  },
  {
    question: "17. Uvođenje cestarine smanjuje gužve.",
    options: [
      "Ova rečenica predstavlja pozitivnu tvrdnju.",
      "Ova rečenica predstavlja normativnu tvrdnju."
    ],
    answer: "Ova rečenica predstavlja pozitivnu tvrdnju."
  },
  {
    question: "18. Vožnja autocestom bi trebala biti besplatna za sve.",
    options: [
      "Ova rečenica predstavlja pozitivnu tvrdnju.",
      "Ova rečenica predstavlja normativnu tvrdnju."
    ],
    answer: "Ova rečenica predstavlja normativnu tvrdnju."
  },
  {
    question: "19. Što znači izraz ceteris paribus i zašto može predstavljati problem u ekonomskim analizama?",
    options: [
      "Označava uvjet pod kojim se sve varijable mijenjaju istovremeno.",
      "Označava pretpostavku da se svi ostali uvjeti ne mijenjaju.",
      "Pokazuje da su svi zaključci u ekonomiji uvijek točni."
    ],
    answer: "Označava pretpostavku da se svi ostali uvjeti ne mijenjaju."
  },
  {
    question: "20. Što predstavlja zabluda lažne uzročnosti u ekonomiji?",
    options: [
      "Tvrdnju koja koristi previše stručnih izraza i zbunjuje čitatelja.",
      "Zaključak da postoji uzročno-posljedična veza između dviju varijabli samo zato što su povezane.",
      "Situaciju u kojoj varijable nemaju nikakvu povezanost.",
      "Ispravnu identifikaciju uzroka i posljedice pomoću korelacije."
    ],
    answer: "Zaključak da postoji uzročno-posljedična veza između dviju varijabli samo zato što su povezane."
  }
];

const testId = "test_1";

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
      if (JSON.stringify(korisnik) === JSON.stringify(tocno)) score++;
    } else if (typeof pitanje.answer === "string") {
      if (korisnikovOdgovor.trim().toLowerCase() === pitanje.answer.trim().toLowerCase()) score++;
    } else if (Array.isArray(pitanje.answer)) {
      const korisnikOdgovorTrim = korisnikovOdgovor.trim().toLowerCase();
      const tocniOdgovori = pitanje.answer.map(a => a.trim().toLowerCase());
      if (tocniOdgovori.includes(korisnikOdgovorTrim)) score++;
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
      console.log("Rezultat testa spremljen.");
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

