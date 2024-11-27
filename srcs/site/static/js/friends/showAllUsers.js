import { showMessage } from '../commons/common.js';
import { registerComponent, refreshComponent } from '../commons/componentManager.js';

export async function initShowAllUsers() {
	const accessToken = localStorage.getItem('accessToken');
	const allUsersContainer = document.getElementById('allUsersContainer');
	const newFriendRequestIndicator = document.getElementById('newFriendRequestIndicator');
	const messageContainer = document.getElementById('messageContainer');

	if (!accessToken) {
		showMessage('You must be logged in to access this page.', 'danger');
		return;
	}

	try {
		const [usersResponse, friendsResponse, sentRequestsResponse, receivedRequestsResponse] = await Promise.all([
			fetch('https://localhost:8000/api/user/show-all-users/', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}),
			fetch('https://localhost:8000/api/friends/show-all-friends/', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}),
			fetch('https://localhost:8000/api/friends/show-all-sent-requests/', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}),
			fetch('https://localhost:8000/api/friends/show-all-received-requests/', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}),
		]);

		if (!usersResponse.ok || !friendsResponse.ok || !sentRequestsResponse.ok || !receivedRequestsResponse.ok) {
			throw new Error('Error retrieving data.');
		}

		const users = await usersResponse.json();
		const friendsData = await friendsResponse.json();
		const sentRequestsData = await sentRequestsResponse.json();
		const receivedRequestsData = await receivedRequestsResponse.json();

		const friendIds = new Set(friendsData.map((friendEntry) => friendEntry.friend.id));
		const sentRequestIds = new Set(sentRequestsData.map((request) => request.receiver.id));
		const receivedRequestIds = new Set(receivedRequestsData.map((request) => request.sender.id));

		newFriendRequestIndicator.classList.toggle('d-none', receivedRequestsData.length === 0);

		const sortedUsers = users.sort((a, b) => {
			if (receivedRequestIds.has(a.id) && !receivedRequestIds.has(b.id)) {
				return -1;
			}
			if (!receivedRequestIds.has(a.id) && receivedRequestIds.has(b.id)) {
				return 1;
			}
			return new Date(b.date_joined) - new Date(a.date_joined);
		});

		allUsersContainer.innerHTML = ''; // Clear previous content
		sortedUsers.forEach((user) => {
			if (friendIds.has(user.id)) {
				return;
			}

			const userElement = document.createElement('div');
			userElement.classList.add('card', 'mb-3', 'w-auto');
			userElement.innerHTML = `
				<div class="row g-0 align-items-center">
					<div class="col-md-2">
						<img src="${user.profile_photo}" class="profile-photo" alt="${user.username}">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<h5 class="card-title user-username">${user.username}</h5>
							<p class="card-text user-joined-date">
								<span>Member since :</span> <span class="user-date-joined">${user.date_joined}</span>
							</p>
						</div>
					</div>
					<div class="col-md-2 d-flex flex-column align-items-center justify-content-center" id="action-${user.id}">
					</div>
				</div>
			`;
			allUsersContainer.appendChild(userElement);

			const actionContainer = document.getElementById(`action-${user.id}`);

			if (sentRequestIds.has(user.id)) {
				createActionButton(actionContainer, 'Cancel', ['btn', 'btn-danger', 'me-5', 'custom-size-btn', 'd-flex', 'justify-content-center', 'align-items-center'], () => cancelFriendRequest(user.id));
			} else if (receivedRequestIds.has(user.id)) {
				createActionButton(actionContainer, 'Accept', ['btn', 'btn-success', 'mb-2', 'me-5', 'custom-size-btn', 'd-flex', 'justify-content-center', 'align-items-center'], () => acceptFriendRequest(user.id));
				createActionButton(actionContainer, 'Refuse', ['btn', 'btn-danger', 'me-5', 'custom-size-btn', 'd-flex', 'justify-content-center', 'align-items-center'], () => declineFriendRequest(user.id));
			} else {
				createActionButton(actionContainer, 'Add', ['btn', 'btn-primary', 'me-5', 'custom-size-btn', 'd-flex', 'justify-content-center', 'align-items-center'], () => sendFriendRequest(user.id));
			}
		});
	} catch (error) {
		console.error('Error managing users and friends:', error);
		showMessage('An error occurred while managing users and friends.', 'danger', messageContainer);
	}
}

function createActionButton(container, text, classes, action) {
	const button = document.createElement('button');
	button.textContent = text;
	button.classList.add(...classes);
	button.addEventListener('click', action);
	container.appendChild(button);
}

async function sendFriendRequest(userId) {
	await handleFriendRequest('POST', 'send-friend-request', userId, 'Friend request sent successfully!');
}

async function acceptFriendRequest(userId) {
	await handleFriendRequest('PATCH', 'accept-friend-request', userId, 'Friend request accepted successfully.');
}

async function declineFriendRequest(userId) {
	await handleFriendRequest('DELETE', 'decline-friend-request', userId, 'Friend request successfully declined.');
}

async function cancelFriendRequest(userId) {
	await handleFriendRequest('DELETE', 'cancel-friend-request', userId, 'Friend request canceled successfully.');
}

async function handleFriendRequest(method, endpoint, userId, successMessage) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`https://localhost:8000/api/friends/${endpoint}/`, {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${method} ${endpoint} failed: ${errorText}`);
        }

        showMessage(successMessage, 'success');

        // Rafraîchit les composants pertinents
        refreshComponent('showAllUsers');
        refreshComponent('friendList'); // Actualise la liste des amis directement
    } catch (error) {
        console.error(`Error handling friend request (${endpoint}):`, error);
        showMessage('An error occurred during the operation.', 'danger');
    }
}

registerComponent('showAllUsers', initShowAllUsers);
