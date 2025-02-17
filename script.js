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
        loser2: loser2,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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

        const stats = {};
        const losePartners = {};
        const winPartners = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (!stats[data.winner1]) stats[data.winner1] = { wins: 0, loses: 0, total: 0 };
            if (!stats[data.winner2]) stats[data.winner2] = { wins: 0, loses: 0, total: 0 };
            if (!stats[data.loser1]) stats[data.loser1] = { wins: 0, loses: 0, total: 0 };
            if (!stats[data.loser2]) stats[data.loser2] = { wins: 0, loses: 0, total: 0 };

            stats[data.winner1].wins += 1;
            stats[data.winner2].wins += 1;
            stats[data.loser1].loses += 1;
            stats[data.loser2].loses += 1;
            stats[data.winner1].total += 1;
            stats[data.winner2].total += 1;
            stats[data.loser1].total += 1;
            stats[data.loser2].total += 1;

            // Track lose partners
            if (!losePartners[data.loser1]) losePartners[data.loser1] = {};
            if (!losePartners[data.loser2]) losePartners[data.loser2] = {};
            if (data.loser1 !== data.loser2) {
                losePartners[data.loser1][data.loser2] = (losePartners[data.loser1][data.loser2] || 0) + 1;
                losePartners[data.loser2][data.loser1] = (losePartners[data.loser2][data.loser1] || 0) + 1;
            }

            // Track win partners
            if (!winPartners[data.winner1]) winPartners[data.winner1] = {};
            if (!winPartners[data.winner2]) winPartners[data.winner2] = {};
            if (data.winner1 !== data.winner2) {
                winPartners[data.winner1][data.winner2] = (winPartners[data.winner1][data.winner2] || 0) + 1;
                winPartners[data.winner2][data.winner1] = (winPartners[data.winner2][data.winner1] || 0) + 1;
            }
        });

        let statsContent = `<p>Nombre total de parties : ${querySnapshot.size}</p><table><thead><tr><th>Pseudo</th><th>Wins</th><th>Loses</th><th>Mon pire winner</th><th>Brother de lose</th><th>Win %</th><th>Lose %</th></tr></thead><tbody>`;
        for (const [pseudo, data] of Object.entries(stats)) {
            const mostLostTo = Object.entries(losePartners[pseudo] || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            const mostWonWith = Object.entries(winPartners[pseudo] || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            const winPercentage = ((data.wins / data.total) * 100).toFixed(2);
            const losePercentage = ((data.loses / data.total) * 100).toFixed(2);
            statsContent += `<tr><td>${pseudo}</td><td>${data.wins}</td><td>${data.loses}</td><td>${mostLostTo}</td><td>${mostWonWith}</td><td>${winPercentage}%</td><td>${losePercentage}%</td></tr>`;
        }
        statsContent += '</tbody></table>';

        document.getElementById('stats-content').innerHTML = statsContent;
    }).catch((error) => {
        console.error("Erreur lors de la récupération des statistiques : ", error.message);
    });
}

// Afficher le Hall of Lose
document.getElementById('hall-of-lose').addEventListener('click', function() {
    document.getElementById('hall-of-lose-section').style.display = 'block';
    loadPodium();
});

// Fermer le Hall of Lose
document.getElementById('close-hall-of-lose').addEventListener('click', function() {
    document.getElementById('hall-of-lose-section').style.display = 'none';
});

// Afficher les erreurs dans la lose
document.getElementById('error-in-lose').addEventListener('click', function() {
    document.getElementById('error-in-lose-section').style.display = 'block';
    loadErrors();
});

// Fermer les erreurs dans la lose
document.getElementById('close-error-in-lose').addEventListener('click', function() {
    document.getElementById('error-in-lose-section').style.display = 'none';
});

// Fonction pour charger les erreurs dans la lose
function loadErrors() {
    db.collection('looses').orderBy('date', 'desc').get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.error("Aucune partie trouvée.");
            document.getElementById('error-content').textContent = "Aucune partie trouvée.";
            return;
        }

        let errorContent = '<table><thead><tr><th>Date</th><th>Winner1</th><th>Winner2</th><th>Loser1</th><th>Loser2</th><th>Actions</th></tr></thead><tbody>';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            errorContent += `<tr><td>${data.date}</td><td>${data.winner1}</td><td>${data.winner2}</td><td>${data.loser1}</td><td>${data.loser2}</td><td>
                <button class="btn" onclick="editMatch('${doc.id}', '${data.date}', '${data.winner1}', '${data.winner2}', '${data.loser1}', '${data.loser2}')">Modifier</button>
                <button class="btn" onclick="saveMatch('${doc.id}')">Sauvegarder</button>
                <button class="btn" onclick="deleteMatch('${doc.id}')">Supprimer</button>
            </td></tr>`;
        });
        errorContent += '</tbody></table>';

        document.getElementById('error-content').innerHTML = errorContent;
    }).catch((error) => {
        console.error("Erreur lors de la récupération des erreurs : ", error.message);
    });
}

