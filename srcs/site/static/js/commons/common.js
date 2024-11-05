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
        setTimeout(() =>
		{
            messageContainer.innerHTML = '';
        }, 2000);
    }
}

function checkForMessage(containerId = 'messageContainer')
{
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage)
	{
        showMessage(successMessage, 'success', containerId);
        localStorage.removeItem('successMessage');
    }
}

function addFooter() {
    if (document.body.hasAttribute('data-no-footer')) {
        return;
    }

    const footerContainer = document.createElement('div');
    footerContainer.classList.add('bg-light-subtle', 'border-top', 'mt-auto');

    footerContainer.innerHTML = `
	<footer class="footer container-fluid">
		<div class="row flex-column flex-md-row justify-content-between align-items-center text-center text-md-start mx-3">

			<div class="col-md-auto my-2">
				<a href="https://42lausanne.ch/">
					<img src="../../media/images/42_logo.png" alt="logo" height="50" class="d-inline-block align-text-top">
				</a>
			</div>

			<div class="col-md-auto my-2">
				<a href="https://www.linkedin.com/in/adrien-barras/" class="text-decoration-none text-white">abarras</a> |
				<a href="https://www.linkedin.com/in/ari-monbaron-57432b179" class="text-decoration-none text-white">amonbaro</a> |
				<a href="#" class="text-decoration-none text-white">cmansey</a> |
				<a href="https://www.linkedin.com/in/mariya-dancheva/" class="text-decoration-none text-white">mdanchev</a>
			</div>

			<div class="col-md-auto my-2 small" id="language_selector_container">
				<a href="#" id="lang-en" class="d-block text-decoration-none text-white">English</a>
				<a href="#" id="lang-fr" class="d-block text-decoration-none text-white mt-2">Français</a>
				<a href="#" id="lang-es" class="d-block text-decoration-none text-white mt-2">Español</a>
			</div>

			<div class="col-md-auto my-2">
				<a href="#" class="navbar-brand">
					<img src="../../media/images/circle-up.png" alt="Scroll to top" height="40" class="d-inline-block align-text-top">
				</a>
			</div>
		</div>
	</footer>
    `;

    document.body.appendChild(footerContainer);

	document.getElementById('lang-en').addEventListener('click', (e) => {
        e.preventDefault();
        changeLanguage('en');
    });
    document.getElementById('lang-fr').addEventListener('click', (e) => {
        e.preventDefault();
        changeLanguage('fr');
    });
    document.getElementById('lang-es').addEventListener('click', (e) => {
        e.preventDefault();
        changeLanguage('es');
    });
}

function changeLanguage(lang = null) {
    if (lang) {
        localStorage.setItem('selectedLanguage', lang);
    }

    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');

        if (translations[selectedLanguage] && translations[selectedLanguage][key]) {
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
                element.placeholder = translations[selectedLanguage][key];
            } else if (element.tagName === 'OPTION') {
                element.textContent = translations[selectedLanguage][key];
            } else if (key === 'player_title') {
                const playerNumber = element.textContent.match(/\d+$/);
                element.textContent = translations[selectedLanguage][key] + (playerNumber ? ` ${playerNumber[0]}` : '');
            } else if (element.tagName === 'LABEL' && element.querySelector('span')) {
                const spanElement = element.querySelector('span');
                element.childNodes[0].textContent = translations[selectedLanguage][key] + ' ';
                if (spanElement) {
                    spanElement.textContent = spanElement.textContent;
                }
            } else {
                element.textContent = translations[selectedLanguage][key];
            }
        }
    });

    document.querySelectorAll('#language_selector_container a').forEach(link => {
        link.classList.toggle('text-primary', link.id === `lang-${selectedLanguage}`);
        link.classList.toggle('text-white', link.id !== `lang-${selectedLanguage}`);
    });
}

