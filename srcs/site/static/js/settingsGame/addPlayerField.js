import { handleKeyBindings } from './keyBinds.js';

export function addPlayerField(index, noControls = false) {
    const controlsWrapper = document.getElementById('player-controls-wrapper');
    if (!controlsWrapper) return;
    let column;

    if (index % 2 === 0) {
        column = document.getElementById('column1') || createColumn('column1', controlsWrapper);
    } else {
        column = document.getElementById('column2') || createColumn('column2', controlsWrapper);
    }

    const playerContainer = createPlayerContainer(index);
    const mode = document.getElementById('mode')?.value || '';

    if (!noControls) {
        const controlKeysDiv = createControlKeysDiv(index, mode);

        if (mode === 'tournament') {
            column.appendChild(controlKeysDiv);
            column.appendChild(playerContainer);
        } else {
            playerContainer.appendChild(controlKeysDiv);
            column.appendChild(playerContainer);
        }

        handleKeyBindings(index, mode);
    } else {
        column.appendChild(playerContainer);
    }
}

function createColumn(id, parent) {
    const column = document.createElement('div');
    column.classList.add('col-md-5', 'mx-auto');
    column.setAttribute('id', id);
    parent.appendChild(column);
    return column;
}

function createPlayerContainer(index) {
    const playerContainer = document.createElement('div');
    playerContainer.classList.add('player-container', 'mt-5', 'mb-5', 'text-center');

    const playerTitle = document.createElement('h5');
    playerTitle.textContent = `Player ${index + 1}`;
    playerContainer.appendChild(playerTitle);

    const playerControlDiv = createPlayerControlDiv(index);
    playerContainer.appendChild(playerControlDiv);

    return playerContainer;
}

function createPlayerControlDiv(index) {
    const divPlayer = document.createElement('div');
    divPlayer.classList.add('player-control', 'mb-3');
    divPlayer.innerHTML = `
        <input type="text" class="form-control" id="player${index}" placeholder="Enter player name" autocomplete="off" maxlength="8">
        <div id="usernameCharCount${index}" class="form-text">Characters left: 8</div>
    `;

    if (localStorage.getItem('accessToken')) {
        const connectButton = document.createElement('button');
        connectButton.classList.add('btn', 'btn-outline-primary', 'connect-btn');
        connectButton.setAttribute('data-player-index', index);
        connectButton.setAttribute('data-bs-toggle', 'modal');
        connectButton.setAttribute('data-bs-target', '#loginModal');
        connectButton.textContent = "Connect";
        divPlayer.appendChild(connectButton);
    }

    const usernameInput = divPlayer.querySelector(`#player${index}`);
    const charCountDisplay = divPlayer.querySelector(`#usernameCharCount${index}`);
    usernameInput.addEventListener('input', () => updateCharCount(usernameInput, charCountDisplay));

    updateCharCount(usernameInput, charCountDisplay);
    return divPlayer;
}

function updateCharCount(input, display) {
    const remainingChars = 8 - input.value.length;
    display.textContent = `Characters left: ${remainingChars}`;
}

function createControlKeysDiv(index, mode) {
    const divKeys = document.createElement('div');
    divKeys.classList.add('player-controls', 'mb-3');

    let upLabel = "Up Key";
    let downLabel = "Down Key";

    if (mode === 'brickBreaker' || (mode === 'lastManStanding' && index >= 2)) {
        upLabel = "Left Key";
        downLabel = "Right Key";
    }

    divKeys.innerHTML = `
        <div class="mb-2 d-flex align-items-center mx-3">
            <label class="col-form-label text-start text-nowrap key-label">${upLabel}:</label>
            <div class="flex-grow-1 ms-4">
                <input type="text" class="form-control touch-field" id="player${index}Up" placeholder="Press a key" autocomplete="off">
            </div>
        </div>
        <div class="mb-2 d-flex align-items-center mx-3">
            <label class="col-form-label text-start text-nowrap key-label">${downLabel}:</label>
            <div class="flex-grow-1 ms-4">
                <input type="text" class="form-control touch-field" id="player${index}Down" placeholder="Press a key" autocomplete="off">
            </div>
        </div>
    `;

    return divKeys;
}
