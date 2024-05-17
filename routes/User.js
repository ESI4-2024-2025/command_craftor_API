// Require controller modules.
const User = require('../controllers/userControllers')
const { body, validationResult, check } = require('express-validator');

const { authJwt } = require('../middlewares');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-token-acces, Origin, Content-Type, Accept"
        );
        next();
    });

    //Login
    app.post('/users/login', [
        body('email').isEmail().isLength({ max: 255 }),
        body('password').isLength({ max: 255 })
    ], User.login) //OK
    //Get
    app.get('/users', User.getAllUsers)    //OK
    app.put('/users/current', /*[authJwt.verifyToken],*/ User.getCurrentProfile) //OK
    app.get('/users/email/validationupdate/:email', User.emailValidationUpdate)  //A tester PLUS TARD // Besoin du Front
    //Put
    app.put('/users/update', /*[authJwt.verifyToken],*/[
        body('username').isLength({ max: 30 }).custom(async (value, { req }) => {
            // Access the authenticated user's username from req.user (assuming you have middleware that sets it)
            const authenticatedUsername = req.body.username;

            // If the username in the request body matches the authenticated user's username, resolve the promise
            if (value === authenticatedUsername) {
                return Promise.resolve();
            }

            // Check if the username is unique in the database
            return userModel.findOne({ username: value }).then((user) => {
                if (user) {
                    return Promise.reject('Le nom d\'utilisateur est déjà utilisé');
                }
                return Promise.resolve();
            });
        }),
        body('email').custom((value) => {
            // Check if the email is unique in the database
            return userModel.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject('L\'adresse email est déjà utilisée');
                }
                return Promise.resolve();
            });
        }),
        body('phone').custom((value) => {
            // Check if the phone number is in a valid format
            if (value === '' || value === undefined || value === null) return Promise.resolve();
            if (!isValidPhoneNumber(value)) {
                return Promise.reject('Le format du numéro de téléphone est incorrect');
            }

            // Check if the phone number is unique in the database
            return userModel.findOne({ phone: value }).then((user) => {
                if (user) {
                    return Promise.reject('Ce numéro de téléphone est déjà utilisé par un autre utilisateur');
                }
                return Promise.resolve();
            });
        }),
        body('password').isLength({ max: 255 })
    ], User.profileUpdate) //Besoin Token
    app.put('/users/email/password-modify', [body('password').isLength({ max: 255 })], User.passwordModify) //Ok
    app.put('/users/email/verify', User.emailVerify) //OK
    //Post
    app.put('/users/addFavorite', /*[authJwt.verifyToken],*/ User.addFavorite) //Ok
    app.post('/users/register', [
        body('username').isLength({ max: 30 }).custom((value) => {
            return userModel.findOne({ username: value }).then((user) => {
                if (user) {
                    return Promise.reject('Le nom d\'utilisateur est déjà utilisé');
                }
                return Promise.resolve();
            });
        }),
        body('email').custom((value) => {
            return userModel.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject('L\'adresse email est déjà utilisée');
                }
                return Promise.resolve()
            })
        }),
        // Exemple de vérification de la validité et de l'unicité du numéro de téléphone
        body('phone').custom(async (value) => {
            if (value === '' || value === undefined || value === null) return Promise.resolve();
            // Vérifier si le format du numéro de téléphone est valide
            if (!isValidPhoneNumber(value)) {
                return Promise.reject('Le format du numéro de téléphone est incorrect');
            }
            try {
                // Rechercher si le numéro de téléphone existe déjà dans la base de données
                const existingUserWithPhone = await userModel.findOne({ phone: value });
                // Si un utilisateur avec ce numéro de téléphone existe déjà, rejeter la promesse
                if (existingUserWithPhone) {
                    return Promise.reject('Ce numéro de téléphone est déjà pris');
                }
                // Si le numéro de téléphone est valide et unique, résoudre la promesse
                return Promise.resolve();
            } catch (err) {
                // En cas d'erreur lors de la recherche dans la base de données, rejeter la promesse avec un message d'erreur
                return Promise.reject('Une erreur s\'est produite lors de la vérification du numéro de téléphone');
            }
        }),
        body('password').isLength({ max: 255 })
    ], User.register) //OK
    app.post('/users/email/PasswordReset', User.emailPasswordReset) //Ok
    //Delete
    app.delete('/users/deleteFavorite', /*[authJwt.verifyToken],*/ User.deleteFavorite) //Ok 
    app.delete('/users/deleteUser', /*[authJwt.verifyToken],*/ User.deleteUser) //OK
    //Token
    app.put('/verify-token', [authJwt.verifyToken]) //A Tester PLUS TARD // Besoin du Front
}

