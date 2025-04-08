const express = require('express');
const router = express.Router();
const Encounter = require('../models/Encounter');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Route pour enregistrer une rencontre entre utilisateurs
router.post('/', auth, async (req, res) => {
  try {
    const { userId, longitude, latitude, duration } = req.body;
    
    // Vérifier si l'utilisateur rencontré existe
    const encounteredUser = await User.findById(userId);
    if (!encounteredUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'utilisateur n'essaie pas d'enregistrer une rencontre avec lui-même
    if (req.user.id === userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas enregistrer une rencontre avec vous-même' });
    }
    
    // Vérifier si l'utilisateur rencontré est visible
    if (!encounteredUser.isVisible) {
      return res.status(403).json({ message: 'Cet utilisateur n\'est pas visible' });
    }
    
    // Créer une nouvelle rencontre
    const newEncounter = new Encounter({
      users: [req.user.id, userId],
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      duration: duration || 0
    });
    
    await newEncounter.save();
    
    res.json(newEncounter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les utilisateurs à proximité
router.get('/nearby', auth, async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 100 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Les coordonnées sont requises' });
    }
    
    // Mettre à jour la position de l'utilisateur
    await User.findByIdAndUpdate(req.user.id, {
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      lastActive: Date.now()
    });
    
    // Trouver les utilisateurs à proximité
    const nearbyUsers = await User.find({
      _id: { $ne: req.user.id }, // Exclure l'utilisateur lui-même
      isVisible: true, // Seulement les utilisateurs visibles
      blockedUsers: { $ne: req.user.id }, // Exclure les utilisateurs qui ont bloqué l'utilisateur actuel
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) // Distance en mètres
        }
      }
    }).select('-passwordHash -blockedUsers');
    
    // Filtrer les utilisateurs que l'utilisateur actuel a bloqués
    const currentUser = await User.findById(req.user.id);
    const filteredUsers = nearbyUsers.filter(user => 
      !currentUser.blockedUsers.includes(user._id)
    );
    
    res.json(filteredUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir l'historique des rencontres d'un utilisateur
router.get('/history', auth, async (req, res) => {
  try {
    const encounters = await Encounter.find({
      users: req.user.id
    })
      .sort({ createdAt: -1 })
      .populate('users', 'name profilePicture');
    
    res.json(encounters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
