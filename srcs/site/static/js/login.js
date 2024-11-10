document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://localhost:8000/api/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                let errorMessage = 'Erreur lors de la connexion.';
                
                try {
                    // Tenter de parser la réponse en JSON pour obtenir le message d'erreur
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;  // Extraire "detail" s'il est présent
                } catch (jsonError) {
                    // En cas d'échec de parsing, utiliser le texte brut
                    errorMessage = await response.text();
                }

                showMessage(`Échec de la connexion : ${errorMessage}`, 'danger');
                return;
            }

            const result = await response.json();
            const accessToken = result.access;
            const refreshToken = result.refresh;

            if (accessToken && refreshToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('successMessage', 'Connexion réussie !');
                window.location.href = 'profile.html';
            } else {
                showMessage('Échec de la connexion : aucun token reçu.', 'warning');
            }
        } catch (error) {
            showMessage("Une erreur s'est produite lors de la connexion. Veuillez réessayer.", 'danger');
        }
    });
});
