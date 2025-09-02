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

const kvizId = "kviz42";

const quizData = [
  {
    question: "1. Što opisuje pravilo granične odluke u kontekstu maksimizacije korisnosti?",
    options: [
      "Izbor koji maksimizira ukupnu potrošnju bez obzira na cijenu",
      "Izbor kod kojeg su omjeri granične korisnosti i cijene jednaki za sva dobra",
      "Izbor koji maksimizira potrošnju samo najjeftinijih dobara",
      "Izbor u kojem su cijene svih dobara jednake"
    ],
    answer: "Izbor kod kojeg su omjeri granične korisnosti i cijene jednaki za sva dobra"
  },
  {
    question: "2. Kako se mijenja potrošnja jabuka gospođe Andrews kada cijena jabuka padne s 2 eura na 1 euro po kilogramu?",
    options: [
      "Kupuje manje jabuka",
      "Kupuje istu količinu jabuka",
      "Kupuje više jabuka, povećavajući količinu s 5 na 12 kilograma",
      "Potrošnja jabuka ovisi samo o dohotku, ne o cijeni"
    ],
    answer: "Kupuje više jabuka, povećavajući količinu s 5 na 12 kilograma"
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
    question: "5. Koja je razlika između efekta supstitucije i efekta dohotka?",
    options: [
      "Efekt supstitucije mijenja potrošnju zbog promjene cijene u odnosu na druga dobra, dok efekt dohotka mijenja potrošnju zbog promjene kupovne moći",
      "Efekt dohotka mijenja cijenu dobara, a efekt supstitucije mijenja dohodak potrošača",
      "Efekt supstitucije i efekt dohotka su isti i ne razlikuju se",
      "Efekt dohotka utječe samo na inferiorna dobra, a efekt supstitucije samo na normalna"
    ],
    answer: "Efekt supstitucije mijenja potrošnju zbog promjene cijene u odnosu na druga dobra, dok efekt dohotka mijenja potrošnju zbog promjene kupovne moći"
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
      <a href="maksimizacija.html" class="btn">Nastavi s učenjem</a>
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

