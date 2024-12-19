const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const itemController = require('../../controllers/itemControllers');
const Item = require('../../models/itemModel');
const Enchant = require('../../models/enchantModel');
const Materiaux = require('../../models/materiauxModel');
const Version = require('../../models/VersionsModel');

const app = express();
app.use(express.json());
app.get('/item', itemController.getItem);
app.post('/item', itemController.addItem);
app.post('/enchant', itemController.addEnchant);
app.post('/materiaux', itemController.addMateriaux);
app.post('/version', itemController.addVersion);

describe('Item Controller', () => {
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/commad_craftor_API_test`;
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    describe('GET /item', () => {
        it('should get all items', async () => {
            const res = await request(app).get('/item');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /item', () => {
        it('should add a new item', async () => {
            const newItem = { identifier: 'item1', enchantement: [], materiaux: [], version: '1.0' };
            const res = await request(app).post('/item').send(newItem);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.identifier).toBe(newItem.identifier);
        });
    });

    describe('POST /materiaux', () => {
        it('should add a new materiaux', async () => {
            const newMateriaux = { identifier: 'materiaux1', version: '1.0' };
            const res = await request(app).post('/materiaux').send(newMateriaux);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.identifier).toBe(newMateriaux.identifier);
        });
    });
});