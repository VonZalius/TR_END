import { addPlayerField } from './addPlayerField.js';
import { initializeStartGame } from './startGame.js';
import { clearUsedKeys } from './keyBinds.js';

const MIN_PLAYERS = 2;
const VERSUS_MAX = 4;
const TOURNAMENT_MAX = 10;
const LASTMANSTANDING_MAX = 4;
const BRICKBREAKER_MAX = 4;

let existingUsernames = [];

async function fetchExistingUsernames() {
    try {
        const response = await fetch("https://localhost:8000/api/user/show-all-users/");
        if (response.ok) {
            const users = await response.json();
            existingUsernames = users.map(user => user.username.toLowerCase());
        } else {
            console.error('Failed to fetch existing usernames');
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
    }
}

function checkUsernameAvailability(inputField) {
    const username = inputField.value.trim().toLowerCase();
    const usernamePattern = /^[a-zA-Z0-9@#_.-]{8}$/;

    let errorMessage = inputField.parentNode.querySelector('.invalid-feedback');
    if (errorMessage) {
        errorMessage.remove();
    }

    const nameExistsMessage = "Name already exists, try to connect!";
    const invalidFormatMessage = "Username must be exactly 8 alphanumeric characters or special characters - _ @ .";

    if (!usernamePattern.test(username)) {
        displayError(inputField, invalidFormatMessage);
    } else if (existingUsernames.includes(username) || isUsernameAlreadyUsedInGame(username, inputField)) {
        displayError(inputField, nameExistsMessage);
    } else {
        inputField.classList.remove('is-invalid');
    }
}

function displayError(inputField, message) {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('invalid-feedback', 'text-danger');
    errorMessage.textContent = message;
    inputField.classList.add('is-invalid');
    inputField.parentNode.appendChild(errorMessage);
}

function isUsernameAlreadyUsedInGame(username, currentInputField) {
    const playerInputFields = document.querySelectorAll('.player-control input[type="text"]');
    return Array.from(playerInputFields).some(field =>
        field !== currentInputField && field.value.trim().toLowerCase() === username
    );
}

export async function initSettingsGame() {
    await fetchExistingUsernames();

    document.getElementById('mode').addEventListener('change', updateOptions);
    document.getElementById('addPlayer').addEventListener('click', addPlayer);
    document.getElementById('removePlayer').addEventListener('click', removePlayer);
    document.getElementById('defaultSetting').addEventListener('click', resetToDefault);

    document.getElementById('player-controls-wrapper').addEventListener('input', event => {
        if (event.target && event.target.matches('.player-control input[type="text"]')) {
            checkUsernameAvailability(event.target);
        }
    });

    initializeRangeDisplays();
    updateOptions();
    initializeStartGame();
}

function initializeRangeDisplays() {
    const rangeSettings = [
        { id: 'maxScore', displayId: 'maxScoreValue' },
        { id: 'paddleSpeed', displayId: 'paddleSpeedValue' },
        { id: 'paddleSize', displayId: 'paddleSizeValue' },
        { id: 'ballSpeed', displayId: 'ballSpeedValue' },
        { id: 'ballAcceleration', displayId: 'ballAccelerationValue' },
        { id: 'numBalls', displayId: 'numBallsValue' },
        { id: 'map', displayId: 'mapValue' },
    ];

    rangeSettings.forEach(({ id, displayId }) => {
        const rangeInput = document.getElementById(id);
        const display = document.getElementById(displayId);

        rangeInput.addEventListener('input', () => {
            display.textContent = rangeInput.value;
        });

        display.textContent = rangeInput.value;
    });
}

function updateOptions() {
    const mode = document.getElementById('mode').value;
    const maxScoreField = document.getElementById('maxScore');

    document.getElementById('player-controls-wrapper').innerHTML = ''; 
    document.getElementById('player-key-wrapper').innerHTML = ''; 

    clearUsedKeys();

    const initialPlayers = MIN_PLAYERS;
    const maxPlayers = getMaxPlayersForMode(mode);

    maxScoreField.disabled = (mode === 'brickBreaker');
    document.getElementById('maxScoreValue').textContent = maxScoreField.disabled ? 'N/A' : maxScoreField.value;

    for (let i = 0; i < initialPlayers; i++) {
        addPlayerField(i);
    }

    updateAddPlayerButton(maxPlayers);
    updateRemovePlayerButton(initialPlayers);
}

function getPlayersToAddOrRemove(mode) {
    return (mode === 'versus' || mode === 'brickBreaker') ? 2 : 1;
}

function addPlayer() {
    const mode = document.getElementById('mode').value;
    const maxPlayers = getMaxPlayersForMode(mode);
    const playerFields = document.getElementsByClassName('player-control');

    let toAdd = getPlayersToAddOrRemove(mode);
    const currentPlayers = playerFields.length;

    for (let i = 0; i < toAdd; i++) {
        if (currentPlayers + i < maxPlayers) {
            addPlayerField(currentPlayers + i, mode === 'tournament');
        }
    }

    updateAddPlayerButton(maxPlayers);
    updateRemovePlayerButton(currentPlayers + toAdd);
}

function removePlayer() {
    const mode = document.getElementById('mode').value;
    const column1 = document.getElementById('column1');
    const column2 = document.getElementById('column2');

    const playerContainersCol1 = column1?.getElementsByClassName('player-container') || [];
    const playerContainersCol2 = column2?.getElementsByClassName('player-container') || [];

    let toRemove = getPlayersToAddOrRemove(mode);

    for (let i = 0; i < toRemove; i++) {
        if (playerContainersCol1.length + playerContainersCol2.length > MIN_PLAYERS) {
            if (playerContainersCol1.length > playerContainersCol2.length) {
                playerContainersCol1[playerContainersCol1.length - 1].remove();
            } else {
                playerContainersCol2[playerContainersCol2.length - 1].remove();
            }
        }
    }

    updateRemovePlayerButton(playerContainersCol1.length + playerContainersCol2.length - toRemove);
}

function updateAddPlayerButton(maxPlayers) {
    const playerFields = document.getElementsByClassName('player-control');
    const addPlayerButton = document.getElementById('addPlayer');
    addPlayerButton.style.display = playerFields.length >= maxPlayers ? 'none' : 'inline';
}

function updateRemovePlayerButton(currentPlayers) {
    const removePlayerButton = document.getElementById('removePlayer');
    removePlayerButton.style.display = currentPlayers <= MIN_PLAYERS ? 'none' : 'inline';
}

function getMaxPlayersForMode(mode) {
    switch (mode) {
        case 'versus':
        case 'brickBreaker':
            return VERSUS_MAX;
        case 'tournament':
            return TOURNAMENT_MAX;
        case 'lastManStanding':
            return LASTMANSTANDING_MAX;
        default:
            return 4;
    }
}

function resetToDefault() {
    document.getElementById('maxScore').value = 10;
    document.getElementById('paddleSpeed').value = 5;
    document.getElementById('paddleSize').value = 100;
    document.getElementById('bounceMode').checked = true;
    document.getElementById('ballSpeed').value = 5;
    document.getElementById('ballAcceleration').value = 1;
    document.getElementById('numBalls').value = 1;
    document.getElementById('map').value = 1;

    initializeRangeDisplays();
}
