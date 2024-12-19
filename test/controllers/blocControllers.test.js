const request = require('supertest');
const express = require('express');
const blocControllers = require('../../controllers/blocControllers');
const blocModels = require('../../models/blocModel');
const logger = require('../../logger');

const app = express();
app.get('/bloc', blocControllers.getBloc);

jest.mock('../../models/blocModel');
jest.mock('../../logger');

describe('GET /bloc', () => {
    it('should return 200 and the list of blocs', async () => {
        const mockBlocs = [{ id: 1, name: 'Bloc 1' }, { id: 2, name: 'Bloc 2' }];
        blocModels.find.mockResolvedValue(mockBlocs);

        const response = await request(app).get('/bloc');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockBlocs);
        expect(logger.info).toHaveBeenCalledWith('Bloc information retrieved successfully.');
    });

    it('should return 500 if there is an error', async () => {
        blocModels.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/bloc');

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred while retrieving the current profile.');
        expect(logger.error).toHaveBeenCalledWith('Bloc information retrieved successfully.');
    });
});