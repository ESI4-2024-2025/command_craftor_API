const Version = require('../controllers/versionControllers');

module.exports = function (app) {
    // Route pour récupérer toutes les versions
    app.get('/version', Version.getAllVersions);
}
/**
 * @swagger
 * /version:
 *   get:
 *     summary: Récupère toutes les versions
 *     tags:
 *       - Version
 *     responses:
 *       200:
 *         description: Liste des versions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Version'
 *       500:
 *         description: Erreur serveur
 */