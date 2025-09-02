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

const gridDiv = document.getElementById("materijaliGrid");
const searchInput = document.getElementById("searchInput");

let sviMaterijali = [];

firebase.database().ref("materijali").on("value", (snapshot) => {
  gridDiv.innerHTML = "";
  sviMaterijali = [];

  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    sviMaterijali.push(data);
  });

  prikaziMaterijale(sviMaterijali);
});

function prikaziMaterijale(lista) {
  gridDiv.innerHTML = "";

  lista.forEach((data) => {
    const card = document.createElement("div");
    card.className = "kartica-materijala";

    card.innerHTML = `
      <strong>${data.imeDatoteke}</strong>
      <p><em>Autor:</em> ${data.autor}</p>
      <p><em>Datum:</em> ${new Date(data.datum).toLocaleDateString("hr-HR")}</p>
      <a href="${data.url}" target="_blank" rel="noopener noreferrer">
        <button>Otvori</button>
      </a>
    `;

    gridDiv.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtrirani = sviMaterijali.filter((materijal) =>
    materijal.imeDatoteke.toLowerCase().includes(query)
  );
  prikaziMaterijale(filtrirani);
});
