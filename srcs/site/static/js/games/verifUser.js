export function initVerifUser() {
    const loginSubmit = document.getElementById('loginSubmit');
    const loginModalElement = document.getElementById('loginModal');
    if (!loginModalElement) return;
    const loginModal = new bootstrap.Modal(loginModalElement);
    const verifiedUsers = new Map();
    const usedUsernames = new Set();

    const submitLogin = async () => {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const playerIndex = document.getElementById('loginPlayerIndex').value;
        const loginErrorMessage = document.getElementById('loginErrorMessage');

        loginErrorMessage.classList.add('d-none');

        if (!email || !password) {
            loginErrorMessage.textContent = "Please enter your email and password.";
            loginErrorMessage.classList.remove('d-none');
            return;
        }

        try {
            const response = await fetch('https://localhost:8000/api/user/verify-user-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                loginErrorMessage.textContent = errorData?.error || "Unknown email or password.";
                loginErrorMessage.classList.remove('d-none');
                return;
            }

            const userData = await response.json();

            if (verifiedUsers.has(userData.username)) {
                loginErrorMessage.textContent = "This user is already logged in for another player.";
                loginErrorMessage.classList.remove('d-none');
                return;
            }

            const playerInput = document.getElementById(`player${playerIndex}`);
            if (!playerInput) return;

            const previousValue = playerInput.value.trim();
            if (previousValue) {
                verifiedUsers.delete(previousValue);
                usedUsernames.delete(previousValue);
            }

            playerInput.value = userData.username;
            playerInput.disabled = true;
            verifiedUsers.set(userData.username, userData.id);
            usedUsernames.add(userData.username);

            updateVerifiedUsersInLocalStorage();
            loginModal.hide();
        } catch (error) {
            console.error('Error connecting:', error);
            loginErrorMessage.textContent = "An error occurred during login. Please check your credentials.";
            loginErrorMessage.classList.remove('d-none');
        }
    };

    const updateVerifiedUsersInLocalStorage = () => {
        const verifiedUsersObject = Object.fromEntries(verifiedUsers);
        localStorage.setItem('verifiedUsers', JSON.stringify(verifiedUsersObject));
    };

    if (loginSubmit) {
        loginSubmit.addEventListener('click', submitLogin);
    }

    document.getElementById('loginEmail')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitLogin();
        }
    });

    document.getElementById('loginPassword')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitLogin();
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('connect-btn')) {
            const playerIndex = event.target.getAttribute('data-player-index');
            document.getElementById('loginPlayerIndex').value = playerIndex;
        }
    });

    loginModalElement?.addEventListener('hidden.bs.modal', () => {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPlayerIndex').value = '';
    });

    document.addEventListener('input', (event) => {
        if (event.target && event.target.matches('[id^="player"]')) {
            const inputField = event.target;
            const playerName = inputField.value.trim();

            if (usedUsernames.has(playerName)) {
                inputField.value = '';
                showMessage("This name is already used by a verified player. Please choose another one.", "warning");
            }
        }
    });
}
