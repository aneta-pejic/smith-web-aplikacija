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

const certifikatiLista = document.getElementById("certifikati-lista");
const noCert = document.getElementById("no-cert");

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    noCert.textContent = "Morate biti prijavljeni za pregled certifikata.";
    return;
  }

  const korisnickoIme = user.displayName || user.email || "Nepoznati korisnik";
  const uid = user.uid;

  firebase.database().ref(`rezultati/${uid}`).once('value').then(snapshot => {
    const sviRezultati = snapshot.val();

    if (!sviRezultati) {
      noCert.textContent = "Nemate nijedan certifikat.";
      return;
    }

    const postojaniCertifikati = Object.entries(sviRezultati).filter(([quiz, podaci]) => {
      let najbolji = null;
      Object.values(podaci).forEach(r => {
        if (!najbolji || r.bodovi > najbolji.bodovi) najbolji = r;
      });
      return najbolji && najbolji.bodovi === najbolji.ukupno;
    });

    if (postojaniCertifikati.length === 0) {
      noCert.textContent = "Nemate nijedan certifikat.";
      return;
    }

    certifikatiLista.innerHTML = '';

    postojaniCertifikati.forEach(([quiz, podaci]) => {
      const div = document.createElement("div");
      div.className = "certifikat";

      const certId = `cert-${quiz}`;
      const certDiv = document.createElement("div");
      certDiv.id = certId;
      certDiv.className = "certifikat-sadrzaj";

      certDiv.style.padding = "30px";
      certDiv.style.fontFamily = "'Merriweather', serif";
      certDiv.style.textAlign = "center";
      certDiv.style.marginBottom = "30px";
      certDiv.style.backgroundColor = "#fdf6e3";
      certDiv.style.border = "4px solid #c9b037";
      certDiv.style.borderRadius = "12px";
      certDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";

      const naslov = document.createElement("h2");
      naslov.textContent = `Certifikat za ${quiz.replace('_', ' ')}`;
      naslov.style.color = "#2e5e0e";
      naslov.style.marginBottom = "16px";
      naslov.style.fontSize = "24px";

      const poruka = document.createElement("p");
      poruka.textContent = `Čestitamo, postigli ste 20/20 na ovom testu!`;
      poruka.style.fontSize = "18px";
      poruka.style.color = "#252525";

      certDiv.appendChild(naslov);
      certDiv.appendChild(poruka);

      const btn = document.createElement("button");
      btn.textContent = "Preuzmi PDF";
      btn.style.marginTop = "15px";
      btn.style.padding = "10px 20px";
      btn.style.border = "none";
      btn.style.borderRadius = "6px";
      btn.style.backgroundColor = "#2e5e0e";
      btn.style.color = "white";
      btn.style.fontWeight = "bold";
      btn.style.cursor = "pointer";

      btn.onclick = () => preuzmiCertifikat(quiz.replace('_', ' '), korisnickoIme);

      div.appendChild(certDiv);
      div.appendChild(btn);
      certifikatiLista.appendChild(div);
    });
  });
});

function preuzmiCertifikat(nazivTest, korisnickoIme) {
  const certDiv = document.createElement("div");

  certDiv.innerHTML = `
    <div style="
      width: 620px;
      padding: 40px;
      font-family: 'Merriweather', serif;
      text-align: center;
      background-color: #fdf6e3;
      border: 6px solid #d4af37;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    ">
      <h1 style="font-size: 32px; color: #bfa100;">Certifikat o uspjehu</h1>
      <p style="font-size: 20px; margin-top: 20px; color: #4b7c1b;">Ovim se potvrđuje da je</p>
      <p style="font-size: 24px; font-weight: bold; color: #2e5e0e;">${korisnickoIme}</p>
      <p style="font-size: 20px; color: #2c5e1a;">uspješno završio/la:</p>
      <p style="font-size: 22px; font-weight: bold; color: #2e5e0e;">${nazivTest}</p>
      <p style="margin-top: 20px; font-size: 18px; color: #252525;">Rezultat: <strong>20/20</strong></p>
    </div>
  `;

  html2pdf().from(certDiv).set({
    margin: 0,
    filename: `Certifikat-${nazivTest}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, logging: false },
    jsPDF: { unit: 'px', format: 'a4', orientation: 'landscape' }
  }).save();
}

