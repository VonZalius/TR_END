#!/bin/sh
set -e

until curl -s http://ganache:8545 > /dev/null; do
  echo "Waiting for Ganache to be ready..."
  sleep 5
done

echo "Ganache is up and running!"
sleep 10 # Ajoute un délai de 10 secondes après le démarrage de Ganache
exec "$@"
