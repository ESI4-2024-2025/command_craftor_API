const mongoose = require('mongoose');

const { Schema } = mongoose;

const blocSchema = Schema({
    nom: { type: String, required: true },
    identifier: { type: String, required: true },
});

module.exports = mongoose.model('Bloc', blocSchema);