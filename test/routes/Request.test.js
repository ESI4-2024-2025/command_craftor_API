const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../../routes/Request');
const RequestController = require('../../controllers/requestControllers');

const app = express();

app.use(bodyParser.json());
routes(app);

jest.mock('../../controllers/requestControllers');

describe('Request Routes', () => {
    describe('GET /getRequest', () => {
        it('should return the latest 5 requests sorted by nbutilisation in descending order', async () => {
            const mockRequests = [
                { command: "/give @p minecraft:diamond 1", version: ["1.0", "1.1"], nbutilisation: 5 },
                { command: "/give @p minecraft:gold 1", version: ["1.0", "1.1"], nbutilisation: 4 },
                { command: "/give @p minecraft:iron 1", version: ["1.0", "1.1"], nbutilisation: 3 },
                { command: "/give @p minecraft:stone 1", version: ["1.0", "1.1"], nbutilisation: 2 },
                { command: "/give @p minecraft:wood 1", version: ["1.0", "1.1"], nbutilisation: 1 }
            ];
            RequestController.getRequest.mockImplementation((req, res) => {
                res.status(200).json(mockRequests);
            });

            const response = await request(app).get('/getRequest');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRequests);
        });
    });

    describe('POST /ARequest', () => {
        it('should create or update a request', async () => {
            const mockRequest = { command: "/give @p minecraft:diamond 1", version: ["1.0", "1.1"], nbutilisation: 1 };
            RequestController.Request.mockImplementation((req, res) => {
                res.status(200).json(mockRequest);
            });

            const response = await request(app)
                .post('/ARequest')
                .send({ command: "/exampleCommand", version: ["1.0", "1.1"] });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRequest);
        });

        it('should return 400 for bad request', async () => {
            RequestController.Request.mockImplementation((req, res) => {
                res.status(400).send('Bad request');
            });

            const response = await request(app)
                .post('/ARequest')
                .send({ invalidField: "invalidValue" });
            expect(response.status).toBe(400);
            expect(response.text).toBe('Bad request');
        });

        it('should return 500 for internal server error', async () => {
            RequestController.Request.mockImplementation((req, res) => {
                res.status(500).send('Internal server error');
            });

            const response = await request(app)
                .post('/ARequest')
                .send({ command: "/exampleCommand", version: ["1.0", "1.1"] });
            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });
    });
});