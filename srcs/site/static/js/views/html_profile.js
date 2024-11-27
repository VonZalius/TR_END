import { fetchUserProfile, initProfileHandlers } from '../profile.js';
import { initShowAllUsers } from '../friends/showAllUsers.js';
import { initFriendList } from '../friends/friendList.js';
import { fetchUserStats } from '../games/currUserStats.js';
import { initUserMatchHistory } from '../games/currUserHistory.js';

export function htmlProfile(app) {
	app.innerHTML = `
		<div class="container-fluid mt-5 mb-5">
			<h1 class="text-center mb-5">Profile</h1>
			<div id="messageContainer" class="mb-5"></div>
		</div>

		<div class="container-fluid div-custom-marge-pp">
			<div class="row">
				<div class="col-md-6 d-flex flex-column justify-content-center">
					<div class="profile-photo-wrapper">
						<img src="" alt="Profile Photo" id="profilePhoto" class="profile-photo">
						<div class="edit-overlay d-flex justify-content-center align-items-center">
							<span class="text-white fw-bold">EDIT</span>
						</div>
					</div>
				</div>
				<div class="col-md-6 d-flex flex-column justify-content-center more-marge-top-title">
					<div class="text-start">
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Username :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userUsername"></div>
						</div>
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Prénom :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userFirstName"></div>
						</div>
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Nom :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userLastName"></div>
						</div>
						<div class="row mb-2">
							<div class="col-md-4 col-12 fw-bold fs-5 text-nowrap">Email :</div>
							<div class="col-md-8 col-12 fs-5 text-nowrap" id="userEmail"></div>
						</div>
						<button class="btn btn-outline-primary mt-5" id="editProfileBtn">Modifier le profil</button>
						<button class="btn btn-outline-warning mt-5" id="changePasswordBtn">Changer le mot de passe</button>
					</div>				
				</div>
			</div>
		</div>

		<div class="container-fluid div-custom-marge">
			<div class="row">
				<div class="col-md-6">
					<h3 class="mt-5">
						<a class="text-decoration-none" data-bs-toggle="collapse" href="#friendListContainer" role="button" aria-expanded="false" aria-controls="friendListContainer">
							FRIEND LIST
						</a>
					</h3>
					<div id="friendListContainer" class="collapse text-start mt-5"></div>
					<h3 class="mt-5 d-flex align-items-center">
						<a class="text-decoration-none" data-bs-toggle="collapse" href="#allUsersContainer" role="button" aria-expanded="false" aria-controls="allUsersContainer">
							ALL PLAYERS
						</a>
					<span id="newFriendRequestIndicator" class="blinking-dot d-none ms-2"></span>
					</h3>
					<div id="allUsersContainer" class="collapse text-start mt-5"></div>
				</div>
				<div class="col-md-6">
					<h3 class="mt-5">PERSONAL STATISTICS</h3>
					<div class="card p-4 mb-4 mt-5" id="statsContainer">
						<p><strong>Number of games played :</strong> <span id="totalPlayed"></span></p>
						<p><strong>Win percentage :</strong> <span id="winPercentage"></span>%</p>
						<button class="btn btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#statsDetails" aria-expanded="false" aria-controls="statsDetails">
							All game mods
						</button>
						<div class="collapse mt-3" id="statsDetails">
							<table class="table table-bordered table-hover text-center">
								<thead class="table-light">
									<tr>
										<th>Mods</th>
										<th>Victory</th>
										<th>Defeats</th>
									</tr>
								</thead>
							<tbody id="modeStatsTable"></tbody>
							</table>
						</div>
					</div>
					<h3 class="mt-5 d-flex align-items-center">
					<a class="text-decoration-none" data-bs-toggle="collapse" href="#matchHistoryContainer" role="button" aria-expanded="false" aria-controls="matchHistoryContainer">
						GAME HISTORY
					</a>
					</h3>
					<div id="matchHistoryContainer" class="collapse text-start mt-5"></div>
				</div>
			</div>
		</div>
		<div class="mb-5 mt-5"></div>
		<div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="changePasswordModalLabel">Change password</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="changePasswordForm">
							<div class="mb-3">
								<label for="oldPassword" class="form-label">Old Password</label>
								<input type="password" class="form-control" id="oldPassword" required>
							</div>
							<div class="mb-3">
								<label for="newPassword" class="form-label">New Password</label>
								<input type="password" class="form-control" id="newPassword" required>
							</div>
							<div class="mb-3">
								<label for="confirmNewPassword" class="form-label">Confirm new password</label>
								<input type="password" class="form-control" id="confirmNewPassword" required>
							</div>
							<button type="submit" class="btn btn-primary">Change</button>
						</form>
						<div id="passwordChangeMessage" class="mt-3"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="friendDetailsModal" tabindex="-1" aria-labelledby="friendDetailsModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="friendDetailsModalLabel"><strong></strong></h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div class="text-center mb-4">
							<img id="friendProfilePhoto" class="rounded-circle" src="" alt="Profile Photo" width="150" height="150">
						</div>
						<div class="text-start">
							<p><strong>First name :</strong> <span id="friendFirstName"></span></p>
							<p><strong>Last name :</strong> <span id="friendLastName"></span></p>
							<p><strong>Member since :</strong> <span id="friendDateJoined"></span></p>
							<p><strong>Last connection :</strong> <span id="friendLastLogin"></span></p>
							<p><strong>Friend since :</strong> <span id="friendSince"></span></p>
						</div>
						<div class="text-start mt-4">
							<h5><strong>STATISTICS</strong></h5>
							<p><strong>Number of games played :</strong> <span id="friendTotalPlayed"></span></p>
							<p><strong>Win percentage :</strong> <span id="friendWinPercentage"></span>%</p>
							<button class="btn btn-outline-info btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#friendStatsDetails" aria-expanded="false" aria-controls="friendStatsDetails">
								All game mods
							</button>
							<div class="collapse mt-3" id="friendStatsDetails">
								<table class="table table-bordered table-hover text-center">
									<thead class="table-light">
										<tr>
											<th>Mods</th>
											<th>Victory</th>
											<th>Defeats</th>
										</tr>
									</thead>
									<tbody id="friendModeStatsTable"></tbody>
								</table>
							</div>
						</div>
						<div class="mt-4">
							<h5 class="mt-3">
								<a class="text-decoration-none" data-bs-toggle="collapse" href="#friendMatchHistoryContainer" role="button" aria-expanded="false" aria-controls="friendMatchHistoryContainer"">
									History of the Games
								</a>
							</h5>
							<div id="friendMatchHistoryContainer" class="collapse mt-3"></div>
						</div>
					</div>
					<div class="modal-footer d-flex justify-content-between">
						<button type="button" class="btn btn-danger" id="removeFriendBtn">Remove</button>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="editProfilePhotoModal" tabindex="-1" aria-labelledby="editProfilePhotoModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="editProfilePhotoModalLabel">Change profile picture</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="profilePhotoForm">
							<div class="mb-3">
								<label for="newProfilePhoto" class="form-label">New profile picture :</label>
								<input type="file" class="form-control d-none" id="newProfilePhoto" name="profile_photo" accept="image/*">
								<button type="button" id="selectPhotoButton" class="btn btn-secondary">Choose a photo</button>
								<div id="fileNameDisplay" class="mt-2 text-muted"></div>
							</div>
							<button type="button" class="btn btn-danger" id="deletePhotoButton">Delete photo</button>
							<button type="submit" class="btn btn-primary float-end">Save</button>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="editProfileModalLabel">Edit profile</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="editProfileForm">
							<div class="mb-3">
								<label for="editFirstName" class="form-label">First name</label>
								<input type="text" class="form-control" id="editFirstName" name="first_name" required>
							</div>
							<div class="mb-3">
								<label for="editLastName" class="form-label">Last name</label>
								<input type="text" class="form-control" id="editLastName" name="last_name" required>
							</div>
							<div class="mb-3">
								<label for="editUsername" class="form-label">User name</label>
								<input type="text" class="form-control" id="editUsername" name="username" maxlength="8" required>
							</div>
							<div class="mb-3">
								<label for="editEmail" class="form-label">E-mail</label>
								<input type="email" class="form-control" id="editEmail" name="email" required>
							</div>
							<button type="submit" class="btn btn-primary">Save the changes</button>
						</form>
					</div>
					<div id="profileEditMessage"></div>
				</div>
			</div>
		</div>
	`;

	fetchUserProfile();
	initProfileHandlers();
	initShowAllUsers();
	initFriendList();
	fetchUserStats();
	initUserMatchHistory();
}
