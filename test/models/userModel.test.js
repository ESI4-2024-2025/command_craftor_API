const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Add this line
const User = require('../../models/userModel');

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/commad_craftor_API_test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('create & save user successfully', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        };
        const validUser = new User(userData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
        expect(savedUser.email_verified).toBe(false);
        expect(savedUser.favoris).toEqual([]);
    });

    it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            nickname: 'testnickname',
        });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickname).toBeUndefined();
    });

    it('create user without required field should fail', async () => {
        const userWithoutRequiredField = new User({ username: 'testuser' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.email).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });
});