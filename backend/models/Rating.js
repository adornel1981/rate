const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les notations
const ratingSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index pour accélérer les recherches par utilisateur
ratingSchema.index({ fromUser: 1, toUser: 1 });
// Index géospatial pour les requêtes basées sur la localisation
ratingSchema.index({ location: '2dsphere' });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
