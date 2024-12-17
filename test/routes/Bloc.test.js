const request = require('supertest');
jest.mock('../../controllers/blocControllers');
const express = require('express');
const Bloc = require('../../controllers/blocControllers');

const app = express();

// Mock the controller method
Bloc.getBloc = jest.fn((req, res) => {
    res.status(200).json({ nom: "Pierre" });
});

// Use the route
require('../../routes/Bloc')(app);

describe('GET /getBloc', () => {
    it('should return bloc information', async () => {
        const response = await request(app).get('/getBloc');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ nom: "Pierre" });
    });
});