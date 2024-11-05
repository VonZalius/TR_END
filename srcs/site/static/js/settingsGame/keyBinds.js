export function handleKeyBindings(index, mode){
	document.getElementById(`player${index}Up`).addEventListener('keydown', function(event) {
		event.preventDefault();
		const key = event.key;
		let displayValue = key;

		// Vérification et conversion des flèches en icônes Unicode
		if (key === "ArrowUp") displayValue = "↑";
		else if (key === "ArrowDown") displayValue = "↓";
		else if (key === "ArrowLeft") displayValue = "←";
		else if (key === "ArrowRight") displayValue = "→";

		// Vérification pour n'autoriser que les lettres minuscules, chiffres, et flèches directionnelles
		if ((/^[a-z0-9]$/.test(key)) || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab", "Shift"].includes(key)) {
			if (event.key !== 'Tab' && event.key !== 'Shift') {
				this.value = displayValue; // Affiche l'icône
				this.setAttribute('data-key', key); // Stocke la vraie touche dans un attribut data-key
			} else if (event.key === 'Tab' && !event.shiftKey) {
				event.preventDefault();
				document.getElementById(`player${index}Down`).focus(); // Passer au champ suivant (Down key)
			} else if (event.key === 'Tab' && event.shiftKey) {
				event.preventDefault();
				if (mode === 'tournament' && index > 0) {
					// Rechercher le mot "player" avec l'index impair le plus élevé
					let players = ["player0", "player2", "player4", "player6", "player8"];
					let foundPlayer = null;

					for (let i = players.length - 1; i >= 0; i--) {
						const playerElement = document.getElementById(players[i]);
						if (playerElement) {
							foundPlayer = playerElement;
							break;
						}
					}

					if (foundPlayer) {
						foundPlayer.focus();
					}
				}
				else if (mode != 'tournament')
				{
					// Passer au champ du pseudo du joueur précédent
					const previousPlayer = document.getElementById(`player${index}`);
					if (previousPlayer) {
						previousPlayer.focus();
					}
				}
			}
		} else {
			//alert("Only lowercase letters, numbers, and arrow keys are allowed.");
			localStorage.setItem('successMessage', 'Déconnexion réussie !'); 
		}
	});

	document.getElementById(`player${index}Down`).addEventListener('keydown', function(event) {
		event.preventDefault();
		const key = event.key;
		let displayValue = key;

		// Vérification et conversion des flèches en icônes Unicode
		if (key === "ArrowUp") displayValue = "↑";
		else if (key === "ArrowDown") displayValue = "↓";
		else if (key === "ArrowLeft") displayValue = "←";
		else if (key === "ArrowRight") displayValue = "→";

		// Vérification pour n'autoriser que les lettres minuscules, chiffres, et flèches directionnelles
		if ((/^[a-z0-9]$/.test(key)) || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab", "Shift"].includes(key)) {
			if (event.key !== 'Tab' && event.key !== 'Shift') {
				this.value = displayValue; // Affiche l'icône
				this.setAttribute('data-key', key); // Stocke la vraie touche dans un attribut data-key
			} else if (event.key === 'Tab' && !event.shiftKey) {
				event.preventDefault();
				if (mode === 'tournament') {
					if (index === 0)
						document.getElementById(`player${0}`).focus();
					else
						document.getElementById(`player${1}`).focus();
				} else {
					const nextPlayer = document.getElementById(`player${index + 1}`);
					if (nextPlayer) {
						nextPlayer.focus(); // Passe au champ suivant (nom du joueur suivant)
					}
				}
			} else if (event.key === 'Tab' && event.shiftKey) {
				event.preventDefault();
				// Revenir au champ Up associé
				const associatedUpField = document.getElementById(`player${index}Up`);
				if (associatedUpField) {
					associatedUpField.focus();
				}
			}
		} else {
			alert("Only lowercase letters, numbers, and arrow keys are allowed.");
		}
	});
}