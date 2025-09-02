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

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let message = document.getElementById("message");
    if (!message) {
        message = document.createElement("div");
        message.id = "message";
        document.querySelector(".left-section").appendChild(message);
    }

    if (!email || !password) {
        message.innerHTML = "Unesite email i lozinku!";
        message.style.color = "red";
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            message.innerHTML = "Uspješna prijava!";
            message.style.color = "#4b7c1b";

            setTimeout(() => {
                window.location.href = "first_page.html";
            }, 1500);
        })
        .catch((error) => {
            console.log("Greška kod:", error.code);
            console.log("Poruka:", error.message);

            let errorMessage;
            
            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-login-credentials" ||
                error.code === "auth/invalid-credential" ||
                error.code === "auth/internal-error"
            ) {
                errorMessage = "Neuspješna prijava. Provjerite email i lozinku.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Neispravan format email adrese.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Previše pokušaja. Pokušajte kasnije.";
            } else {
                errorMessage = "Greška prilikom prijave. Pokušajte ponovno.";
                console.error("Firebase error:", error);
            }

            message.innerHTML = errorMessage;
            message.style.color = "red";
        });
}
