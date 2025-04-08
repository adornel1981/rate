// Fichier de configuration pour la gestion des erreurs d'authentification
const errorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
};

// Classe d'erreur personnalisée pour l'authentification
class AuthError extends Error {
  constructor(message, type, statusCode) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

// Fonction pour créer une erreur de validation
const createValidationError = (message) => {
  return new AuthError(message, errorTypes.VALIDATION_ERROR, 400);
};

// Fonction pour créer une erreur d'authentification
const createAuthenticationError = (message) => {
  return new AuthError(message, errorTypes.AUTHENTICATION_ERROR, 401);
};

// Fonction pour créer une erreur d'autorisation
const createAuthorizationError = (message) => {
  return new AuthError(message, errorTypes.AUTHORIZATION_ERROR, 403);
};

// Fonction pour créer une erreur de ressource non trouvée
const createNotFoundError = (message) => {
  return new AuthError(message, errorTypes.NOT_FOUND_ERROR, 404);
};

// Fonction pour créer une erreur serveur
const createServerError = (message) => {
  return new AuthError(message, errorTypes.SERVER_ERROR, 500);
};

// Middleware pour gérer les erreurs d'authentification
const authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({
      error: {
        type: err.type,
        message: err.message
      }
    });
  }
  
  // Si ce n'est pas une erreur d'authentification, passer au middleware d'erreur suivant
  next(err);
};

module.exports = {
  errorTypes,
  AuthError,
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createNotFoundError,
  createServerError,
  authErrorHandler
};
