const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const Materiaux = require('../../models/materiauxModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connect, disconnect } = require('../../utils/testDb');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connect(mongoServer.getUri());
});

beforeEach(async () => {
    await Materiaux.deleteMany({});
});

afterAll(async () => {
    await disconnect();
    await mongoServer.stop();
});

describe('Materiaux Model Test', () => {
    it('should create and save a new materiaux successfully', async () => {
        const validMateriaux = new Materiaux({
            identifier: 'testIdentifier',
            version: 1
        });
        const savedMateriaux = await validMateriaux.save();

        expect(savedMateriaux._id).toBeDefined();
        expect(savedMateriaux.identifier).toBe('testIdentifier');
        expect(savedMateriaux.version).toBe(1);
        expect(savedMateriaux.number).toBeDefined();
    });

    it('should not save a materiaux without required fields', async () => {
        const invalidMateriaux = new Materiaux({});

        let err;
        try {
            await invalidMateriaux.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.identifier).toBeDefined();
        expect(err.errors.version).toBeDefined();
    });

    it('should auto-increment the number field', async () => {
        const materiaux1 = new Materiaux({
            identifier: 'testIdentifier1',
            version: 1
        });
        const materiaux2 = new Materiaux({
            identifier: 'testIdentifier2',
            version: 1
        });

        const savedMateriaux1 = await materiaux1.save();
        const savedMateriaux2 = await materiaux2.save();

        expect(savedMateriaux1.number).toBe(1);
        expect(savedMateriaux2.number).toBe(2);
    });
});