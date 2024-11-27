export async function initMatchmaking() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.log("User not logged in. Matchmaking disabled.");
        return;
    }

    const matchmakingButton = document.getElementById('matchmakingButton');
    if (matchmakingButton) {
        matchmakingButton.addEventListener('click', loadMatchmaking);
        await initializeMatchmakingButton();
    }
}

async function initializeMatchmakingButton() {
    const friends = await fetchFriends();
    const userStats = await fetchUserStats();

    let userWinPercentageText = "My win percentage : ";
    let addFriendsText = "Add friends";

    if (userStats) {
        const userWinPercentage = calculateWinPercentage(userStats);
        const userWinPercentageElement = document.getElementById('userWinPercentageText');
        if (userWinPercentageElement) {
            userWinPercentageElement.textContent = `${userWinPercentageText} ${userWinPercentage}%`;
        }
    }

    const matchmakingButton = document.getElementById('matchmakingButton');
    if (friends.length === 0) {
        if (matchmakingButton) {
            matchmakingButton.textContent = addFriendsText;
            matchmakingButton.onclick = () => {
                window.location.href = '#/profile';
            };
        }
    } else if (matchmakingButton) {
        matchmakingButton.onclick = loadMatchmaking;
    }
}

async function fetchUserStats() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;

    try {
        const response = await fetch('https://localhost:8000/api/game/show-current-user-stats/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) return await response.json();
    } catch (error) {
        console.error('Error retrieving user statistics:', error);
    }
    return null;
}

async function fetchFriends() {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch('https://localhost:8000/api/friends/show-all-friends/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) return await response.json();
    } catch (error) {
        console.error('Error retrieving friends:', error);
    }
    return [];
}

function calculateWinPercentage(stats) {
    const played = stats.total_played || 0;
    const wins = stats.total_wins || 0;
    return played ? Math.floor((wins / played) * 100) : 0;
}

async function loadMatchmaking() {
    const friends = await fetchFriendsWithStats();
    const userStats = await fetchUserStats();

    if (userStats && friends.length) {
        const sortedFriends = sortFriendsByWinPercentage(friends, userStats);
        displaySortedFriends(sortedFriends, userStats);
    } else {
        console.error("Unable to retrieve user or friend statistics.");
    }
}

async function fetchFriendsWithStats() {
    const friendsData = await fetchFriends();
    if (!friendsData || !friendsData.length) return [];

    return await Promise.all(friendsData.map(async (friendEntry) => {
        const friend = friendEntry.friend;
        const stats = await fetchFriendStats(friend.id);
        return stats ? { ...friend, stats } : null;
    })).then(friends => friends.filter(friend => friend !== null));
}

async function fetchFriendStats(friendId) {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch('https://localhost:8000/api/game/show-other-user-stats/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: friendId }),
        });

        if (response.ok) return await response.json();
    } catch (error) {
        console.error('Error retrieving friend\'s stats:', error);
    }
    return null;
}

function sortFriendsByWinPercentage(friends, userStats) {
    const userWinPercentage = calculateWinPercentage(userStats);
    return friends.map(friend => {
        const friendWinPercentage = calculateWinPercentage(friend.stats);
        const difference = Math.abs(userWinPercentage - friendWinPercentage);
        const totalPlayed = friend.stats.total_played || 0;
        return { ...friend, winPercentage: friendWinPercentage, difference, totalPlayed };
    }).sort((a, b) => {
        if (a.difference !== b.difference) return a.difference - b.difference;
        return b.totalPlayed - a.totalPlayed;
    });
}

function displaySortedFriends(sortedFriends, userStats) {
    const friendList = document.getElementById('friendMatchmakingList');
    if (friendList) {
        friendList.innerHTML = '';

        sortedFriends.forEach(friend => {
            const friendWinPercentage = friend.winPercentage;
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <span><strong>${friend.username}</strong> - Global Win Rate: ${friendWinPercentage}%</span>
            `;
            friendList.appendChild(listItem);
        });
    }
}
