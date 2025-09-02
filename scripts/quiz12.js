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

const quizData = [
  {
    question: "1.  Koji je osnovni cilj pojedinaca prema ekonomistima kada donose odluke?",
    options: [
      "Zadovoljiti društvene norme",
      "Maksimizirati vrijednost cilja definiranog prema vlastitom samointeresu",
      "Djelovati nesebično u korist drugih",
      "Uvijek birati najjeftiniju opciju"
    ],
    answer: "Maksimizirati vrijednost cilja definiranog prema vlastitom samointeresu"
  },
  {
    question: "2. Što je oportunitetni trošak?",
    options: [
      "Iznos novca koji se mora platiti za neki proizvod",
      "Vrijednost najbolje propuštene alternative",
      "Količina vremena potrebna za donošenje odluke"
    ],
    answer: "Vrijednost najbolje propuštene alternative"
  },
  {
    question: "3. Ekonomisti pretpostavljaju da su svi ljudi sebični.",
    options: [
      "Točno",
      "Netočno"
    ],
    answer: "Netočno"
  },
  {
    question: "4. Kako ekonomisti promatraju donošenje odluka?",
    options: [
      "Kao sve-ili-ništa odluke",
      "Kao izbor između krajnjih opcija bez sredine",
      "Kao odluke koje se donose na marginama, tj. male promjene u razinama aktivnosti"
    ],
    answer: "Kao odluke koje se donose na marginama, tj. male promjene u razinama aktivnosti"
  },
  {
    question: "5. Koja je razlika između mikroekonomije i makroekonomije?",
    options: [
      "Mikroekonomija se bavi pojedincima i poduzećima, a makroekonomija ukupnom razinom ekonomske aktivnosti",
      "Makroekonomija analizira ponašanje tržišta nekretnina",
      "Mikroekonomija se bavi isključivo bankama",
      "Makroekonomija se bavi donošenjem osobnih financijskih odluka"
    ],
    answer: "Mikroekonomija se bavi pojedincima i poduzećima, a makroekonomija ukupnom razinom ekonomske aktivnosti"
  }
];

const kvizId = "kviz12";

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
      <a href="područje_ekonomije.html" class="btn">Nastavi s učenjem</a>
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

function closeQuiz() {
  document.getElementById("quiz").style.display = "none";
  window.history.back();
}

showQuestion();

