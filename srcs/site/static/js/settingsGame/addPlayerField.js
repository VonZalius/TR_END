import { handleKeyBindings } from './keyBinds.js';

export function addPlayerField(index, noControls = false) {
    const controlsWrapper = document.getElementById('player-controls-wrapper');
    let column;

    if (index % 2 === 0) {
        if (!document.getElementById('column1')) {
            column = document.createElement('div');
            column.classList.add('col-md-5', 'mx-auto');
            column.setAttribute('id', 'column1');
            controlsWrapper.appendChild(column);
        } else {
            column = document.getElementById('column1');
        }
    } else {
        if (!document.getElementById('column2')) {
            column = document.createElement('div');
            column.classList.add('col-md-5', 'mx-auto');
            column.setAttribute('id', 'column2');
            controlsWrapper.appendChild(column);
        } else {
            column = document.getElementById('column2');
        }
    }

    const playerContainer = document.createElement('div');
    playerContainer.classList.add('player-container', 'mt-5', 'mb-5', 'text-center');

    const playerTitle = document.createElement('h5');
    playerTitle.setAttribute('data-translate', 'player_title');
    playerTitle.textContent = `Player ${index + 1}`;
    playerContainer.appendChild(playerTitle);

    const divPlayer = document.createElement('div');
    divPlayer.classList.add('player-control', 'mb-3');
    divPlayer.innerHTML = `
        <input type="text" class="form-control" id="player${index}" data-translate="enter_player_name" placeholder="Enter player name" autocomplete="off">
        <br>
        <button class="btn btn-outline-primary connect-btn" data-player-index="${index}" data-bs-toggle="modal" data-bs-target="#loginModal" data-translate="connect_button">Connect</button>
    `;
    playerContainer.appendChild(divPlayer);

    const mode = document.getElementById('mode').value;

    let upLabel = "Up Key";
    let downLabel = "Down Key";

    if (mode === 'brickBreaker' || (mode === 'lastManStanding' && index >= 2)) {
        upLabel = "Left Key";
        downLabel = "Right Key";
    }

    let touchTitle = "";
    if (mode === 'tournament') {
        if (index % 2 === 0) {
            touchTitle = "Left players";
        } else {
            touchTitle = "Right players";
        }
    }

    if (noControls) {
        column.appendChild(playerContainer);
        return;
    }

    const divKeys = document.createElement('div');
    divKeys.classList.add('player-controls', 'mb-3');

    if (mode === 'tournament') {
        const touchTitleElement = document.createElement('h5');
        touchTitleElement.textContent = touchTitle;
        touchTitleElement.classList.add('text-center', 'mt-3', 'mb-3');
        divKeys.appendChild(touchTitleElement);
    }

    divKeys.innerHTML += `
		<div class="mb-2 d-flex align-items-center mx-3">
            <label class="col-form-label text-start text-nowrap key-label" data-translate="${mode === 'brickBreaker' || (mode === 'lastManStanding' && index >= 2) ? 'left_key_label' : 'up_key_label'}">${upLabel} :</label>
            <div class="flex-grow-1 ms-4">
                <input type="text" class="form-control touch-field" id="player${index}Up" data-translate="press_key_placeholder" placeholder="Press a key" autocomplete="off">
            </div>
        </div>
        <div class="mb-2 d-flex align-items-center mx-3">
            <label class="col-form-label text-start text-nowrap key-label" data-translate="${mode === 'brickBreaker' || (mode === 'lastManStanding' && index >= 2) ? 'right_key_label' : 'down_key_label'}">${downLabel} :</label>
            <div class="flex-grow-1 ms-4">
                <input type="text" class="form-control touch-field" id="player${index}Down" data-translate="press_key_placeholder" placeholder="Press a key" autocomplete="off">
            </div>
        </div>
    `;
    playerContainer.appendChild(divKeys);

    if (mode === 'tournament') {
        column.appendChild(divKeys);
        column.appendChild(playerContainer);
    } else {
        playerContainer.appendChild(divKeys);
        column.appendChild(playerContainer);
    }

    // Initialisation des key bindings pour les champs de touches
    handleKeyBindings(index, mode);
}
