const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Route pour noter un utilisateur
router.post('/:userId', auth, async (req, res) => {
  try {
    const { rating, comment, longitude, latitude } = req.body;
    
    // Vérifier si l'utilisateur à noter existe
    const userToRate = await User.findById(req.params.userId);
    if (!userToRate) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'utilisateur n'essaie pas de se noter lui-même
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous noter vous-même' });
    }
    
    // Vérifier si l'utilisateur à noter accepte les notations
    if (userToRate.privacySettings.allowRatingFrom === 'none') {
      return res.status(403).json({ message: 'Cet utilisateur n\'accepte pas les notations' });
    }
    
    // Si l'utilisateur n'accepte les notations que des personnes rencontrées
    if (userToRate.privacySettings.allowRatingFrom === 'encountered') {
      // Logique pour vérifier si les utilisateurs se sont rencontrés
      // Cette logique sera implémentée plus tard
    }
    
    // Vérifier si l'utilisateur est bloqué
    if (userToRate.blockedUsers.includes(req.user.id)) {
      return res.status(403).json({ message: 'Vous ne pouvez pas noter cet utilisateur' });
    }
    
    // Vérifier si une notation existe déjà
    let existingRating = await Rating.findOne({
      fromUser: req.user.id,
      toUser: req.params.userId
    });
    
    if (existingRating) {
      // Mettre à jour la notation existante
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
      if (longitude && latitude) {
        existingRating.location.coordinates = [longitude, latitude];
      }
      
      await existingRating.save();
      
      // Mettre à jour la note moyenne de l'utilisateur noté
      await updateAverageRating(req.params.userId);
      
      return res.json(existingRating);
    }
    
    // Créer une nouvelle notation
    const newRating = new Rating({
      fromUser: req.user.id,
      toUser: req.params.userId,
      rating,
      comment: comment || '',
      location: {
        type: 'Point',
        coordinates: longitude && latitude ? [longitude, latitude] : [0, 0]
      }
    });
    
    await newRating.save();
    
    // Mettre à jour la note moyenne de l'utilisateur noté
    await updateAverageRating(req.params.userId);
    
    res.json(newRating);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les notations reçues par un utilisateur
router.get('/received/:userId', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.userId })
      .populate('fromUser', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les notations données par un utilisateur
router.get('/given', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ fromUser: req.user.id })
      .populate('toUser', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(ratings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour supprimer une notation
router.delete('/:ratingId', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);
    
    if (!rating) {
      return res.status(404).json({ message: 'Notation non trouvée' });
    }
    
    // Vérifier si l'utilisateur est l'auteur de la notation
    if (rating.fromUser.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    await rating.remove();
    
    // Mettre à jour la note moyenne de l'utilisateur noté
    await updateAverageRating(rating.toUser);
    
    res.json({ message: 'Notation supprimée' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Fonction pour mettre à jour la note moyenne d'un utilisateur
async function updateAverageRating(userId) {
  try {
    const ratings = await Rating.find({ toUser: userId });
    
    if (ratings.length === 0) {
      await User.findByIdAndUpdate(userId, {
        averageRating: 0,
        totalRatings: 0
      });
      return;
    }
    
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / ratings.length;
    
    await User.findByIdAndUpdate(userId, {
      averageRating: average,
      totalRatings: ratings.length
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la note moyenne:', err);
  }
}

module.exports = router;
