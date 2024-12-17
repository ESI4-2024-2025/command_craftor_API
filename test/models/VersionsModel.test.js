const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const VersionsModel = require('../../models/VersionsModel');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connect, disconnect } = require('../../utils/testDb');

describe('VersionsModel', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await disconnect();
        await mongoServer.stop();
    });

    it('should require the value field', async () => {
        const version = new VersionsModel({ version: '1.0.0' });

        let error;
        try {
            await version.validate();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.value).toBeDefined();
        expect(error.errors.value.kind).toBe('required');
    });

    it('should save a version with a valid value', async () => {
        const version = new VersionsModel({ value: 1, version: '1.0.0' });

        await version.save();

        const foundVersion = await VersionsModel.findOne({ version: '1.0.0' });
        expect(foundVersion).toBeDefined();
        expect(foundVersion.value).toBe(1);
    });
});