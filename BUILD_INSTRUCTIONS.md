## Instructions pour générer les fichiers APK et IPA de l'application NoseDive

Ce document fournit les instructions détaillées pour générer les fichiers d'installation de l'application NoseDive pour Android (APK) et iOS (IPA).

### Prérequis généraux

- Node.js 14+ et npm
- Git
- Le code source de l'application NoseDive

### Génération du fichier APK (Android)

#### Prérequis spécifiques pour Android
- Android Studio
- JDK 11+
- Un appareil Android ou un émulateur pour les tests

#### Étapes de génération

1. Clonez le dépôt du projet (si vous ne l'avez pas déjà fait) :
   ```
   git clone [URL_DU_REPO]
   cd proximity-rating-app/mobile/ProximityRatingApp
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Installez Expo CLI globalement (si ce n'est pas déjà fait) :
   ```
   npm install -g expo-cli
   ```

4. Mettez à jour le fichier `config.js` avec l'URL de votre backend.

5. Générez le bundle Android :
   ```
   expo build:android -t apk
   ```
   
   Ou pour une version AAB (recommandée pour le Google Play Store) :
   ```
   expo build:android -t app-bundle
   ```

6. Suivez les instructions à l'écran. Expo vous demandera de vous connecter à votre compte Expo (ou d'en créer un).

7. Une fois la compilation terminée, Expo vous fournira un lien pour télécharger le fichier APK.

### Génération du fichier IPA (iOS)

#### Prérequis spécifiques pour iOS
- Un Mac avec macOS 10.15+
- Xcode 12+
- Un compte développeur Apple
- Un appareil iOS pour les tests (facultatif)

#### Étapes de génération

1. Clonez le dépôt du projet (si vous ne l'avez pas déjà fait) :
   ```
   git clone [URL_DU_REPO]
   cd proximity-rating-app/mobile/ProximityRatingApp
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Installez Expo CLI globalement (si ce n'est pas déjà fait) :
   ```
   npm install -g expo-cli
   ```

4. Mettez à jour le fichier `config.js` avec l'URL de votre backend.

5. Générez le bundle iOS :
   ```
   expo build:ios -t archive
   ```
   
   Ou pour un simulateur :
   ```
   expo build:ios -t simulator
   ```

6. Suivez les instructions à l'écran. Expo vous demandera de vous connecter à votre compte Expo et de fournir les informations de votre compte développeur Apple.

7. Une fois la compilation terminée, Expo vous fournira un lien pour télécharger le fichier IPA.

### Utilisation d'EAS Build (Alternative recommandée)

Expo propose également EAS Build, un service de build plus récent et plus puissant :

1. Installez EAS CLI :
   ```
   npm install -g eas-cli
   ```

2. Connectez-vous à votre compte Expo :
   ```
   eas login
   ```

3. Configurez votre projet :
   ```
   eas build:configure
   ```

4. Lancez la compilation pour Android :
   ```
   eas build --platform android
   ```

5. Lancez la compilation pour iOS :
   ```
   eas build --platform ios
   ```

### Installation des fichiers générés

#### Installation de l'APK sur Android
1. Transférez le fichier APK sur votre appareil Android
2. Sur votre appareil, activez l'installation d'applications provenant de sources inconnues dans les paramètres
3. Ouvrez le fichier APK pour installer l'application

#### Installation de l'IPA sur iOS
1. Utilisez Apple TestFlight pour distribuer votre application
2. Ou utilisez un service comme Diawi pour générer un lien d'installation

### Notes importantes
- Les fichiers de build peuvent être volumineux (100+ Mo)
- La compilation peut prendre plusieurs minutes, voire plus d'une heure
- Pour une distribution publique, vous devrez soumettre votre application aux stores officiels (Google Play et App Store)
- Les fonctionnalités de géolocalisation et Bluetooth nécessitent des permissions spécifiques qui doivent être correctement configurées dans les fichiers de configuration natifs
