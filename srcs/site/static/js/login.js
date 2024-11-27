import { showMessage } from './commons/common.js';
import { refreshComponent } from './commons/componentManager.js';

export function initLoginForm() {
	const form = document.getElementById('loginForm');
	const emailField = document.getElementById('email');
	const passwordField = document.getElementById('password');

	const messages = {
		connectionFailed: (errorMessage) => `Connection failed: ${errorMessage}`,
		noTokens: 'Connection failed: no tokens received.',
		retryError: 'An error occurred during connection. Please try again.',
		invalidEmail: 'Invalid email address.',
		successMessage: 'Login successful!',
	};

	function showFieldError(field, message) {
		clearFieldError(field);
		const errorElement = document.createElement('div');
		errorElement.classList.add('invalid-feedback', 'd-block');
		errorElement.textContent = message;
		field.classList.add('is-invalid');
		field.parentNode.appendChild(errorElement);
	}

	function clearFieldError(field) {
		field.classList.remove('is-invalid');
		const errorElement = field.parentNode.querySelector('.invalid-feedback');
		if (errorElement) {
			errorElement.remove();
		}
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		clearFieldError(emailField);
		clearFieldError(passwordField);

		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		try {
			const response = await fetch('https://localhost:8000/api/user/login/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				mode: 'cors',
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				let errorMessage = 'Error connecting.';
				try {
					const errorData = await response.json();

					if (errorData.email) {
						showFieldError(emailField, errorData.email[0] || messages.invalidEmail);
					} else if (errorData.detail) {
						errorMessage = errorData.detail;
					}
				} catch (jsonError) {
					errorMessage = await response.text();
				}

				showMessage(messages.connectionFailed(errorMessage), 'danger');
				return;
			}

			const result = await response.json();
			const { access: accessToken, refresh: refreshToken } = result;

			if (accessToken && refreshToken) {
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('successMessage', messages.successMessage);
				refreshComponent('navbar');
				window.location.href = '#/profile';
			} else {
				showMessage(messages.noTokens, 'warning');
			}
		} catch (error) {
			showMessage(messages.retryError, 'danger');
		}
	});
}
