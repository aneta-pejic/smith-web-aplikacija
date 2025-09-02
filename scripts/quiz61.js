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

const kvizId = "kviz61";

const quizData = [
  {
    question: "1. Koja je glavna karakteristika modela savršene konkurencije?",
    options: [
      "Cijene određuju velike kompanije",
      "Vlada regulira cijene proizvoda",
      "Cijene se određuju interakcijom ponude i potražnje",
      "Kupci pregovaraju pojedinačno s prodavateljima"
    ],
    answer: "Cijene se određuju interakcijom ponude i potražnje"
  },
  {
    question: "2. Što znači da su sudionici u savršenoj konkurenciji „cjenovni sljedbenici“?",
    options: [
      "Oni sami određuju tržišnu cijenu",
      "Ne znaju tržišnu cijenu unaprijed",
      "Prihvaćaju tržišnu cijenu kao zadanu",
      "Podižu cijene kako bi povećali profit"
    ],
    answer: "Prihvaćaju tržišnu cijenu kao zadanu"
  },
  {
    question: "3. Koja od sljedećih pretpostavki NIJE dio modela savršene konkurencije?",
    options: [
      "Postoji velik broj kupaca i prodavatelja",
      "Tvrtke proizvode diferencirane proizvode",
      "Ulazak i izlazak iz industrije je jednostavan",
      "Kupci i prodavatelji imaju potpune informacije"
    ],
    answer: "Tvrtke proizvode diferencirane proizvode"
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
    alert("Molimo odaberi odgovor!");
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
      <a href="model.html" class="btn">Nastavi s učenjem</a>
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

