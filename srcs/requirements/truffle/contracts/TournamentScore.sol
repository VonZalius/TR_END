// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentScore {
    struct Player {
        string name;
        uint score;
    }

    Player[] public players;
    string public winner;
    mapping(string => uint) public tournamentWins;
    string[] private winners; // Un tableau pour stocker les noms des gagnants

    event PlayerAdded(string name, uint score);
    event TournamentWinner(string winner, uint timestamp); // Ajouter le timestamp pour chaque victoire

    function addPlayer(string memory _name) public {
        require(bytes(_name).length > 0, "Le nom ne peut pas etre vide");
        players.push(Player(_name, 0));
        emit PlayerAdded(_name, 0);
    }

    // Fonction pour récupérer tous les alias ayant au moins une victoire
    function getAllPlayerNamesWithWins() public view returns (string[] memory) {
        return winners;
    }

    // Fonction pour enregistrer le gagnant et émettre un événement avec le timestamp
    function enregistrerGagnant(string memory _winner) public {
        require(bytes(_winner).length > 0, "Le nom du gagnant ne peut pas etre vide");
        winner = _winner;
        tournamentWins[_winner]++;

        // Ajout dans winners si c'est un premier gain pour cet alias
        if (tournamentWins[_winner] == 1) {
            winners.push(_winner);
        }

        emit TournamentWinner(_winner, block.timestamp); // Emet l'événement avec le timestamp
    }

    // Fonction pour obtenir le nombre de tournois gagnés par un joueur
    function getTournamentWins(string memory playerName) public view returns (uint) {
        return tournamentWins[playerName];
    }
}
