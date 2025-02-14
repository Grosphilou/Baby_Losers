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
