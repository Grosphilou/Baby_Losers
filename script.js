// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDeWrX-K2uvOWFseZppB_Oj8Z8i6Rtvf18",
    authDomain: "baby-losers.firebaseapp.com",
    projectId: "baby-losers",
    storageBucket: "baby-losers.firebasestorage.app",
    messagingSenderId: "360433135484",
    appId: "1:360433135484:web:31179231cf004e08613ef9",
    measurementId: "G-5YLLE79NT3"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Créer un compte avec pseudo, email et mot de passe
document.getElementById('create-account').addEventListener('click', function() {
    const pseudo = prompt("Entrez votre pseudo :");
    const email = prompt("Entrez votre email :");
    const password = prompt("Entrez votre mot de passe :");

    if (pseudo && email && password) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Sauvegarder le pseudo dans Firestore
                db.collection('users').doc(user.uid).set({
                    pseudo: pseudo,
                    email: email
                })
                .then(() => {
                    console.log("Compte créé avec succès avec pseudo !");
                    alert("Compte créé avec succès avec pseudo !");
                })
                .catch((error) => {
                    console.error("Erreur lors de la sauvegarde du pseudo : ", error.message);
                    alert("Erreur lors de la sauvegarde du pseudo : " + error.message);
                });
            })
            .catch((error) => {
                console.error("Erreur lors de la création du compte : ", error.message);
                alert("Erreur lors de la création du compte : " + error.message);
            });
    } else {
        console.error("Pseudo, email ou mot de passe est vide.");
    }
});

// Connexion avec pseudo
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Connecté avec succès avec l'email :", user.email);
            alert("Connecté avec succès avec l'email : " + user.email);
        })
        .catch((error) => {
            console.error("Erreur lors de la connexion : ", error.message);
            alert("Erreur lors de la connexion : " + error.message);
        });
});

// Afficher le formulaire de nouvelle loose
document.getElementById('new-loose-btn').addEventListener('click', function() {
    document.getElementById('form-new-loose').style.display = 'block';
});

// Soumettre le formulaire de nouvelle loose
document.getElementById('loose-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('date').value;
    const winner1 = document.getElementById('winner1').value;
    const winner2 = document.getElementById('winner2').value;
    const loser1 = document.getElementById('loser1').value;
    const loser2 = document.getElementById('loser2').value;

    db.collection('looses').add({
        date: date,
        winner1: winner1,
        winner2: winner2,
        loser1: loser1,
        loser2: loser2
    })
    .then(() => {
        console.log("Nouvelle loose ajoutée avec succès !");
        alert("Nouvelle loose ajoutée avec succès !");
        document.getElementById('form-new-loose').style.display = 'none'; // Masquer le formulaire
    })
    .catch((error) => {
        console.error("Erreur lors de l'ajout de la nouvelle partie :", error.message);
    });
});
