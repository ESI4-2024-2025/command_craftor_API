const request = require('supertest');
const express = require('express');
const itemRoutes = require('../../routes/Item');
const ItemController = require('../../controllers/itemControllers');

const app = express();

jest.mock('../../controllers/itemControllers');

app.use(express.json());
itemRoutes(app);

describe('Item Routes', () => {
    it('should return all items', async () => {
        const mockItems = [
            { Nom: 'Sword', identifier: 'sword', enchantement: [1, 2, 3], materiaux: [1, 2] },
            { Nom: 'Shield', identifier: 'shield', enchantement: [4, 5, 6], materiaux: [3, 4] }
        ];
        ItemController.getItem.mockImplementation((req, res) => res.status(200).json(mockItems));

        const response = await request(app).get('/getItem');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockItems);
    });
});