const mongoose = require('mongoose');

const connect = async (uri) => {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const disconnect = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

module.exports = { connect, disconnect };
