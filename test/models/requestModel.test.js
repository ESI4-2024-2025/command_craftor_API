const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const Request = require('../../models/requestModel');

describe('Request Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/commad_craftor_API_test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('create & save request successfully', async () => {
        const validRequest = new Request({
            command: 'test command',
            version: ['1.0', '2.0'],
            nbutilisation: 5
        });
        const savedRequest = await validRequest.save();
        expect(savedRequest._id).toBeDefined();
        expect(savedRequest.command).toBe(validRequest.command);
        expect(savedRequest.version).toEqual(expect.arrayContaining(validRequest.version));
        expect(savedRequest.nbutilisation).toBe(validRequest.nbutilisation);
    });

    it('create request without required field should fail', async () => {
        const requestWithoutRequiredField = new Request({ version: ['1.0', '2.0'] });
        let err;
        try {
            const savedRequestWithoutRequiredField = await requestWithoutRequiredField.save();
            error = savedRequestWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.command).toBeDefined();
    });

    it('create request with default nbutilisation', async () => {
        const requestWithDefaultNbutilisation = new Request({
            command: 'test command',
            version: ['1.0', '2.0']
        });
        const savedRequest = await requestWithDefaultNbutilisation.save();
        expect(savedRequest.nbutilisation).toBe(0);
    });
});