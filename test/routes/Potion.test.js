const request = require('supertest');
const express = require('express');
const potionRoutes = require('../../routes/Potion');
const Potion = require('../../controllers/potionControllers');

jest.mock('../../controllers/potionControllers');

const app = express();
potionRoutes(app);

describe('GET /getPotion', () => {
    it('should return potion information', async () => {
        const mockPotion = { name: 'Healing Potion' };
        Potion.getPotion.mockImplementation((req, res) => {
            res.status(200).json(mockPotion);
        });

        const response = await request(app).get('/getPotion');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPotion);
    });
});