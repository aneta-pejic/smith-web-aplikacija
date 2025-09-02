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
    question: "1. Što ekonomisti nazivaju „korisnošću”?",
    options: [
      "Novčana vrijednost nekog dobra",
      "Zadovoljstvo koje osoba dobiva konzumacijom dobara i usluga",
      "Količina novca koju potrošač može uštedjeti",
      "Broj proizvoda koji se mogu kupiti u zadanom roku"
    ],
    answer: "Zadovoljstvo koje osoba dobiva konzumacijom dobara i usluga"
  },
  {
    question: "2. Koji zakon objašnjava zašto potrošači na kraju prestanu konzumirati jedno te isto dobro?",
    options: [
      "Zakon ponude i potražnje",
      "Zakon granične proizvodnje",
      "Zakon opadajuće granične korisnosti",
      "Zakon potrošnje i štednje"
    ],
    answer: "Zakon opadajuće granične korisnosti"
  },
  {
    question: "3. Kako se tržišna krivulja potražnje za jabukama dobiva?",
    options: [
      "Dijeljenjem ukupne potražnje na broj potrošača",
      "Zbrajanjem količina koje svi potrošači traže pri svakoj cijeni (vodoravno zbrajanje)",
      "Množenjem cijene jabuka s ukupnom potražnjom",
      "Uzimajući samo najveću pojedinačnu potražnju na tržištu"
    ],
    answer: "Zbrajanjem količina koje svi potrošači traže pri svakoj cijeni (vodoravno zbrajanje)"
  },
  {
    question: "4. Koji su dva glavna učinka promjene cijene na potrošnju dobara?",
    options: [
      "Efekt poreza i efekt subvencija",
      "Efekt supstitucije i efekt dohotka",
      "Efekt potražnje i efekt ponude",
      "Efekt inflacije i efekt deflacije"
    ],
    answer: "Efekt supstitucije i efekt dohotka"
  },
  {
    question: "5. Koja tvrdnja najbolje opisuje točke koje se nalaze iznad i desno od krivulje indiferencije?",
    options: [
      "One su inferiorne u odnosu na točke na krivulji",
      "Potrošač ih izbjegava jer nisu dostupne",
      "One predstavljaju višu razinu korisnosti i poželjnije su",
      "Svejedno je potrošaču između tih točaka i onih na krivulji"
    ],
    answer: "One predstavljaju višu razinu korisnosti i poželjnije su"
  },
  {
    question: "6. Što predstavlja proračunska linija u analizi izbora potrošača?",
    options: [
      "Granicu između inferiornih i superiornih dobara",
      "Srednju vrijednost korisnosti između dva dobra",
      "Kombinacije dvaju dobara koje potrošač može priuštiti s danim budžetom",
      "Krivulju koja pokazuje sklonost potrošača prema luksuznim dobrima"
    ],
    answer: "Kombinacije dvaju dobara koje potrošač može priuštiti s danim budžetom"
  },
  {
    question: "7. Što prikazuje krivulja indiferencije?",
    options: [
      "Maksimalni iznos koji potrošač može potrošiti",
      "Sve kombinacije dobara koje potrošač ne može priuštiti",
      "Kombinacije dvaju dobara koje donose jednaku razinu korisnosti",
      "Cijene dobara koje se mijenjaju tijekom vremena"
    ],
    answer: "Kombinacije dvaju dobara koje donose jednaku razinu korisnosti"
  },
  {
    question: "8. Što označava izraz MUx/Px u kontekstu korisnosti?",
    options: [
      "Cijenu dobra X podijeljenu s njegovom masom",
      "Broj dobara X koje možemo kupiti za jedan euro",
      "Graničnu korisnost po jedinici cijene dobra X",
      "Ukupnu korisnost dobra X"
    ],
    answer: "Graničnu korisnost po jedinici cijene dobra X"
  },
  {
    question: "9. Prema pravilu granične odluke, potrošač maksimizira korisnost kada:",
    options: [
      "Troši isključivo na najskuplja dobra",
      "Ravnomjerno raspodijeli potrošnju između svih dobara",
      "Omjer granične korisnosti i cijene bude jednak za sva kupljena dobra",
      "Kupuje ono što je na popustu"
    ],
    answer: "Omjer granične korisnosti i cijene bude jednak za sva kupljena dobra"
  },
  {
    question: "10. Što opisuje pravilo granične odluke u kontekstu maksimizacije korisnosti?",
    options: [
      "Izbor koji maksimizira ukupnu potrošnju bez obzira na cijenu",
      "Izbor kod kojeg su omjeri granične korisnosti i cijene jednaki za sva dobra",
      "Izbor koji maksimizira potrošnju samo najjeftinijih dobara",
      "Izbor u kojem su cijene svih dobara jednake"
    ],
    answer: "Izbor kod kojeg su omjeri granične korisnosti i cijene jednaki za sva dobra"
  },
  {
    question: "11. Kako se mijenja potrošnja jabuka gospođe Andrews kada cijena jabuka padne s 2 eura na 1 euro po kilogramu?",
    options: [
      "Kupuje manje jabuka",
      "Kupuje istu količinu jabuka",
      "Kupuje više jabuka, povećavajući količinu s 5 na 12 kilograma",
      "Potrošnja jabuka ovisi samo o dohotku, ne o cijeni"
    ],
    answer: "Kupuje više jabuka, povećavajući količinu s 5 na 12 kilograma"
  },
  {
    question: "12. Kada potrošač maksimizira korisnost, što vrijedi?",
    options: [
      "Proračunska linija i krivulja indiferencije su paralelne",
      "Proračunska linija je tangenta na najvišu moguću krivulju indiferencije",
      "Granična stopa supstitucije je jednaka nuli",
      "Potrošač troši manje nego što ima na raspolaganju"
    ],
    answer: "Proračunska linija je tangenta na najvišu moguću krivulju indiferencije"
  },
  {
    question: "13. Što označava granična stopa supstitucije (MRS)?",
    options: [
      "Prosječna cijena između dvaju dobara",
      "Količinu jednog dobra koje je potrošač spreman žrtvovati za dodatnu jedinicu drugog dobra",
      "Udaljenost između dvije krivulje indiferencije",
      "Omjer budžeta prema korisnosti"
    ],
    answer: "Količinu jednog dobra koje je potrošač spreman žrtvovati za dodatnu jedinicu drugog dobra"
  },
  {
    question: "14. Što predstavlja „granična korisnost”?",
    options: [
      "Ukupan iznos novca potrošen na neko dobro",
      "Povećanje cijene nekog dobra zbog potražnje",
      "Povećanje ukupne korisnosti konzumacijom dodatne jedinice dobra",
      "Količina dobara koju potrošač može kupiti uz dani budžet"
    ],
    answer: "Povećanje ukupne korisnosti konzumacijom dodatne jedinice dobra"
  },
  {
    question: "15. Koja je razlika između efekta supstitucije i efekta dohotka?",
    options: [
      "Efekt supstitucije mijenja potrošnju zbog promjene cijene u odnosu na druga dobra, dok efekt dohotka mijenja potrošnju zbog promjene kupovne moći",
      "Efekt dohotka mijenja cijenu dobara, a efekt supstitucije mijenja dohodak potrošača",
      "Efekt supstitucije i efekt dohotka su isti i ne razlikuju se",
      "Efekt dohotka utječe samo na inferiorna dobra, a efekt supstitucije samo na normalna"
    ],
    answer: "Efekt supstitucije mijenja potrošnju zbog promjene cijene u odnosu na druga dobra, dok efekt dohotka mijenja potrošnju zbog promjene kupovne moći"
  },
  {
    question: "16. Ne postoji vaga kojom bismo mogli utvrditi količinu korisnosti koju nam neki proizvod ili usluga pružaju.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Točno"
  },
  {
    question: "17. Proračunska linija prikazuje kombinacije dvaju dobara koje potrošač može konzumirati s obzirom na ___________ ograničenje.",
    answer: ["proračunsko", "Proračunsko"]
  },
  {
    question: "18. U rješenju koje maksimizira korisnost, marginalna stopa supstitucije (apsolutna vrijednost nagiba krivulje indiferencije) jednaka je omjeru cijena dvaju dobara.",
    options: [
      "Ova tvrdnja je točna.",
      "Ova tvrdnja je polovično točna.",
      "Ova tvrdnja nije točna."
    ],
    answer: "Ova tvrdnja je točna."
  },
  {
    question: "19. Što je ukupna korisnost potrošača veća, to je viša razina njegova zadovoljstva.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Točno"
  },
  {
    question: "20. Kako bismo primijenili pravilo granične odluke na maksimizaciju korisnosti, dobra moraju biti djeljiva.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Točno"
  }
];

const testId = "test_4";

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
