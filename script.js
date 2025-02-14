document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Logique de login
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
});

document.getElementById('create-account').addEventListener('click', function() {
    // Logique de création de compte
    alert('Create Account clicked');
});

document.getElementById('new-lose').addEventListener('click', function() {
    // Logique pour ajouter un résultat de match
    alert('New Lose clicked');
});

document.getElementById('hall-of-lose').addEventListener('click', function() {
    // Logique pour afficher le top 3 des losers et winners
    alert('Hall of Lose clicked');
});

document.getElementById('stats-of-lose').addEventListener('click', function() {
    // Logique pour afficher les statistiques générales
    alert('Stats of Lose clicked');
});
