import { showMessage } from '../commons/common.js';

export function htmlLogin(app) {
	app.innerHTML = `
		<div class="text-center mt-5">
			<h2 class="mb-4">Login</h2>
			<div id="messageContainer" class="mb-3"></div>
			<form id="loginForm" class="w-50 mx-auto text-start">
				<div class="mb-3">
					<label for="email" class="form-label">Email :</label>
					<input type="email" class="form-control" id="email" name="email" placeholder="name@example.com" required>
				</div>

				<div class="mb-3">
					<label for="password" class="form-label">Password :</label>
					<input type="password" class="form-control" id="password" name="password" required>
				</div>

				<button type="submit" class="btn btn-primary d-block mx-auto mt-5">Submit</button>
			</form>
		</div>
	`;

	const successMessage = localStorage.getItem('successMessage');
	if (successMessage) {
		showMessage(successMessage, 'success');
		localStorage.removeItem('successMessage');
	}

	import('../login.js').then((module) => module.initLoginForm());
}
