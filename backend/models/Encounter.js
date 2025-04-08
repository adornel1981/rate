const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les rencontres entre utilisateurs
const encounterSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  duration: {
    type: Number, // durée en secondes
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index pour accélérer les recherches par utilisateur
encounterSchema.index({ users: 1 });
// Index géospatial pour les requêtes basées sur la localisation
encounterSchema.index({ location: '2dsphere' });

const Encounter = mongoose.model('Encounter', encounterSchema);

module.exports = Encounter;