function isValidPhoneNumber(phoneNumber) {
    // Vérifier si le numéro de téléphone est valide
    const phoneRegex = /^\+?1?(\d{10,12}$)/;
    return phoneRegex.test(phoneNumber);
}
/**
* @swagger
* components:
*  schemas:
*    User:
*      type: object
*      required:
*        - username
*        - email
*        - password
*      properties:
*        username:
*          type: string
*          description: Le nom d'utilisateur de l'utilisateur.
*        email:
*          type: string
*          format: email
*          description: L'adresse email de l'utilisateur.
*        phone:
*          type: string
*          description: Le numéro de téléphone de l'utilisateur.
*        password:
*          type: string
*          description: Le mot de passe de l'utilisateur.
*        email_verified:
*          type: boolean
*          description: Indique si l'email de l'utilisateur a été vérifié.
*        favoris:
*          type: array
*          items:
*            type: string
*          description: Les favoris de l'utilisateur.
*/

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Opérations liées aux utilisateurs
 */

/**
 * @swagger
 * tags:
 *   name: Users/Email
 *   description: Opérations liées aux Emails
 */

/**
 * @swagger
 * tags:
 *   name: Token
 *   description: Opérations liées aux Tokens
 */

// GET

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtenez tous les utilisateurs.
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Réponse réussie
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/email/validationupdate/{email}:
 *   get:
 *     summary: Met à jour la validation de l'email pour un utilisateur.
 *     tags: [Users/Email]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: L'email de l'utilisateur à valider.
 *     responses:
 *       '200':
 *         description: Réponse réussie
 *       '500':
 *         description: Erreur serveur interne
 */

// POST

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Connectez-vous avec votre email et mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Connexion réussie
 *       '400':
 *         description: Requête invalide
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Enregistrez un nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 maxLength: 30
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - phone
 *               - password
 *     responses:
 *       '200':
 *         description: Utilisateur enregistré avec succès
 *       '400':
 *         description: Requête invalide
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/email/PasswordReset:
 *   post:
 *     tags: [Users/Email]
 *     summary: Réinitialisez le mot de passe de l'utilisateur via email.
 *     responses:
 *       '200':
 *         description: Email de réinitialisation du mot de passe envoyé avec succès
 *       '500':
 *         description: Erreur serveur interne
 */

// PUT

/**
 * @swagger
 * /users/current:
 *   put:
 *     tags: [Users]
 *     summary: Obtenez le profil de l'utilisateur connecté.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Réponse réussie
 *       '401':
 *         description: Non autorisé
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/update:
 *   put:
 *     tags: [Users]
 *     summary: Mettre à jour le profil de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 maxLength: 30
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Profil utilisateur mis à jour avec succès
 *       '400':
 *         description: Requête invalide
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/email/password-modify:
 *   put:
 *     tags: [Users/Email]
 *     summary: Modifier le mot de passe de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 maxLength: 255
 *             required:
 *               - password
 *     responses:
 *       '200':
 *         description: Mot de passe modifié avec succès
 *       '400':
 *         description: Requête invalide
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/email/verify:
 *   put:
 *     tags: [Users/Email]
 *     summary: Vérifier l'adresse email de l'utilisateur.
 *     responses:
 *       '200':
 *         description: Adresse email vérifiée avec succès
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/addFavorite:
 *   put:
 *     tags: [Users]
 *     summary: Ajoutez un élément aux favoris de l'utilisateur.
 *     responses:
 *       '200':
 *         description: Favori ajouté avec succès
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /verify-token:
 *   put:
 *     tags: [Token]
 *     summary: Vérifiez le jeton d'authentification de l'utilisateur.
 *     responses:
 *       '200':
 *         description: Jeton vérifié avec succès
 *       '401':
 *         description: Non autorisé
 *       '500':
 *         description: Erreur serveur interne
 */

// DELETE

/**
 * @swagger
 * /users/deleteFavorite:
 *   delete:
 *     tags: [Users]
 *     summary: Supprimez un élément des favoris de l'utilisateur.
 *     responses:
 *       '200':
 *         description: Favori supprimé avec succès
 *       '500':
 *         description: Erreur serveur interne
 */

/**
 * @swagger
 * /users/deleteUser:
 *   delete:
 *     tags: [Users]
 *     summary: Supprimez le compte de l'utilisateur.
 *     responses:
 *       '200':
 *         description: Utilisateur supprimé avec succès
 *       '500':
 *         description: Erreur serveur interne
 */
