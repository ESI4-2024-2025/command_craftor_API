const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const Enchant = require('../../models/enchantModel');

describe('Enchant Model Test', () => {
    beforeAll(async () => {
        const url = 'mongodb://127.0.0.1/enchant_test';
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    it('create & save enchant successfully', async () => {
        const validEnchant = new Enchant({
            identifier: 'sharpness',
            lvlMax: 5,
            version: 1,
            minecraft_id: 16
        });
        const savedEnchant = await validEnchant.save();
        expect(savedEnchant._id).toBeDefined();
        expect(savedEnchant.identifier).toBe(validEnchant.identifier);
        expect(savedEnchant.lvlMax).toBe(validEnchant.lvlMax);
        expect(savedEnchant.version).toBe(validEnchant.version);
        expect(savedEnchant.minecraft_id).toBe(validEnchant.minecraft_id);
        expect(savedEnchant.number).toBe(1);
    });

    it('insert enchant successfully, but the field does not defined in schema should be undefined', async () => {
        const enchantWithInvalidField = new Enchant({
            identifier: 'sharpness',
            lvlMax: 5,
            version: 1,
            minecraft_id: 16,
            extraField: 'this field is not defined in schema'
        });
        const savedEnchantWithInvalidField = await enchantWithInvalidField.save();
        expect(savedEnchantWithInvalidField._id).toBeDefined();
        expect(savedEnchantWithInvalidField.extraField).toBeUndefined();
    });

    it('create enchant without required field should fail', async () => {
        const enchantWithoutRequiredField = new Enchant({ identifier: 'sharpness' });
        let err;
        try {
            const savedEnchantWithoutRequiredField = await enchantWithoutRequiredField.save();
            error = savedEnchantWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.lvlMax).toBeDefined();
    });
});