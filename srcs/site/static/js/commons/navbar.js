import { clearTokens, showMessage, verifyToken, verifyUser } from './common.js';
import { registerComponent, refreshComponent } from './componentManager.js';

export async function loadNavBar() {
    const navContainer = document.createElement('nav');
    navContainer.classList.add('navbar', 'navbar-expand-lg', 'bg-light-subtle', 'fixed-top');
    navContainer.innerHTML = `
        <div class="container-fluid">
            <a href="#" class="navbar-brand">
                <img src="../../media/images/logo.png" alt="logo" width="50" height="50" class="d-inline-block align-text-top">
            </a>
            <div class="dropdown ms-auto" id="userMenu">
            </div>
        </div>
    `;
    document.body.insertBefore(navContainer, document.getElementById('app'));

    await loadUserMenu();
	registerComponent('navbar', loadUserMenu);
}

async function loadUserMenu() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userMenu = document.getElementById('userMenu');

    if (!userMenu) {
        console.error('User menu container not found');
        return;
    }

	if (accessToken) {
        const tokenValid = await verifyToken();
        if (!tokenValid) {
            return;
        }

        const userExists = await verifyUser();
        if (!userExists) {
            return;
        }
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

            if (!response.ok) throw new Error(`Error retrieving profile: ${response.status}`);
            
            const profileData = await response.json();
            return profileData.profile_photo || '../../profile_photos/default/default-user-profile-photo.jpg';
        } catch (error) {
            showMessage("Unable to load profile picture.", "danger");
            return '../../profile_photos/default/default-user-profile-photo.jpg';
        }
    }

    if (accessToken) {
        const profilePhoto = await getProfilePhoto();
        userMenu.innerHTML = `
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="profile-photo-wrapper-nav">
                    <img src="${profilePhoto}" alt="User Menu" class="profile-photo">
                </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#/profile">Profile</a></li>
                <li><a class="dropdown-item" href="#/" id="logoutBtn">Logout</a></li>
            </ul>
        `;
    
        document.getElementById('logoutBtn').addEventListener('click', async () => {    
            if (!refreshToken) {
                showMessage("You are not logged in.", "warning");
                window.location.href = '#/login';
                return;
            }
    
            try {
                await fetch('https://localhost:8000/api/user/logout/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });
                clearTokens();
                showMessage('Successfully logged out!', 'success');
				refreshComponent('navbar');
                window.location.href = '#/';
            } catch (error) {
                showMessage("An error occurred while logging out.", "danger");
            }
        });
    } else {
        userMenu.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../../profile_photos/default/default-user-profile-photo.jpg" alt="User Menu" width="50" height="50" class="rounded-circle">
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#/register">Register</a></li>
                <li><a class="dropdown-item" href="#/login">Login</a></li>
            </ul>
        `;
    }
}