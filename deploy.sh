#!/bin/bash

# Script de déploiement pour l'application de notation avec détection de proximité

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Démarrage du déploiement de l'application NoseDive...${NC}"

# Vérifier si nous sommes dans le bon répertoire
if [ ! -d "/home/ubuntu/proximity-rating-app" ]; then
  echo -e "${RED}Erreur: Le répertoire du projet n'existe pas.${NC}"
  exit 1
fi

# Déploiement du backend
echo -e "\n${YELLOW}Étape 1: Déploiement du backend...${NC}"

cd /home/ubuntu/proximity-rating-app/backend

# Installer les dépendances
echo "Installation des dépendances du backend..."
npm install --production

# Construire le backend
echo "Construction du backend..."
npm run build

# Démarrer le serveur en arrière-plan
echo "Démarrage du serveur backend..."
npm run start:prod &
BACKEND_PID=$!

# Vérifier si le serveur a démarré correctement
sleep 5
if ps -p $BACKEND_PID > /dev/null; then
  echo -e "${GREEN}Le serveur backend a démarré avec succès (PID: $BACKEND_PID).${NC}"
else
  echo -e "${RED}Erreur: Le serveur backend n'a pas pu démarrer.${NC}"
  exit 1
fi

# Exposer le port du backend
echo "Exposition du port du backend..."
PORT=5000
BACKEND_URL=$(deploy_expose_port $PORT)
echo -e "${GREEN}Backend déployé et accessible à: $BACKEND_URL${NC}"

# Mettre à jour la configuration du frontend avec l'URL du backend
echo -e "\n${YELLOW}Étape 2: Mise à jour de la configuration du frontend...${NC}"

cd /home/ubuntu/proximity-rating-app/mobile/ProximityRatingApp

# Mettre à jour le fichier de configuration
echo "Mise à jour du fichier de configuration..."
cat > config.js << EOL
export const API_URL = '$BACKEND_URL';

export const GEO_CONFIG = {
  MAX_DISTANCE: 100, // Distance maximale en mètres
  UPDATE_INTERVAL: 60000, // Intervalle de mise à jour en millisecondes (1 minute)
  LOCATION_OPTIONS: {
    accuracy: 'high',
    distanceFilter: 10,
    timeInterval: 60000
  }
};

export const RATING_CONFIG = {
  MAX_STARS: 5,
  RATING_COOLDOWN: 86400 // 24 heures en secondes
};
EOL

echo -e "${GREEN}Configuration du frontend mise à jour avec succès.${NC}"

# Déploiement du frontend
echo -e "\n${YELLOW}Étape 3: Déploiement du frontend...${NC}"

# Installer les dépendances
echo "Installation des dépendances du frontend..."
npm install --production

# Construire l'application
echo "Construction de l'application mobile..."
npm run build

# Créer le bundle pour Android
echo "Création du bundle Android..."
npm run build:android

# Créer le bundle pour iOS
echo "Création du bundle iOS..."
npm run build:ios

# Déployer l'application web pour les tests
echo "Déploiement de la version web pour les tests..."
npm run web &
FRONTEND_PID=$!

# Vérifier si le serveur web a démarré correctement
sleep 5
if ps -p $FRONTEND_PID > /dev/null; then
  echo -e "${GREEN}Le serveur web a démarré avec succès (PID: $FRONTEND_PID).${NC}"
else
  echo -e "${RED}Erreur: Le serveur web n'a pas pu démarrer.${NC}"
  exit 1
fi

# Exposer le port du frontend
echo "Exposition du port du frontend..."
PORT=19006
FRONTEND_URL=$(deploy_expose_port $PORT)
echo -e "${GREEN}Frontend déployé et accessible à: $FRONTEND_URL${NC}"

# Résumé du déploiement
echo -e "\n${GREEN}=== Déploiement terminé avec succès ====${NC}"
echo -e "Backend: $BACKEND_URL"
echo -e "Frontend: $FRONTEND_URL"
echo -e "Les bundles Android et iOS sont disponibles dans le répertoire 'dist'."
echo -e "${YELLOW}Note: Pour une utilisation en production, il est recommandé de déployer l'application sur les stores officiels (Google Play et App Store).${NC}"

exit 0
