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
    const pseudo = prompt("Enter your pseudo:");
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

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
                    console.log("Account created successfully with pseudo!");
                    alert("Account created successfully with pseudo!");
                })
                .catch((error) => {
                    console.error("Error saving pseudo: ", error.message);
                    alert("Error saving pseudo: " + error.message);
                });
            })
            .catch((error) => {
                console.error("Error creating account: ", error.message);
                alert("Error creating account: " + error.message);
            });
    } else {
        console.error("Pseudo, email or password is empty.");
    }
});

// Connexion avec pseudo
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const pseudo = document.getElementById('pseudo').value;

    // Chercher l'utilisateur par pseudo dans Firestore
    db.collection('users').where("pseudo", "==", pseudo).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]; // Prendre le premier utilisateur trouvé
                const userData = userDoc.data();
                
                // Connexion avec l'email associé au pseudo
                auth.signInWithEmailAndPassword(userData.email, document.getElementById('password').value)
                    .then((userCredential) => {
                        console.log("Login successful!");
                        document.getElementById('login-section').style.display = 'none';
                        document.getElementById('main-section').style.display = 'block';
                    })
                    .catch((error) => {
                        console.error("Error logging in: ", error.message);
                        alert("Error logging in: " + error.message);
                    });
            } else {
                alert("No user found with this pseudo.");
            }
        })
        .catch((error) => {
            console.error("Error searching user by pseudo: ", error.message);
            alert("Error searching user: " + error.message);
        });
});

// Afficher le pseudo de l'utilisateur après connexion
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log(`Welcome ${userData.pseudo}!`);
                // Mettre à jour l'interface avec le pseudo
                document.getElementById('welcome-message').innerText = `Welcome, ${userData.pseudo}!`;
            }
        });
    }
});

// Charger la liste des pseudos pour le formulaire "New Loose"
function loadPlayerOptions() {
    db.collection('users').get().then((querySnapshot) => {
        const playersList = [];
        
        // Parcours des utilisateurs et récupération des pseudos
        querySnapshot.forEach((doc) => {
            playersList.push(doc.data().pseudo); // Supposons que chaque utilisateur a un champ "pseudo"
        });

        // Remplir les listes déroulantes pour les gagnants et les perdants
        ['winner1', 'winner2', 'loser1', 'loser2'].forEach(selectId => {
            const selectElement = document.getElementById(selectId);
            selectElement.innerHTML = '<option value="">Sélectionnez un joueur</option>'; // Reset des options
            playersList.forEach(player => {
                const option = document.createElement('option');
                option.value = player;
                option.textContent = player;
                selectElement.appendChild(option);
            });
        });
    }).catch((error) => {
        console.error("Error loading players: ", error.message);
        alert("Error loading players: " + error.message);
    });
}

// Afficher le formulaire pour enregistrer une nouvelle partie (loose)
document.getElementById('new-loose-btn').addEventListener('click', function() {
    document.getElementById('form-new-loose').style.display = 'block'; // Afficher le formulaire
    loadPlayerOptions(); // Charger les options de joueurs
});

// Sauvegarder une nouvelle partie (loose) dans Firestore
document.getElementById('loose-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page
    
    const date = document.getElementById('date').value;
    const winner1 = document.getElementById('winner1').value;
    const winner2 = document.getElementById('winner2').value;
    const loser1 = document.getElementById('loser1').value;
    const loser2 = document.getElementById('loser2').value;

    // Sauvegarder les informations dans Firestore (par exemple dans une collection 'looses')
    db.collection('looses').add({
        date: date,
        winner1: winner1,
        winner2: winner2,
        loser1: loser1,
        loser2: loser2
    }).then(() => {
        console.log('Nouvelle partie ajoutée avec succès');
        // Réinitialiser le formulaire
        document.getElementById('loose-form').reset();
        document.getElementById('form-new-loose').style.display = 'none'; // Masquer à nouveau le formulaire
    }).catch((error) => {
        console.error("Erreur lors de l'ajout de la nouvelle partie :", error.message);
    });
});
