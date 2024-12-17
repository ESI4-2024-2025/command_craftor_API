const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/User');
const User = require('../../controllers/userControllers');

const app = express();

jest.mock('../../controllers/userControllers');

app.use(express.json());
userRoutes(app);

describe('User Routes', () => {
    describe('GET /users', () => {
        it('should get all users', async () => {
            User.getAllUsers.mockImplementation((req, res) => {
                res.status(200).send([{ id: 1, username: 'testuser' }]);
            });

            const response = await request(app).get('/users');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, username: 'testuser' }]);
        });
    });

    describe('PUT /users/current', () => {
        it('should get current user profile', async () => {
            User.getCurrentProfile.mockImplementation((req, res) => {
                res.status(200).send({ id: 1, username: 'testuser' });
            });

            const response = await request(app).put('/users/current');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, username: 'testuser' });
        });
    });

    describe('GET /users/email/validationupdate', () => {
        it('should update email validation', async () => {
            User.emailValidationUpdate.mockImplementation((req, res) => {
                res.status(200).send({ message: 'Email validation updated' });
            });

            const response = await request(app).get('/users/email/validationupdate');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Email validation updated' });
        });
    });
});