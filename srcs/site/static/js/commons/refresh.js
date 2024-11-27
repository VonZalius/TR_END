async function refreshAccessToken()
{
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken)
    {
        alert('Session expired, please log back in.');
        window.location.href = 'login.html';
        return;
    }
    try
    {
        const response = await fetch('https://localhost:8000/api/token/refresh/',
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok)
        {
            const errorText = await response.text();
            throw new Error(`Error refreshing token: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        const newAccessToken = result.access;

        if (newAccessToken)
        {
            localStorage.setItem('accessToken', newAccessToken);
            console.log('Access token refreshed successfully');
        }
        else
        {
            throw new Error('No new access tokens received');
        }
    }
    catch (error)
    {
        console.error('Error refreshing token:', error);
        alert('An error occurred while updating the session. Please log in again.');
        window.location.href = 'login.html';
    }
}
