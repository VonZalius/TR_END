import { htmlHome } from './views/html_home.js';
import { htmlRegister } from './views/html_register.js';
import { htmlLogin } from './views/html_login.js';
import { htmlProfile } from './views/html_profile.js';
import { htmlSettingsGame } from './views/html_settingsGame.js';
import { htmlGame } from './views/html_game.js';
import { loadNavBar } from './commons/navbar.js';
import { addFooter } from './commons/common.js';

const routes = {
    '/': htmlHome,
    '/register': htmlRegister,
    '/login': htmlLogin,
    '/profile': htmlProfile,
	'/settingsGame': htmlSettingsGame,
	'/game': htmlGame,
};

function navigate(path) {
    const view = routes[path];
    const app = document.getElementById('app');
    if (view) {
        app.innerHTML = '';
        view(app);
    } else {
        app.innerHTML = '<h1>404 - Page Not Found</h1>';
    }
}

window.addEventListener('hashchange', () => {
    navigate(location.hash.slice(1) || '/');
});

window.addEventListener('DOMContentLoaded', () => {
    loadNavBar();
    navigate(location.hash.slice(1) || '/');
    addFooter();
});
