function showMessage(message, type = 'success', containerId = 'messageContainer') {
    // Si le message est un objet JSON, extraire le texte d'erreur
    if (typeof message === 'string') {
        try {
            const parsedMessage = JSON.parse(message);
            // Vérifier si l'objet contient un champ "detail" pour afficher un message spécifique
            message = parsedMessage.detail || JSON.stringify(parsedMessage);
        } catch (e) {
            // Si la chaîne n'est pas un JSON, on l'utilise tel quel
        }
    }

    const messageContainer = document.getElementById(containerId);
    if (messageContainer) {
        messageContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 3000); // 1000 = 1sec
    }
}

function checkForMessage(containerId = 'messageContainer') {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
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
                <a href="#" id="lang-bg" class="d-block text-decoration-none text-white mt-2">Български</a>
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
    document.getElementById('lang-bg').addEventListener('click', (e) => {
        e.preventDefault();
        changeLanguage('bg');
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
        "game_title": "Pong",
        "user_login": "User Login",
        "email_label": "Email :",
        "email_placeholder": "youremail@exemple.com",
        "password_label": "Password :",
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
        "max_score": "Max Score :",
        "paddle_speed": "Paddle Speed :",
        "paddle_size": "Paddle Size :",
        "bounce_mode": "Bounce Mode",
        "ball_speed": "Ball Speed :",
        "ball_acceleration": "Ball Acceleration :",
        "num_balls": "Number of Balls :",
        "map": "Map :",
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
        "first_name_placeholder": "First Name",
        "last_name_placeholder": "Last Name",
        "username_label": "Username :",
        "password_help": "The password must be at least 12 characters, including at least uppercase, lowercase, number, and special character. It cannot contain common words, your first name, last name, or email address.",
        "confirm_password_label": "Confirm password :",
        "profile_photo_label": "Profile Photo :",
        "profile_photo_placeholder": "Choose a profile photo",
        "profile_preview_alt": "Profile Preview",
        "select_file_button": "Choose File",
        "no_file_selected": "No file selected",

        "home_page_title": "Home",
        "home_title": "Home",
        "Customize_Play_Button": "Customize & Play",

        "profile_page_title": "Profile",
        "edit_profile_title": "Edit",
        //"username_label": "Username:",
        "first_name_label": "First Name :",
        "last_name_label": "Last Name :",
        //"email_label": "Email:",
        "edit_profile_button": "Edit Profile",
        "change_password_button": "Change Password",
        "friend_list_title": "Friends List",
        "all_players_title": "All Players",
        "personal_stats_title": "Personal Statistics",
        "games_played_label": "Games Played :",
        "win_percentage_label": "Win Percentage :",
        "all_modes_button": "All Modes",
        "wins_label": "Wins",
        "losses_label": "Losses",
        "match_history_title": "Match History",
        "change_password_modal_title": "Change Password",
        "old_password_label": "Old Password",
        "new_password_label": "New Password",
        "confirm_new_password_label": "Confirm New Password",
        "save_changes_button": "Save Changes",
        //"change_password_button_modal": "Change",
        //"edit_profile_modal_title": "Edit Profile",
        //"first_name_input_label": "First Name",
        //"last_name_input_label": "Last Name",
        //"username_input_label": "Username",
        //"email_input_label": "Email",
        "member_since_label": "Member since :",
        "last_login_label": "Last login :",
        "friend_since_label": "Friend since :",
        "statistics_title": "STATISTICS",
        "remove_friend_button": "Remove",
        //"close_button": "Close",
        "edit_profile_photo_modal_title": "Change Profile Photo",
        "new_profile_photo_label": "New Profile Photo :",
        "delete_photo_button": "Delete Photo"
        //"save_photo_button": "Save"
    },
    fr: {
        "game_title": "Pong",
        "user_login": "Connexion Utilisateur",
        "email_label": "E-mail :",
        "email_placeholder": "votremail@exemple.com",
        "password_label": "Mot de passe :",
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
        "password_help": "Le mot de passe doit contenir au moins 12 caractères, comprenant au moins majuscule, minuscule, chiffre et caractère spécial. Il ne peut pas contenir de mots courants, votre prénom, nom de famille, ou adresse e-mail.",
        "confirm_password_label": "Confirmez le mot de passe :",
        "profile_photo_label": "Photo de profil :",
        "profile_photo_placeholder": "Choisissez une photo de profil",
        "profile_preview_alt": "Aperçu du profil",
        "select_file_button": "Choisir un fichier",
        "no_file_selected": "Aucun fichier sélectionné",

        "home_page_title": "Accueil",
        "home_title": "Accueil",
        "Customize_Play_Button": "Personnaliser et Jouer",

        "profile_page_title": "Profil",
        "edit_profile_title": "Editer",
        //"username_label": "Nom d'utilisateur :",
        "first_name_label": "Prénom :",
        "last_name_label": "Nom :",
        //"email_label": "E-mail :",
        "edit_profile_button": "Modifier le profil",
        "change_password_button": "Changer le mot de passe",
        "friend_list_title": "Liste d'amis",
        "all_players_title": "Tous les joueurs",
        "personal_stats_title": "Statistiques personnelles",
        "games_played_label": "Nombre de parties jouées :",
        "win_percentage_label": "Pourcentage de victoire :",
        "all_modes_button": "Tous les modes",
        "wins_label": "Victoire",
        "losses_label": "Défaite",
        "match_history_title": "Historique des parties",
        "change_password_modal_title": "Changer le mot de passe",
        "old_password_label": "Ancien mot de passe",
        "new_password_label": "Nouveau mot de passe",
        "confirm_new_password_label": "Confirmer le mot de passe",
        "save_changes_button": "Enregistrer",
        //"change_password_button_modal": "Changer",
        //"edit_profile_modal_title": "Modifier le profil",
        //"first_name_input_label": "Prénom",
        //"last_name_input_label": "Nom",
        //"username_input_label": "Nom d'utilisateur",
        //"email_input_label": "E-mail",
        "member_since_label": "Membre depuis :",
        "last_login_label": "Dernière connexion :",
        "friend_since_label": "Ami depuis :",
        "statistics_title": "STATISTIQUES",
        "remove_friend_button": "Supprimer",
        //"close_button": "Fermer",
        "edit_profile_photo_modal_title": "Changer la photo de profil",
        "new_profile_photo_label": "Nouvelle photo de profil :",
        "delete_photo_button": "Supprimer la photo"
        //"save_photo_button": "Enregistrer"
    },
    es: {
        "game_title": "Pong",
        "user_login": "Inicio de sesión de usuario",
        "email_label": "Correo electrónico :",
        "email_placeholder": "tucorreo@ejemplo.com",
        "password_label": "Contraseña :",
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
        "no_file_selected": "Ningún archivo seleccionado",

        "home_page_title": "Inicio",
        "home_title": "Inicio",
        "Customize_Play_Button": "Personalizar y Jugar",

        "profile_page_title": "Perfil",
        "edit_profile_title": "Editar",
        //"username_label": "Nombre de usuario:",
        "first_name_label": "Nombre :",
        "last_name_label": "Apellido :",
        //"email_label": "Correo electrónico:",
        "edit_profile_button": "Editar perfil",
        "change_password_button": "Cambiar contraseña",
        "friend_list_title": "Lista de amigos",
        "all_players_title": "Todos los jugadores",
        "personal_stats_title": "Estadísticas personales",
        "games_played_label": "Número de juegos jugados :",
        "win_percentage_label": "Porcentaje de victorias :",
        "all_modes_button": "Todos los modos",
        "wins_label": "Victoria",
        "losses_label": "Derrota",
        "match_history_title": "Historial de juegos",
        "change_password_modal_title": "Cambiar contraseña",
        "old_password_label": "Contraseña antigua",
        "new_password_label": "Nueva contraseña",
        "confirm_new_password_label": "Confirmar contraseña",
        "save_changes_button": "Guardar cambios",
        //"change_password_button_modal": "Cambiar",
        //"edit_profile_modal_title": "Editar perfil",
        //"first_name_input_label": "Nombre",
        //"last_name_input_label": "Apellido",
        //"username_input_label": "Nombre de usuario",
        //"email_input_label": "Correo electrónico",
        "member_since_label": "Miembro desde :",
        "last_login_label": "Última conexión :",
        "friend_since_label": "Amigo desde :",
        "statistics_title": "ESTADÍSTICAS",
        "remove_friend_button": "Eliminar",
        //"close_button": "Cerrar",
        "edit_profile_photo_modal_title": "Cambiar foto de perfil",
        "new_profile_photo_label": "Nueva foto de perfil :",
        "delete_photo_button": "Eliminar foto"
        //"save_photo_button": "Guardar"
    },
    bg: {
        "game_title": "Понг",
        "user_login": "Потребителско Влизане",
        "email_label": "Имейл :",
        "email_placeholder": "вашияимейл@пример.com",
        "password_label": "Парола :",
        "password_placeholder": "Въведете вашата парола",
        "close_button": "Затвори",
        "login_button": "Влизане",
        "customize_play": "Персонализирай и Играй",
        "game_mode": "Режим на играта :",
        "game_mode_versus": "Срещу",
        "game_mode_tournament": "Турнир",
        "game_mode_last_man_standing": "Последният оцелял",
        "game_mode_brick_breaker": "Трошач на тухли",
        "add_player": "Добави играч",
        "remove_player": "Премахни играч",
        "max_score": "Максимален резултат :",
        "paddle_speed": "Скорост на ракетата :",
        "paddle_size": "Размер на ракетата :",
        "bounce_mode": "Режим на отскачане",
        "ball_speed": "Скорост на топката :",
        "ball_acceleration": "Ускорение на топката :",
        "num_balls": "Брой топки :",
        "map": "Карта :",
        "find_match": "Приятел със сходен процент на победи",
        "default_settings": "Настройки по подразбиране",
        "start_game": "Започни играта",
        "player_title": "Играч",
        "enter_player_name": "Въведете име на играча",
        "connect_button": "Свържи",
        "up_key_label": "Клавиш Нагоре",
        "down_key_label": "Клавиш Надолу",
        "left_key_label": "Клавиш Наляво",
        "right_key_label": "Клавиш Надясно",
        "press_key_placeholder": "Натиснете клавиш",
        "max_score_na": "Няма",
        "must_have_name_and_keys": "трябва да има име и зададени клавиши!",
        "name_already_used": "Името вече се използва от друг играч. Моля, изберете друго име.",
        "same_key_error": "не може да има една и съща клавиш за Нагоре и Надолу.",
        "key_already_assigned": "Клавишът вече е зададен на друг играч.",
        "back_to_menu": "Назад към менюто",
        "go_to_settings": "Отиди към настройките",

        "login_page_title": "Влизане",
        "login_title": "Влизане",
        "submit_button": "Изпрати",
        "register_page_title": "Регистрация",
        "register_title": "Регистрация",
        "name_label": "Име :",
        "first_name_placeholder": "Първо име",
        "last_name_placeholder": "Фамилия",
        "username_label": "Потребителско име :",
        "password_help": "Паролата трябва да е поне 12 символа, включително поне главни, малки букви, цифра и специален символ. Не може да съдържа често срещани думи, вашето име, фамилия или имейл адрес.",
        "confirm_password_label": "Потвърдете паролата :",
        "profile_photo_label": "Профилна снимка :",
        "profile_photo_placeholder": "Изберете профилна снимка",
        "profile_preview_alt": "Преглед на профила",
        "select_file_button": "Изберете файл",
        "no_file_selected": "Няма избран файл",

        "home_page_title": "Начало",
        "home_title": "Начало",
        "Customize_Play_Button": "Персонализирай и Играй",

        "profile_page_title": "Профил",
        "edit_profile_title": "Редактиране",
        //"username_label": "Потребителско име :",
        "first_name_label": "Първо име :",
        "last_name_label": "Фамилия :",
        //"email_label": "Имейл :",
        "edit_profile_button": "Редактирай профила",
        "change_password_button": "Промени паролата",
        "friend_list_title": "Списък с приятели",
        "all_players_title": "Всички играчи",
        "personal_stats_title": "Лична статистика",
        "games_played_label": "Изиграни игри :",
        "win_percentage_label": "Процент на победи :",
        "all_modes_button": "Всички режими",
        "wins_label": "Победи",
        "losses_label": "Загуби",
        "match_history_title": "История на игрите",
        "change_password_modal_title": "Промяна на паролата",
        "old_password_label": "Стара парола",
        "new_password_label": "Нова парола",
        "confirm_new_password_label": "Потвърдете новата парола",
        "save_changes_button": "Запази промените",
        //"change_password_button_modal": "Промени",
        //"edit_profile_modal_title": "Редактиране на профила",
        //"first_name_input_label": "Първо име",
        //"last_name_input_label": "Фамилия",
        //"username_input_label": "Потребителско име",
        //"email_input_label": "Имейл",
        "member_since_label": "Член от :",
        "last_login_label": "Последно влизане :",
        "friend_since_label": "Приятел от :",
        "statistics_title": "СТАТИСТИКА",
        "remove_friend_button": "Премахване",
        //"close_button": "Затвори",
        "edit_profile_photo_modal_title": "Промени профилната снимка",
        "new_profile_photo_label": "Нова профилна снимка :",
        "delete_photo_button": "Изтрий снимката"
        //"save_photo_button": "Запази"
    }    
};

document.addEventListener('DOMContentLoaded', () => {
    addFooter();
    changeLanguage();
});
