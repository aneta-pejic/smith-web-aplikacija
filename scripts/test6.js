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
    question: "1. Koja je temeljna pretpostavka za poduzeće koje djeluje u savršenoj konkurenciji?",
    options: [
      "Može utjecati na tržišnu cijenu svojih proizvoda",
      "Prodaje robu po višoj cijeni od tržišne",
      "Prihvaća tržišnu cijenu kao zadanu",
      "Određuje cijenu proizvoda na temelju svojih troškova"
    ],
    answer: "Prihvaća tržišnu cijenu kao zadanu"
  },
  {
    question: "2. Kada poduzeće maksimizira dobit prema marginalnom pravilu odlučivanja?",
    options: [
      "Kada je MR = MC",
      "Kada je P > AVC",
      "Kada su ukupni prihodi veći od ukupnih troškova"
    ],
    answer: "Kada je MR = MC"
  },
  {
    question: "3. Kako se dugoročna krivulja ponude ponaša u industriji s konstantnim troškovima?",
    options: [
      "Ima uzlazni nagib",
      "Ima silazni nagib",
      "Je horizontalna linija",
      "Nije definirana"
    ],
    answer: "Je horizontalna linija"
  },
  {
    question: "4. Zašto je pretpostavka identičnosti proizvoda važna u modelu savršene konkurencije?",
    options: [
      "Jer omogućava tvrtkama da određuju cijene",
      "Jer eliminira potrebu za reklamiranjem",
      "Jer jamči da su svi proizvodi različite kvalitete",
      "Jer sprječava da bilo koja tvrtka ima utjecaj na cijenu"
    ],
    answer: "Jer sprječava da bilo koja tvrtka ima utjecaj na cijenu"
  },
  {
    question: "5. Kako jednostavan ulazak i izlazak utječu na konkurenciju?",
    options: [
      "Smanjuju broj sudionika na tržištu",
      "Otežavaju nove ulaske zbog rizika",
      "Jačaju konkurenciju jer novi ulasci brzo reagiraju na profitne prilike",
      "Nemaju utjecaja jer cijene su već zadane"
    ],
    answer: "Jačaju konkurenciju jer novi ulasci brzo reagiraju na profitne prilike"
  },
  {
    question: "6. Koja je glavna karakteristika modela savršene konkurencije?",
    options: [
      "Cijene određuju velike kompanije",
      "Vlada regulira cijene proizvoda",
      "Cijene se određuju interakcijom ponude i potražnje",
      "Kupci pregovaraju pojedinačno s prodavateljima"
    ],
    answer: "Cijene se određuju interakcijom ponude i potražnje"
  },
  {
    question: "7. Što se događa u industriji u dugom roku kada postoje ekonomski profiti?",
    options: [
      "Poduzeća izlaze s tržišta, a krivulja ponude se pomiče ulijevo",
      "Ulaze nova poduzeća, a krivulja ponude se pomiče udesno",
      "Cijena raste, a profit raste",
      "Broj poduzeća ostaje isti"
    ],
    answer: "Ulaze nova poduzeća, a krivulja ponude se pomiče udesno"
  },
  {
    question: "8. Koja je glavna razlika između ekonomskog i računovodstvenog profita?",
    options: [
      "Računovodstveni profit uključuje implicitne i eksplicitne troškove",
      "Ekonomski profit uključuje samo eksplicitne troškove",
      "Ekonomski profit uključuje oportunitetne (implicitne) troškove, dok računovodstveni samo eksplicitne"
    ],
    answer: "Ekonomski profit uključuje oportunitetne (implicitne) troškove, dok računovodstveni samo eksplicitne"
  },
  {
    question: "9. Ako je tržišna cijena niža od prosječnog ukupnog troška, ali viša od prosječnog varijabilnog troška, što bi poduzeće trebalo učiniti?",
    options: [
      "Odmah obustaviti proizvodnju",
      "Nastaviti s proizvodnjom kako bi minimiziralo gubitke",
      "Smanjiti cijenu proizvoda"
    ],
    answer: "Nastaviti s proizvodnjom kako bi minimiziralo gubitke"
  },
  {
    question: "10. Kako se izračunava ekonomska dobit po jedinici?",
    options: [
      "Kao razlika između ukupnog prihoda i ukupnih troškova",
      "Kao razlika između cijene i prosječnog ukupnog troška (P − ATC)",
      "Kao ukupni prihod podijeljen s količinom"
    ],
    answer: "Kao razlika između cijene i prosječnog ukupnog troška (P − ATC)"
  },
  {
    question: "11. Što znači da su sudionici u savršenoj konkurenciji „cjenovni sljedbenici“?",
    options: [
      "Oni sami određuju tržišnu cijenu",
      "Ne znaju tržišnu cijenu unaprijed",
      "Prihvaćaju tržišnu cijenu kao zadanu",
      "Podižu cijene kako bi povećali profit"
    ],
    answer: "Prihvaćaju tržišnu cijenu kao zadanu"
  },
  {
    question: "12. Koja od sljedećih pretpostavki NIJE dio modela savršene konkurencije?",
    options: [
      "Postoji velik broj kupaca i prodavatelja",
      "Tvrtke proizvode diferencirane proizvode",
      "Ulazak i izlazak iz industrije je jednostavan",
      "Kupci i prodavatelji imaju potpune informacije"
    ],
    answer: "Tvrtke proizvode diferencirane proizvode"
  },
  {
    question: "13. Što označava vodoravna linija u modelu savršene konkurencije?",
    options: [
      "Krivulju ukupnog troška",
      "Krivulju ukupnog prihoda",
      "Krivulju graničnog i prosječnog prihoda"
    ],
    answer: "Krivulju graničnog i prosječnog prihoda"
  },
  {
    question: "14. Što se događa s cijenama proizvodnih faktora u industriji s rastućim troškovima kada nova poduzeća ulaze na tržište?",
    options: [
      "Cijene inputa ostaju iste",
      "Cijene inputa padaju",
      "Cijene inputa rastu",
      "Cijene inputa su nepredvidive"
    ],
    answer: "Cijene inputa rastu"
  },
  {
    question: "15. Koja je posljedica uvođenja godišnje licence kao fiksnog troška na kratki rok?",
    options: [
      "Cijena i količina proizvodnje se mijenjaju odmah",
      "Krivulja graničnog troška se pomiče gore",
      "Nema promjene u cijeni ni količini, ali će doći do izlaska poduzeća u dugom roku"
    ],
    answer: "Nema promjene u cijeni ni količini, ali će doći do izlaska poduzeća u dugom roku"
  },
  {
    question: "16. Ekonomski gubitak (negativni ekonomski profit) nastaje kada ukupni prihodi premašuju ukupne troškove.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Netočno"
  },
  {
    question: "17. Ukupni prihod poduzeća izračunava se množenjem količine proizvodnje s _______ po kojoj se ta količina prodaje.",
    answer: "cijenom"
  },
  {
    question: "18. U savršenoj konkurenciji pretpostavlja se da postoji toliko kupaca i prodavatelja da...",
    options: [
      "samo kupci utječu na cijenu.",
      "samo prodavatelji imaju utjecaj na cijenu.",
      "nijedan od njih nema utjecaja na cijenu."
    ],
    answer: "nijedan od njih nema utjecaja na cijenu."
  },
  {
    question: "19. Model savršene konkurencije čini temelj za model ponude i potražnje.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Točno"
  },
  {
    question: "20. Primarna primjena modela savršene konkurencije je u predviđanju kako će poduzeća reagirati na promjene u potražnji i u troškovima proizvodnje.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Točno"
  }
];

const testId = "test_6";

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
