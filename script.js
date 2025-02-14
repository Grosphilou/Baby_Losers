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

// Fonction pour valider l'adresse e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Créer un compte avec pseudo, email et mot de passe
document.getElementById('create-account').addEventListener('click', function() {
    const pseudo = document.getElementById('pseudo').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (pseudo && isValidEmail(email) && password) {
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
                    document.getElementById('login-section').style.display = 'none';
                    document.getElementById('main-section').style.display = 'block';
                    document.getElementById('welcome-message').textContent = pseudo;
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
        alert("Veuillez entrer un pseudo, une adresse e-mail valide et un mot de passe.");
    }
});

// Connexion avec pseudo
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isValidEmail(email)) {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Connecté avec succès avec l'email :", user.email);
                alert("Connecté avec succès avec l'email : " + user.email);
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('main-section').style.display = 'block';
                document.getElementById('welcome-message').textContent = user.email; // Ou pseudo si disponible
            })
            .catch((error) => {
                console.error("Erreur lors de la connexion : ", error.message);
                alert("Erreur lors de la connexion : " + error.message);
            });
    } else {
        alert("Veuillez entrer une adresse e-mail valide.");
    }
});

// Afficher le formulaire de nouvelle loose
document.getElementById('new-lose').addEventListener('click', function() {
    document.getElementById('new-lose-form').style.display = 'block';
    loadUserPseudos();
});

// Annuler le formulaire de nouvelle loose
document.getElementById('cancel-new-lose').addEventListener('click', function() {
    document.getElementById('new-lose-form').style.display = 'none';
});

// Soumettre le formulaire de nouvelle loose
document.getElementById('new-lose-data-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('match-date').value;
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
        document.getElementById('new-lose-form').style.display = 'none';
    })
    .catch((error) => {
        console.error("Erreur lors de l'ajout de la nouvelle partie :", error.message);
    });
});

// Déconnexion
document.getElementById('logout').addEventListener('click', function() {
    auth.signOut().then(() => {
        console.log("Déconnecté avec succès");
        alert("Déconnecté avec succès");
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('main-section').style.display = 'none';
    }).catch((error) => {
        console.error("Erreur lors de la déconnexion : ", error.message);
        alert("Erreur lors de la déconnexion : " + error.message);
    });
});

// Fonction pour charger les pseudos des utilisateurs
function loadUserPseudos() {
    db.collection('users').get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.error("Aucun utilisateur trouvé.");
            return;
        }

        const winner1Select = document.getElementById('winner1');
        const winner2Select = document.getElementById('winner2');
        const loser1Select = document.getElementById('loser1');
        const loser2Select = document.getElementById('loser2');

        // Vider les options actuelles
        winner1Select.innerHTML = '<option value="" disabled selected>Sélectionnez Winner1</option>';
        winner2Select.innerHTML = '<option value="" disabled selected>Sélectionnez Winner2</option>';
        loser1Select.innerHTML = '<option value="" disabled selected>Sélectionnez Loser1</option>';
        loser2Select.innerHTML = '<option value="" disabled selected>Sélectionnez Loser2</option>';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.pseudo) {
                const pseudo = data.pseudo;
                console.log("Pseudo chargé :", pseudo); // Log pour vérifier les pseudos chargés
                const option = document.createElement('option');
                option.value = pseudo;
                option.textContent = pseudo;

                // Ajouter l'option à chaque liste de sélection
                winner1Select.appendChild(option.cloneNode(true));
                winner2Select.appendChild(option.cloneNode(true));
                loser1Select.appendChild(option.cloneNode(true));
                loser2Select.appendChild(option.cloneNode(true));
            } else {
                console.warn("Document sans pseudo trouvé :", doc.id);
            }
        });
    }).catch((error) => {
        console.error("Erreur lors de la récupération des pseudos : ", error.message);
    });
}

// Afficher les statistiques
document.getElementById('stats-of-lose').addEventListener('click', function() {
    document.getElementById('stats-section').style.display = 'block';
    loadStats();
});

// Fermer les statistiques
document.getElementById('close-stats').addEventListener('click', function() {
    document.getElementById('stats-section').style.display = 'none';
});

// Fonction pour charger les statistiques
function loadStats() {
    db.collection('looses').get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.error("Aucune partie trouvée.");
            document.getElementById('stats-content').textContent = "Aucune partie trouvée.";
            return;
        }

        let statsContent = '<ul>';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            statsContent += `<li>Date: ${data.date}, Winner1: ${data.winner1}, Winner2: ${data.winner2}, Loser1: ${data.loser1}, Loser2: ${data.loser2}</li>`;
        });
        statsContent += '</ul>';

        document.getElementById('stats-content').innerHTML = statsContent;
    }).catch((error) => {
        console.error("Erreur lors de la récupération des statistiques : ", error.message);
    });
}
