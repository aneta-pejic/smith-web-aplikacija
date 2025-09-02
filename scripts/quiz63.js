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
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    console.log("Prijavljen:", user.uid);
  } else {
    console.warn("Korisnik nije prijavljen.");
    alert("Niste prijavljeni. Rezultati kviza neće biti spremljeni.");
  }
});

const kvizId = "kviz63";

const quizData = [
  {
    question: "1. Što se događa u industriji u dugom roku kada postoje ekonomski profiti?",
    options: [
      "Poduzeća izlaze s tržišta, a krivulja ponude se pomiče ulijevo",
      "Ulaze nova poduzeća, a krivulja ponude se pomiče udesno",
      "Cijena raste, a profit raste",
      "Broj poduzeća ostaje isti"
    ],
    answer: "Ulaze nova poduzeća, a krivulja ponude se pomiče udesno"
  },
  {
    question: "2. Koja je glavna razlika između ekonomskog i računovodstvenog profita?",
    options: [
      "Računovodstveni profit uključuje implicitne i eksplicitne troškove",
      "Ekonomski profit uključuje samo eksplicitne troškove",
      "Ekonomski profit uključuje oportunitetne (implicitne) troškove, dok računovodstveni samo eksplicitne"
    ],
    answer: "Ekonomski profit uključuje oportunitetne (implicitne) troškove, dok računovodstveni samo eksplicitne"
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
    question: "4. Što se događa s cijenama proizvodnih faktora u industriji s rastućim troškovima kada nova poduzeća ulaze na tržište?",
    options: [
      "Cijene inputa ostaju iste",
      "Cijene inputa padaju",
      "Cijene inputa rastu",
      "Cijene inputa su nepredvidive"
    ],
    answer: "Cijene inputa rastu"
  },
  {
    question: "5. Koja je posljedica uvođenja godišnje licence kao fiksnog troška na kratki rok?",
    options: [
      "Cijena i količina proizvodnje se mijenjaju odmah",
      "Krivulja graničnog troška se pomiče gore",
      "Nema promjene u cijeni ni količini, ali će doći do izlaska poduzeća u dugom roku"
    ],
    answer: "Nema promjene u cijeni ni količini, ali će doći do izlaska poduzeća u dugom roku"
  }
];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit");

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let startTime = Date.now();

function showQuestion() {
  const question = quizData[currentQuestion];
  questionElement.innerText = question.question;

  optionsElement.innerHTML = "";
  selectedAnswer = null;

  question.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("option-btn");

    button.addEventListener("click", () => {
      selectedAnswer = option;

      document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    optionsElement.appendChild(button);
  });
}

submitButton.addEventListener("click", () => {
  if (!selectedAnswer) {
    alert("Molimo odaberite odgovor!");
    return;
  }

  quizData[currentQuestion].userAnswer = selectedAnswer;

  if (selectedAnswer === quizData[currentQuestion].answer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  const endTime = Date.now();
  const durationInSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const timeString = `${minutes}:${seconds}`;

  let resultHTML = `
    <div class="quiz-header">
      <h1>Kviz završen!</h1>
      <p style="font-size: 1.1em; margin-top: -10px;">Vrijeme rješavanja: ${timeString}</p>
      <button class="close-btn" onclick="closeQuiz()">×</button>
    </div>
    <p>Osvojeni bodovi: ${score}/${quizData.length}</p>
    <div class="answers-review">
  `;

  quizData.forEach((q, index) => {
    const userAnswer = q.userAnswer || "Niste odgovorili";
    const correct = userAnswer === q.answer;

    resultHTML += `
      <div class="answer-block ${correct ? 'correct' : 'incorrect'}">
        <strong>${q.question}</strong><br>
        Tvoj odgovor: <span>${userAnswer}</span><br>
        Točan odgovor: <span>${q.answer}</span>
      </div>
    `;
  });

  resultHTML += `
    </div>
    <div class="quiz-actions">
      <button onclick="closeQuiz()" class="btn">Završi</button>
      <a href="savršena_konkurencija.html" class="btn">Nastavi s učenjem</a>
      ${currentUser ? '<a href="rezultati_kvizova.html" class="btn">Pogledaj sve rezultate</a>' : ''}
    </div>
  `;

  document.getElementById("quiz").innerHTML = resultHTML;

  if (currentUser) {
    const uid = currentUser.uid;
    const rezultatRef = firebase.database().ref(`korisnici/${uid}/rezultatiKvizova/${kvizId}`);
    rezultatRef.push({
      datum: new Date().toISOString(),
      rezultat: score,
      ukupno: quizData.length,
      trajanje: timeString
    }).then(() => {
      console.log("Rezultat kviza spremljen.");
    }).catch(error => {
      console.error("Greška prilikom spremanja rezultata kviza:", error);
    });
  }
}

showQuestion();

function closeQuiz() {
  document.getElementById("quiz").style.display = "none";
  window.history.back();
}

