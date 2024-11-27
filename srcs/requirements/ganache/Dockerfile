# Dockerfile pour Ganache
FROM trufflesuite/ganache-cli

# Créer et configurer le dossier de données avec les permissions root
RUN mkdir -p /data && chown -R root:root /data

# Définir le dossier de travail pour Ganache
WORKDIR /data

# Lancer Ganache avec les paramètres spécifiés et définir la base de données persistante
CMD ["ganache-cli", "-h", "0.0.0.0", "-p", "8545", "-i", "5777", "-l", "12000000", "--db", "/data", "--account", "0x1c3b45dbf05a38eebd0a21271e117b93e4e418528bbc7c75e5b8e2e7a84c0c4f,100000000000000000000"]
