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

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Login successful!");
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('main-section').style.display = 'block';
        })
        .catch((error) => {
            console.error("Error logging in: ", error.message);
            alert("Error logging in: " + error.message);
        });
});

document.getElementById('create-account').addEventListener('click', function() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    if (email && password) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("Account created successfully!");
                alert("Account created successfully!");
            })
            .catch((error) => {
                console.error("Error creating account: ", error.message);
                alert("Error creating account: " + error.message);
            });
    } else {
        console.error("Email or password is empty.");
    }
});

document.getElementById('new-lose').addEventListener('click', function() {
    document.getElementById('new-lose-form').style.display = 'block';
});

document.getElementById('lose-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const matchData = {
        date: document.getElementById('match-date').value,
        winner1: document.getElementById('winner1').value,
        winner2: document.getElementById('winner2').value,
        loser1: document.getElementById('loser1').value,
        loser2: document.getElementById('loser2').value,
    };

    db.collection('matches').add(matchData)
        .then(() => {
            console.log("Match result submitted successfully!");
            alert("Match result submitted successfully!");
            document.getElementById('new-lose-form').style.display = 'none';
        })
        .catch((error) => {
            console.error("Error submitting match result: ", error.message);
            alert("Error submitting match result: " + error.message);
        });
});

document.getElementById('hall-of-lose').addEventListener('click', function() {
    db.collection('matches').get().then((querySnapshot) => {
        let losers = {};
        let winners = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            incrementCount(losers, data.loser1);
            incrementCount(losers, data.loser2);
            incrementCount(winners, data.winner1);
            incrementCount(winners, data.winner2);
        });

        displayTopThree(losers, winners);
    });
});

document.getElementById('stats-of-lose').addEventListener('click', function() {
    db.collection('matches').get().then((querySnapshot) => {
        let totalMatches = querySnapshot.size;
        console.log(`Total matches played: ${totalMatches}`);
        alert(`Total matches played: ${totalMatches}`);
    });
});

function incrementCount(obj, key) {
    if (obj[key]) {
        obj[key]++;
    } else {
        obj[key] = 1;
    }
}

function displayTopThree(losers, winners) {
    const losersSorted = Object.entries(losers).sort((a, b) => b[1] - a[1]);
    const winnersSorted = Object.entries(winners).sort((a, b) => b[1] - a[1]);

    const topLosers = losersSorted.slice(0, 3);
    const topWinners = winnersSorted.slice(0, 3);

    console.log(`Top Losers: ${topLosers.map(l => `${l[0]}: ${l[1]}`).join(', ')}`);
    console.log(`Top Winners: ${topWinners.map(w => `${w[0]}: ${w[1]}`).join(', ')}`);
    alert(`Top Losers: ${topLosers.map(l => `${l[0]}: ${l[1]}`).join(', ')}`);
    alert(`Top Winners: ${topWinners.map(w => `${w[0]}: ${w[1]}`).join(', ')}`);
}
