document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userMenu = document.getElementById('userMenu');

    function clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    async function getProfilePhoto() {
        try {
            const response = await fetch('https://localhost:8000/api/user/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du profil: ${response.status}`);
            }

            const profileData = await response.json();
            return profileData.profile_photo || '../../profile_photos/default/default-user-profile-photo.jpg';
        } catch (error) {
            showMessage("Impossible de charger la photo de profil.", "danger");
            return '../../profile_photos/default/default-user-profile-photo.jpg';
        }
    }

    async function verifyToken() {
        try {
            const verifyResponse = await fetch('https://localhost:8000/api/user/token/verify/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: accessToken }),
            });

            if (!verifyResponse.ok) {
                clearTokens();
                showMessage("Session expirée. Veuillez vous reconnecter.", "warning");
                window.location.href = '../index.html';
                return false;
            }
            return true;
        } catch (error) {
            clearTokens();
            showMessage("Erreur réseau. Veuillez vous reconnecter.", "danger");
            window.location.href = '../index.html';
            return false;
        }
    }

    async function verifyUser() {
        try {
            const profileResponse = await fetch('https://localhost:8000/api/user/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!profileResponse.ok) {
                clearTokens();
                showMessage("Votre compte a été supprimé ou vous n'êtes plus connecté.", "warning");
                window.location.href = '../index.html';
                return false;
            }
            return true;
        } catch (error) {
            clearTokens();
            showMessage("Erreur réseau lors de la vérification du profil. Veuillez vous reconnecter.", "danger");
            window.location.href = '../index.html';
            return false;
        }
    }

    if (accessToken) {
        const tokenValid = await verifyToken();
        if (!tokenValid) return;

        const userExists = await verifyUser();
        if (!userExists) return;
    }

    checkForMessage();

    if (accessToken) {
        const profilePhoto = await getProfilePhoto();
        userMenu.innerHTML = `
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="profile-photo-wrapper-nav">
                    <img src="${profilePhoto}" alt="User Menu" class="profile-photo">
                </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            </ul>
        `;

        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (!refreshToken) {
                showMessage("Vous n'êtes pas connecté.", "warning");
                window.location.href = '../index.html';
                return;
            }

            try {
                const response = await fetch('https://localhost:8000/api/user/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erreur lors de la déconnexion: ${response.status} ${errorText}`);
                }

                clearTokens();
                localStorage.setItem('successMessage', 'Déconnexion réussie !');
                window.location.href = '../index.html';

            } catch (error) {
                showMessage("Une erreur s'est produite lors de la déconnexion.", "danger");
            }
        });
    } else {
        userMenu.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../../profile_photos/default/default-user-profile-photo.jpg" alt="User Menu" width="50" height="50" class="rounded-circle">
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="register.html">Register</a></li>
                <li><a class="dropdown-item" href="login.html">Login</a></li>
            </ul>
        `;
    }
});
