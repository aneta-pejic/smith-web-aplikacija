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

const kvizId = "kviz82";

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
    question: "3. Kada dohodovni učinak nadmašuje supstitucijski učinak, krivulja ponude rada:",
    options: [
      "Ima pozitivan nagib",
      "Postaje horizontalna",
      "Postaje okomita",
      "Savija se unatrag"
    ],
    answer: "Savija se unatrag"
  },
  {
    question: "4. Koji čimbenik neće uzrokovati pomak krivulje ponude rada?",
    options: [
      "Promjena preferencija između rada i slobodnog vremena",
      "Promjena radnog vremena bez promjene nadnice",
      "Dobivanje nasljedstva",
      "Povećanje troškova aktivnosti za slobodno vrijeme"
    ],
    answer: "Promjena radnog vremena bez promjene nadnice"
  },
  {
    question: "5. Kako pad cijene komplementa radu (npr. brige o djeci) utječe na ponudu rada?",
    options: [
      "Smanjuje ponudu rada jer rad postaje manje atraktivan",
      "Povećava ponudu rada jer je lakše ići na posao",
      "Ne utječe na ponudu rada",
      "Povećava cijenu slobodnog vremena"
    ],
    answer: "Povećava ponudu rada jer je lakše ići na posao"
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
      <a href="ponuda_radne_snage.html" class="btn">Nastavi s učenjem</a>
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

