export function showMessage(message, type = 'success', containerId = 'messageContainer') {
    const messageContainer = document.getElementById(containerId);
    if (messageContainer) {
        messageContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 2000);
    }
}

export function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export async function refreshTokens() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch('https://localhost:8000/api/user/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
            const { access } = await response.json();
            localStorage.setItem('accessToken', access);
            return true;
        } else {
            clearTokens();
            return false;
        }
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        clearTokens();
        return false;
    }
}

export async function verifyToken() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch('https://localhost:8000/api/user/token/verify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: accessToken }),
        });

        if (response.ok) {
            return true;
        } else if (response.status === 401) {
            return await refreshTokens();
        } else {
            clearTokens();
            return false;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        clearTokens();
        return false;
    }
}

export async function verifyUser() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch('https://localhost:8000/api/user/profile/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            clearTokens();
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error verifying user:', error);
        clearTokens();
        return false;
    }
}


export function addFooter() {
	let footer = document.getElementById('footer');
	if (!footer) {
		footer = document.createElement('div');
		footer.id = 'footer';
		document.body.appendChild(footer);
	}
	footer.innerHTML = `
		<footer class="footer container-fluid">
			<div class="row flex-column flex-md-row justify-content-between align-items-center text-center text-md-start mx-3">

				<div class="col-md-auto my-2">
					<a href="https://42lausanne.ch/">
						<img src="../../media/images/42_logo.png" alt="logo" height="50" class="d-inline-block align-text-top">
					</a>
				</div>

				<div class="col-md-auto my-2">
					<a href="#" class="text-decoration-none text-white">abarras</a> |
					<a href="#" class="text-decoration-none text-white">amonbaro</a> |
					<a href="#" class="text-decoration-none text-white">cmansey</a> |
					<a href="#" class="text-decoration-none text-white">mdanchev</a>
				</div>

				<div class="col-md-auto my-2">
					<a href="#" class="navbar-brand">
						<img src="../../media/images/circle-up.png" alt="Scroll to top" height="40" class="d-inline-block align-text-top">
					</a>
				</div>
			</div>
		</footer>
	`;
}
