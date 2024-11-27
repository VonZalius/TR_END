#!/bin/bash

# psql command doc and options: https://www.postgresql.org/docs/current/app-psql.html
# pg_ctl command doc and options: https://www.postgresql.org/docs/current/app-pg-ctl.html
# initdb source: https://www.postgresql.org/docs/current/app-initdb.html

set -e # Exit immediately if a command exits with a non-zero status.

# Si le répertoire de données n'existe toujours pas, initialiser la base de données
if [ ! -d "$PGDATA" ] ; then

  # Récupérer les valeurs des fichiers de secrets
  POSTGRES_USER="$(cat "$POSTGRES_USER_FILE")"
  POSTGRES_PASSWORD="$(cat "$POSTGRES_PASSWORD_FILE")"
  POSTGRES_DB="$(cat "$POSTGRES_DB_NAME_FILE")"

  PGPASSWORD="$(cat "$PG_SUPERUSER_PASS")"
  export PGPASSWORD

  # pour le débogage
  if [ $LOG_LEVEL = "DEBUG" ]; then
    echo "POSTGRES_USER: $POSTGRES_USER"
    echo "POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
    echo "POSTGRES_DB: $POSTGRES_DB"
    echo "PG SUPERUSER PASSWORD: $PGPASSWORD"
  fi

  echo "Initializing the database"

  # initdb crée un nouveau cluster de base de données PostgreSQL.
  initdb --auth-local=scram-sha-256 --auth-host=scram-sha-256 -D "$PGDATA" --pwfile=/run/secrets/pg_superuser_pass

  # obtenir l'adresse IP du conteneur auth
  DJANGO_CONTAINER_IP=$(getent hosts auth | awk '{ print $1 }')

  echo "Getting container IP address"

  if [ $LOG_LEVEL = "DEBUG" ]; then
    echo "auth ip address is : $DJANGO_CONTAINER_IP"
  fi

  # Ajouter l'adresse IP du conteneur auth au fichier pg_hba.conf
  echo "host    all             all             $DJANGO_CONTAINER_IP/32           scram-sha-256" >> "$PGDATA"/pg_hba.conf

  echo "Container IP address is set in pg_hba.conf"

  echo "Starting PostgreSQL instance"

  # pg_ctl est une utilité pour initialiser, démarrer, arrêter ou redémarrer une instance PostgreSQL.
  pg_ctl -D "$PGDATA" -l /etc/postgresql/logfile -w start

  echo "Creating PostgreSQL role with password" 

  # Créer un utilisateur avec mot de passe
  psql -U postgres -c "
      CREATE ROLE $POSTGRES_USER
      WITH LOGIN PASSWORD '$POSTGRES_PASSWORD';
  "

  echo "PostgreSQL parametrizing for Django"

  # Paramètres spécifiques pour Django
  psql -U postgres -c "ALTER ROLE $POSTGRES_USER SET client_encoding TO 'UTF8';"
  psql -U postgres -c "ALTER ROLE $POSTGRES_USER SET default_transaction_isolation TO 'read committed';"
  psql -U postgres -c "ALTER ROLE $POSTGRES_USER SET timezone TO 'Europe/Zurich';"

  echo "Creating a database"

  # Créer une base de données avec le propriétaire spécifié
  psql -U postgres -c "
      CREATE DATABASE $POSTGRES_DB
      OWNER $POSTGRES_USER;
  "

  # changement du mot de passe pour qu'il corresponde à POSTGRES_USER (pong)
  PGPASSWORD="$(cat "$POSTGRES_PASSWORD_FILE")"
  export PGPASSWORD

  echo "Shutting down PostgreSQL to take changes"

  # Arrêter PostgreSQL pour appliquer les changements
  pg_ctl -D "$PGDATA" -m fast -w stop

fi

unset PGPASSWORD

echo "Running PostgreSQL in foreground mode"

# Exécuter PostgreSQL en mode premier-plan
exec postgres -D "$PGDATA" -c config_file=/etc/postgresql/postgresql.conf
