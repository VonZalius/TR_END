import { storeGameSession } from '../games/registerGame.js';

export function initializeStartGame() {
    document.getElementById('startGame').addEventListener('click', () => {
        const mode = document.getElementById('mode').value;
        const playerFields = document.getElementsByClassName('player-control');
        const usedKeys = new Set();
        const usedNames = new Set();

        let allFieldsValid = true;

        for (let i = 0; i < playerFields.length; i++) {
            const playerName = document.getElementById(`player${i}`).value.trim();

            let upKey = '';
            let downKey = '';

            if (mode !== 'tournament' || i < 2) {
                upKey = document.getElementById(`player${i}Up`).getAttribute('data-key') || document.getElementById(`player${i}Up`).value.trim();
                downKey = document.getElementById(`player${i}Down`).getAttribute('data-key') || document.getElementById(`player${i}Down`).value.trim();
            }

            if (!playerName || (mode !== 'tournament' && (!upKey || !downKey))) {
                allFieldsValid = false;
                showMessage(`Player ${i + 1} must have a name and keys assigned!`, "warning");
                break;
            }

            if (usedNames.has(playerName)) {
                allFieldsValid = false;
                showMessage(`The name '${playerName}' is already used by another player. Please choose a different name.`, "warning");
                break;
            }

            if (mode !== 'tournament' || i < 2) {
                if (upKey === downKey) {
                    allFieldsValid = false;
                    showMessage(`Player ${i + 1} cannot have the same key for both Up and Down.`, "warning");
                    break;
                }

                if (usedKeys.has(upKey)) {
                    allFieldsValid = false;
                    showMessage(`The key '${upKey}' is already assigned to another player.`, "warning");
                    break;
                }
                if (usedKeys.has(downKey)) {
                    allFieldsValid = false;
                    showMessage(`The key '${downKey}' is already assigned to another player.`, "warning");
                    break;
                }

                usedKeys.add(upKey);
                usedKeys.add(downKey);
            }

            usedNames.add(playerName);
        }

		if (allFieldsValid) {
			const playerNames = [];
			const playerKeys = [];
			for (let i = 0; i < playerFields.length; i++) {
				const playerName = document.getElementById(`player${i}`).value;

				let upKey = '';
				let downKey = '';

				if (mode !== 'tournament' || i < 2) {
					upKey = document.getElementById(`player${i}Up`).getAttribute('data-key') || document.getElementById(`player${i}Up`).value;
					downKey = document.getElementById(`player${i}Down`).getAttribute('data-key') || document.getElementById(`player${i}Down`).value;
				}

				playerNames.push(playerName);
				playerKeys.push([upKey, downKey]);
			}

			const maxScore = document.getElementById('maxScore').value;
			const paddleSpeed = document.getElementById('paddleSpeed').value;
			const paddleSize = document.getElementById('paddleSize').value;
			const bounceMode = document.getElementById('bounceMode').checked;
			const ballSpeed = document.getElementById('ballSpeed').value;
			const ballAcceleration = document.getElementById('ballAcceleration').value;
			const numBalls = document.getElementById('numBalls').value;
			const map = document.getElementById('map').value;

			localStorage.setItem('gameOptions', JSON.stringify({
				mode, playerNames, playerKeys, maxScore, paddleSpeed, paddleSize, bounceMode, ballSpeed, ballAcceleration, numBalls, map
			}));

			storeGameSession();
			window.location.href = 'game.html';
		}
	});
}