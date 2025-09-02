document.addEventListener("DOMContentLoaded", () => {
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

  const korisnikSection = document.getElementById("userSection");
  const authLinks = document.getElementById("authLinks");

  const korisnickoIme = document.getElementById("userDropdown");
  const profOpcija = document.getElementById("profOpcija");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const userDropdownContainer = korisnickoIme ? korisnickoIme.closest('.user-dropdown') : null;

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;

      firebase.database().ref("korisnici/" + uid).once("value").then(snapshot => {
        const data = snapshot.val();
        if (!data || data.role?.toLowerCase() === "gost") {
          if (userDropdownContainer) userDropdownContainer.style.display = "none";
          return;
        }

        const ime = data.ime || "";
        const prezime = data.prezime || "";
        const role = data.role || "";

        if (userDropdownContainer) userDropdownContainer.style.display = "inline-block";
        korisnickoIme.textContent = `${ime} ${prezime} ▾`;

        if (role === "profesor" && profOpcija) {
          profOpcija.style.display = "block";
        } else if (profOpcija) {
          profOpcija.style.display = "none";
        }

        if (authLinks) authLinks.style.display = "none";
        if (korisnikSection) korisnikSection.style.display = "block";

        azurirajProgressBar(uid);

        const trenutniModulId = document.body.getAttribute("data-modul-id");
        if (trenutniModulId) {
          const modulRef = firebase.database().ref(`korisnici/${uid}/pogledaneLekcije/${trenutniModulId}`);
          const statusDiv = document.getElementById("status-pogledano");

          modulRef.once('value').then(snap => {
            const data = snap.val();

            if (data && data.pogledano === true) {
              if (statusDiv) {
                statusDiv.style.display = "block";
                statusDiv.textContent = `✔ Lekcija je već pogledana`;
              }
            } else {
              modulRef.set({
                pogledano: true,
                datum: new Date().toISOString()
              }).then(() => {
                if (statusDiv) {
                  statusDiv.style.display = "none";
                }
                azurirajProgressBar(uid);
              }).catch(error => {
                console.error("Greška prilikom upisa modula kao pogledanog:", error);
              });
            }
          });
        }
      });
    } else {
      if (userDropdownContainer) userDropdownContainer.style.display = "none";
      if (authLinks) {
        authLinks.style.display = "inline-block";
        authLinks.style.whiteSpace = "nowrap";
      }
    }
  });

  function azurirajProgressBar(uid) {
    firebase.database().ref(`korisnici/${uid}/pogledaneLekcije`).once('value')
      .then(snapshot => {
        const sviModuli = snapshot.val();
        let brojPogledanih = 0;
        if (sviModuli) {
          brojPogledanih = Object.values(sviModuli).filter(modul => modul.pogledano === true).length;
        }

        const ukupanBrojLekcija = 22;
        const postotak = Math.round((brojPogledanih / ukupanBrojLekcija) * 100);

        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progressText");

        if (progressBar) {
          progressBar.style.width = `${postotak}%`;
        }

        if (progressText) {
          progressText.textContent = `${postotak}%`;
        }
      });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    });
  }

  if (korisnickoIme && dropdownMenu) {
    korisnickoIme.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
      if (!korisnickoIme.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  }

  document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
      const dropdown = this.nextElementSibling;
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
  });

  document.addEventListener('click', function (event) {
    document.querySelectorAll('.dropdown-content').forEach(function (dropdownContent) {
      if (!dropdownContent.contains(event.target) &&
        !dropdownContent.previousElementSibling.contains(event.target)) {
        dropdownContent.classList.remove('show');
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addedLessonsBtn = document.querySelector(".addedLessons");

  if (!addedLessonsBtn) return;

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      addedLessonsBtn.style.display = "none";
      return;
    }
    
    addedLessonsBtn.style.display = "block";
    addedLessonsBtn.addEventListener("click", () => {
      window.location.href = "dodane_lekcije.html";
    });
  });
});




