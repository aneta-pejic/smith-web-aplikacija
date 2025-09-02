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

const kvizId = "kviz71";

const quizData = [
  {
    question: "1. Što najbolje opisuje monopol?",
    options: [
      "Tržište s velikim brojem konkurenata",
      "Tržište na kojem postoji samo jedno poduzeće bez bliskih supstituta",
      "Tržište koje prihvaća tržišnu cijenu kao zadanu",
      "Tržište s potpuno slobodnim ulaskom i izlaskom"
    ],
    answer: "Tržište na kojem postoji samo jedno poduzeće bez bliskih supstituta"
  },
  {
    question: "2. Koja izjava najbolje opisuje prirodni monopol?",
    options: [
      "Poduzeće koje proizvodi luksuzne proizvode s visokom cijenom",
      "Poduzeće koje ima potpunu kontrolu nad cijenama zbog državne potpore",
      "Poduzeće koje ima padajuće dugoročne prosječne troškove u cijelom rasponu potražnje"
    ],
    answer: "Poduzeće koje ima padajuće dugoročne prosječne troškove u cijelom rasponu potražnje"
  },
  {
    question: "3. Koji je od sljedećih primjera prepreke ulasku na tržište?",
    options: [
      "Visoki nepovratni troškovi oglašavanja",
      "Mala potražnja za luksuznim dobrima",
      "Postojanje više malih poduzeća u industriji",
      "Jednostavan pristup svim sirovinama"
    ],
    answer: "Visoki nepovratni troškovi oglašavanja"
  },
  {
    question: "4. Što označava pojam ODREĐIVAČ CIJENE?",
    options: [
      "Poduzeće koje određuje cijene u skladu s konkurentskim tržištem",
      "Državna agencija koja postavlja cijene dobara",
      "Poduzeće koje samo određuje cijenu temeljem svoje odluke o količini proizvodnje",
      "Poduzeće koje proizvodi po konstantnim troškovima"
    ],
    answer: "Poduzeće koje samo određuje cijenu temeljem svoje odluke o količini proizvodnje"
  },
  {
    question: "5. Koji je od sljedećih izvora monopolske moći?",
    options: [
      "Slobodan ulazak novih poduzeća na tržište",
      "Ekskluzivne franšize dodijeljene od strane vlade",
      "Niska potražnja na tržištu",
      "Višak ponude u industriji"
    ],
    answer: "Ekskluzivne franšize dodijeljene od strane vlade"
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
      <a href="priroda_monopola.html" class="btn">Nastavi s učenjem</a>
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

