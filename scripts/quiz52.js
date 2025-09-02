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

const kvizId = "kviz52";

const quizData = [
  {
    question: "1. Koja je osnovna razlika između kratkoročnog i dugoročnog razdoblja u pogledu proizvodnih faktora?",
    options: [
      "U dugom roku svi proizvodni faktori su fiksni",
      "U kratkom roku svi proizvodni faktori su varijabilni",
      "U dugom roku svi proizvodni faktori su varijabilni"
    ],
    answer: "U dugom roku svi proizvodni faktori su varijabilni"
  },
  {
    question: "2. Što poduzeće želi postići prema pravilu marginalne odluke?",
    options: [
      "Maksimizirati fiksne troškove",
      "Izabrati najskuplju kombinaciju faktora",
      "Maksimalnu moguću proizvodnju za dani ukupni trošak"
    ],
    answer: "Maksimalnu moguću proizvodnju za dani ukupni trošak"
  },
  {
    question: "3. Ako poduzeće postaje „kapitalno intenzivnije”, što se događa s njegovom proizvodnom kombinacijom?",
    options: [
      "Koristi relativno više rada i manje kapitala",
      "Koristi relativno više kapitala i manje rada",
      "Povećava omjer rada prema kapitalu"
    ],
    answer: "Koristi relativno više kapitala i manje rada"
  },
  {
    question: "4. Koji je uvjet za učinkovitu uporabu faktora prema pravilu marginalne odluke?",
    options: [
      "MPK = MPL",
      "MPK/PK = MPL/PL",
      "PK = PL",
      "MPK * PL = MPL * PK"
    ],
    answer: "MPK/PK = MPL/PL"
  },
  {
    question: "5. Što opisuje dio LRAC krivulje koji pada?",
    options: [
      "Diseekonomije razmjera",
      "Konstantni troškovi",
      "Ekonomije razmjera",
      "Zakon opadajućih prinosa"
    ],
    answer: "Ekonomije razmjera"
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
      <a href="dugoročno_razdoblje.html" class="btn">Nastavi s učenjem</a>
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
      vrijeme: timeString
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

