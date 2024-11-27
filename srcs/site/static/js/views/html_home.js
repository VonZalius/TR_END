import { showMessage } from '../commons/common.js';

export function htmlHome(app) {
	app.innerHTML = `
	<div class="text-center mt-5">
		<h2 class="mb-4">Home</h2>
		<div id="messageContainer" class="mb-3"></div>
		<a class="btn btn-outline-primary mx-auto mt-5" href="#/settingsGame" >Customize & Play</a>
	</div>
	`;

	const successMessage = localStorage.getItem('successMessage');
	if (successMessage) {
		showMessage(successMessage, 'success');
		localStorage.removeItem('successMessage');
	}
}