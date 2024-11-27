#!/bin/sh
set -e

# Attendre que Ganache soit prêt
wait-for-ganache.sh

# Chemin vers le fichier du contrat déployé
CONTRACT_PATH="/app/build/contracts/TournamentScore.json"

# Vérifier si le contrat est déjà déployé en vérifiant l'existence du fichier JSON généré
if [ -f "$CONTRACT_PATH" ]; then
    echo "Le contrat est déjà déployé. Aucun nouveau déploiement nécessaire."
else
    echo "Déploiement du contrat sur le réseau 'development'..."
    truffle compile && truffle migrate --network development
fi

# Garder le conteneur actif après le déploiement
while :; do sleep 2073600; done
