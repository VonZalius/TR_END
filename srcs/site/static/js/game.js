import { main } from '../game/games.js';

export function initializeGame() {
    const gameOptions = JSON.parse(localStorage.getItem('gameOptions'));
    let gameSession = JSON.parse(localStorage.getItem('gameSession'));

    if (gameSession) {
        gameSession.start_date = formatDateToStandard(new Date());
        localStorage.setItem('gameSession', JSON.stringify(gameSession));
    }

    if (gameOptions) {
        const { mode, playerNames, playerKeys, maxScore, paddleSpeed, paddleSize, bounceMode, ballSpeed, ballAcceleration, numBalls, map } = gameOptions;

        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        let languageIndex = 0;

        switch (selectedLanguage) {
            case 'fr':
                languageIndex = 1;
                break;
            case 'es':
                languageIndex = 2;
                break;
            case 'bg':
                languageIndex = 3;
                break;
            default:
                languageIndex = 0;
        }

        main(
            mode,
            playerNames,
            playerKeys,
            parseInt(maxScore),
            parseInt(paddleSpeed),
            parseInt(paddleSize),
            bounceMode,
            parseInt(ballSpeed),
            parseInt(ballAcceleration),
            parseInt(numBalls),
            parseInt(map),
            languageIndex
        );
    } else {
        alert("No game options found!");
        window.location.hash = '#/settingsGame';
    }

    const backButton = document.getElementById('backButton');
    const settingsButton = document.getElementById('settingsButton');

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.hash = '#/';
        });
    } else {
        console.error('Back button not found.');
    }

    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            window.location.hash = '#/settingsGame';
        });
    } else {
        console.error('Settings button not found.');
    }

    document.addEventListener('keydown', function (event) {
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        const canvas = document.getElementById('webgl1');

        if (keysToPrevent.includes(event.key) && document.activeElement !== canvas) {
            event.preventDefault();
        }
    });
}

function formatDateToStandard(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

