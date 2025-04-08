## Guide de déploiement pour l'application NoseDive

Ce document explique comment déployer l'application NoseDive sur différentes plateformes.

### Prérequis

- Node.js 14+ et npm
- MongoDB
- Expo CLI pour le développement mobile
- Android Studio (pour Android) ou Xcode (pour iOS) pour les builds natifs

### Déploiement du backend

1. Naviguez vers le répertoire du backend :
   ```
   cd /home/ubuntu/proximity-rating-app/backend
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Configurez les variables d'environnement dans le fichier `.env` :
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/proximity-rating-app
   JWT_SECRET=votre_secret_jwt
   JWT_EXPIRE=30d
   ```

4. Démarrez le serveur :
   ```
   npm start
   ```

### Déploiement du frontend mobile

1. Naviguez vers le répertoire du frontend :
   ```
   cd /home/ubuntu/proximity-rating-app/mobile/ProximityRatingApp
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Mettez à jour le fichier `config.js` avec l'URL de votre backend.

4. Pour tester sur un appareil physique avec Expo Go :
   ```
   expo start
   ```

5. Pour créer un build Android :
   ```
   expo build:android
   ```

6. Pour créer un build iOS :
   ```
   expo build:ios
   ```

### Déploiement automatisé

Pour un déploiement automatisé, utilisez le script `deploy.sh` :

```
./deploy.sh
```

Ce script :
- Déploie le backend
- Configure le frontend avec l'URL du backend
- Construit l'application mobile
- Expose les ports nécessaires

### Accès à l'application déployée

Après le déploiement, l'application sera accessible aux URLs suivantes :
- Backend API : URL fournie par le script de déploiement
- Version web de test : URL fournie par le script de déploiement
- Applications mobiles : Téléchargez les fichiers APK/IPA générés

### Notes importantes

- Pour une utilisation en production, il est recommandé de déployer l'application sur les stores officiels (Google Play et App Store)
- Les fonctionnalités de géolocalisation et Bluetooth nécessitent des permissions spécifiques sur les appareils mobiles
- Assurez-vous que votre serveur MongoDB est correctement sécurisé pour une utilisation en production
