// Générique pour afficher un message de succès ou d'erreur
function showMessage(message, type = 'success', containerId = 'messageContainer')
{
    const messageContainer = document.getElementById(containerId);
    if (messageContainer)
	{
        messageContainer.innerHTML =
		`
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
        // Faire disparaître le message après 2 secondes
        setTimeout(() =>
		{
            messageContainer.innerHTML = '';
        }, 2000);
    }
}

// Vérifier et afficher un message stocké dans localStorage
function checkForMessage(containerId = 'messageContainer')
{
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage)
	{
        showMessage(successMessage, 'success', containerId);
        localStorage.removeItem('successMessage'); // Supprimer le message après affichage
    }
}

// Fonction pour ajouter une plage de bas de page
function addFooter() {
    // Vérifier si la page contient l'attribut 'data-no-footer' pour ne pas ajouter le footer
    if (document.body.hasAttribute('data-no-footer')) {
        return;
    }

    const footerContainer = document.createElement('div');
    footerContainer.style.position = 'fixed';
    footerContainer.style.bottom = '0';
    footerContainer.style.left = '0';
    footerContainer.style.width = '100%';
    footerContainer.style.backgroundColor = '#f8f9fa'; // Couleur de fond similaire à la navbar
    footerContainer.style.padding = '1rem'; // Ajouter un padding pour mieux ajuster la hauteur
    footerContainer.style.boxSizing = 'border-box'; // S'assurer que le padding est pris en compte dans la taille totale
    footerContainer.classList.add('bg-light-subtle', 'border-top');
    footerContainer.innerHTML = `
        <footer class="footer text-white d-flex justify-content-between align-items-center" style="width: 100%;">
            <p class="mb-0" style="flex: 1; text-align: left;" data-translate="footer_names">amonbaro | cmansey | mdanchev | abarras</p>
            <div class="d-flex" style="flex: 1; justify-content: center; position: absolute; left: 50%; transform: translateX(-50%);">
                <button onclick="redirectRandomSite()" class="btn btn-primary" data-translate="unstable_button">Unstable button. Click at your own risk.</button>
            </div>
            <div id="language_selector_container" class="ms-auto" style="flex: 0 0 auto; text-align: right; margin-left: 1rem;">
                <select id="languageSelector" class="form-select" style="width: 150px;">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                </select>
            </div>
        </footer>
    `;
    document.body.appendChild(footerContainer);

    // Ajouter un espace supplémentaire au bas du contenu pour éviter qu'il ne soit masqué par le bandeau
    const spacer = document.createElement('div');
    spacer.style.height = '6rem'; // Hauteur supplémentaire pour permettre le défilement
    document.body.appendChild(spacer);
}


// Fonction pour rediriger vers un site aléatoire
function redirectRandomSite() {
    const sites = [
        'https://fr.wikihow.com/surmonter-une-addiction-aux-%C3%A9crans',
        'https://rickroll.it/rickroll.mp4',
        'https://madebyqwerty.itch.io/',
        'https://42lausanne.ch'
    ];
    const randomIndex = Math.floor(Math.random() * sites.length);
    window.open(sites[randomIndex], '_blank');
}

function changeLanguage() {
    // Récupérer la langue enregistrée, ou utiliser 'en' par défaut
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');

        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
            // Modifier le placeholder pour les champs d'entrée (text, email, password)
            element.placeholder = translations[selectedLanguage][key];
        } else if (element.tagName === 'OPTION') {
            // Modifier le texte des options du select
            element.textContent = translations[selectedLanguage][key];
        } else if (key === 'player_title') {
            // Traiter les titres de joueurs, par exemple "Player 1", "Player 2", etc.
            const playerNumber = element.textContent.match(/\d+$/); // Récupérer le numéro du joueur
            element.textContent = translations[selectedLanguage][key] + (playerNumber ? ` ${playerNumber[0]}` : '');
        } else if (element.tagName === 'LABEL' && element.querySelector('span')) {
            // Traiter les labels avec enfants (comme des spans avec des valeurs dynamiques)
            const spanElement = element.querySelector('span');
            element.childNodes[0].textContent = translations[selectedLanguage][key] + ' ';
            if (spanElement) {
                spanElement.textContent = spanElement.textContent; // Laisser les valeurs dynamiques inchangées
            }
        } else {
            // Autres éléments simples
            element.textContent = translations[selectedLanguage][key];
        }
    });
}







// Objet de traduction
const translations = {
    en: {
        "footer_names": "amonbaro | cmansey | mdanchev | abarras",
        "unstable_button": "Unstable button. Click at your own risk.",

        "user_login": "User Login",
        "email_label": "Email",
        "email_placeholder": "Enter your email",
        "password_label": "Password",
        "password_placeholder": "Enter your password",
        "close_button": "Close",
        "login_button": "Login",

        "customize_play": "Customize & Play",
        "game_mode": "Game Mode :",
        "game_mode_versus": "Versus",
        "game_mode_tournament": "Tournament",
        "game_mode_last_man_standing": "Last Man Standing",
        "game_mode_brick_breaker": "Brick Breaker",
        "add_player": "Add Player",
        "remove_player": "Remove Player",
        "max_score": "Max Score:",
        "paddle_speed": "Paddle Speed:",
        "paddle_size": "Paddle Size:",
        "bounce_mode": "Bounce Mode",
        "ball_speed": "Ball Speed:",
        "ball_acceleration": "Ball Acceleration:",
        "num_balls": "Number of Balls:",
        "map": "Map:",
        "find_match": "Friend with a similar winning percentage",
        "default_settings": "Default Settings",
        "start_game": "Start Game",

        "player_title": "Player",
        "enter_player_name": "Enter player name",
        "connect_button": "Connect",
        "up_key_label": "Up Key",
        "down_key_label": "Down Key",
        "press_key_placeholder": "Press a key",
        "max_score_na": "N/A",
        "must_have_name_and_keys": "must have a name and keys assigned!",
        "name_already_used": "The name is already used by another player. Please choose a different name.",
        "same_key_error": "cannot have the same key for both Up and Down.",
        "key_already_assigned": "The key is already assigned to another player.",
        "back_to_menu": "Back to Menu",
        "go_to_settings": "Go to Settings"
    },
    fr: {
        "footer_names": "amonbaro | cmansey | mdanchev | abarras",
        "unstable_button": "Bouton instable. Cliquez à vos risques et périls.",
        "user_login": "Connexion Utilisateur",
        "email_label": "E-mail",
        "email_placeholder": "Entrez votre e-mail",
        "password_label": "Mot de passe",
        "password_placeholder": "Entrez votre mot de passe",
        "close_button": "Fermer",
        "login_button": "Connexion",
        "customize_play": "Personnaliser & Jouer",
        "game_mode_versus": "Face-à-face",
        "game_mode_tournament": "Tournoi",
        "game_mode_last_man_standing": "Dernier en lice",
        "game_mode_brick_breaker": "Casse-briques",
        "game_mode": "Mode de jeu :",
        "add_player": "Ajouter un joueur",
        "remove_player": "Supprimer un joueur",
        "max_score": "Score maximal :",
        "paddle_speed": "Vitesse de la raquette :",
        "paddle_size": "Taille de la raquette :",
        "bounce_mode": "Mode rebond",
        "ball_speed": "Vitesse de la balle :",
        "ball_acceleration": "Accélération de la balle :",
        "num_balls": "Nombre de balles :",
        "map": "Carte :",
        "find_match": "Ami avec un pourcentage de victoire similaire",
        "default_settings": "Paramètres par défaut",
        "start_game": "Commencer le jeu",
        "player_title": "Joueur",
        "enter_player_name": "Entrez le nom du joueur",
        "connect_button": "Connecter",
        "up_key_label": "Touche Haut",
        "down_key_label": "Touche Bas",
        "press_key_placeholder": "Appuyez sur une touche",
        "max_score_na": "N/A",
        "must_have_name_and_keys": "doit avoir un nom et des touches assignés!",
        "name_already_used": "Le nom est déjà utilisé par un autre joueur. Veuillez choisir un nom différent.",
        "same_key_error": "ne peut pas avoir la même touche pour Haut et Bas.",
        "key_already_assigned": "La touche est déjà assignée à un autre joueur.",
        "back_to_menu": "Retour au menu",
        "go_to_settings": "Aller aux paramètres"
    },
    es: {
        "footer_names": "amonbaro | cmansey | mdanchev | abarras",
        "unstable_button": "Botón inestable. Haga clic bajo su propio riesgo.",
        "user_login": "Inicio de sesión de usuario",
        "email_label": "Correo electrónico",
        "email_placeholder": "Ingrese su correo electrónico",
        "password_label": "Contraseña",
        "password_placeholder": "Ingrese su contraseña",
        "close_button": "Cerrar",
        "login_button": "Iniciar sesión",
        "customize_play": "Personalizar y jugar",
        "game_mode": "Modo de juego :",
        "game_mode_versus": "Uno contra uno",
        "game_mode_tournament": "Torneo",
        "game_mode_last_man_standing": "Último en pie",
        "game_mode_brick_breaker": "Rompe ladrillos",
        "add_player": "Agregar jugador",
        "remove_player": "Eliminar jugador",
        "max_score": "Puntuación máxima :",
        "paddle_speed": "Velocidad de la pala :",
        "paddle_size": "Tamaño de la pala :",
        "bounce_mode": "Modo rebote",
        "ball_speed": "Velocidad de la bola :",
        "ball_acceleration": "Aceleración de la bola :",
        "num_balls": "Número de bolas :",
        "map": "Mapa :",
        "find_match": "Amigo con un porcentaje de victorias similar",
        "default_settings": "Configuraciones predeterminadas",
        "start_game": "Comenzar juego",
        "player_title": "Jugador",
        "enter_player_name": "Ingrese el nombre del jugador",
        "connect_button": "Conectar",
        "up_key_label": "Tecla Arriba",
        "down_key_label": "Tecla Abajo",
        "press_key_placeholder": "Presione una tecla",
        "max_score_na": "N/A",
        "must_have_name_and_keys": "debe tener un nombre y teclas asignadas!",
        "name_already_used": "El nombre ya está siendo utilizado por otro jugador. Por favor elija un nombre diferente.",
        "same_key_error": "no puede tener la misma tecla para Arriba y Abajo.",
        "key_already_assigned": "La tecla ya está asignada a otro jugador.",
        "back_to_menu": "Volver al menú",
        "go_to_settings": "Ir a configuración"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Ajouter le footer uniquement si nécessaire
    addFooter();

    // Charger la langue sauvegardée ou utiliser 'en' par défaut
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

    // Si un sélecteur de langue est présent, le mettre à jour et ajouter l'événement de changement
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = savedLanguage;
        languageSelector.addEventListener('change', () => {
            localStorage.setItem('selectedLanguage', languageSelector.value);
            changeLanguage();
        });
    }

    // Appliquer la langue sauvegardée à tous les éléments traduisibles
    changeLanguage();

    // Appliquer la langue toutes les 100 ms pour les éléments ajoutés dynamiquement
    setInterval(changeLanguage, 10);
});



