const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les utilisateurs
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200
  },
  profilePicture: {
    type: String,
    default: ''
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
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
  lastActive: {
    type: Date,
    default: Date.now
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  privacySettings: {
    shareLocation: {
      type: Boolean,
      default: true
    },
    showRating: {
      type: Boolean,
      default: true
    },
    allowRatingFrom: {
      type: String,
      enum: ['everyone', 'encountered', 'none'],
      default: 'everyone'
    }
  },
  blockedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexation géospatiale pour les requêtes de proximité
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;
