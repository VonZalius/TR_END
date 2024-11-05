document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const showAllUsers = urlParams.get('showAllUsers');

    if (showAllUsers === 'true') {
        const allUsersContainer = document.getElementById('allUsersContainer');
        const allUsersButton = document.querySelector('[data-bs-target="#allUsersContainer"]') || 
                               document.querySelector('[href="#allUsersContainer"]');

        // Ouvre le container si le paramètre est présent
        if (allUsersContainer && !allUsersContainer.classList.contains('show')) {
            new bootstrap.Collapse(allUsersContainer, { toggle: true });
            if (allUsersButton) {
                allUsersButton.setAttribute('aria-expanded', 'true');
            }
        }

        // Supprime le paramètre showAllUsers de l'URL après ouverture
        urlParams.delete('showAllUsers');
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }

    const accessToken = localStorage.getItem('accessToken');
    const userFirstName = document.getElementById('userFirstName');
	const userLastName = document.getElementById('userLastName');
    const userUsername = document.getElementById('userUsername');
	const userEmail = document.getElementById('userEmail');
	const profilePhoto = document.getElementById('profilePhoto');
    const editOverlay = document.querySelector('.edit-overlay');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const passwordChangeMessage = document.getElementById('passwordChangeMessage');

	// Récupération des éléments pour modification de profil
	const editProfileBtn = document.getElementById('editProfileBtn');
	const editFirstName = document.getElementById('editFirstName');
	const editLastName = document.getElementById('editLastName');
	const editUsername = document.getElementById('editUsername');
	const editEmail = document.getElementById('editEmail');
	const editProfileForm = document.getElementById('editProfileForm');

    if (!accessToken) {
        alert('Vous devez être connecté pour accéder à cette page.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://localhost:8000/api/user/profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération du profil: ${response.status} ${errorText}`);
        }

        const profileData = await response.json();
        profilePhoto.src = profileData.profile_photo;
        userFirstName.textContent = profileData.first_name;
        userLastName.textContent = profileData.last_name;
        userUsername.textContent = profileData.username;
		userEmail.textContent = profileData.email;
    } catch (error) {
        console.error('Erreur lors de la récupération des données du profil:', error);
        alert('Une erreur s\'est produite. Vérifiez la console pour plus de détails.');
        window.location.href = 'login.html';
    }

    // Ouvrir la modale de modification de la photo de profil
    editOverlay.addEventListener('click', () => {
        const editProfilePhotoModal = new bootstrap.Modal(document.getElementById('editProfilePhotoModal'));
        editProfilePhotoModal.show();
    });

    // Gérer la soumission du formulaire pour télécharger une nouvelle photo
    document.getElementById('profilePhotoForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const newPhoto = document.getElementById('newProfilePhoto').files[0];

        if (newPhoto) {
            formData.append('profile_photo', newPhoto);
        }

        try {
            const response = await fetch('https://localhost:8000/api/user/profile/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour de la photo de profil: ${response.status}`);
            }

            const result = await response.json();
            profilePhoto.src = result.profile_photo; // Met à jour l'image affichée
            const editProfilePhotoModal = bootstrap.Modal.getInstance(document.getElementById('editProfilePhotoModal'));
            editProfilePhotoModal.hide();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la photo de profil:', error);
            alert('Erreur lors de la mise à jour de la photo de profil. Veuillez vérifier la console.');
        }
    });

    // Gérer le clic sur le bouton de suppression de la photo
    document.getElementById('deletePhotoButton').addEventListener('click', async () => {
        try {
            const response = await fetch('https://localhost:8000/api/user/profile/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delete_photo: "True" }),
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression de la photo de profil: ${response.status}`);
            }

            profilePhoto.src = ''; // Retirer l'image affichée
            document.getElementById('newProfilePhoto').value = ''; // Réinitialiser le champ d'upload
            const editProfilePhotoModal = bootstrap.Modal.getInstance(document.getElementById('editProfilePhotoModal'));
            editProfilePhotoModal.hide();
        } catch (error) {
            console.error('Erreur lors de la suppression de la photo de profil:', error);
            alert('Erreur lors de la suppression de la photo de profil. Veuillez vérifier la console.');
        }
    });

    // Ouvrir le modal lors du clic sur le bouton "Changer le mot de passe"
    changePasswordBtn.addEventListener('click', () => {
        const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
        changePasswordModal.show();
    });

    // Gestion de la soumission du formulaire de changement de mot de passe
    changePasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            passwordChangeMessage.innerHTML = '<div class="alert alert-danger">Les nouveaux mots de passe ne correspondent pas.</div>';
            return;
        }

        try {
            const response = await fetch('https://localhost:8000/api/user/change-password/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    new_password2: confirmNewPassword,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors du changement de mot de passe: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            passwordChangeMessage.innerHTML = `<div class="alert alert-success">${result.detail}</div>`;
            changePasswordForm.reset();

            // Fermer le modal après 2 secondes
            setTimeout(() => {
                const changePasswordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                changePasswordModal.hide();
                passwordChangeMessage.innerHTML = ''; // Effacer les messages
				localStorage.removeItem('accessToken'); // Supprime le token d'accès
				window.location.href = 'login.html'; 
            }, 2000);

        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            passwordChangeMessage.innerHTML = '<div class="alert alert-danger">Une erreur s\'est produite lors du changement de mot de passe.</div>';
        }
    });

	// Bouton pour ouvrir la modale de modification du profil
    editProfileBtn.addEventListener('click', () => {
        const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
        editFirstName.value = userFirstName.textContent;
        editLastName.value = userLastName.textContent;
        editUsername.value = userUsername.textContent;
        editEmail.value = userEmail.textContent; // Assurez-vous que ce champ existe dans le HTML
        editProfileModal.show();
    });

    // Soumission du formulaire de modification du profil
    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedData = {
            first_name: editFirstName.value,
            last_name: editLastName.value,
            username: editUsername.value,
            email: editEmail.value,
        };

        try {
            const response = await fetch('https://localhost:8000/api/user/profile/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la mise à jour du profil : ${response.status} ${errorText}`);
            }

            const result = await response.json();

            // Mettre à jour les éléments HTML avec les nouvelles données
            userFirstName.textContent = result.first_name;
            userLastName.textContent = result.last_name;
            userUsername.textContent = result.username;
            userEmail.textContent = result.email;

            // Fermer la modale
            const editProfileModal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            editProfileModal.hide();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            alert('Une erreur est survenue lors de la mise à jour du profil. Veuillez vérifier la console pour plus de détails.');
        }
    });
});
