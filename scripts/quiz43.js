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

const kvizId = "kviz43";

const quizData = [
  {
    question: "1. Što predstavlja proračunska linija u analizi izbora potrošača?",
    options: [
      "Granicu između inferiornih i superiornih dobara",
      "Srednju vrijednost korisnosti između dva dobra",
      "Kombinacije dvaju dobara koje potrošač može priuštiti s danim budžetom",
      "Krivulju koja pokazuje sklonost potrošača prema luksuznim dobrima"
    ],
    answer: "Kombinacije dvaju dobara koje potrošač može priuštiti s danim budžetom"
  },
  {
    question: "2. Što prikazuje krivulja indiferencije?",
    options: [
      "Maksimalni iznos koji potrošač može potrošiti",
      "Sve kombinacije dobara koje potrošač ne može priuštiti",
      "Kombinacije dvaju dobara koje donose jednaku razinu korisnosti",
      "Cijene dobara koje se mijenjaju tijekom vremena"
    ],
    answer: "Kombinacije dvaju dobara koje donose jednaku razinu korisnosti"
  },
  {
    question: "3. Kada potrošač maksimizira korisnost, što vrijedi?",
    options: [
      "Proračunska linija i krivulja indiferencije su paralelne",
      "Proračunska linija je tangenta na najvišu moguću krivulju indiferencije",
      "Granična stopa supstitucije je jednaka nuli",
      "Potrošač troši manje nego što ima na raspolaganju"
    ],
    answer: "Proračunska linija je tangenta na najvišu moguću krivulju indiferencije"
  },
  {
    question: "4. Što označava granična stopa supstitucije (MRS)?",
    options: [
      "Prosječna cijena između dvaju dobara",
      "Količinu jednog dobra koje je potrošač spreman žrtvovati za dodatnu jedinicu drugog dobra",
      "Udaljenost između dvije krivulje indiferencije",
      "Omjer budžeta prema korisnosti"
    ],
    answer: "Količinu jednog dobra koje je potrošač spreman žrtvovati za dodatnu jedinicu drugog dobra"
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
      <a href="analiza_ind_krivulje.html" class="btn">Nastavi s učenjem</a>
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
  } else {
    console.warn("Korisnik nije prijavljen. Rezultat nije spremljen.");
  }
}

showQuestion();

function closeQuiz() {
  document.getElementById("quiz").style.display = "none";
  window.history.back();
}
