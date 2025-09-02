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

function submitLink() {
  const linkInput = document.getElementById("fileLink").value.trim();
  const nameInput = document.getElementById("fileName").value.trim();
  const message = document.getElementById("uploadMessage");

  if (!linkInput || !nameInput) {
    message.textContent = "Popunite sva polja!";
    message.style.color = "red";
    return;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      message.textContent = "Niste prijavljeni!";
      message.style.color = "red";
      return;
    }

    const timestamp = new Date().toISOString();

    firebase.database().ref("materijali").push({
      imeDatoteke: nameInput,
      url: linkInput,
      autor: user.email,
      datum: timestamp
    }, (error) => {
      if (error) {
        message.textContent = "Greška kod zapisa u bazu: " + error.message;
        message.style.color = "red";
      } else {
        message.textContent = "Link uspješno spremljen!";
        message.style.color = "green";
        document.getElementById("fileLink").value = "";
        document.getElementById("fileName").value = "";
      }
    });
  });
}


