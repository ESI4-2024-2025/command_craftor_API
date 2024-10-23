const mongoose = require('mongoose');

const { Schema } = mongoose;

const potionSchema = Schema({
    identifier: { type: String, required: true },
    version: { type: String, required: true },
});

module.exports = mongoose.model('Potion', potionSchema);