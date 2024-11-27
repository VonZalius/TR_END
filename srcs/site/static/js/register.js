export function initRegisterForm() {
    const form = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const usernameCharCount = document.getElementById('usernameCharCount');
    const maxUsernameLength = 8;

    const updateCharCount = () => {
        const remainingChars = maxUsernameLength - usernameInput.value.length;
        usernameCharCount.textContent = `Remaining characters : ${remainingChars}`;
    };

    usernameInput.addEventListener('input', updateCharCount);
    updateCharCount();

    const passwordHelpBlock = document.getElementById('passwordHelpBlock');
    const profilePhotoInput = document.getElementById('profile_photo');
    const profilePreviewContainer = document.querySelector('.profile-photo-wrapper-register');
    const profilePreview = document.getElementById('profile_preview');

    profilePhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
                profilePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            profilePreviewContainer.style.display = 'none';
        }
    });

    const showError = (field, message) => {
        field.classList.add('is-invalid');
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('invalid-feedback');
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    };

    function clearError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.remove();
        }
    }

    function togglePasswordHelp(isValid) {
        if (isValid) {
            passwordHelpBlock.classList.remove('text-danger');
        } else {
            passwordHelpBlock.classList.add('text-danger');
        }
    }

    function validatePassword(password, firstName, lastName, email, username) {
        let isValid = true;
        let errorMessages = [];

        if (password.length < 12) {
            errorMessages.push('At least 12 characters');
            isValid = false;
        }

        const lowerPassword = password.toLowerCase();
        if (
            lowerPassword.includes(firstName.toLowerCase()) ||
            lowerPassword.includes(lastName.toLowerCase()) ||
            lowerPassword.includes(email.toLowerCase()) ||
            lowerPassword.includes(username.toLowerCase())
        ) {
            errorMessages.push("Can't be your first name, last name, email, or username");
            isValid = false;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            errorMessages.push('Must contain uppercase, lowercase, numeric, and special character');
            isValid = false;
        }

        passwordHelpBlock.innerHTML = isValid
            ? `At least 12 characters<br>Must contain uppercase, lowercase, numeric, and special character<br>Can't be your first name, last name, email, or username`
            : errorMessages.join('<br>');
        togglePasswordHelp(isValid);

        return isValid;
    }

    function validateForm() {
        let isValid = true;
        const firstName = document.getElementById('first_name');
        const lastName = document.getElementById('last_name');
        const email = document.getElementById('email');
        const username = document.getElementById('username');
        const password = document.getElementById('password').value;
        const password2 = document.getElementById('password2').value;

        const namePattern = /^[A-Z][a-zA-Z -]{0,49}$/;
        if (!namePattern.test(firstName.value.trim())) {
            showError(firstName, 'First name must start with a capital letter.');
            isValid = false;
        } else {
            clearError(firstName);
        }
    
        if (!namePattern.test(lastName.value.trim())) {
            showError(lastName, 'Last name must start with a capital letter.');
            isValid = false;
        } else {
            clearError(lastName);
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            showError(email, 'Invalid email address.');
            isValid = false;
        } else {
            clearError(email);
        }

        const usernamePattern = /^[a-zA-Z0-9@#_-]{8}$/;
        if (!usernamePattern.test(username.value.trim())) {
            showError(username, 'Username can contain 8 characters with only letters, numbers, and - _ @.');
            isValid = false;
        } else {
            clearError(username);
        }

        if (!validatePassword(password, firstName.value, lastName.value, email.value, username.value)) {
            isValid = false;
        }

        if (password !== password2) {
            showError(document.getElementById('password2'), 'Passwords do not match.');
            isValid = false;
        } else {
            clearError(document.getElementById('password2'));
        }
    
        return isValid;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
    
        const formData = new FormData(form);
    
        try {
            const response = await fetch('https://localhost:8000/api/user/register/', {
                method: 'POST',
                headers: {},
                mode: 'cors',
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.email) {
                    showError(document.getElementById('email'), errorData.email[0]);
                } else {
                    showMessage(`Error HTTP: ${response.status} - ${errorData}`, 'danger');
                }
                return;
            }
    
            const result = await response.json();
            localStorage.setItem('successMessage', 'Registration successful!');
            window.location.href = '#/login'; // Adaptation pour la SPA
        } catch (error) {
            showMessage('An error occurred during registration. Please try again.', 'danger');
        }
    });

    document.getElementById('selectPhotoButton').addEventListener('click', () => {
        document.getElementById('profile_photo').click();
    });

    document.getElementById('profile_photo').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('fileNameDisplay').textContent = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profile_preview').src = e.target.result;
                document.querySelector('.profile-photo-wrapper-register').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            document.getElementById('fileNameDisplay').textContent = "";
            document.getElementById('profile_preview').src = "";
            document.querySelector('.profile-photo-wrapper-register').style.display = 'none';
        }
    });
}
