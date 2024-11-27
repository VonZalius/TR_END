export async function fetchUserStats() {
    const accessToken = localStorage.getItem('accessToken');
    const statsContainer = document.getElementById('statsContainer');
    const totalPlayedElement = document.getElementById('totalPlayed');
    const winPercentageElement = document.getElementById('winPercentage');
    const modeStatsTable = document.getElementById('modeStatsTable');

    if (!accessToken) {
        statsContainer.innerHTML = '<p class="text-danger">You must be logged in to see your statistics.</p>';
        return;
    }

    try {
        const response = await fetch('https://localhost:8000/api/game/show-current-user-stats/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const stats = await response.json();

            const totalWins = stats.total_wins;
            const totalPlayed = stats.total_played;
            const winPercentage = totalPlayed ? Math.floor((totalWins / totalPlayed) * 100) : 0;

            totalPlayedElement.textContent = totalPlayed;
            winPercentageElement.textContent = winPercentage;

            const modes = ['VS', 'TN', 'LS', 'BB'];
            modeStatsTable.innerHTML = modes.map(mode => {
                const played = stats[`${mode}_played`] || 0;
                const wins = stats[`${mode}_wins`] || 0;
                const losses = played - wins;
                return `
                    <tr>
                        <td>${getModeText(mode)}</td>
                        <td>${wins}</td>
                        <td>${losses}</td>
                    </tr>
                `;
            }).join('');
        } else {
            statsContainer.innerHTML = '<p class="text-danger">Unable to retrieve statistics.</p>';
        }
    } catch (error) {
        console.error('Error retrieving statistics :', error);
        statsContainer.innerHTML = '<p class="text-danger">Error retrieving statistics.</p>';
    }
}

function getModeText(mode) {
    switch (mode) {
        case 'VS':
            return 'Versus';
        case 'TN':
            return 'Tournament';
        case 'LS':
            return 'Last Man Standing';
        case 'BB':
            return 'Brick Breaker';
        default:
            return mode;
    }
}
