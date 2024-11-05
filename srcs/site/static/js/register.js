document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const passwordHelpBlock = document.getElementById('passwordHelpBlock');
    const profilePhotoInput = document.getElementById('profile_photo');
    const profilePreviewContainer = document.querySelector('.profile-photo-wrapper-register');
    const profilePreview = document.getElementById('profile_preview');
    const selectFileButton = document.getElementById('select_file_button'); // Bouton personnalisé pour choisir le fichier
    const selectedFileName = document.getElementById('selected_file_name'); // Élément pour afficher le nom du fichier sélectionné

    // 1. Ajouter un écouteur d'événement 'click' sur le bouton personnalisé
    selectFileButton.addEventListener('click', () => {
        profilePhotoInput.click(); // Déclenche le champ de fichier masqué
    });

    // 2. Ajouter un écouteur d'événement 'change' pour le champ de fichier
    profilePhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result; // Mise à jour de l'aperçu de l'image
                profilePreviewContainer.style.display = 'block'; // Affiche le conteneur lorsque l'image est sélectionnée
            };
            reader.readAsDataURL(file);
            
            // Met à jour le texte avec le nom du fichier sélectionné
            selectedFileName.textContent = file.name; 
            selectedFileName.removeAttribute('data-translate'); // Enlève l'attribut 'data-translate' pour éviter la traduction
        } else {
            profilePreviewContainer.style.display = 'none'; // Masque le conteneur si rien n'est sélectionné
            selectedFileName.setAttribute('data-translate', 'no_file_selected'); // Ajoute l'attribut de traduction
            selectedFileName.textContent = "Aucun fichier sélectionné"; // Texte par défaut si aucun fichier n'est sélectionné
        }
    });

    // Pour afficher une erreur sous un champ
    function showError(field, message) {
        field.classList.add('is-invalid');
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('invalid-feedback');
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    // Pour enlever les erreurs d'un champ
    function clearError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.remove();
        }
    }

    // Pour changer la couleur du texte d'aide du mot de passe
    function togglePasswordHelp(isValid) {
        if (isValid) {
            passwordHelpBlock.classList.remove('text-danger');
        } else {
            passwordHelpBlock.classList.add('text-danger');
        }
    }

    // Pour valider le mot de passe
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

        if (!isValid) {
            passwordHelpBlock.innerHTML = errorMessages.join('<br>');
            togglePasswordHelp(false);
        } else {
            passwordHelpBlock.innerHTML = "Must contain at least 12 characters<br>With: uppercase, lowercase, numeric, and special character<br>Can't be: your first name, last name, or email";
            togglePasswordHelp(true);
        }

        return isValid;
    }

    // Validation des champs avant de soumettre le formulaire
    function validateForm() {
        let isValid = true;

        const firstName = document.getElementById('first_name');
        const lastName = document.getElementById('last_name');
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required.');
            isValid = false;
        } else {
            clearError(firstName);
        }

        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required.');
            isValid = false;
        } else {
            clearError(lastName);
        }

        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            showError(email, 'Invalid email address.');
            isValid = false;
        } else {
            clearError(email);
        }

        const username = document.getElementById('username');
        if (username.value.trim() === '') {
            showError(username, 'Username is required.');
            isValid = false;
        } else {
            clearError(username);
        }

        const password = document.getElementById('password').value;
        const password2 = document.getElementById('password2').value;
        const passwordValid = validatePassword(password, firstName.value, lastName.value, email.value, username.value);

        if (!passwordValid) {
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

    // Écouteur d'événement pour la soumission du formulaire
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData(form);

        try {
            console.log('Envoi des données:', formData);
            const response = await fetch('https://localhost:8000/api/user/register/', {
                method: 'POST',
                headers: {},
                mode: 'cors',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur HTTP: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('Réponse du serveur:', result);
            localStorage.setItem('successMessage', 'Inscription réussie !');
            window.location.href = '../html/login.html';
        } catch (error) {
            console.error('Erreur:', error);
            alert("Une erreur s'est produite. Vérifiez la console pour plus de détails.");
        }
    });
});