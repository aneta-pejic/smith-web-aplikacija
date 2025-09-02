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

const kvizId = "kviz73";

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
    question: "3. Što predstavlja područje označeno kao GRC u analizi monopola?",
    options: [
      "Dobit monopola.",
      "Gubitak ekonomske dobiti ili tzv. deadweight loss uzrokovan monopolom.",
      "Potrošački višak u savršenoj konkurenciji."
    ],
    answer: "Gubitak ekonomske dobiti ili tzv. deadweight loss uzrokovan monopolom."
  },
  {
    question: "4. Koji je ključni razlog zbog kojeg monopol može ostvarivati dugoročni profit?",
    options: [
      "Postoji slobodan ulazak novih konkurenata.",
      "Ulazak na tržište je blokiran, što sprječava konkurenciju.",
      "Monopol ima horizontalnu krivulju potražnje."
    ],
    answer: "Ulazak na tržište je blokiran, što sprječava konkurenciju."
  },
  {
    question: "5. Koji je jedan od glavnih javnih politika prema prirodnim monopolima?",
    options: [
      "Potpuna zabrana monopola.",
      "Regulacija cijena i kontrola profita monopolista kako bi se spriječila zloupotreba moći.",
      "Potpuna liberalizacija tržišta bez ikakve regulacije."
    ],
    answer: "Regulacija cijena i kontrola profita monopolista kako bi se spriječila zloupotreba moći."
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
      <a href="procjena_monopola.html" class="btn">Nastavi s učenjem</a>
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

