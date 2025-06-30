const mongoose = require('mongoose');

const { Schema } = mongoose;

const potionSchema = Schema({
    id: { type: Number, required: true },
    identifier: { type: String, required: true },
    version: { type: String, required: true },
});

module.exports = mongoose.model('Potion', potionSchema);