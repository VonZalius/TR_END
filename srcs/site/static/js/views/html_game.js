import { initializeGame } from '../game.js';

export function htmlGame(app) {
    app.innerHTML = `
    <div class="text-center mt-5">
        <h2 class="mb-4">Pong</h2>
        <canvas id="webgl1" width="1000" height="1000"></canvas>
        <div id="scoreboard"></div>
        <div class="mt-3">
            <button class="btn btn-primary" id="backButton">Back to Menu</button>
            <button class="btn btn-primary ms-3" id="settingsButton">Go to Settings</button>
        </div>
    </div>
    `;

    initializeGame();
}
