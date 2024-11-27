# Dockerfile pour Truffle
FROM node:16.20.0

# Installer netcat pour attendre que Ganache soit prêt
RUN apt-get update && apt-get install -y netcat && apt-get clean

# Installer Truffle
RUN npm install -g truffle@5.11.5

# Copier les scripts et donner les permissions
COPY wait-for-ganache.sh /usr/local/bin/
COPY deploy-if-needed.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-ganache.sh /usr/local/bin/deploy-if-needed.sh

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY . /app

# Utiliser le script conditionnel pour lancer Truffle
CMD ["sh", "-c", "deploy-if-needed.sh"]
