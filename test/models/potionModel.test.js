const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const Potion = require('../../models/potionModel');

describe('Potion Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/commad_craftor_API_test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }, 10000); // Increase timeout to 10 seconds

    afterAll(async () => {
        await mongoose.connection.close();
    }, 10000); // Increase timeout to 10 seconds

    it('should create a potion with a numeric id and a version', async () => {
        const potionData = { id: 1, identifier: 'potion1', version: '1.0' };
        const validPotion = new Potion(potionData);
        const savedPotion = await validPotion.save();

        expect(savedPotion.id).toBe(potionData.id);
        expect(savedPotion.identifier).toBe(potionData.identifier);
        expect(savedPotion.version).toBe(potionData.version);
    });

    it('should fail to create a potion without a version', async () => {
        const potionData = { id: 2, identifier: 'potion2' };
        const invalidPotion = new Potion(potionData);
        let err;
        try {
            await invalidPotion.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.version).toBeDefined();
    });
});