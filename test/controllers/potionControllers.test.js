const request = require('supertest');
const express = require('express');
const potionControllers = require('../../controllers/potionControllers');
const potionModels = require('../../models/potionModel');
const logger = require('../../logger');

const app = express();
app.get('/potion', potionControllers.getPotion);

jest.mock('../../models/potionModel');
jest.mock('../../logger');

describe('GET /potion', () => {
    it('should return 200 and the list of potions', async () => {
        const mockPotions = [{ name: 'Potion1' }, { name: 'Potion2' }];
        potionModels.find.mockResolvedValue(mockPotions);

        const response = await request(app).get('/potion');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPotions);
        expect(logger.info).toHaveBeenCalledWith('Potion information retrieved successfully.');
    });

    it('should return 500 if there is an error', async () => {
        potionModels.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/potion');

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred while retrieving the current profile.');
        expect(logger.error).toHaveBeenCalledWith('Potion information not retrieved.');
    });
});