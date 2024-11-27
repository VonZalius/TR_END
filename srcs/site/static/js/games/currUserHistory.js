export function initUserMatchHistory() {
    const historyContainerLink = document.querySelector('[href="#matchHistoryContainer"]');
    if (historyContainerLink) {
        historyContainerLink.addEventListener('click', fetchUserMatchHistory);
    }
}

async function fetchUserMatchHistory() {
    const accessToken = localStorage.getItem('accessToken');
    const matchHistoryContainer = document.getElementById('matchHistoryContainer');

    if (!accessToken) {
        matchHistoryContainer.innerHTML = '<p class="text-danger">You must be logged in to view your history.</p>';
        return;
    }

    try {
        const response = await fetch('https://localhost:8000/api/game/show-current-user-match-history/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const matchHistory = await response.json();
            displayMatchHistory(matchHistory);
        } else {
            matchHistoryContainer.innerHTML = '<p class="text-danger">Unable to retrieve game history.</p>';
        }
    } catch (error) {
        console.error('Error retrieving game history :', error);
        matchHistoryContainer.innerHTML = '<p class="text-danger">Error retrieving game history.</p>';
    }
}

function displayMatchHistory(matches) {
    const matchHistoryContainer = document.getElementById('matchHistoryContainer');
    matchHistoryContainer.innerHTML = '';

    if (matches.length === 0) {
        matchHistoryContainer.innerHTML = '<p>No games played yet.</p>';
        return;
    }

    matches.forEach((match, index) => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('card', 'mb-3', 'w-auto');
        matchCard.style.border = "1px solid";
        matchCard.style.backgroundColor = `var(${match.result === 'win' ? '--bs-success-bg-subtle' : '--bs-danger-bg-subtle'})`;
        matchCard.style.borderColor = `var(${match.result === 'win' ? '--bs-success-border-subtle' : '--bs-danger-border-subtle'})`;

        const modeText = getModeText(match.mode);

        matchCard.innerHTML = `
            <div class="row g-0 align-items-center">
                <div class="col-md-8 d-flex flex-column justify-content-center">
                    <div class="card-body">
                        <h5 class="card-title">${modeText}</h5>
                        <p class="card-text user-joined-date">${formatDate(match.date_played)}</p>
                    </div>
                </div>
                <div class="col-md-4 d-flex align-items-center justify-content-center">
                    <button class="btn ${match.result === 'win' ? 'btn-outline-success' : 'btn-outline-danger'}" data-bs-toggle="collapse" data-bs-target="#matchDetails${index}">
                        Details
                    </button>
                </div>
            </div>
            <div id="matchDetails${index}" class="collapse">
                <!-- Détails supplémentaires affichés en accordéon -->
                <div class="card-body d-flex flex-column justify-content-center">
                    <p><strong>Duration :</strong> ${match.duration}</p>
                    <p><strong>Number of players :</strong> ${match.number_of_players}</p>
                    ${match.teammate ? `<p><strong>Teammate :</strong> ${match.teammate}</p>` : ''}
                </div>
            </div>
        `;

        matchHistoryContainer.appendChild(matchCard);
    });
}

function getModeText(mode) {
    switch (mode) {
        case 'VS':
            return 'Versus';
        case 'LS':
            return 'Last Man Standing';
        case 'BB':
            return 'Brick Breaker';
        case 'TN':
            return 'Tournament';
        default:
            return mode;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
