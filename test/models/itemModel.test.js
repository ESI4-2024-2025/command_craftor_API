const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const Item = require('../../models/itemModel');

describe('Item Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/test_database', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('create & save item successfully', async () => {
        const validItem = new Item({
            identifier: 'item123',
            enchantement: [1, 2],
            materiaux: [3, 4],
            version: 1
        });
        const savedItem = await validItem.save();
        expect(savedItem._id).toBeDefined();
        expect(savedItem.identifier).toBe(validItem.identifier);
        expect(savedItem.enchantement).toEqual(expect.arrayContaining(validItem.enchantement));
        expect(savedItem.materiaux).toEqual(expect.arrayContaining(validItem.materiaux));
        expect(savedItem.version).toBe(validItem.version);
    });

    it('insert item successfully, but the field not defined in schema should be undefined', async () => {
        const itemWithInvalidField = new Item({
            identifier: 'item123',
            enchantement: [1, 2],
            materiaux: [3, 4],
            version: 1,
            extraField: 'extra'
        });
        const savedItemWithInvalidField = await itemWithInvalidField.save();
        expect(savedItemWithInvalidField._id).toBeDefined();
        expect(savedItemWithInvalidField.extraField).toBeUndefined();
    });

    it('create item without required field should fail', async () => {
        const itemWithoutRequiredField = new Item({
            enchantement: [1, 2],
            materiaux: [3, 4]
        });
        let err;
        try {
            const savedItemWithoutRequiredField = await itemWithoutRequiredField.save();
            error = savedItemWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.identifier).toBeDefined();
        expect(err.errors.version).toBeDefined();
    });
});