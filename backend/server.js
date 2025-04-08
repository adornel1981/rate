const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { authErrorHandler } = require('./utils/errorHandlers');

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de l\'application de notation avec détection de proximité' });
});

// Importer les routes
app.use('/api/users', require('./routes/users'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/encounters', require('./routes/encounters'));

// Middleware de gestion des erreurs d'authentification
app.use(authErrorHandler);

// Middleware de gestion des erreurs générales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Configuration de Socket.io pour les mises à jour en temps réel
io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté');
  
  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
  
  // Mise à jour de la position
  socket.on('updatePosition', (data) => {
    console.log('Position mise à jour:', data);
    // Ici, nous traiterons les mises à jour de position et enverrons les utilisateurs à proximité
    if (data.userId && data.longitude && data.latitude) {
      // Émettre un événement pour informer les autres utilisateurs à proximité
      socket.broadcast.emit('userNearby', {
        userId: data.userId,
        location: {
          longitude: data.longitude,
          latitude: data.latitude
        }
      });
    }
  });
  
  // Notification de nouvelle notation
  socket.on('newRating', (data) => {
    if (data.toUserId) {
      // Émettre un événement pour informer l'utilisateur noté
      socket.broadcast.emit('ratingReceived', {
        fromUserId: data.fromUserId,
        rating: data.rating
      });
    }
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = { app, server, io };
