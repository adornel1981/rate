# Exigences pour l'application de notation avec détection de proximité

## Concept général
Application mobile permettant de détecter automatiquement les personnes à proximité utilisant également l'application, et de les noter sur une échelle de 1 à 5 étoiles, inspirée du concept de l'épisode "Nosedive" de Black Mirror.

## Fonctionnalités principales

### Détection de proximité
- Utilisation de la géolocalisation pour détecter les utilisateurs à proximité (GPS)
- Option d'utilisation du Bluetooth pour une détection plus précise en intérieur
- Paramètres de distance configurable (10m, 50m, 100m, etc.)
- Mise à jour en temps réel des utilisateurs à proximité

### Système de notation
- Notation des utilisateurs sur une échelle de 1 à 5 étoiles
- Historique des notations données et reçues
- Calcul de la note moyenne pour chaque utilisateur
- Possibilité d'ajouter un commentaire avec la note

### Profil utilisateur
- Création d'un profil avec photo, nom, bio courte
- Affichage de la note moyenne
- Historique des interactions
- Paramètres de confidentialité

### Confidentialité et consentement
- Option pour être visible/invisible
- Contrôle des informations partagées
- Consentement explicite pour le partage de localisation
- Possibilité de bloquer certains utilisateurs

### Interface utilisateur
- Vue carte pour visualiser les utilisateurs à proximité
- Vue liste pour afficher les utilisateurs triés par distance
- Filtres par note, distance, etc.
- Mode sombre/clair

## Architecture technique

### Frontend (Application mobile)
- Application native pour iOS et Android
- Interface utilisateur intuitive et responsive
- Accès à la géolocalisation et au Bluetooth
- Stockage local pour les données hors ligne

### Backend
- API RESTful pour la communication client-serveur
- Base de données pour stocker les profils utilisateurs et les notations
- Système d'authentification sécurisé
- Algorithmes de calcul de proximité et de notation

### Sécurité
- Chiffrement des données
- Authentification sécurisée (OAuth 2.0)
- Protection contre les abus (limites de notation, détection de spam)
- Conformité RGPD pour les utilisateurs européens

## Considérations éthiques
- Mesures pour prévenir le harcèlement
- Système de signalement des abus
- Transparence sur l'utilisation des données
- Option de suppression complète du compte et des données

## Phases de développement
1. Prototype avec fonctionnalités de base
2. Version bêta avec groupe d'utilisateurs restreint
3. Lancement public avec toutes les fonctionnalités
4. Améliorations basées sur les retours utilisateurs
