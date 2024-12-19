const requestControllers = require('../../controllers/requestControllers');
const requestModels = require('../../models/requestModel');
const logger = require('../../logger');

jest.mock('../../models/requestModel');
jest.mock('../../logger');

describe('requestControllers', () => {
    describe('getRequest', () => {
        it('should return the latest 5 requests sorted by nbutilisation in descending order', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const docs = [{}, {}, {}, {}, {}];
            requestModels.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockImplementation((callback) => callback(null, docs))
            });

            await requestControllers.getRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(docs);
            expect(logger.info).toHaveBeenCalledWith('Request information retrieved successfully.', docs);
        });

        it('should handle errors when finding data', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const error = new Error('Error finding data');
            requestModels.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockImplementation((callback) => callback(error, null))
            });

            await requestControllers.getRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(logger.error).toHaveBeenCalledWith('Error while finding the data', error);
        });

        it('should handle unexpected errors', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const error = new Error('Unexpected error');
            requestModels.find.mockImplementation(() => { throw error; });

            await requestControllers.getRequest(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('An error occurred while retrieving the current profile.');
            expect(logger.error).toHaveBeenCalledWith('An Error occurred while retrieving the current profile');
        });
    });

    describe('Request', () => {
        it('should return 400 if Command is empty', async () => {
            const req = { body: { Command: '', Version: '1.0' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await requestControllers.Request(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: "La Commande ne peut pas être vide" });
            expect(logger.warn).toHaveBeenCalledWith('La Commande ne peut pas être vide');
        });

        it('should return 400 if Version is empty', async () => {
            const req = { body: { Command: 'test', Version: '' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await requestControllers.Request(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: "La version ne peut pas être vide" });
            expect(logger.warn).toHaveBeenCalledWith('La version ne peut pas être vide');
        });

        it('should update existing request if Command exists and Version is included', async () => {
            const req = { body: { Command: 'test', Version: '1.0' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const existingRequest = {
                version: ['1.0'],
                nbutilisation: 1,
                save: jest.fn().mockResolvedValue({ id: '123' })
            };
            requestModels.findOne.mockResolvedValue(existingRequest);

            await requestControllers.Request(req, res);

            expect(existingRequest.nbutilisation).toBe(2);
            expect(existingRequest.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: '123' });
            expect(logger.info).toHaveBeenCalledWith('Requête mise à jour avec succès.', '123');
        });

        it('should update existing request if Command exists and Version is not included', async () => {
            const req = { body: { Command: 'test', Version: '2.0' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const existingRequest = {
                _id: '123',
                version: ['1.0'],
                nbutilisation: 1
            };
            requestModels.findOne.mockResolvedValue(existingRequest);
            requestModels.findByIdAndUpdate.mockResolvedValue({ id: '123' });

            await requestControllers.Request(req, res);

            expect(requestModels.findByIdAndUpdate).toHaveBeenCalledWith('123', {
                $set: {
                    version: ['1.0', '2.0'],
                    nbutilisation: 2
                }
            }, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: '123' });
            expect(logger.info).toHaveBeenCalledWith('Requête mise à jour avec succès.', '123');
        });

        it('should create a new request if Command does not exist', async () => {
            const req = { body: { Command: 'test', Version: '1.0' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const newRequest = {
                save: jest.fn().mockResolvedValue({ id: '123' })
            };
            requestModels.findOne.mockResolvedValue(null);
            requestModels.mockImplementation(() => newRequest);

            await requestControllers.Request(req, res);

            expect(newRequest.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: '123' });
            expect(logger.info).toHaveBeenCalledWith('Requête ajoutée avec succès.', '123');
        });

        it('should handle errors when saving request', async () => {
            const req = { body: { Command: 'test', Version: '1.0' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const error = new Error('Error saving request');
            requestModels.findOne.mockRejectedValue(error);

            await requestControllers.Request(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Erreur lors de l\'enregistrement de la requête Veuillez réessayer plus tard.');
            expect(logger.error).toHaveBeenCalledWith('Erreur lors de l\'enregistrement de la requête');
        });
    });
});