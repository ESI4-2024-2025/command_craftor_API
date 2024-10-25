// logger.js
const winston = require('winston');

/*
logger.error(message) : Pour les erreurs critiques.
logger.warn(message) : Pour les avertissements.
logger.info(message) : Pour les messages d'information généraux.
logger.verbose(message) : Pour des messages détaillés de niveau inférieur.
logger.debug(message) : Pour le débogage.
logger.silly(message) : Pour des messages encore plus détaillés, souvent pour un suivi exhaustif.
*/

// Création d'un logger avec Winston
const logger = winston.createLogger({
    // Niveau par défaut
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Format de l'heure française
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),  // Affichage dans la console
        new winston.transports.File({ filename: 'app.log' })  // Sauvegarde dans un fichier
    ]
});

module.exports = logger;
