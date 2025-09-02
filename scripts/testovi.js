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

document.addEventListener("DOMContentLoaded", () => {
    const korisnikSection = document.getElementById("korisnikSection");
    const korisnickoIme = document.getElementById("korisnickoIme");
    const profOpcija = document.getElementById("profOpcija");
    const tests = document.querySelector(".tests");
    const guestView = document.getElementById("guestView");
    const logoutBtn = document.getElementById("logoutBtn");
    const dropdownMeni = document.getElementById("dropdownMeni");
    const authLinks = document.getElementById("authLinks");

    firebase.auth().onAuthStateChanged(user => {
        if (user && !user.isAnonymous) {
            if (tests) tests.classList.add("show");
            if (guestView) guestView.classList.remove("show");
            korisnikSection.style.display = "block";

            firebase.database().ref("korisnici/" + user.uid).once("value")
                .then(snapshot => {
                    const data = snapshot.val();
                    if (data) {
                        const ime = data.ime || "";
                        const prezime = data.prezime || "";
                        const role = data.role || "";

                        korisnickoIme.textContent = `${ime} ${prezime} ▾`;

                        if (role === "profesor") {
                            profOpcija.style.display = "block";
                        } else {
                            profOpcija.style.display = "none";
                        }
                    } else {
                        korisnikSection.style.display = "none";
                        console.warn("Nema korisničkih podataka za UID:", user.uid);
                    }
                }).catch(error => {
                    console.error("Greška pri dohvatu korisničkih podataka:", error);
                });
        } else {
            if (tests) tests.classList.remove("show");
            if (guestView) guestView.classList.add("show");
            korisnikSection.style.display = "none";
            if (authLinks) authLinks.style.display = "block";
        }
    });

    korisnickoIme.addEventListener("click", () => {
        dropdownMeni.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        if (!korisnikSection.contains(event.target)) {
            dropdownMeni.classList.remove("show");
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", e => {
            e.preventDefault();
            firebase.auth().signOut()
                .then(() => {
                    console.log("Korisnik odjavljen.");
                    window.location.href = "login.html";
                })
                .catch(error => {
                    console.error("Greška pri odjavi:", error);
                    alert("Došlo je do pogreške pri odjavi, pokušajte ponovno.");
                });
        });
    }
});
