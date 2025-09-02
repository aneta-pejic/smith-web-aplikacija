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
    question: "1. Što proučava ekonomija kao društvena znanost?",
    options: [
      "Načine na koje prirodni resursi nastaju i razvijaju se",
      "Kako ljudi donose odluke među dostupnim alternativama",
      "Isključivo financijske transakcije i poslovanje banaka",
      "Povijest trgovine i razvoja novca"
    ],
    answer: "Kako ljudi donose odluke među dostupnim alternativama"
  },
  {
    question: "2. Koji od sljedećih pojmova NIJE jedan od tri ključna pojma u ekonomiji?",
    options: ["Oskudnost dobara", "Inflacija", "Izbor", "Oportunitetni trošak"],
    answer: "Inflacija"
  },
  {
    question: "3. Zašto zrak može biti oskudno dobro?",
    options: [
      "Zato što ga uvijek ima u neograničenim količinama",
      "Zato što može imati alternativne upotrebe, poput disanja i kao odlagalište otpada",
      "Zato što svi ljudi jednako dišu"
    ],
    answer: "Zato što može imati alternativne upotrebe, poput disanja i kao odlagalište otpada"
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
    question: "5. Koje od sljedećih pitanja NIJE jedno od temeljnih ekonomskih pitanja?",
    options: [
      "Što treba proizvoditi?",
      "Kako treba proizvoditi?",
      "Tko će trošiti najviše dobara?",
      "Za koga treba proizvoditi?"
    ],
    answer: "Tko će trošiti najviše dobara?"
  }
];

const kvizId = "kviz11";

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit");

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

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

  quizData.forEach(q => {
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
      <a href="definicija_ekonomije.html" class="btn">Nastavi s učenjem</a>
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

