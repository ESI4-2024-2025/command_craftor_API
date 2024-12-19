const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let db; // Declare db variable


describe('Database Connection', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        process.env.MONGO_URL = mongoUri;
        process.env.MONGO_NAME = 'testDB';
        db = require('../../config/database'); // Require db after setting environment variables
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should connect to the database without errors', async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.MONGO_NAME
        });
        const connectionState = mongoose.connection.readyState;
        expect(connectionState).toBe(1); // 1 means connected
    });

    it('should use the correct database name from environment variables', async () => {
        const dbName = mongoose.connection.db.databaseName;
        expect(dbName).toBe(process.env.MONGO_NAME);
    });
});