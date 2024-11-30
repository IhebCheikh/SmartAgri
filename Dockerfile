# Étape 1 : Construire l'application
FROM node:20.18.0-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu de l'application
COPY . .

# Compiler l'application
RUN npm run build

# Étape 2 : Créer une image minimale pour l'exécution
FROM node:20.18.0-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances nécessaires
COPY --from=builder /app/node_modules ./node_modules

# Copier le code compilé
COPY --from=builder /app/dist ./dist

# Copier les autres fichiers nécessaires (par exemple, un fichier de configuration .env)
COPY --from=builder /app/package*.json ./

# Exposer le port de l'application (par défaut 3000 pour NestJS)
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/main"]
