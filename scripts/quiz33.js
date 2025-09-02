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

const kvizId = "kviz33";

const quizData = [
  {
    question: "1. Što mjeri cjenovna elastičnost ponude?",
    options: [
      "Osjetljivost potražnje na promjene prihoda",
      "Osjetljivost ponuđene količine na promjene cijene",
      "Promjenu cijene zbog promjene potražnje"
    ],
    answer: "Osjetljivost ponuđene količine na promjene cijene"
  },
  {
    question: "2. Kada je ponuda savršeno neelastična?",
    options: [
      "Kada je krivulja ponude vodoravna",
      "Kada je cjenovna elastičnost ponude jednaka 1",
      "Kada cijena ne utječe na količinu ponuđenu",
      "Kada se količina ponuđena udvostruči zbog rasta cijene"
    ],
    answer: "Kada cijena ne utječe na količinu ponuđenu"
  },
  {
    question: "3. Zašto je cjenovna elastičnost ponude veća u duljem vremenskom razdoblju?",
    options: [
      "Jer se kupci lakše prilagođavaju",
      "Jer proizvođači imaju više mogućnosti prilagodbe",
      "Jer cijene stagniraju kroz vrijeme",
      "Jer potražnja postaje konstantna"
    ],
    answer: "Jer proizvođači imaju više mogućnosti prilagodbe"
  },
  {
    question: "4. Što se događa s ponudom rada u nekim vrlo dobro plaćenim zanimanjima kada plaće rastu?",
    options: [
      "Ponuda rada se povećava jer svi žele više raditi",
      "Ponuda rada ostaje nepromijenjena",
      "Ponuda rada se može smanjiti jer radnici preferiraju slobodno vrijeme",
      "Radnici prelaze na niže plaćene poslove"
    ],
    answer: "Ponuda rada se može smanjiti jer radnici preferiraju slobodno vrijeme"
  },
  {
    question: "5. Koja je ispravna formula za izračun cjenovne elastičnosti ponude (eS)?",
    options: [
      "Promjena cijene podijeljena s promjenom prihoda",
      "Promjena količine podijeljena s promjenom potražnje",
      "Postotna promjena ponuđene količine podijeljena s postotnom promjenom cijene",
      "Ukupna količina ponuđena puta cijena"
    ],
    answer: "Postotna promjena ponuđene količine podijeljena s postotnom promjenom cijene"
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
      <a href="cjenovna_el_ponude.html" class="btn">Nastavi s učenjem</a>
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
