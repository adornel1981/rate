const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const authUtils = require('../utils/auth');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const result = await authUtils.registerUser(req.body);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const result = await authUtils.loginUser(req.body);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/me', auth, async (req, res) => {
  try {
    const user = await authUtils.getUserInfo(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route pour mettre à jour le profil
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, profilePicture, privacySettings } = req.body;
    
    // Construire l'objet de mise à jour
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (privacySettings) updateFields.privacySettings = privacySettings;
    
    // Mise à jour du profil
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route pour mettre à jour la position
router.put('/location', auth, async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    
    // Mise à jour de la position
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          lastActive: Date.now()
        } 
      },
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route pour basculer la visibilité
router.put('/visibility', auth, async (req, res) => {
  try {
    const { isVisible } = req.body;
    
    // Mise à jour de la visibilité
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { isVisible } },
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route pour bloquer un utilisateur
router.post('/block/:userId', auth, async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.userId);
    if (!userToBlock) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Ajouter l'utilisateur à la liste des bloqués
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { blockedUsers: req.params.userId } },
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route pour débloquer un utilisateur
router.delete('/block/:userId', auth, async (req, res) => {
  try {
    // Retirer l'utilisateur de la liste des bloqués
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { blockedUsers: req.params.userId } },
      { new: true }
    ).select('-passwordHash');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
