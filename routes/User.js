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
    app.get('/users/current', /*[authJwt.verifyToken],*/ User.getCurrentProfile) //OK
    app.get('/users/email/validationupdate/:email', User.emailValidationUpdate)  //A tester PLUS TARD
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
    app.put('/users/email/password-modify', [body('password').isLength({ max: 255 })], User.passwordModify) //A tester PLUS TARD
    app.put('/users/email/verify', User.emailVerify) //A tester PLUS TARD
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
    app.post('/users/email/PasswordReset', User.emailPasswordReset) //A tester PLUS TARD
    //Delete
    app.delete('/users/deleteFavorite', /*[authJwt.verifyToken],*/ User.deleteFavorite) //Ok 
    app.delete('/users/deleteUser', /*[authJwt.verifyToken],*/ User.deleteUser) //OK
    //Token
    app.put('/verify-token', [authJwt.verifyToken]) //A tester PLUS TARD
}

function isValidPhoneNumber(phoneNumber) {
    // Vérifier si le numéro de téléphone est valide
    const phoneRegex = /^\+?1?(\d{10,12}$)/;
    return phoneRegex.test(phoneNumber);
}