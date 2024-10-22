const mongoose = require('mongoose');

const { Schema } = mongoose;

const blocSchema = Schema({
    identifier: { type: String, required: true },
});

module.exports = mongoose.model('Bloc', blocSchema);