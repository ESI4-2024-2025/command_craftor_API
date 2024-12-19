const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const Bloc = require('../../models/blocModel');

describe('Bloc Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/commad_craftor_API_test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a Bloc with a valid identifier', async () => {
        const validBloc = new Bloc({ identifier: 'validIdentifier' });
        const savedBloc = await validBloc.save();
        expect(savedBloc._id).toBeDefined();
        expect(savedBloc.identifier).toBe('validIdentifier');
    });

    it('should not create a Bloc without an identifier', async () => {
        const invalidBloc = new Bloc({});
        let err;
        try {
            await invalidBloc.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.identifier).toBeDefined();
    });

    it('should not create a Bloc with an empty identifier', async () => {
        const invalidBloc = new Bloc({ identifier: '' });
        let err;
        try {
            await invalidBloc.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.identifier).toBeDefined();
    });
});