// Fonction pour modifier un match
window.editMatch = function(matchId, date, winner1, winner2, loser1, loser2) {
    const newDate = prompt("Entrez la nouvelle date :", date);
    const newWinner1 = prompt("Entrez le nouveau Winner1 :", winner1);
    const newWinner2 = prompt("Entrez le nouveau Winner2 :", winner2);
    const newLoser1 = prompt("Entrez le nouveau Loser1 :", loser1);
    const newLoser2 = prompt("Entrez le nouveau Loser2 :", loser2);

    db.collection('looses').doc(matchId).update({
        date: newDate,
        winner1: newWinner1,
        winner2: newWinner2,
        loser1: newLoser1,
        loser2: newLoser2
    })
    .then(() => {
        console.log("Match modifié avec succès !");
        alert("Match modifié avec succès !");
        loadErrors(); // Recharger les erreurs après modification
    })
    .catch((error) => {
        console.error("Erreur lors de la modification du match : ", error.message);
        alert("Erreur lors de la modification du match : " + error.message);
    });
}

// Fonction pour sauvegarder un match
window.saveMatch = function(matchId) {
    db.collection('looses').doc(matchId).set({
        date: document.getElementById(`date-${matchId}`).value,
        winner1: document.getElementById(`winner1-${matchId}`).value,
        winner2: document.getElementById(`winner2-${matchId}`).value,
        loser1: document.getElementById(`loser1-${matchId}`).value,
        loser2: document.getElementById(`loser2-${matchId}`).value
    }, { merge: true })
    .then(() => {
        console.log("Match sauvegardé avec succès !");
        alert("Match sauvegardé avec succès !");
        loadErrors(); // Recharger les erreurs après sauvegarde
    })
    .catch((error) => {
        console.error("Erreur lors de la sauvegarde du match : ", error.message);
        alert("Erreur lors de la sauvegarde du match : " + error.message);
    });
}

// Fonction pour supprimer un match
window.deleteMatch = function(matchId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
        db.collection('looses').doc(matchId).delete()
            .then(() => {
                console.log("Match supprimé avec succès !");
                alert("Match supprimé avec succès !");
                loadErrors(); // Recharger les erreurs après suppression
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression du match : ", error.message);
                alert("Erreur lors de la suppression du match : " + error.message);
            });
    }
}

// Fonction pour charger le podium
function loadPodium() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculer le podium des 7 derniers jours
    db.collection('looses')
        .where('timestamp', '>=', oneWeekAgo)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                console.error("Aucune partie trouvée pour les 7 derniers jours.");
                document.getElementById('podium-weekly').textContent = "Aucune partie trouvée pour les 7 derniers jours.";
                return;
            }

            const loserCounts = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.loser1) loserCounts[data.loser1] = (loserCounts[data.loser1] || 0) + 1;
                if (data.loser2) loserCounts[data.loser2] = (loserCounts[data.loser2] || 0) + 1;
            });

            const sortedLosers = Object.entries(loserCounts).sort((a, b) => b[1] - a[1]);
            displayPodium(sortedLosers.slice(0, 3), 'podium-weekly', 'Podium des 7 derniers jours');
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des données des 7 derniers jours : ", error.message);
        });

    // Calculer le podium de tous les temps
    db.collection('looses').get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.error("Aucune partie trouvée pour tous les temps.");
            document.getElementById('podium-all-time').textContent = "Aucune partie trouvée pour tous les temps.";
            return;
        }

        const loserCounts = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.loser1) loserCounts[data.loser1] = (loserCounts[data.loser1] || 0) + 1;
            if (data.loser2) loserCounts[data.loser2] = (loserCounts[data.loser2] || 0) + 1;
        });

        const sortedLosers = Object.entries(loserCounts).sort((a, b) => b[1] - a[1]);
        displayPodium(sortedLosers.slice(0, 3), 'podium-all-time', 'Podium de tous les temps');
    }).catch((error) => {
        console.error("Erreur lors de la récupération des données de tous les temps : ", error.message);
    });
}

// Fonction pour afficher le podium
function displayPodium(losers, elementId, title) {
    let podiumContent = `<h3>${title}</h3><ol>`;
    losers.forEach(([loser, count], index) => {
        podiumContent += `<li>${index + 1}. ${loser} - ${count} pertes</li>`;
    });
    podiumContent += '</ol>';
    document.getElementById(elementId).innerHTML = podiumContent;
}
