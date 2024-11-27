import { showMessage, verifyToken } from '../commons/common.js';
import { initSettingsGame } from '../settingsGame/settingsGame.js';
import { initMatchmaking } from '../games/matchmaking.js';
import { initVerifUser } from '../games/verifUser.js';

export async function htmlSettingsGame(app) {
	app.innerHTML = `
		<div class="container mt-5 mb-5">
			<div class="row justify-content-center">
				<div class="col-lg-8 col-md-10">
					<h2 class="text-center mb-4">Customize & Play</h2>
					<div class="card p-4">
						<div id="controls">
							<div class="form-group mb-3 d-flex align-items-center">
									<label for="mode" class="form-label text-nowrap mt-1 me-4">Game Mode :</label>
									<select id="mode" class="form-select flex-grow-1">
										<option value="versus" >Versus</option>
										<option value="tournament" >Tournament</option>
										<option value="lastManStanding" >Last Man Standing</option>
										<option value="brickBreaker" >Brick Breaker</option>
									</select>
							</div>
							<div id="matchmakingSection">
								<div class="form-group mb-3 d-flex align-items-center justify-content-between">
									<span id="userWinPercentageText" class="me-3">My winning percentage : %</span>
									<button id="matchmakingButton" class="btn btn-outline-info" data-bs-toggle="collapse" data-bs-target="#matchmakingAccordion">
										Show Matchmaking with Friends
									</button>
								</div>
								<div id="matchmakingAccordion" class="accordion-collapse collapse">
									<div class="accordion-body">
										<ul id="friendMatchmakingList" class="list-group">
										</ul>
									</div>
								</div>
							</div>

							<div id="player-controls-wrapper" class="row"></div>

							<div id="player-controls-wrapper" class="form-group mb-3"></div>
							<div id="player-key-wrapper" class="form-group mb-3"></div>

							<div class="d-flex justify-content-between mb-3">
								<button id="addPlayer" class="btn btn-outline-primary">Add Player</button>
								<button id="removePlayer" class="btn btn-outline-danger">Remove Player</button>
							</div>

							<div class="form-group mb-3">
								<label for="maxScore" class="form-label">Max Score: <span id="maxScoreValue">10</span></label>
								<input type="range" id="maxScore" class="form-range" min="1" max="100" value="10" step="1">
							</div>

							<div class="form-group mb-3">
								<label for="paddleSpeed" class="form-label">Paddle Speed: <span id="paddleSpeedValue">5</span></label>
								<input type="range" id="paddleSpeed" class="form-range" min="1" max="30" value="5" step="1">
							</div>

							<div class="form-group mb-3">
								<label for="paddleSize" class="form-label">Paddle Size: <span id="paddleSizeValue">100</span></label>
								<input type="range" id="paddleSize" class="form-range" min="20" max="150" value="100" step="1">
							</div>

							<div class="form-check form-switch mb-3">
								<input class="form-check-input" type="checkbox" id="bounceMode" checked>
								<label class="form-check-label" for="bounceMode">Bounce Mode</label>
							</div>

							<div class="form-group mb-3">
								<label for="ballSpeed" class="form-label">Ball Speed: <span id="ballSpeedValue">5</span></label>
								<input type="range" id="ballSpeed" class="form-range" min="1" max="10" value="5" step="1">
							</div>

							<div class="form-group mb-3">
								<label for="ballAcceleration" class="form-label">Ball Acceleration: <span id="ballAccelerationValue">1</span></label>
								<input type="range" id="ballAcceleration" class="form-range" min="0" max="5" value="1" step="1">
							</div>

							<div class="form-group mb-3">
								<label for="numBalls" class="form-label">Number of Balls: <span id="numBallsValue">1</span></label>
								<input type="range" id="numBalls" class="form-range" min="1" max="10" value="1" step="1">
							</div>

							<div class="form-group mb-3">
								<label for="map" class="form-label">Map: <span id="mapValue">1</span></label>
								<input type="range" id="map" class="form-range" min="1" max="5" value="1" step="1">
							</div>

							<div class="d-flex justify-content-between mt-4">
								<button id="defaultSetting" class="btn btn-secondary">Default Settings</button>
								<button id="startGame" class="btn btn-primary"">Start Game</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="loginModalLabel">User Login</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div class="form-group mb-3">
							<label for="loginEmail">Email</label>
							<input type="email" id="loginEmail" class="form-control" placeholder="Enter your email" required>
						</div>
						<div class="form-group mb-3">
							<label for="loginPassword">Password</label>
							<input type="password" id="loginPassword" class="form-control" placeholder="Enter your password" required>
						</div>
						<input type="hidden" id="loginPlayerIndex">
						<div id="loginErrorMessage" class="alert alert-danger d-none" role="alert"></div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary" id="loginSubmit">Login</button>
					</div>
				</div>
			</div>
		</div>
	`;

    const accessToken = localStorage.getItem('accessToken');
    const matchmakingSection = document.getElementById('matchmakingSection');
    if (!accessToken || !(await verifyToken())) {
        matchmakingSection.style.display = 'none';
    }

    initSettingsGame();
    initMatchmaking();
    initVerifUser();
}
