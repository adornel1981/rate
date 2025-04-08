// Fichier de configuration pour l'authentification
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Fonction pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { user: { id: userId } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Fonction pour hacher un mot de passe
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Fonction pour vérifier un mot de passe
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Fonction pour valider un email
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Fonction pour valider un mot de passe (au moins 8 caractères, une majuscule, un chiffre)
const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Fonction pour enregistrer un nouvel utilisateur
const registerUser = async (userData) => {
  try {
    const { email, password, name } = userData;
    
    // Validation des données
    if (!email || !password || !name) {
      throw new Error('Tous les champs sont requis');
    }
    
    if (!validateEmail(email)) {
      throw new Error('Email invalide');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Cet utilisateur existe déjà');
    }
    
    // Hacher le mot de passe
    const passwordHash = await hashPassword(password);
    
    // Créer le nouvel utilisateur
    const user = new User({
      email,
      passwordHash,
      name,
      location: {
        type: 'Point',
        coordinates: [0, 0] // Coordonnées par défaut
      }
    });
    
    await user.save();
    
    // Générer un token JWT
    const token = generateToken(user.id);
    
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  } catch (error) {
    throw error;
  }
};

// Fonction pour connecter un utilisateur
const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Validation des données
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Identifiants invalides');
    }
    
    // Vérifier le mot de passe
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Identifiants invalides');
    }
    
    // Mettre à jour la dernière activité
    user.lastActive = Date.now();
    await user.save();
    
    // Générer un token JWT
    const token = generateToken(user.id);
    
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  } catch (error) {
    throw error;
  }
};

// Fonction pour récupérer les informations d'un utilisateur
const getUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  hashPassword,
  verifyPassword,
  validateEmail,
  validatePassword,
  registerUser,
  loginUser,
  getUserInfo
};
