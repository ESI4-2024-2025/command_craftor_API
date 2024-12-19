const userControllers = require('../../controllers/userControllers');
const userModels = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { SHA256 } = require('crypto-js');
const nodemailer = require("nodemailer");
const logger = require('../../logger');

jest.mock('../../models/userModel');
jest.mock('jsonwebtoken');
jest.mock('crypto-js');
jest.mock('nodemailer');
jest.mock('../../logger');
jest.mock('express-validator');

describe('User Controllers', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };
        validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true), array: jest.fn() });
    });

    describe('login', () => {
        it('should return 400 if validation errors exist', () => {
            validationResult.mockReturnValueOnce({ isEmpty: jest.fn().mockReturnValue(false), array: jest.fn().mockReturnValue([{ msg: 'Error' }]) });

            userControllers.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Error' }] });
        });

        it('should return 400 if email or password is incorrect', async () => {
            req.body = { email: 'test@test.com', password: 'password' };
            userModels.findOne.mockImplementationOnce((query, callback) => callback(null, null));
            SHA256.mockReturnValue({ toString: jest.fn().mockReturnValue('hashedpassword') });
            jwt.sign.mockReturnValue('token');

            await userControllers.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Votre email ou mot de passe est incorrect');
        });
        it('should return 200 and a token if login is successful', async () => {
            req.body = { email: 'test@test.com', password: 'password' };
            const user = { email: 'test@test.com', _id: '123', username: 'testuser', password: 'hashedpassword' };
            userModels.findOne.mockImplementationOnce((query, callback) => callback(null, user));
            SHA256.mockReturnValue({ toString: jest.fn().mockReturnValue('hashedpassword') });
            jwt.sign.mockReturnValue('token');

            await userControllers.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ accessToken: 'token' });
        });
    });

    describe('getCurrentProfile', () => {
        it('should return 401 if token is missing', async () => {
            await userControllers.getCurrentProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Access token is missing');
        });

        it('should return 401 if token is invalid', async () => {
            req.headers['x-access-token'] = 'invalidtoken';
            jwt.verify.mockImplementationOnce((token, secret, callback) => callback(new Error('Invalid token'), null));

            await userControllers.getCurrentProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid access token');
        });

        it('should return 404 if user is not found', async () => {
            req.headers['x-access-token'] = 'validtoken';
            jwt.verify.mockImplementationOnce((token, secret, callback) => callback(null, { email: 'test@test.com' }));
            userModels.findOne.mockImplementationOnce((query, callback) => callback(null, null));

            await userControllers.getCurrentProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found.');
        });

        it('should return 200 and user profile if user is found', async () => {
            req.headers['x-access-token'] = 'validtoken';
            jwt.verify.mockImplementationOnce((token, secret, callback) => callback(null, { email: 'test@test.com' }));
            const user = { email: 'test@test.com', password: 'password' };
            userModels.findOne.mockImplementationOnce((query, callback) => callback(null, user));

            await userControllers.getCurrentProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ email: 'test@test.com', password: undefined });
        });
    });

    describe('logout', () => {
        it('should return logout successful', () => {
            userControllers.logout(req, res);

            expect(res.send).toHaveBeenCalledWith('Logout successful');
        });
    });

    describe('getAllUsers', () => {
        it('should return 200 and all users', async () => {
            const users = [{ email: 'test@test.com' }];
            userModels.find.mockResolvedValue(users);

            await userControllers.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(users);
        });

        it('should return 500 if an error occurs while retrieving all users', async () => {
            const error = new Error('Database error');
            userModels.find.mockRejectedValue(error);

            await userControllers.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('An error occurred while retrieving all users.');
        });
    });

    describe('deleteUser', () => {
        it('should return 400 if id is invalid', () => {
            req.body._id = 'invalidid';

            userControllers.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('No record with given id: invalidid');
        });

        it('should return 200 if user is deleted successfully', async () => {
            req.body._id = '507f1f77bcf86cd799439011';
            const user = { _id: '507f1f77bcf86cd799439011' };
            userModels.findByIdAndDelete.mockImplementationOnce((id, callback) => callback(null, user));

            await userControllers.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                data: user,
                message: 'Post has been removed successfully.',
                status: 200,
            });
        });

        it('should return 500 if an error occurs while deleting the user', async () => {
            req.body._id = '507f1f77bcf86cd799439011';
            const error = new Error('Database error');
            userModels.findByIdAndDelete.mockImplementationOnce((id, callback) => callback(error, null));

            await userControllers.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteFavorite', () => {
        it('should return 400 if id is invalid', () => {
            req.body._id = 'invalidid';

            userControllers.deleteFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('No record with given id: invalidid');
        });

        it('should return 200 if favorite is removed successfully', async () => {
            req.body._id = '507f1f77bcf86cd799439011';
            req.body.favorite = '507f1f77bcf86cd799439012';
            const user = { _id: '507f1f77bcf86cd799439011', favoris: [] };
            userModels.findByIdAndUpdate.mockImplementationOnce((id, update, options, callback) => callback(null, user));

            await userControllers.deleteFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(user);
        });

        it('should return 500 if an error occurs while removing the favorite', async () => {
            req.body._id = '507f1f77bcf86cd799439011';
            req.body.favorite = '507f1f77bcf86cd799439012';
            const error = new Error('Database error');
            userModels.findByIdAndUpdate.mockImplementationOnce((id, update, options, callback) => callback(error, null));

            await userControllers.deleteFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('An error occurred while adding the favorite.');
        });
    });

    describe('register', () => {
        it('should return 400 if username is too long', async () => {
            req.body.username = 'a'.repeat(31);

            await userControllers.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" });
        });

        it('should return 400 if username is already used', async () => {
            req.body.username = 'testuser';
            userModels.findOne.mockResolvedValueOnce({ username: 'testuser' });

            await userControllers.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: "Le nom d'utilisateur est déjà utilisé" });
        });

        it('should return 400 if email is already used', async () => {
            req.body.email = 'test@test.com';
            userModels.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ email: 'test@test.com' });

            await userControllers.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: "L'adresse email est déjà utilisée" });
        });

        it('should return 400 if password is invalid', async () => {
            req.body.password = 'short';

            await userControllers.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: "Le mot de passe doit avoir entre 6 et 255 caractères" });
        });

        it('should return 500 if an error occurs while registering the user', async () => {
            req.body = { username: 'testuser', email: 'test@test.com', password: 'password' };
            userModels.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
            const error = new Error('Database error');
            userModels.mockImplementationOnce(() => ({
                save: jest.fn().mockRejectedValue(error)
            }));

            await userControllers.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(error);
        });
    });

    describe('addFavorite', () => {
        it('should return 400 if id is invalid', () => {
            req.body._id = 'invalidid';

            userControllers.addFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('No record with given id: invalidid');
        });

        it('should return 200 if favorite is added successfully', async () => {
            req.body._id = '507f1f77bcf86cd799439011';
            req.body.favorite = '507f1f77bcf86cd799439012';
            const user = { _id: '507f1f77bcf86cd799439011', favoris: ['507f1f77bcf86cd799439012'] };
            userModels.findByIdAndUpdate.mockImplementationOnce((id, update, options, callback) => callback(null, user));

            await userControllers.addFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(user);
        });

        it('should return 500 if an error occurs while adding the favorite', async () => {
            req.body._id = '507f1f77bcf86cd799439011';
            req.body.favorite = '507f1f77bcf86cd799439012';
            const error = new Error('Database error');
            userModels.findByIdAndUpdate.mockImplementationOnce((id, update, options, callback) => callback(error, null));

            await userControllers.addFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('An error occurred while adding the favorite.');
        });
    });

    describe('emailVerify', () => {
        it('should return 404 if user is not found', async () => {
            req.body.email = 'test@test.com';
            userModels.findOne.mockResolvedValue(null);

            await userControllers.emailVerify(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('User not found.');
        });

        it('should return 200 if email is sent successfully', async () => {
            req.body.email = 'test@test.com';
            const user = { _id: '123', email: 'test@test.com' };
            userModels.findOne.mockResolvedValue(user);
            nodemailer.createTransport.mockReturnValue({
                sendMail: jest.fn().mockResolvedValue(undefined)
            });

            await userControllers.emailVerify(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith("Email 'Verification de Mail' Envoyer");
        });
    });

    describe('passwordModify', () => {
        it('should return 200 if password is modified successfully', async () => {
            req.body.userId = '507f1f77bcf86cd799439011';
            req.body.password = 'newpassword';
            const user = { _id: '507f1f77bcf86cd799439011', email: 'test@test.com' };
            userModels.findByIdAndUpdate.mockResolvedValue(user);
            userModels.findById.mockResolvedValue(user);
            nodemailer.createTransport.mockReturnValue({
                sendMail: jest.fn().mockResolvedValue(undefined)
            });

            await userControllers.passwordModify(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith("Email 'Modification de Mots de Passe' Envoyé");
        });

        it('should return 500 if an error occurs while modifying the password', async () => {
            req.body.userId = '507f1f77bcf86cd799439011';
            req.body.password = 'newpassword';
            const error = new Error('Database error');
            userModels.findByIdAndUpdate.mockRejectedValue(error);

            await userControllers.passwordModify(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(error);
        });
    });

    describe('profileUpdate', () => {
        it('should return 400 if validation errors exist', async () => {
            validationResult.mockReturnValueOnce({ isEmpty: jest.fn().mockReturnValue(false), array: jest.fn().mockReturnValue([{ msg: 'Error' }]) });

            await userControllers.profileUpdate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Error' }] });
        });

        it('should return 200 if profile is updated successfully', async () => {
            req.headers['x-access-token'] = 'validtoken';
            req.body = { username: 'newusername' };
            const user = { _id: '507f1f77bcf86cd799439011', username: 'newusername' };
            jwt.verify.mockImplementationOnce((token, secret, callback) => callback(null, { userid: '507f1f77bcf86cd799439011' }));
            userModels.findByIdAndUpdate.mockResolvedValue(user);

            await userControllers.profileUpdate(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(user);
        });

        it('should return 500 if an error occurs while updating the profile', async () => {
            req.headers['x-access-token'] = 'validtoken';
            req.body = { username: 'newusername' };
            const error = new Error('Database error');
            jwt.verify.mockImplementationOnce((token, secret, callback) => callback(null, { userid: '507f1f77bcf86cd799439011' }));
            userModels.findByIdAndUpdate.mockRejectedValue(error);

            await userControllers.profileUpdate(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(error);
        });
    });
});