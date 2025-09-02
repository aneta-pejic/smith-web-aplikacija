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

function register() {
  const ime = document.getElementById("ime").value;
  const prezime = document.getElementById("prezime").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  let message = document.getElementById("message");
  if (!message) {
    message = document.createElement("div");
    message.id = "message";
    document.querySelector(".left-section").appendChild(message);
  }

  message.innerHTML = "";

  if (!ime || !prezime || !email || !password) {
    message.innerHTML = "Sva polja moraju biti popunjena!";
    message.style.color = "red";
    return;
  }

  const emailCheck = /^[^\s@]+@gmail\.com$/;
  if (!emailCheck.test(email)) {
    message.innerHTML = "E-mail mora biti u formatu korisnik@gmail.com!";
    message.style.color = "red";
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      firebase.database().ref("korisnici/" + user.uid).set({
        ime: ime,
        prezime: prezime,
        email: email,
        role: role
      });

      user.sendEmailVerification()
        .then(() => {
          message.innerHTML = "Registracija uspješna! Molimo potvrdite email klikom na link koji smo vam poslali. (Provjerite spam!)";
          message.style.color = "#4b7c1b";
        })
        .catch((error) => {
          message.innerHTML = "Greška pri slanju email potvrde: " + error.message;
          message.style.color = "red";
        });
    })
    .catch((error) => {
      if (error.code === 'auth/invalid-email') {
        message.innerHTML = "Unesite ispravnu email adresu!";
      } else if (error.code === 'auth/weak-password') {
        message.innerHTML = "Lozinka mora imati najmanje 6 znakova.";
      } else if (error.code === 'auth/email-already-in-use') {
        message.innerHTML = "Ova e-mail adresa je već registrirana.";
      } else {
        message.innerHTML = "Greška: " + error.message;
      }
      message.style.color = "red";
    });
}

document.getElementById("email").addEventListener("input", () => {
  const message = document.getElementById("message");
  if (message) message.innerHTML = "";
});

document.getElementById("password").addEventListener("input", () => {
  const message = document.getElementById("message");
  if (message) message.innerHTML = "";
});

document.getElementById("ime").addEventListener("input", () => {
  const message = document.getElementById("message");
  if (message) message.innerHTML = "";
});

document.getElementById("prezime").addEventListener("input", () => {
  const message = document.getElementById("message");
  if (message) message.innerHTML = "";
});
