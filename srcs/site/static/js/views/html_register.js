export function htmlRegister(app) {
	app.innerHTML = `
		<div class="text-center mt-5">
			<h2 class="mb-4">Register</h2>
			<form id="registrationForm" class="w-50 mx-auto text-start" enctype="multipart/form-data">

				<div class="mb-3">
					<label for="name" class="form-label" >Name :</label>
					<div class="row">
						<div class="col-md-6">
							<input type="text" class="form-control" id="first_name" name="first_name" placeholder="First"  required>
						</div>
						<div class="col-md-6">
							<input type="text" class="form-control" id="last_name" name="last_name" placeholder="Last"  required>
						</div>
					</div>
				</div>

				<div class="mb-3">
					<label for="email" class="form-label" >Email :</label>
					<input type="email" class="form-control" id="email" name="email" placeholder="name@example.com"  required>
				</div>

				<div class="mb-3">
					<label for="username" class="form-label" >Username :</label>
					<div id="usernameCharCount" class="form-text">Remaining characters : 8</div>
					<input type="text" class="form-control" id="username" name="username" maxlength="8" required>
				</div>

				<div class="mb-3">
					<label for="password" class="form-label" >Password :</label>
					<input type="password" class="form-control" id="password" name="password" required>
					<div id="passwordHelpBlock" class="form-text" >
						Must contain at least 12 characters<br>
						With : uppercase, lowercase, numeric and special caracter<br>
						Can't be : common word, your first name, last name or email
					</div>
				</div>

				<div class="mb-3">
					<label for="password2" class="form-label" >Confirm password :</label>
					<input type="password" class="form-control" id="password2" name="password2" required>
				</div>

				<div class="mb-3 text-center">
					<label for="profile_photo" class="form-label" >Profile picture :</label>
					<input type="file" class="form-control d-none" id="profile_photo" name="profile_photo" accept="image/*">
					<button type="button" id="selectPhotoButton" class="btn btn-secondary" >Chose a file</button>
					<div id="fileNameDisplay" class="mt-2 text-muted"></div>
					<div class="mt-3 profile-photo-wrapper-register mx-auto">
						<img id="profile_preview" alt="Profile Preview" class="profile-photo-register" >
					</div>	
				</div>

				<button type="submit" class="btn btn-primary d-block mx-auto mt-5" >Submit</button>
			</form>
		</div>
	`;

	import('../register.js').then((module) => module.initRegisterForm());
}
