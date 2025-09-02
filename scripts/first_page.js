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

firebase.auth().onAuthStateChanged((user) => {
    const korisnikSection = document.getElementById("korisnikSection");
    const korisnickoIme = document.getElementById("korisnickoIme");
    const profOpcija = document.getElementById("profOpcija");

    if (user) {
        const uid = user.uid;
        firebase.database().ref("korisnici/" + uid).once("value").then((snapshot) => {
            const data = snapshot.val();
            console.log("Podaci korisnika:", data);
            if (data) {
                const ime = data.ime || "";
                const prezime = data.prezime || "";
                const role = data.role || "";

                if (korisnikSection) korisnikSection.style.display = "block";
                if (korisnickoIme) korisnickoIme.textContent = `${ime} ${prezime} ▾`;

                if (profOpcija) {
                    profOpcija.style.display = role === "profesor" ? "block" : "none";
                }
            } else {
                if (korisnikSection) korisnikSection.style.display = "none";
                console.warn("Nema korisničkih podataka za UID:", uid);
            }
        }).catch((error) => {
            console.error("Greška pri dohvatu korisničkih podataka:", error);
        });
    } else {
        if (korisnikSection) korisnikSection.style.display = "none";
        if (authLinks) authLinks.style.display = "block";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector("video");
    if (video) {
        video.playbackRate = 0.8;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            firebase.auth().signOut()
                .then(() => {
                    console.log("Korisnik odjavljen.");
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    console.error("Greška pri odjavi:", error);
                });
        });
    } else {
        console.warn("Logout gumb nije pronađen!");
    }
});


