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

const extraLessonsForm = document.getElementById("extraLessonsForm");
const lessonTitle = document.getElementById("lessonTitle");
const lessonContent = document.getElementById("lessonContent");
const saveLessonBtn = document.getElementById("saveLessonBtn");
const lessonList = document.getElementById("lessonList");

function showLesson(data) {
    const div = document.createElement("div");
    div.className = "lesson-item";
    div.innerHTML = `
        <h3>${data.title}</h3>
        <p><em>Autor: ${data.authorName || "Nepoznato"}</em></p>
        <div>${data.content}</div>
    `;
    lessonList.prepend(div);
}

firebase.database().ref("lekcije").on("child_added", snap => showLesson(snap.val()));

firebase.auth().onAuthStateChanged(user => {
    if (!user) return;

    firebase.database().ref("korisnici/" + user.uid).once("value").then(snapshot => {
        const role = snapshot.val()?.role || "";

        if (role.toLowerCase() === "profesor") {
            extraLessonsForm.style.display = "block";

            saveLessonBtn.onclick = () => {
                const title = lessonTitle.value.trim();
                const content = lessonContent.innerHTML.trim();
                if (!title || !content) return alert("Unesite naslov i sadržaj!");

                firebase.database().ref("korisnici/" + user.uid).once("value").then(snap => {
                    const ime = snap.val().ime || "";
                    const prezime = snap.val().prezime || "";
                    const authorName = `${ime} ${prezime}`;

                    firebase.database().ref("lekcije").push({
                        title,
                        content,
                        authorName
                    });

                    lessonTitle.value = "";
                    lessonContent.innerHTML = "";
                });
            };
        }
    });
});