const translations = {
    en: {
        "user_login": "User Login",
        "email_label": "Email",
        "email_placeholder": "youremail@exemple.com",
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
        "left_key_label": "Left Key",
        "right_key_label": "Right Key",
        "press_key_placeholder": "Press a key",
        "max_score_na": "N/A",
        "must_have_name_and_keys": "must have a name and keys assigned!",
        "name_already_used": "The name is already used by another player. Please choose a different name.",
        "same_key_error": "cannot have the same key for both Up and Down.",
        "key_already_assigned": "The key is already assigned to another player.",
        "back_to_menu": "Back to Menu",
        "go_to_settings": "Go to Settings",

        "login_page_title": "Login",
        "login_title": "Login",
        "submit_button": "Submit",
        "register_page_title": "Register",
        "register_title": "Register",
        "name_label": "Name :",
        "first_name_placeholder": "First",
        "last_name_placeholder": "Last",
        "username_label": "Username :",
        "password_help": "The password must be at least 12 characters long, including uppercase letters, lowercase letters, numbers, and special characters. It cannot contain common words or your first name, last name, or email address.",
        "confirm_password_label": "Confirm password :",
        "profile_photo_label": "Profile Photo :",
        "profile_photo_placeholder": "Choose a profile photo",
        "profile_preview_alt": "Profile Preview",
        "select_file_button": "Choose File",
        "no_file_selected": "No file selected"
    },
    fr: {
        "user_login": "Connexion Utilisateur",
        "email_label": "E-mail",
        "email_placeholder": "votremail@exemple.com",
        "password_label": "Mot de passe",
        "password_placeholder": "Entrez votre mot de passe",
        "close_button": "Fermer",
        "login_button": "Connexion",
        "customize_play": "Personnaliser & Jouer",
        "game_mode": "Mode de jeu :",
        "game_mode_versus": "Face-à-face",
        "game_mode_tournament": "Tournoi",
        "game_mode_last_man_standing": "Dernier en lice",
        "game_mode_brick_breaker": "Casse-briques",
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
        "left_key_label": "Touche Gauche",
        "right_key_label": "Touche Droite",
        "press_key_placeholder": "Tapez une touche",
        "max_score_na": "N/A",
        "must_have_name_and_keys": "doit avoir un nom et des touches assignés!",
        "name_already_used": "Le nom est déjà utilisé par un autre joueur. Veuillez choisir un nom différent.",
        "same_key_error": "ne peut pas avoir la même touche pour Haut et Bas.",
        "key_already_assigned": "La touche est déjà assignée à un autre joueur.",
        "back_to_menu": "Retour au menu",
        "go_to_settings": "Aller aux paramètres",

        "login_page_title": "Connexion",
        "login_title": "Connexion",
        "submit_button": "Valider",
        "register_page_title": "Inscription",
        "register_title": "Inscription",
        "name_label": "Nom :",
        "first_name_placeholder": "Prénom",
        "last_name_placeholder": "Nom",
        "username_label": "Nom d'utilisateur :",
        "password_help": "Le mot de passe doit contenir au moins 12 caractères, comprenant des majuscules, des minuscules, des chiffres et des caractères spéciaux. Il ne peut pas contenir des mots courants, votre prénom, nom de famille, ou adresse e-mail.",
        "confirm_password_label": "Confirmez le mot de passe :",
        "profile_photo_label": "Photo de profil :",
        "profile_photo_placeholder": "Choisissez une photo de profil",
        "profile_preview_alt": "Aperçu du profil",
        "select_file_button": "Choisir un fichier",
        "no_file_selected": "Aucun fichier sélectionné"
    },
    es: {
        "user_login": "Inicio de sesión de usuario",
        "email_label": "Correo electrónico",
        "email_placeholder": "tucorreo@ejemplo.com",
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
        "left_key_label": "Tecla Izquierda",
        "right_key_label": "Tecla Derecha",
        "press_key_placeholder": "Presione una tecla",
        "max_score_na": "N/A",
        "must_have_name_and_keys": "debe tener un nombre y teclas asignadas!",
        "name_already_used": "El nombre ya está siendo utilizado por otro jugador. Por favor elija un nombre diferente.",
        "same_key_error": "no puede tener la misma tecla para Arriba y Abajo.",
        "key_already_assigned": "La tecla ya está asignada a otro jugador.",
        "back_to_menu": "Volver al menú",
        "go_to_settings": "Ir a configuración",

        "login_page_title": "Iniciar sesión",
        "login_title": "Iniciar sesión",
        "submit_button": "Enviar",
        "register_page_title": "Registro",
        "register_title": "Registro",
        "name_label": "Nombre :",
        "first_name_placeholder": "Nombre",
        "last_name_placeholder": "Apellido",
        "username_label": "Nombre de usuario :",
        "password_help": "La contraseña debe tener al menos 12 caracteres, incluyendo letras mayúsculas, letras minúsculas, números y caracteres especiales. No puede contener palabras comunes ni su nombre, apellido o dirección de correo electrónico.",
        "confirm_password_label": "Confirme la contraseña :",
        "profile_photo_label": "Foto de perfil :",
        "profile_photo_placeholder": "Elija una foto de perfil",
        "profile_preview_alt": "Vista previa del perfil",
        "select_file_button": "Seleccionar archivo",
        "no_file_selected": "Ningún archivo seleccionado"
    }    
};


document.addEventListener('DOMContentLoaded', () => {
    addFooter();
    changeLanguage();
});
